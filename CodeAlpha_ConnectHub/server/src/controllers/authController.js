import crypto from 'crypto';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { attachAuthCookie, signToken } from '../utils/token.js';
import { env } from '../config/env.js';

const publicUserSelect = '-password -resetPasswordToken -resetPasswordExpires -passwordChangedAt';

function sendSession(res, user, statusCode = 200) {
  const token = signToken(user._id);
  attachAuthCookie(res, token);
  res.status(statusCode).json({ token, user });
}

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = await User.create({ name, username, email, password });
  sendSession(res, user.toObject(), 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  sendSession(res, user.toObject());
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.cookieName);
  res.json({ message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(publicUserSelect);
  res.json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select(
    '+resetPasswordToken +resetPasswordExpires'
  );
  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
  }
  res.json({ message: 'If an account exists, password reset instructions will be sent.' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) throw new ApiError(400, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  sendSession(res, user.toObject());
});
