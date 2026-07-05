import { useEffect, useState, useCallback } from 'react';
import { Conversation, fetchConversations, fetchUnreadCount } from '../services/chatService';
import { useSocket } from './useSocket';
import { useAuth } from '../contexts/AuthContext';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const { firebaseUser, loading: authLoading } = useAuth();

  const load = useCallback(async (silent = false) => {
    try {
      const [data, count] = await Promise.all([
        fetchConversations(),
        fetchUnreadCount()
      ]);
      setConversations((prev) => {
        const prevIds = new Set(prev.map((conv) => conv._id));
        const nextIds = new Set(data.map((conv) => conv._id));
        const hasChanges = data.some((conv) => !prevIds.has(conv._id)) || prev.some((conv) => !nextIds.has(conv._id));
        if (!hasChanges && prev.length === data.length) {
          return prev;
        }
        return data;
      });
      setUnread(count);
    } catch {} finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      setLoading(false);
      return;
    }

    load();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        load(true);
      }
    }, 10000);

    const handleFocus = () => {
      load(true);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [load, firebaseUser, authLoading]);

  useEffect(() => {
    if (!socket) return;
    if (!firebaseUser) return;

    const handler = () => {
      load();
    };
    socket.on('conversation:updated', handler);
    return () => { socket.off('conversation:updated', handler); };
  }, [socket, load, firebaseUser]);

  return { conversations, unread, loading, reload: load };
}
