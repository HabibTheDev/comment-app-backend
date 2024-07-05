import httpStatus from 'http-status';
import { TComment } from './comment.interface';
import AppError from '../../errors/AppError';
import { User } from '../Authentication/auth.model';
import { Comment } from './comment.model';

const addCommentByUser = async (userId: string, payload: TComment) => {
  const UserExits = await User.isUserExistsId(userId);
  if (!UserExits) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const commentData = { ...payload, userId };

  const result = await Comment.create(commentData);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Add Comment');
  }
  return result;
};

export const CommentService = {
  addCommentByUser,
};
