import { Router } from 'express';
import {
  deleteAccount,
  followUser,
  getProfile,
  listFollowers,
  listFollowing,
  search,
  suggestedUsers,
  unfollowUser,
  updateProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const userRoutes = Router();

userRoutes.get('/search', protect, search);
userRoutes.get('/suggested', protect, suggestedUsers);
userRoutes.get('/:username', protect, getProfile);
userRoutes.patch(
  '/me',
  protect,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  updateProfile
);
userRoutes.delete('/me', protect, deleteAccount);
userRoutes.post('/:userId/follow', protect, followUser);
userRoutes.delete('/:userId/follow', protect, unfollowUser);
userRoutes.get('/:userId/followers', protect, listFollowers);
userRoutes.get('/:userId/following', protect, listFollowing);
