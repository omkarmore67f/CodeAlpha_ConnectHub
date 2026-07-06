import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_]+$/, 'Username can contain lowercase letters, numbers, and underscores']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Email is invalid']
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: imageSchema, default: () => ({}) },
    coverImage: { type: imageSchema, default: () => ({}) },
    bio: { type: String, trim: true, maxlength: 220, default: '' },
    location: { type: String, trim: true, maxlength: 80, default: '' },
    website: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
      validate: {
        validator(value) {
          return !value || validator.isURL(value, { require_protocol: true });
        },
        message: 'Website must include http:// or https://'
      }
    },
    skills: [{ type: String, trim: true, maxlength: 32 }],
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'followers'], default: 'public' },
      allowMentions: { type: Boolean, default: true }
    },
    theme: { type: String, enum: ['system', 'light', 'dark'], default: 'system' },
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active', index: true },
    passwordChangedAt: Date,
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.index({ name: 'text', username: 'text', bio: 'text', skills: 'text' });

userSchema.virtual('postsCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  count: true
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date();
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
