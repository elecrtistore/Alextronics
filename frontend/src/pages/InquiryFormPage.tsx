import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';
import { submitInquiry } from '../services/inquiryService';

function InquiryFormPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clear } = useInquiry();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      setError('Your inquiry cart is empty. Add products before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await submitInquiry({
        customer: { name: form.name, phone: form.phone },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        estimatedTotal: totalAmount
      });
      clear();
      navigate('/success');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] bg-white p-10 text-center shadow-soft">
          <h1 className="text-3xl font-semibold text-charcoal">No items to submit</h1>
          <p className="mt-4 text-sm text-slate-600">Add products to your inquiry cart first.</p>
          <button onClick={() => navigate('/shop')} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Go to store</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[1.5rem] bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-charcoal">Submit inquiry</h1>
        <p className="mt-2 text-sm text-slate-600">The seller will contact you directly using the details below.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full Name</span>
              <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Phone Number</span>
              <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-charcoal outline-none focus:border-primary" />
            </label>
          </div>

          <div className="rounded-[1.5rem] bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-charcoal">Products</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-charcoal">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity} x KSh {item.price.toLocaleString()}</p>
                  </div>
                  <p className="font-semibold text-charcoal">KSh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-lg font-semibold text-charcoal">KSh {totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[1.25rem] bg-primary px-5 py-4 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InquiryFormPage;
