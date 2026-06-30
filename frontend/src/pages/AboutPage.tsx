import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowRight } from 'lucide-react';

interface SiteContent {
  page: string; title: string; subtitle: string; body: string;
  sections: { heading: string; content: string }[];
}

const defaults: SiteContent = {
  page: 'about',
  title: 'About ElectriShop',
  subtitle: 'Your trusted source for quality electronics.',
  body: 'ElectriShop is an inquiry-first private shop built for direct customer contact. We focus on product browsing, simple inquiry tracking, and a direct connection between you and the seller.',
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
    <div className="pt-24">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal leading-tight">{content.title}</h1>
          <p className="mt-4 text-lg text-soft">{content.subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-charcoal leading-relaxed text-lg">{content.body}</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold text-charcoal mb-3">{section.heading}</h2>
              <p className="text-sm text-soft leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition">
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
