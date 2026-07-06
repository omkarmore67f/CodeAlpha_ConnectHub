import { User } from '../models/User.js';
import { Follow } from '../models/Follow.js';
import { Post } from '../models/Post.js';
import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadBuffer } from '../utils/uploadToCloudinary.js';

const publicSelect = '-password -resetPasswordToken -resetPasswordExpires -passwordChangedAt';

async function enrichUser(user, viewerId) {
  const [followersCount, followingCount, postsCount, isFollowing] = await Promise.all([
    Follow.countDocuments({ following: user._id }),
    Follow.countDocuments({ follower: user._id }),
    Post.countDocuments({ author: user._id, status: 'published' }),
    viewerId ? Follow.exists({ follower: viewerId, following: user._id }) : null
  ]);
  return { ...user.toObject(), followersCount, followingCount, postsCount, isFollowing: Boolean(isFollowing) };
}

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username, status: 'active' }).select(publicSelect);
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ user: await enrichUser(user, req.user?._id) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'location', 'website', 'skills', 'privacy', 'theme'];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  if (typeof updates.skills === 'string') {
    updates.skills = updates.skills
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((skill) => skill.replaceAll('"', '').trim())
      .filter(Boolean);
  }
  if (typeof updates.privacy === 'string') updates.privacy = JSON.parse(updates.privacy);

  if (req.files?.avatar?.[0]) updates.avatar = await uploadBuffer(req.files.avatar[0], 'connecthub/avatars');
  if (req.files?.coverImage?.[0]) updates.coverImage = await uploadBuffer(req.files.coverImage[0], 'connecthub/covers');

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select(publicSelect);
  res.json({ user: await enrichUser(user, req.user._id) });
});

export const followUser = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.userId);
  if (!target || target.status !== 'active') throw new ApiError(404, 'User not found');
  if (target._id.equals(req.user._id)) throw new ApiError(400, 'You cannot follow yourself');

  const follow = await Follow.findOneAndUpdate(
    { follower: req.user._id, following: target._id },
    { follower: req.user._id, following: target._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await Notification.findOneAndUpdate(
    { recipient: target._id, actor: req.user._id, type: 'follow' },
    { recipient: target._id, actor: req.user._id, type: 'follow' },
    { upsert: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ follow });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  await Follow.deleteOne({ follower: req.user._id, following: req.params.userId });
  res.json({ message: 'Unfollowed successfully' });
});

export const listFollowers = asyncHandler(async (req, res) => {
  const rows = await Follow.find({ following: req.params.userId }).populate('follower', publicSelect).sort('-createdAt');
  res.json({ users: rows.map((row) => row.follower) });
});

export const listFollowing = asyncHandler(async (req, res) => {
  const rows = await Follow.find({ follower: req.params.userId }).populate('following', publicSelect).sort('-createdAt');
  res.json({ users: rows.map((row) => row.following) });
});

export const suggestedUsers = asyncHandler(async (req, res) => {
  const following = await Follow.find({ follower: req.user._id }).distinct('following');
  const users = await User.find({ _id: { $nin: [...following, req.user._id] }, status: 'active' })
    .select(publicSelect)
    .sort('-createdAt')
    .limit(5);
  res.json({ users });
});

export const search = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ users: [], posts: [], hashtags: [] });
  const [users, posts] = await Promise.all([
    User.find({ $text: { $search: q }, status: 'active' }).select(publicSelect).limit(10),
    Post.find({ $text: { $search: q }, status: 'published' }).populate('author', publicSelect).limit(10)
  ]);
  const hashtags = await Post.aggregate([
    { $match: { hashtags: { $regex: q.replace(/^#/, ''), $options: 'i' }, status: 'published' } },
    { $unwind: '$hashtags' },
    { $match: { hashtags: { $regex: q.replace(/^#/, ''), $options: 'i' } } },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  res.json({ users, posts, hashtags: hashtags.map((tag) => ({ tag: tag._id, count: tag.count })) });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { status: 'deleted', email: `deleted-${req.user._id}@connecthub.local` });
  res.json({ message: 'Account deleted' });
});
