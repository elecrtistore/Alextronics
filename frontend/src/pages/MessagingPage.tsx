import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConversations } from '../hooks/useConversations';
import { useSocket } from '../hooks/useSocket';
import ConversationSidebar from '../components/MessagingPage/ConversationSidebar';
import ChatWindow from '../components/MessagingPage/ChatWindow';
import BusinessPanel from '../components/MessagingPage/BusinessPanel';

export default function MessagingPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { conversations, loading } = useConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = conversations.find(c => c._id === selectedId) || null;

  useEffect(() => {
    if (loading) return;
    if (selectedId) return;
    const requestedConversation = searchParams.get('conversation');
    if (requestedConversation && conversations.some((c) => c._id === requestedConversation)) {
      setSelectedId(requestedConversation);
      return;
    }
    if (conversations.length > 0) {
      setSelectedId(conversations[0]._id);
    }
  }, [conversations, loading, searchParams, selectedId]);

  return (
    <div className="pt-20 h-screen flex flex-col bg-[#F8FAFC]">
      <div className="flex-1 flex overflow-hidden max-w-[1440px] w-full mx-auto border border-[#E5E7EB] rounded-2xl bg-white shadow-sm">
        <div className="w-[360px] shrink-0 max-md:hidden">
          <ConversationSidebar
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={loading}
          />
        </div>
        <ChatWindow conversation={selected} />
        <BusinessPanel />
      </div>
    </div>
  );
}
