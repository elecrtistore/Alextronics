import { useEffect, useState } from 'react';
import api from '../services/api';
import { MessageCircle, Phone, Mail, Clock, MapPin } from 'lucide-react';

interface SiteContent {
  page: string; title: string; subtitle: string; body: string;
  sections: { heading: string; content: string }[];
}

const defaults: SiteContent = {
  page: 'contact',
  title: 'Contact us',
  subtitle: 'Reach out to discuss inquiries, pricing, or pickup arrangements.',
  body: 'Our team is here to help with product info, order assistance, and direct communication with sellers.',
  sections: [
    { heading: 'Phone', content: '0708309429' },
    { heading: 'WhatsApp', content: '0708309429' },
    { heading: 'Email', content: 'alextronics.shop01@gmail.com' }
  ]
};

const sectionIcons: Record<string, typeof Phone> = { Phone, WhatsApp: MessageCircle, Email: Mail };

function ContactPage() {
  const [content, setContent] = useState<SiteContent>(defaults);

  useEffect(() => {
    api.get<SiteContent>('/site/contact').then((res) => { if (res.data.title) setContent(res.data); }).catch(() => {});
  }, []);

  return (
    <div className="pt-0 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-charcoal mb-4">Contact us</h1>
        <p className="text-base leading-8 text-slate-700">{content.body}</p>
        <div className="mt-6 text-sm text-slate-600">
          {content.sections.map((s) => (
            <div key={s.heading} className="mt-3">
              <strong className="block text-sm font-semibold text-charcoal">{s.heading}</strong>
              <div className="text-sm text-slate-700">{s.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
