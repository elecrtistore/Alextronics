import { Menu, Phone, MoreHorizontal } from 'lucide-react';
import { Conversation } from '../../services/chatService';

export default function ChatHeader({
  conversation,
  currentUserId,
  onOpenSidebar
}: {
  conversation: Conversation;
  currentUserId: string;
  onOpenSidebar: () => void;
}) {
  const other = conversation.participants.find(p => p.userId !== currentUserId) || conversation.participants[0];
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-[#E5E7EB] shadow-sm md:px-5">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenSidebar} className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden">
          <Menu size={16} />
        </button>
        <div className="w-11 h-11 rounded-2xl bg-[#274472] flex items-center justify-center text-sm font-semibold text-white shadow-sm">
          {(other?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{other?.name || 'Customer'}</p>
          <p className="truncate text-xs text-slate-500">
            {conversation.productName ? `Chat about ${conversation.productName}` : 'Customer support chat'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition">
          <Phone size={16} />
        </button>
        <button className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
