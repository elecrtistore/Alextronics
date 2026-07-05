import { useEffect, useRef, useState } from 'react';
import { Menu, Phone, MoreHorizontal, Pencil } from 'lucide-react';
import { Conversation } from '../../services/chatService';
import api from '../../services/api';
import { productSlug } from '../../utils/slug';

export default function ChatHeader({
  conversation,
  currentUserId,
  onOpenSidebar
}: {
  conversation: Conversation;
  currentUserId: string;
  onOpenSidebar: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('0708309429');
  const [chatLabel, setChatLabel] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const other = conversation.participants.find(p => p.userId !== currentUserId) || conversation.participants[0];

  useEffect(() => {
    api.get('/site/contact').then((res) => {
      if (res.data.sections) {
        const phone = res.data.sections.find((s: any) => s.heading === 'Phone');
        if (phone) setPhoneNumber(phone.content);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRename = () => {
    const name = prompt('Rename chat:', chatLabel || other?.name || '');
    if (name && name.trim()) {
      setChatLabel(name.trim());
    }
    setMenuOpen(false);
  };

  const handleViewProduct = () => {
    if (conversation.productId) {
      window.open(`/#/products/${productSlug(conversation.productName || 'product', conversation.productId)}`, '_blank');
    }
    setMenuOpen(false);
  };

  const displayedName = chatLabel || other?.name || 'Customer';

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-[#E5E7EB] shadow-sm md:px-5">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenSidebar} className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden">
          <Menu size={16} />
        </button>
        <div className="w-11 h-11 rounded-2xl bg-[#274472] flex items-center justify-center text-sm font-semibold text-white shadow-sm">
          {displayedName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{displayedName}</p>
          <p className="truncate text-xs text-slate-500">
            {conversation.productName ? `Chat about ${conversation.productName}` : 'Customer support chat'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 relative">
        <a
          href={`tel:${phoneNumber}`}
          className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition inline-flex items-center justify-center"
        >
          <Phone size={16} />
        </a>
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl z-30 py-1">
              <button
                onClick={handleRename}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <Pencil size={15} />
                Rename Chat
              </button>
              {conversation.productId && (
                <button
                  onClick={handleViewProduct}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M7 7h10v10" />
                    <path d="M7 17 21 3" />
                  </svg>
                  View Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
