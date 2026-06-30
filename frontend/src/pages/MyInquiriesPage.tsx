import { useEffect, useState } from 'react';
import { Inquiry } from '../types/inquiry';
import { fetchInquiries } from '../services/inquiryService';

function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries()
      .then(setInquiries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-slate-500 sm:px-6 lg:px-8">
        Loading inquiries…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-charcoal">My inquiries</h1>
          <p className="mt-2 text-sm text-slate-600">Track your inquiry status and review details for each request.</p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="mt-8 rounded-[1.5rem] bg-white p-10 text-center shadow-soft">
          <p className="text-slate-500">You haven't submitted any inquiries yet.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="rounded-[1.5rem] bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Inquiry ID</p>
                  <p className="mt-1 text-lg font-semibold text-charcoal">{inquiry._id}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{inquiry.status}</div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Customer</p>
                  <p className="mt-1 text-sm font-semibold text-charcoal">{inquiry.customer.name}</p>
                  <p className="text-sm text-slate-500">{inquiry.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="mt-1 text-sm font-semibold text-charcoal">{inquiry.customer.county}, {inquiry.customer.town}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Submitted</p>
                  <p className="mt-1 text-sm font-semibold text-charcoal">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr>
                      <th className="pb-3 font-semibold text-slate-800">Product</th>
                      <th className="pb-3 font-semibold text-slate-800">Quantity</th>
                      <th className="pb-3 font-semibold text-slate-800">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiry.items.map((item) => (
                      <tr key={item.productId}>
                        <td className="py-3 font-medium text-charcoal">{item.name}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">KSh {item.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">Estimated total</p>
                <p className="text-lg font-semibold text-charcoal">KSh {inquiry.estimatedTotal.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInquiriesPage;
