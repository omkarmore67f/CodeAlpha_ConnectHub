import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },
    content: { type: String, required: true, trim: true, maxlength: 600 },
    status: { type: String, enum: ['published', 'deleted'], default: 'published', index: true },
    editedAt: Date
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

commentSchema.index({ post: 1, createdAt: -1 });

commentSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'target',
  count: true,
  match: { targetType: 'Comment' }
});

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parent'
});

export const Comment = mongoose.model('Comment', commentSchema);
