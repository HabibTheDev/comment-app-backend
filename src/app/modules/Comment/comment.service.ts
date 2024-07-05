import httpStatus from 'http-status';
import { TComment } from './comment.interface';
import AppError from '../../errors/AppError';
import { User } from '../Authentication/auth.model';
import { Comment } from './comment.model';
import mongoose from 'mongoose';

const addCommentByUser = async (userId: string, payload: TComment) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID format');
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const commentData = { ...payload, userId };

  const result = await Comment.create(commentData);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add comment');
  }
  return result;
};

const updateComment = async (
  userId: string,
  commentId: string,
  payload: Partial<TComment>,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to update this comment',
    );
  }

  Object.assign(comment, payload);
  const result = await comment.save();

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update comment');
  }

  return result;
};

const deleteComment = async (userId: string, commentId: string) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this comment',
    );
  }

  await comment.deleteOne();

  return { message: 'Comment deleted successfully' };
};

export const CommentService = {
  addCommentByUser,
  updateComment,
  deleteComment,
};
