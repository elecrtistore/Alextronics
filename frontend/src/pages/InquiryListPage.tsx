import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';
import { useAuth } from '../contexts/AuthContext';
import { createConversation } from '../services/chatService';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, MessageCircle, LogIn } from 'lucide-react';

function InquiryListPage() {
  const { items, removeItem, updateQuantity, clear, totalItems, totalAmount } = useInquiry();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messaging, setMessaging] = useState(false);

  const handleMessageSeller = async () => {
    if (!user) { navigate('/login'); return; }
    if (items.length === 0) return;
    setMessaging(true);
    try {
      const first = items[0];
      const conv = await createConversation({
        participantId: 'admin',
        participantRole: 'Admin',
        participantName: 'ALEXTRONICS',
        productId: first.productId,
        productName: items.length === 1 ? first.name : `${first.name} + ${items.length - 1} more`,
        productImage: first.image,
        productPrice: totalAmount,
      });
      navigate(`/messages?conversation=${conv._id}`);
    } catch {
      navigate('/messages');
    } finally {
      setMessaging(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12 pb-28">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Shopping Cart</h1>
            <p className="mt-2 text-sm text-soft">
              {totalItems > 0 ? `${totalItems} product${totalItems > 1 ? 's' : ''} in your cart.` : 'Add products from the store.'}
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-soft hover:text-red-600 hover:border-red-200 transition">Clear all</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingBag size={48} className="text-soft mx-auto" />
            <p className="text-soft">Your cart is empty.</p>
            <button onClick={() => navigate('/shop')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition inline-flex items-center gap-2">
              Browse store <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="rounded-2xl bg-white border border-border/60 p-5 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-border/60" />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-semibold text-charcoal truncate">{item.name}</h2>
                    <p className="text-sm text-soft mt-1">KSh {item.price.toLocaleString()} each</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 rounded-full hover:bg-slate-200 transition">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[1.5rem] text-center font-semibold text-sm text-charcoal">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 rounded-full hover:bg-slate-200 transition">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-semibold text-charcoal text-right">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeItem(item.productId)} className="p-2 inline-flex rounded-full hover:bg-red-50 transition text-soft hover:text-red-500 self-start sm:self-end">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-orange-50 to-white border border-orange-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-soft">Estimated total</p>
              <p className="text-3xl font-bold text-charcoal">KSh {totalAmount.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              {!user && (
                <button onClick={() => navigate('/login')} className="rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-charcoal hover:bg-slate-50 transition inline-flex items-center gap-2">
                  <LogIn size={16} /> Sign in
                </button>
              )}
              <button
                onClick={handleMessageSeller}
                disabled={messaging}
                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition shadow-lg shadow-primary/20 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <MessageCircle size={18} />
                {messaging ? 'Opening chat...' : 'Message Seller'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InquiryListPage;