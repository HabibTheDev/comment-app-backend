import { Router } from 'express';
import { AuthRoutes } from '../modules/Authentication/auth.route';
import { CommentRoutes } from '../modules/Comment/comment.route';
const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/comment',
    route: CommentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
