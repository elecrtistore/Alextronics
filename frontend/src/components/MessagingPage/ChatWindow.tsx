import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Conversation } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../hooks/useMessages';
import { useTypingStatus } from '../../hooks/useTypingStatus';
import { useSocket } from '../../hooks/useSocket';
import ChatHeader from './ChatHeader';
import ProductPreview from './ProductPreview';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatWindow({ conversation, onOpenSidebar }: { conversation: Conversation | null; onOpenSidebar: () => void }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, markRead } = useMessages(conversation?._id || null);
  const { typingUsers, notifyTyping } = useTypingStatus(conversation?._id || null);
  const socketRef = useSocket();
  const currentUserId = user?.uid || '';

  const other = conversation?.participants.find(p => p.userId !== currentUserId);
  const isOtherTyping = other?.userId ? typingUsers.has(other.userId) : false;

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:hidden">
          <button type="button" onClick={onOpenSidebar} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
            <Menu size={16} /> Conversations
          </button>
        </div>
        <div className="flex-1 flex min-h-0 items-center justify-center px-6 bg-white">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#111827]">No conversation selected</h3>
            <p className="text-sm text-[#6B7280] mt-1">Open the conversations list to continue chatting.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader conversation={conversation} currentUserId={currentUserId} onOpenSidebar={onOpenSidebar} />
      <ProductPreview
        name={conversation.productName}
        price={conversation.productPrice}
        image={conversation.productImage}
        productId={conversation.productId}
      />
      <MessageList
        messages={messages}
        loading={loading}
        typingName={isOtherTyping ? other?.name : undefined}
        onMarkRead={markRead}
      />
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        onTyping={notifyTyping}
      />
    </div>
  );
}
