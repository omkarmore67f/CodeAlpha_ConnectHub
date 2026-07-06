import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetType', index: true },
    targetType: { type: String, required: true, enum: ['Post', 'Comment'], index: true }
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, target: 1, targetType: 1 }, { unique: true });

export const Like = mongoose.model('Like', likeSchema);
