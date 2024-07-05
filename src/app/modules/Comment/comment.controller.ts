import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRequest';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const { comment } = req.body;

  const userId = req.user._id.toString();

  const result = await CommentService.addCommentByUser(userId, { comment });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Added By User Successfully',
    data: result,
  });
});

const UpdateCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const commentData = req.body;
  const userId = req.user._id;

  const result = await CommentService.updateComment(
    userId as string,
    commentId as string,
    commentData,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Updated By User Successfully',
    data: result,
  });
});

const deleteCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const result = await CommentService.deleteComment(userId, commentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Deleted By User Successfully',
    data: result,
  });
});

const getAllComment = catchAsync(async (req, res) => {
  const result = await CommentService.getAllCommentFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const result = await CommentService.getSingleCommentFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  UpdateCommentController,
  deleteCommentController,
  getAllComment,
  getSingleComment,
};
