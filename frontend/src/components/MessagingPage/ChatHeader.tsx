import { Phone, MoreHorizontal } from 'lucide-react';
import { Conversation } from '../../services/chatService';

export default function ChatHeader({
  conversation,
  currentUserId
}: {
  conversation: Conversation;
  currentUserId: string;
}) {
  const other = conversation.participants.find(p => p.userId !== currentUserId) || conversation.participants[0];
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#274472] flex items-center justify-center text-sm font-bold text-white">
          {(other?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111827]">{other?.name || 'Customer'}</p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span className="text-xs text-[#6B7280]">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full p-2 text-[#6B7280] hover:bg-[#F8FAFC] transition">
          <Phone size={16} />
        </button>
        <button className="rounded-full p-2 text-[#6B7280] hover:bg-[#F8FAFC] transition">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
