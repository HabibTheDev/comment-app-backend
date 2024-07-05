import httpStatus from 'http-status';
import { TComment, TReplyPayload } from './comment.interface';
import AppError from '../../errors/AppError';
import { User } from '../Authentication/auth.model';
import { Comment } from './comment.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';
import { io } from '../../../app';

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

const getAllCommentFromDB = async (query: Record<string, unknown>) => {
  try {
    const commentQuery = new QueryBuilder(
      Comment.find({}).populate([
        {
          path: 'User',
          select: 'name',
        },
      ]),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await commentQuery.modelQuery.exec();
    const meta = await commentQuery.countTotal();

    return { comments: result, meta };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getSingleCommentFromDB = async (userId: string) => {
  try {
    const commentFind = await Comment.findById(userId).populate([
      {
        path: 'User',
        select: 'name',
      },
    ]);

    if (!commentFind) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Comment not found');
    }

    const commentData = commentFind.toObject();

    return commentData;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const likeComment = async (userId: string, commentId: string) => {
  try {
    const userIdObj = new Types.ObjectId(userId);

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (comment.likes.includes(userIdObj)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already liked this comment',
      );
    }

    if (comment.dislikes.includes(userIdObj)) {
      comment.dislikes = comment.dislikes.filter(
        (dislikeId) => !dislikeId.equals(userIdObj),
      );
      comment.disLikeVotes -= 1;
    }

    comment.likes.push(userIdObj);
    comment.likeVotes += 1;

    await comment.save();

    return comment;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const dislikeComment = async (userId: string, commentId: string) => {
  try {
    const userIdObj = new Types.ObjectId(userId);

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    if (comment.dislikes.includes(userIdObj)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already disliked this comment',
      );
    }

    if (comment.likes.includes(userIdObj)) {
      comment.likes = comment.likes.filter(
        (likeId) => !likeId.equals(userIdObj),
      );
      comment.likeVotes -= 1;
    }

    comment.dislikes.push(userIdObj);
    comment.disLikeVotes += 1;

    await comment.save();

    return comment;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const addReplyToComment = async (commentId: string, payload: TReplyPayload) => {
  try {
    const { userId, reply } = payload;
    const userIdObj = new Types.ObjectId(userId);

    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    comment.replies.push({ userId: userIdObj, reply });
    await comment.save();

    io.emit('replyAdded', { commentId, reply: { userId, reply } });

    return comment;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const updateReply = async (
  commentId: string,
  replyId: string,
  payload: Partial<TReplyPayload>,
) => {
  try {
    const { userId, reply } = payload;
    const userIdObj = new Types.ObjectId(userId);

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    const replyToUpdate = comment.replies.id(replyId);
    if (!replyToUpdate) {
      throw new AppError(httpStatus.NOT_FOUND, 'Reply not found');
    }

    if (!replyToUpdate.userId.equals(userIdObj)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update this reply',
      );
    }

    if (reply) {
      replyToUpdate.reply = reply;
    }

    await comment.save();

    io.emit('replyUpdated', { commentId, replyId, reply });

    return comment;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const deleteReply = async (commentId: string, replyId: string) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
    }

    const replyToDelete = comment.replies.id(replyId);
    if (!replyToDelete) {
      throw new AppError(httpStatus.NOT_FOUND, 'Reply not found');
    }

    replyToDelete.deleteOne();
    await comment.save();

    io.emit('replyDeleted', { commentId, replyId });

    return { message: 'Reply deleted successfully' };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const CommentService = {
  addCommentByUser,
  updateComment,
  deleteComment,
  getAllCommentFromDB,
  getSingleCommentFromDB,
  likeComment,
  dislikeComment,
  addReplyToComment,
  updateReply,
  deleteReply,
};
