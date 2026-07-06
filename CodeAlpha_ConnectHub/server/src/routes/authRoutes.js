import { Router } from 'express';
import { changePassword, forgotPassword, login, logout, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

export const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.get('/me', protect, me);
authRoutes.patch('/change-password', protect, changePassword);
