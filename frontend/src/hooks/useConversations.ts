import { useEffect, useState, useCallback } from 'react';
import { Conversation, fetchConversations, fetchUnreadCount } from '../services/chatService';
import { useSocket } from './useSocket';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const socketRef = useSocket();

  const load = useCallback(async () => {
    try {
      const [data, count] = await Promise.all([
        fetchConversations(),
        fetchUnreadCount()
      ]);
      setConversations(data);
      setUnread(count);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = () => {
      load();
    };
    socket.on('conversation:updated', handler);
    return () => { socket.off('conversation:updated', handler); };
  }, [socketRef, load]);

  return { conversations, unread, loading, reload: load };
}
