import { Router } from 'express';
import * as chatController from '../controllers/chatController';
import { validateFirebaseToken } from '../middleware/validateFirebaseToken';
import { adminGuard } from '../middleware/adminGuard';

const router = Router();

router.get('/conversations', validateFirebaseToken, chatController.getConversations);
router.get('/conversations/:id', validateFirebaseToken, chatController.getConversationById);
router.get('/conversations/:id/messages', validateFirebaseToken, chatController.getMessages);
router.post('/conversations', validateFirebaseToken, chatController.createConversation);
router.get('/unread', validateFirebaseToken, chatController.getUnreadCount);

export default router;
