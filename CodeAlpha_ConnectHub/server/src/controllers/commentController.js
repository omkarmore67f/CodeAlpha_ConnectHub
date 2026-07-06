import { Comment } from '../models/Comment.js';
import { Like } from '../models/Like.js';
import { Notification } from '../models/Notification.js';
import { Post } from '../models/Post.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const userSelect = 'name username avatar';

async function enrich(comments, viewerId) {
  return Promise.all(
    comments.map(async (comment) => {
      const [likesCount, liked] = await Promise.all([
        Like.countDocuments({ target: comment._id, targetType: 'Comment' }),
        viewerId ? Like.exists({ user: viewerId, target: comment._id, targetType: 'Comment' }) : null
      ]);
      return { ...comment.toObject(), likesCount, liked: Boolean(liked) };
    })
  );
}

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId, parent: null, status: 'published' })
    .populate('author', userSelect)
    .populate({ path: 'replies', match: { status: 'published' }, populate: { path: 'author', select: userSelect } })
    .sort('-createdAt');
  res.json({ comments: await enrich(comments, req.user?._id) });
});

export const createComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post || post.status !== 'published') throw new ApiError(404, 'Post not found');
  const comment = await Comment.create({
    post: post._id,
    author: req.user._id,
    parent: req.body.parent || null,
    content: req.body.content
  });
  if (!post.author.equals(req.user._id)) {
    await Notification.create({ recipient: post.author, actor: req.user._id, type: 'comment', post: post._id, comment: comment._id });
  }
  await comment.populate('author', userSelect);
  res.status(201).json({ comment: (await enrich([comment], req.user._id))[0] });
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment || comment.status !== 'published') throw new ApiError(404, 'Comment not found');
  if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed');
  comment.content = req.body.content;
  comment.editedAt = new Date();
  await comment.save();
  await comment.populate('author', userSelect);
  res.json({ comment: (await enrich([comment], req.user._id))[0] });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') throw new ApiError(403, 'Not allowed');
  comment.status = 'deleted';
  await comment.save();
  res.json({ message: 'Comment deleted' });
});

export const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment || comment.status !== 'published') throw new ApiError(404, 'Comment not found');
  const existing = await Like.findOne({ user: req.user._id, target: comment._id, targetType: 'Comment' });
  if (existing) {
    await existing.deleteOne();
    return res.json({ liked: false });
  }
  await Like.create({ user: req.user._id, target: comment._id, targetType: 'Comment' });
  res.status(201).json({ liked: true });
});
