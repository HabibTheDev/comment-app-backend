import mongoose, { Schema } from 'mongoose';

const ReplySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reply: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likeVotes: { type: Number, default: 0 },
  disLikeVotes: { type: Number, default: 0 },
});

const CommentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likeVotes: { type: Number, default: 0 },
    disLikeVotes: { type: Number, default: 0 },
    replies: [ReplySchema],
  },
  {
    timestamps: true,
  },
);

export const Comment = mongoose.model('Comment', CommentSchema);
