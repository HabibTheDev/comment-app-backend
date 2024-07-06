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

router.post('/:commentId/reply', auth(), CommentController.addReply);

router.put(
  '/:commentId/reply/:replyId',
  auth(),
  CommentController.updateReplyById,
);

router.delete(
  '/:commentId/reply/:replyId',
  auth(),
  CommentController.deleteReplyById,
);

export const CommentRoutes = router;
