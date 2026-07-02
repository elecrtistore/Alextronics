import { useState, useMemo } from 'react';
import { Conversation } from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from './SearchBar';
import FilterTabs from './FilterTabs';
import ConversationItem from './ConversationItem';

export default function ConversationSidebar({
  conversations,
  selectedId,
  onSelect,
  loading
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = conversations;
    if (filter === 'Unread') {
      list = list.filter(c => {
        const lm = c.lastMessage;
        return lm && lm.senderId !== (user?.uid || '');
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => {
        const other = c.participants.find(p => p.userId !== user?.uid);
        const name = (other?.name || '').toLowerCase();
        const product = (c.productName || '').toLowerCase();
        return name.includes(q) || product.includes(q);
      });
    }
    return list;
  }, [conversations, filter, search, user]);

  const currentUserId = user?.uid || '';

  return (
    <div className="flex flex-col h-full border-r border-[#E5E7EB] bg-white">
      <div className="p-4 pb-2">
        <h2 className="text-lg font-bold text-[#111827] mb-3">Messages</h2>
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} />
          <FilterTabs value={filter} onChange={setFilter} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {loading ? (
          <p className="text-sm text-[#6B7280] text-center py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-8">No conversations yet.</p>
        ) : (
          filtered.map(conv => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isSelected={selectedId === conv._id}
              onClick={() => onSelect(conv._id)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}
