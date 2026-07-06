import { Router } from 'express';
import {
  bookmarks,
  createPost,
  deletePost,
  getFeed,
  getPost,
  sharePost,
  toggleBookmark,
  toggleLike,
  trending,
  updatePost
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const postRoutes = Router();

postRoutes.get('/feed', protect, getFeed);
postRoutes.get('/bookmarks', protect, bookmarks);
postRoutes.get('/trending', protect, trending);
postRoutes.post('/', protect, upload.array('images', 6), createPost);
postRoutes.get('/:postId', protect, getPost);
postRoutes.patch('/:postId', protect, updatePost);
postRoutes.delete('/:postId', protect, deletePost);
postRoutes.post('/:postId/like', protect, toggleLike);
postRoutes.post('/:postId/bookmark', protect, toggleBookmark);
postRoutes.post('/:postId/share', protect, sharePost);
