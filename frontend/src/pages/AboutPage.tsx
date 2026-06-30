import { useEffect, useState } from 'react';
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
    api.get<SiteContent>('/site/about')
      .then((res) => {
        if (res.data.title) setContent(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-[1.5rem] bg-white p-10 shadow-soft">
        <h1 className="text-3xl font-semibold text-charcoal">{content.title}</h1>
        <p className="mt-4 text-slate-600">{content.subtitle}</p>
        <p className="mt-6 text-slate-600">{content.body}</p>
        {content.sections.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {content.sections.map((section, i) => (
              <div key={i} className="rounded-[1.25rem] border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-charcoal">{section.heading}</h2>
                <p className="mt-3 text-sm text-slate-600">{section.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutPage;
