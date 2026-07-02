import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://127.0.0.1:5000';

let globalSocket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(globalSocket);

  useEffect(() => {
    if (globalSocket?.connected) {
      socketRef.current = globalSocket;
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    user.getIdToken().then((token) => {
      if (globalSocket?.connected) return;
      const s = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'] as any
      });
      globalSocket = s;
      socketRef.current = s;
    });

    return () => {};
  }, []);

  return socketRef;
}
