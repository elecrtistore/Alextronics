import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, MessageCircle, Star } from 'lucide-react';
import api from '../services/api';

interface SiteContent {
  page: string;
  title: string;
  subtitle: string;
  body: string;
  sections: { heading: string; content: string }[];
}

const defaults: SiteContent = {
  page: 'about',
  title: 'About ALEXTRONICS',
  subtitle: 'Your trusted source for quality electronics.',
  body: 'ALEXTRONICS is an inquiry-first private shop built for direct customer contact. We focus on product browsing, simple inquiry tracking, and a direct connection between you and the seller.',
  sections: [
    { heading: 'Explore', content: 'Browse curated electronics and request product details directly from the shop owner.' },
    { heading: 'Inquire', content: 'Send the shop owner a single request for pricing, stock, and delivery details.' },
    { heading: 'Connect', content: 'Reach out by phone or WhatsApp to follow up directly.' }
  ]
};

function AboutPage() {
  const [content, setContent] = useState<SiteContent>(defaults);

  useEffect(() => {
    api.get<SiteContent>('/site/about').then((res) => { if (res.data.title) setContent(res.data); }).catch(() => {});
  }, []);

  return (
    <div className="pt-24 bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">About us</p>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">{content.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">{content.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] bg-white p-10 shadow-sm border border-slate-200">
            <p className="text-lg leading-8 text-slate-700">{content.body}</p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {content.sections.map((section) => (
                <div key={section.heading} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    {section.heading === 'Explore' ? <Star size={20} /> : section.heading === 'Inquire' ? <MessageCircle size={20} /> : <Shield size={20} />}
                  </div>
                  <h2 className="text-base font-semibold text-charcoal mb-2">{section.heading}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-primary to-primary-hover p-10 text-white shadow-lg shadow-primary/20">
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Why choose us</p>
            <h2 className="mt-5 text-3xl font-semibold">ALEXTRONICS brings buyers and sellers closer.</h2>
            <p className="mt-5 text-sm leading-7 text-white/80">Experience a transparent inquiry marketplace where every product, message, and quote is built for direct communication.</p>
            <div className="mt-10 grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Premium selection</p>
                <p className="mt-3 text-lg font-semibold">Curated electronics for every need.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Support</p>
                <p className="mt-3 text-lg font-semibold">Direct contact and fast responses.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Trust</p>
                <p className="mt-3 text-lg font-semibold">Verified business and secure browsing.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-500">Ready to explore the marketplace?</p>
          <Link to="/shop" className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition">
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
