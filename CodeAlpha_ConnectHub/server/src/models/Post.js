import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: Number,
    height: Number
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, trim: true, maxlength: 1200, default: '' },
    images: { type: [mediaSchema], validate: [(value) => value.length <= 6, 'Maximum 6 images per post'] },
    hashtags: [{ type: String, lowercase: true, trim: true, index: true }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    visibility: { type: String, enum: ['public', 'followers'], default: 'public', index: true },
    status: { type: String, enum: ['published', 'archived', 'deleted'], default: 'published', index: true },
    shareCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.index({ content: 'text', hashtags: 'text' });
postSchema.index({ createdAt: -1 });

postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
  match: { status: 'published' }
});

postSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target',
  count: true,
  match: { targetType: 'Post' }
});

export const Post = mongoose.model('Post', postSchema);
