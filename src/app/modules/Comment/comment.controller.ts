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
    statusCode: httpStatus.CREATED,
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

const likeCommentCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const result = await CommentService.likeComment(
    userId as string,
    commentId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Liked By User Successfully',
    data: result,
  });
});

const disLikeCommentCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const result = await CommentService.dislikeComment(
    userId as string,
    commentId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Disliked By User Successfully',
    data: result,
  });
});

const likeReplyController = catchAsync(async (req, res) => {
  const { commentId, replyId } = req.params;
  const userId = req.user._id;

  const updatedComment = await CommentService.likeReply(
    userId,
    commentId,
    replyId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply liked successfully',
    data: updatedComment,
  });
});

const dislikeReplyController = catchAsync(async (req, res) => {
  const { commentId, replyId } = req.params;
  const userId = req.user._id; // Assuming userId is available in req.user._id

  const updatedComment = await CommentService.dislikeReply(
    userId,
    commentId,
    replyId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply disliked successfully',
    data: updatedComment,
  });
});

const addReply = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { reply } = req.body;
  const userId = req.user._id;

  const result = await CommentService.addReplyToComment(commentId, {
    userId,
    reply,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Reply added successfully',
    data: result,
  });
});

const updateReplyById = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { commentId, replyId } = req.params;
  const { reply } = req.body;

  const result = await CommentService.updateReply(commentId, replyId, {
    userId,
    reply,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply updated successfully',
    data: result,
  });
});

const deleteReplyById = catchAsync(async (req, res) => {
  const { commentId, replyId } = req.params;

  await CommentService.deleteReply(commentId, replyId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply updated successfully',
    data: '',
  });
});

export const CommentController = {
  createComment,
  UpdateCommentController,
  deleteCommentController,
  getAllComment,
  getSingleComment,
  likeCommentCommentController,
  disLikeCommentCommentController,
  addReply,
  updateReplyById,
  deleteReplyById,
  likeReplyController,
  dislikeReplyController,
};
