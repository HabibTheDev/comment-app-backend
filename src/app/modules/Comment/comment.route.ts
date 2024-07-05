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

export const CommentRoutes = router;
