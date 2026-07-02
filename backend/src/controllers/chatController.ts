import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import Admin from '../models/Admin';

async function isAdmin(uid: string): Promise<boolean> {
  const record = await Admin.findOne({ firebaseUID: uid });
  if (record) return true;
  const emails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  return false;
}

export async function getConversations(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  const admin = await isAdmin(firebaseUser.uid);
  const filter = admin ? {} : { 'participants.userId': firebaseUser.uid };
  const conversations = await Conversation.find(filter).sort({ updatedAt: -1 });
  res.json(conversations);
}

export async function getConversationById(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  const admin = await isAdmin(firebaseUser.uid);
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
  const isParticipant = conversation.participants.some(p => p.userId === firebaseUser.uid);
  if (!isParticipant && !admin) return res.status(403).json({ message: 'Access denied' });
  res.json(conversation);
}

export async function getMessages(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  const admin = await isAdmin(firebaseUser.uid);
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
  const isParticipant = conversation.participants.some(p => p.userId === firebaseUser.uid);
  if (!isParticipant && !admin) return res.status(403).json({ message: 'Access denied' });

  const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
  const before = req.query.before as string;
  const filter: any = { conversationId: req.params.id };
  if (before) filter._id = { $lt: before };

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .then(docs => docs.reverse());
  res.json(messages);
}

export async function createConversation(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  const { participantId, participantRole, participantName, inquiryId, productId, productName } = req.body;

  if (!participantId) return res.status(400).json({ message: 'participantId is required' });

  const existing = await Conversation.findOne({
    $and: [
      { 'participants.userId': firebaseUser.uid },
      { 'participants.userId': participantId }
    ]
  });
  if (existing) return res.json(existing);

  const conversation = await Conversation.create({
    participants: [
      { userId: firebaseUser.uid, role: 'Buyer', name: firebaseUser.name || firebaseUser.email || '' },
      { userId: participantId, role: participantRole || 'Admin', name: participantName || '' }
    ],
    inquiryId,
    productId,
    productName
  });
  res.status(201).json(conversation);
}

export async function getUnreadCount(req: Request, res: Response) {
  const firebaseUser = res.locals.firebaseUser;
  const admin = await isAdmin(firebaseUser.uid);
  const filter = admin ? {} : { 'participants.userId': firebaseUser.uid };
  const conversations = await Conversation.find(filter);
  const ids = conversations.map(c => c._id);
  const count = await Message.countDocuments({
    conversationId: { $in: ids },
    senderId: { $ne: firebaseUser.uid },
    'readBy.userId': { $ne: firebaseUser.uid }
  });
  res.json({ count });
}
