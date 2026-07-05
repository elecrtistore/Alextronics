import { useEffect, useState } from 'react';
import api from '../services/api';

interface SiteContent {
  page: string;
  title: string;
  subtitle: string;
  body: string;
}

const defaults: SiteContent = {
  page: 'about',
  title: 'About ALEXTRONICS',
  subtitle: '',
  body: 'ALEXTRONICS is an inquiry-first private shop built for direct customer contact. We focus on product browsing, simple inquiry tracking, and a direct connection between you and the seller.'
};

function AboutPage() {
  const [content, setContent] = useState<SiteContent>(defaults);

  useEffect(() => {
    api.get<SiteContent>('/site/about').then((res) => { if (res.data.title) setContent(res.data); }).catch(() => {});
  }, []);

  return (
    <div className="pt-0 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-charcoal mb-4">About ALEXTRONICS</h1>
        <p className="text-base leading-8 text-slate-700">{content.body}</p>
      </div>
    </div>
  );
}

export default AboutPage;
