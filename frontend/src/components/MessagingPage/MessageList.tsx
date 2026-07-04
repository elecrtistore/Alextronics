import { useEffect, useRef } from 'react';
import { Message } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function MessageList({
  messages,
  loading,
  typingName,
  onMarkRead
}: {
  messages: Message[];
  loading: boolean;
  typingName?: string;
  onMarkRead: () => void;
}) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const didMarkRef = useRef(false);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    const shouldAutoScroll = lastMessage?.senderId === user?.uid || messages.length > 0;
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, user?.uid]);

  useEffect(() => {
    if (messages.length > 0 && !didMarkRef.current) {
      onMarkRead();
      didMarkRef.current = true;
    }
  }, [messages.length, onMarkRead]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-[#6B7280]">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.senderId === user?.uid}
          />
        ))
      )}
      <TypingIndicator name={typingName} />
      <div ref={bottomRef} />
    </div>
  );
}
