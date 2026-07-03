import { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from './useSocket';

export function useTypingStatus(conversationId: string | null) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socket = useSocket();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleStart = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    };
    const handleStop = ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    socket.on('typing:start', handleStart);
    socket.on('typing:stop', handleStop);
    return () => {
      socket.off('typing:start', handleStart);
      socket.off('typing:stop', handleStop);
    };
  }, [socket, conversationId]);

  const emitTyping = useCallback((isTyping: boolean) => {
    if (!socket || !conversationId) return;
    socket.emit(isTyping ? 'typing:start' : 'typing:stop', { conversationId });
  }, [socket, conversationId]);

  const notifyTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitTyping(false);
    }, 2000);
  }, [emitTyping]);

  return { typingUsers, notifyTyping };
}
