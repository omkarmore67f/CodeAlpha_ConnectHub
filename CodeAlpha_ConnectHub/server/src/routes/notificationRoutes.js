import { Router } from 'express';
import { listNotifications, markRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

export const notificationRoutes = Router();

notificationRoutes.get('/', protect, listNotifications);
notificationRoutes.patch('/read', protect, markRead);
