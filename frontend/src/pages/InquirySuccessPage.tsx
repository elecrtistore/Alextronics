import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

function InquirySuccessPage() {
  const { clear } = useInquiry();
  useEffect(() => { clear(); }, [clear]);

  return (
    <div className="pt-0 bg-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white border border-slate-200 p-10 shadow-sm text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-charcoal">Inquiry submitted</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">Your inquiry has been sent. The seller will contact you shortly by phone or WhatsApp.</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
            Continue shopping <ArrowRight size={16} />
          </Link>
          <Link to="/messages" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-charcoal hover:bg-slate-100 transition">
            <MessageCircle size={16} /> Messages
          </Link>
        </div>

        <div className="mt-12 rounded-3xl bg-slate-50 p-6 text-left">
          <h2 className="text-lg font-semibold text-charcoal">What happens next?</h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">Your inquiry is now in the seller's inbox. They will review it and respond with pricing, availability, and pickup details.</p>
        </div>
      </div>
    </div>
  );
}

export default InquirySuccessPage;
