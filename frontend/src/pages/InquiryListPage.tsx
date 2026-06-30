import { useNavigate } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';

function InquiryListPage() {
  const { items, removeItem, updateQuantity, clear, totalItems, totalAmount } = useInquiry();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-[2rem] bg-gradient-to-r from-white via-orange-50 to-slate-100 p-6 ring-1 ring-slate-200/70 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-charcoal">Inquiry cart</h1>
          <p className="mt-2 text-sm text-slate-600">
            {totalItems > 0
              ? `${totalItems} product${totalItems > 1 ? 's' : ''} saved. Submit when ready.`
              : 'Add products from the store to build your inquiry.'}
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Clear all</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] bg-white p-10 text-center ring-1 ring-slate-200/70 shadow-soft">
          <p className="text-slate-500">Your inquiry cart is empty. Browse the store to add products.</p>
          <button onClick={() => navigate('/shop')} className="mt-4 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Go to store</button>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="rounded-[1.75rem] bg-white p-5 ring-1 ring-slate-200/70 shadow-soft">
                <div className="grid gap-4 md:grid-cols-[1fr_140px] md:items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal">{item.name}</h2>
                    <p className="mt-2 text-sm text-slate-600">KSh {item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 transition hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="text-sm font-semibold text-primary">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[1.75rem] bg-gradient-to-r from-orange-50 to-white p-6 ring-1 ring-slate-200/70 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Estimated total</p>
                <p className="mt-2 text-3xl font-semibold text-charcoal">KSh {totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={() => navigate('/inquiry')} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Submit inquiry</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InquiryListPage;
