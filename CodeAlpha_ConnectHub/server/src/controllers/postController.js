import { Bookmark } from '../models/Bookmark.js';
import { Comment } from '../models/Comment.js';
import { Follow } from '../models/Follow.js';
import { Like } from '../models/Like.js';
import { Notification } from '../models/Notification.js';
import { Post } from '../models/Post.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadBuffer } from '../utils/uploadToCloudinary.js';

const userSelect = 'name username avatar bio';
const tagRegex = /#([a-zA-Z0-9_]{2,40})/g;

function extractHashtags(content = '') {
  return [...new Set([...content.matchAll(tagRegex)].map((match) => match[1].toLowerCase()))];
}

async function enrichPosts(posts, viewerId) {
  return Promise.all(
    posts.map(async (post) => {
      const [likesCount, commentsCount, liked, bookmarked] = await Promise.all([
        Like.countDocuments({ target: post._id, targetType: 'Post' }),
        Comment.countDocuments({ post: post._id, status: 'published' }),
        viewerId ? Like.exists({ user: viewerId, target: post._id, targetType: 'Post' }) : null,
        viewerId ? Bookmark.exists({ user: viewerId, post: post._id }) : null
      ]);
      return { ...post.toObject(), likesCount, commentsCount, liked: Boolean(liked), bookmarked: Boolean(bookmarked) };
    })
  );
}

export const createPost = asyncHandler(async (req, res) => {
  const content = String(req.body.content || '').trim();
  if (!content && !req.files?.length) throw new ApiError(400, 'Post content or images are required');
  const images = await Promise.all((req.files || []).map((file) => uploadBuffer(file, 'connecthub/posts')));
  const post = await Post.create({
    author: req.user._id,
    content,
    images,
    hashtags: extractHashtags(content),
    visibility: req.body.visibility || 'public'
  });
  await post.populate('author', userSelect);
  res.status(201).json({ post: (await enrichPosts([post], req.user._id))[0] });
});

export const getFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 30);
  const mode = req.query.mode || 'latest';
  const query = { status: 'published' };
  if (mode === 'following') {
    const following = await Follow.find({ follower: req.user._id }).distinct('following');
    query.author = { $in: following };
  }
  const posts = await Post.find(query)
    .populate('author', userSelect)
    .sort(mode === 'trending' ? { shareCount: -1, createdAt: -1 } : { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ posts: await enrichPosts(posts, req.user._id), nextPage: posts.length === limit ? page + 1 : null });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId, status: 'published' }).populate('author', userSelect);
  if (!post) throw new ApiError(404, 'Post not found');
  res.json({ post: (await enrichPosts([post], req.user?._id))[0] });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');
  if (!post.author.equals(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed');
  post.content = String(req.body.content || post.content).trim();
  post.visibility = req.body.visibility || post.visibility;
  post.hashtags = extractHashtags(post.content);
  await post.save();
  await post.populate('author', userSelect);
  res.json({ post: (await enrichPosts([post], req.user._id))[0] });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw new ApiError(404, 'Post not found');
  if (!post.author.equals(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed');
  post.status = 'deleted';
  await post.save();
  res.json({ message: 'Post deleted' });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');
  const existing = await Like.findOne({ user: req.user._id, target: post._id, targetType: 'Post' });
  if (existing) {
    await existing.deleteOne();
    return res.json({ liked: false });
  }
  await Like.create({ user: req.user._id, target: post._id, targetType: 'Post' });
  if (!post.author.equals(req.user._id)) {
    await Notification.create({ recipient: post.author, actor: req.user._id, type: 'like', post: post._id });
  }
  res.status(201).json({ liked: true });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');
  const existing = await Bookmark.findOne({ user: req.user._id, post: post._id });
  if (existing) {
    await existing.deleteOne();
    return res.json({ bookmarked: false });
  }
  await Bookmark.create({ user: req.user._id, post: post._id });
  res.status(201).json({ bookmarked: true });
});

export const sharePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.postId, { $inc: { shareCount: 1 } }, { new: true });
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');
  res.json({ shareCount: post.shareCount });
});

export const bookmarks = asyncHandler(async (req, res) => {
  const rows = await Bookmark.find({ user: req.user._id }).sort('-createdAt').populate({
    path: 'post',
    match: { status: 'published' },
    populate: { path: 'author', select: userSelect }
  });
  const posts = rows.map((row) => row.post).filter(Boolean);
  res.json({ posts: await enrichPosts(posts, req.user._id) });
});

export const trending = asyncHandler(async (_req, res) => {
  const tags = await Post.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', posts: { $sum: 1 } } },
    { $sort: { posts: -1 } },
    { $limit: 8 }
  ]);
  res.json({ topics: tags.map((row) => ({ tag: row._id, posts: row.posts })) });
});
