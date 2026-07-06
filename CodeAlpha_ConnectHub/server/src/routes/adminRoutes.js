import { Router } from 'express';
import { dashboard, managePosts, manageUsers } from '../controllers/adminController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

export const adminRoutes = Router();

adminRoutes.use(protect, requireAdmin);
adminRoutes.get('/dashboard', dashboard);
adminRoutes.get('/users', manageUsers);
adminRoutes.get('/posts', managePosts);
