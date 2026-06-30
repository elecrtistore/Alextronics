import { useNavigate } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

function InquiryListPage() {
  const { items, removeItem, updateQuantity, clear, totalItems, totalAmount } = useInquiry();
  const navigate = useNavigate();

  return (
    <div className="pt-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Inquiry Cart</h1>
            <p className="mt-2 text-sm text-soft">
              {totalItems > 0 ? `${totalItems} product${totalItems > 1 ? 's' : ''} saved.` : 'Add products from the store.'}
            </p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-soft hover:text-red-600 hover:border-red-200 transition">Clear all</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <ShoppingBag size={48} className="text-soft mx-auto" />
            <p className="text-soft">Your inquiry cart is empty.</p>
            <button onClick={() => navigate('/shop')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition inline-flex items-center gap-2">
              Browse store <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="rounded-2xl bg-white border border-border/60 p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-charcoal">{item.name}</h2>
                  <p className="text-sm text-soft mt-1">KSh {item.price.toLocaleString()} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1 rounded-full hover:bg-slate-200 transition">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[1.5rem] text-center font-semibold text-sm text-charcoal">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1 rounded-full hover:bg-slate-200 transition">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-semibold text-charcoal min-w-[100px] text-right">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeItem(item.productId)} className="p-2 rounded-full hover:bg-red-50 transition text-soft hover:text-red-500">
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
            <button onClick={() => navigate('/inquiry')} className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition shadow-lg shadow-primary/20">
              Submit inquiry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InquiryListPage;
