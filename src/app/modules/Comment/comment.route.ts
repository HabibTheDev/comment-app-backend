import express from 'express';
import auth from '../../middlewares/auth';
import { commentValidations } from './comment.validation';
import { CommentController } from './comment.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  auth(),
  validateRequest(commentValidations.commentSchemaValidation),
  CommentController.createComment,
);
router.put(
  '/:commentId',
  auth(),
  validateRequest(commentValidations.commentSchemaValidation),
  CommentController.UpdateCommentController,
);

router.delete('/:commentId', auth(), CommentController.deleteCommentController);

router.get('/', auth(), CommentController.getAllComment);

router.get('/:userId', auth(), CommentController.getSingleComment);

router.put(
  '/like/:commentId',
  auth(),
  CommentController.likeCommentCommentController,
);

router.put(
  '/dislike/:commentId',
  auth(),
  CommentController.disLikeCommentCommentController,
);
router.put(
  '/:commentId/reply/:replyId/like',
  auth(),
  CommentController.likeReplyController,
);
router.put(
  '/:commentId/reply/:replyId/dislike',
  auth(),
  CommentController.dislikeReplyController,
);

router.post('/:commentId/reply', auth(), CommentController.addReply);

router.put(
  '/:commentId/reply/:replyId/edit',
  auth(),
  CommentController.updateReplyById,
);

router.delete(
  '/:commentId/reply/:replyId/delete',
  auth(),
  CommentController.deleteReplyById,
);

export const CommentRoutes = router;
