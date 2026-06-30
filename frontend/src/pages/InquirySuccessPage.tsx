import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';

function InquirySuccessPage() {
  const { clear } = useInquiry();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="rounded-[1.5rem] bg-white p-10 text-center shadow-soft">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <h1 className="text-3xl font-semibold text-charcoal">Inquiry submitted successfully</h1>
        <p className="mt-4 text-sm text-slate-600">Your inquiry has been sent. The seller will contact you shortly by phone or WhatsApp.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/shop" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">Continue shopping</Link>
          <Link to="/my-inquiries" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-slate-50">View my inquiries</Link>
        </div>
      </div>
    </div>
  );
}

export default InquirySuccessPage;
