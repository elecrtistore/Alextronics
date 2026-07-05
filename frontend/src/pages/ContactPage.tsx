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
    <div className="pt-24 bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Contact</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-charcoal">{content.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">{content.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[2rem] bg-white p-10 shadow-sm border border-slate-200">
            <p className="text-lg text-slate-700 leading-relaxed">{content.body}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {content.sections.map((section) => {
                const Icon = sectionIcons[section.heading] || Phone;
                const isWhatsApp = section.heading === 'WhatsApp';
                const isEmail = section.heading === 'Email';
                const isPhone = section.heading === 'Phone';
                const href = isWhatsApp ? `https://wa.me/${section.content.replace(/[^0-9]/g, '')}` : isEmail ? `mailto:${section.content}` : isPhone ? `tel:${section.content}` : undefined;
                const Wrapper = href ? 'a' : 'div';

                return (
                  <Wrapper key={section.heading} href={href} target={isWhatsApp ? '_blank' : undefined} rel={isWhatsApp ? 'noreferrer' : undefined}
                    className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:border-primary hover:bg-white">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                      <Icon size={24} />
                    </div>
                    <h2 className="text-base font-semibold text-charcoal mb-2">{section.heading}</h2>
                    <p className="text-sm text-slate-600 break-words">{section.content}</p>
                  </Wrapper>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Need help now?</p>
              <h2 className="mt-4 text-3xl font-semibold">Contact our support team.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">Our team is available to answer your questions and help you with product inquiries, delivery, and seller communication.</p>
            </div>
            <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200">
              <div className="flex items-start gap-4">
                <Clock size={24} className="text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Business hours</p>
                  <p className="mt-3 text-sm text-slate-700">Mon - Sat: 8:00 AM - 7:00 PM</p>
                  <p className="text-sm text-slate-700">Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-4">
                <MapPin size={24} className="text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Location</p>
                  <p className="mt-3 text-sm text-slate-700">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
