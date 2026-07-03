import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://127.0.0.1:5000';

let globalSocket: Socket | null = null;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(globalSocket);

  useEffect(() => {
    if (globalSocket?.connected) {
      setSocket(globalSocket);
      return;
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      user.getIdToken().then((token) => {
        if (globalSocket?.connected) {
          setSocket(globalSocket);
          return;
        }

        const s = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket', 'polling'] as any
        });
        globalSocket = s;
        setSocket(s);
      });
    });

    return () => unsubscribe();
  }, []);

  return socket;
}
