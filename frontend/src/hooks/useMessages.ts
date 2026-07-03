import { useEffect, useState, useCallback, useRef } from 'react';
import { Message, fetchMessages } from '../services/chatService';
import { useSocket } from './useSocket';

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const joinedRef = useRef(false);

  const load = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch {} finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    setMessages([]);
    joinedRef.current = false;
    if (!conversationId) return;
    load();
  }, [conversationId, load]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    if (!joinedRef.current) {
      socket.emit('join:conversation', conversationId);
      joinedRef.current = true;
    }

    const handleNew = (msg: Message) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handleRead = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => prev.map(m =>
          m.senderId !== data.userId && !m.readBy.some(r => r.userId === data.userId)
            ? { ...m, readBy: [...m.readBy, { userId: data.userId, timestamp: new Date().toISOString() }] }
            : m
        ));
      }
    };

    socket.on('message:new', handleNew);
    socket.on('message:read', handleRead);

    return () => {
      socket.off('message:new', handleNew);
      socket.off('message:read', handleRead);
    };
  }, [socket, conversationId]);

  const sendMessage = useCallback((text: string) => {
    if (!socket || !conversationId) return;
    socket.emit('message:send', { conversationId, text });
  }, [socket, conversationId]);

  const markRead = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit('message:read', { conversationId });
  }, [socket, conversationId]);

  return { messages, loading, sendMessage, markRead, reload: load };
}
