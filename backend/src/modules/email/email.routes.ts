import { Router } from 'express';
import { emailController } from './email.controller.ts';
import { authMiddleware } from '../auth/auth.middleware.ts';

const router = Router();

router.use(authMiddleware);

router.post('/', emailController.create);
router.get('/', emailController.list);
router.get('/domains', emailController.listDomains);
router.get('/:emailId/messages', emailController.getMessages);
router.get('/:emailId/messages/:messageId', emailController.getMessage);
router.delete('/:emailId', emailController.delete);

export default router;
