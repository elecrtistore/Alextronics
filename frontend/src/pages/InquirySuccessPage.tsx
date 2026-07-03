import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInquiry } from '../contexts/InquiryContext';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

function InquirySuccessPage() {
  const { clear } = useInquiry();
  useEffect(() => { clear(); }, [clear]);

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-charcoal">Inquiry submitted</h1>
        <p className="text-soft leading-relaxed">Your inquiry has been sent. The seller will contact you shortly by phone or WhatsApp.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
            Continue shopping <ArrowRight size={16} />
          </Link>
          <Link to="/messages" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-charcoal hover:bg-slate-50 transition">
            <MessageCircle size={16} /> Messages
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InquirySuccessPage;
