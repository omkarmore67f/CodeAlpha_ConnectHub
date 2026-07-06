import { Comment } from '../models/Comment.js';
import { Follow } from '../models/Follow.js';
import { Like } from '../models/Like.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (_req, res) => {
  const [users, posts, comments, follows, likes] = await Promise.all([
    User.countDocuments({ status: 'active' }),
    Post.countDocuments({ status: 'published' }),
    Comment.countDocuments({ status: 'published' }),
    Follow.countDocuments(),
    Like.countDocuments()
  ]);
  res.json({ metrics: { users, posts, comments, follows, likes } });
});

export const manageUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort('-createdAt').limit(100);
  res.json({ users });
});

export const managePosts = asyncHandler(async (_req, res) => {
  const posts = await Post.find().populate('author', 'name username avatar').sort('-createdAt').limit(100);
  res.json({ posts });
});
