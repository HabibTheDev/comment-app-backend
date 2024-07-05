import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendRequest';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const commentData = req.body;
  const userId = req.user._id;

  const result = await CommentService.addCommentByUser(userId, commentData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment Added By User Successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
};
