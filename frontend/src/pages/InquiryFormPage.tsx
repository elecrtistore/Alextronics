import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInquiry } from '../contexts/InquiryContext';
import { submitInquiry } from '../services/inquiryService';
import { createConversation } from '../services/chatService';
import { User, Phone as PhoneIcon, ShoppingBag, ArrowLeft } from 'lucide-react';

function InquiryFormPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { items, totalAmount, clear } = useInquiry();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.displayName && !form.name) {
      setForm((prev) => ({ ...prev, name: prev.name || user.displayName || '' }));
    }
  }, [user?.displayName]);

  useEffect(() => {
    if (!authLoading && !user && items.length > 0) {
      setError('Sign in before submitting your inquiry.');
    }
  }, [authLoading, user, items.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    setSubmitting(true); setError('');
    try {
      const inquiry = await submitInquiry({
        customer: { name: form.name, phone: form.phone },
        items: items.map((i) => ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
        estimatedTotal: totalAmount
      });

      clear();

      if (user) {
        try {
          const conv = await createConversation({
            participantId: 'admin',
            participantRole: 'Admin',
            participantName: 'ALEXTRONICS',
            inquiryId: inquiry._id,
            productId: items[0]?.productId,
            productName: items[0]?.name,
          });
          navigate(`/messages?conversation=${conv._id}`);
          return;
        } catch {
          // fall through to success page if chat creation fails
        }
      }

      navigate('/success');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit.');
    } finally { setSubmitting(false); }
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <ShoppingBag size={48} className="text-soft mx-auto" />
          <h1 className="text-2xl font-bold text-charcoal">No items to submit</h1>
          <p className="text-soft text-sm">Add products to your cart first.</p>
          <button onClick={() => navigate('/shop')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">Go to store</button>
        </div>
      </div>
    );
  }

  if (!authLoading && !user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <ShoppingBag size={48} className="text-soft mx-auto" />
          <h1 className="text-2xl font-bold text-charcoal">Please sign in</h1>
          <p className="text-soft text-sm">You must be signed in to submit an inquiry and start a chat.</p>
          <button onClick={() => navigate('/login')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <button onClick={() => navigate('/inquiry-list')} className="inline-flex items-center gap-2 text-sm text-soft hover:text-charcoal transition mb-8">
          <ArrowLeft size={16} /> Back to cart
        </button>
        <h1 className="text-3xl font-bold text-charcoal">Submit inquiry</h1>
        <p className="mt-2 text-soft text-sm">The seller will contact you directly.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-600">{error}</div>}

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-charcoal">Full Name</label>
              <div className="relative mt-2">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-primary transition" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal">Phone Number</label>
              <div className="relative mt-2">
                <PhoneIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-soft" />
                <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-primary transition" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 space-y-4">
            <h2 className="font-semibold text-charcoal">Products ({items.length})</h2>
            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-charcoal text-sm">{item.name}</p>
                    <p className="text-xs text-soft">Qty: {item.quantity} &times; KSh {item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-charcoal text-sm">KSh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <p className="text-sm text-soft">Total</p>
              <p className="text-xl font-bold text-charcoal">KSh {totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InquiryFormPage;
