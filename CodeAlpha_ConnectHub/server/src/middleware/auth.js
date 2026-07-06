import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  const token = req.cookies?.[env.cookieName] || bearer;

  if (!token) throw new ApiError(401, 'Authentication required');

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.userId).select('+passwordChangedAt');
  if (!user || user.status !== 'active') throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') throw new ApiError(403, 'Admin access required');
  next();
};
