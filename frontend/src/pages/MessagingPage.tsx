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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selected = conversations.find(c => c._id === selectedId) || null;

  useEffect(() => {
    if (loading) return;
    if (selectedId && conversations.some((c) => c._id === selectedId)) return;
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
    <div className="pt-20 min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="flex-1 flex min-h-0 flex-col overflow-hidden max-w-[1440px] w-full mx-auto border border-[#E5E7EB] rounded-2xl bg-white shadow-sm relative md:flex-row">
        <div className="w-[360px] shrink-0 max-md:hidden">
          <ConversationSidebar
            conversations={conversations}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              setIsSidebarOpen(false);
            }}
            loading={loading}
          />
        </div>

        <ChatWindow conversation={selected} onOpenSidebar={() => setIsSidebarOpen(true)} />
        <BusinessPanel />

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 md:hidden">
            <div className="absolute left-0 top-0 h-full w-full max-w-[320px] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
                <h2 className="text-lg font-semibold text-[#111827]">Chats</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="text-sm text-slate-600 hover:text-charcoal">Close</button>
              </div>
              <ConversationSidebar
                conversations={conversations}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  setIsSidebarOpen(false);
                }}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
