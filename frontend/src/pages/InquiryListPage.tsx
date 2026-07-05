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
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Your inquiry basket</p>
              <h1 className="mt-3 text-4xl font-semibold text-charcoal">Shopping Cart</h1>
              <p className="mt-2 text-sm text-slate-500">
                {totalItems > 0 ? `${totalItems} product${totalItems > 1 ? 's' : ''} in your cart.` : 'Add products from the shop to start your inquiry.'}
              </p>
            </div>
            {items.length > 0 && (
              <button onClick={clear} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                Clear cart
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-[2rem] border border-dashed border-slate-300 bg-white p-14 text-center">
            <ShoppingBag size={56} className="mx-auto text-slate-400" />
            <h2 className="mt-6 text-2xl font-semibold text-charcoal">Your cart is empty</h2>
            <p className="mt-3 text-sm text-slate-500">Add the products you want to inquire about and send them as one request.</p>
            <button onClick={() => navigate('/shop')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
              Browse store <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {items.map((item) => (
              <div key={item.productId} className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl bg-slate-50 p-2 object-contain border border-slate-200" />
                    )}
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-charcoal truncate">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">KSh {item.price.toLocaleString()} each</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 items-start sm:items-end">
                    <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="rounded-full p-1 transition hover:bg-slate-200">
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[1.5rem] text-center font-semibold text-charcoal">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="rounded-full p-1 transition hover:bg-slate-200">
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-charcoal">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeItem(item.productId)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-10 rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-500">Estimated total</p>
                <p className="mt-2 text-4xl font-semibold text-charcoal">KSh {totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {!user && (
                  <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                    <LogIn size={16} /> Sign in
                  </button>
                )}
                <button
                  onClick={handleMessageSeller}
                  disabled={messaging}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <MessageCircle size={18} />
                  {messaging ? 'Opening chat...' : 'Message Seller'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InquiryListPage;