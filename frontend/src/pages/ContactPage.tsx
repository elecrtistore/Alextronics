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
  page: 'contact',
  title: 'Contact us',
  subtitle: 'Reach out to discuss inquiries, pricing, or pickup arrangements.',
  body: 'Have a question or want to follow up on an inquiry? Use any of the channels below.',
  sections: [
    { heading: 'Phone', content: '0705980668' },
    { heading: 'WhatsApp', content: '0705980668' },
    { heading: 'Email', content: 'electristore@gmail.com' }
  ]
};

function ContactPage() {
  const [content, setContent] = useState<SiteContent>(defaults);

  useEffect(() => {
    api.get<SiteContent>('/site/contact')
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
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {content.sections.map((section, i) => (
            <div key={i} className="rounded-[1.25rem] border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-charcoal">{section.heading}</h2>
              {section.heading === 'WhatsApp' ? (
                <a
                  href={`https://wa.me/${section.content.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-sm text-blue-600 underline"
                >
                  {section.content}
                </a>
              ) : (
                <p className="mt-3 text-sm text-slate-600">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
