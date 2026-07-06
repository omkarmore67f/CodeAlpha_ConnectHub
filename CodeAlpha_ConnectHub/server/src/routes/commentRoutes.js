import { Router } from 'express';
import {
  createComment,
  deleteComment,
  listComments,
  toggleCommentLike,
  updateComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

export const commentRoutes = Router();

commentRoutes.get('/post/:postId', protect, listComments);
commentRoutes.post('/post/:postId', protect, createComment);
commentRoutes.patch('/:commentId', protect, updateComment);
commentRoutes.delete('/:commentId', protect, deleteComment);
commentRoutes.post('/:commentId/like', protect, toggleCommentLike);
