import { useEffect, useState, useCallback } from 'react';
import { Conversation, fetchConversations, fetchUnreadCount } from '../services/chatService';
import { useSocket } from './useSocket';
import { useAuth } from '../contexts/AuthContext';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const socketRef = useSocket();
  const { firebaseUser, loading: authLoading } = useAuth();

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
    // wait for auth to initialize and for a signed-in firebase user
    if (authLoading) return;
    if (!firebaseUser) {
      setLoading(false);
      return;
    }
    load();
  }, [load, firebaseUser, authLoading]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    // only listen for socket events when user is authenticated
    if (!firebaseUser) return;

    const handler = () => {
      load();
    };
    socket.on('conversation:updated', handler);
    return () => { socket.off('conversation:updated', handler); };
  }, [socketRef, load]);

  return { conversations, unread, loading, reload: load };
}
