import { Server, Socket } from 'socket.io';
import { getAuth } from 'firebase-admin/auth';
import Conversation from './models/Conversation';
import Message from './models/Message';
import Admin from './models/Admin';

interface AuthSocket extends Socket {
  firebaseUid?: string;
  firebaseRole?: string;
  firebaseIsAdmin?: boolean;
}

export function setupChat(io: Server) {
  io.use(async (socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = await getAuth().verifyIdToken(token);
      socket.firebaseUid = decoded.uid;
      socket.firebaseRole = (decoded as any).role || 'Buyer';
      const adminRecord = await Admin.findOne({ firebaseUID: decoded.uid });
      socket.firebaseIsAdmin = !!adminRecord;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log('Chat connected:', socket.id, socket.firebaseUid);

    if (!socket.firebaseUid) {
      console.warn('Socket missing firebaseUid, disconnecting', socket.id);
      socket.disconnect(true);
      return;
    }

    const uid: string = socket.firebaseUid;

    socket.on('join:conversation', async (conversationId: string) => {
      const conv = await Conversation.findById(conversationId);
      if (!conv) return socket.emit('error', 'Conversation not found');
      const isParticipant = conv.participants.some(p => p.userId === uid);
      if (!isParticipant && !socket.firebaseIsAdmin) return socket.emit('error', 'Not a participant');
      socket.join(conversationId);
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(conversationId);
    });

    socket.on('message:send', async ({ conversationId, text }) => {
      if (!text?.trim()) return;
      const conv = await Conversation.findById(conversationId);
      if (!conv) return socket.emit('error', 'Conversation not found');
      let participant = conv.participants.find(p => p.userId === socket.firebaseUid);
      if (!participant && socket.firebaseIsAdmin) {
        participant = conv.participants.find(p => p.userId === 'admin') || conv.participants[0];
      }
      if (!participant) return socket.emit('error', 'Not a participant');

      const message = await Message.create({
        conversationId,
        senderId: uid,
        senderRole: participant.role,
        text: text.trim(),
        readBy: [{ userId: uid, timestamp: new Date() }]
      });

      conv.lastMessage = { text: text.trim(), timestamp: new Date(), senderId: uid };
      await conv.save();

      io.to(conversationId).emit('message:new', message.toObject());

      const convoObj = conv.toObject();
      io.emit('conversation:updated', convoObj);
    });

    socket.on('typing:start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing:start', { conversationId, userId: uid });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing:stop', { conversationId, userId: uid });
    });

    socket.on('message:read', async ({ conversationId }) => {
      const conv = await Conversation.findById(conversationId);
      if (!conv) return;
      const isParticipant = conv.participants.some(p => p.userId === uid);
      if (!isParticipant && !socket.firebaseIsAdmin) return;

      await Message.updateMany(
        { conversationId, 'readBy.userId': { $ne: uid } },
        { $push: { readBy: { userId: uid, timestamp: new Date() } } }
      );

      io.to(conversationId).emit('message:read', { conversationId, userId: uid });
    });

    socket.on('disconnect', () => {
      console.log('Chat disconnected:', socket.id);
    });
  });
}
