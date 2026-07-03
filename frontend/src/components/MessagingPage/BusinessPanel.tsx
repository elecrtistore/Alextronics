import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Package } from 'lucide-react';
import api from '../../services/api';

interface SiteContent {
  page: string; title: string; subtitle: string; body: string;
  sections: { heading: string; content: string }[];
  meta: Record<string, string>;
}

export default function BusinessPanel() {
  const [settings, setSettings] = useState<SiteContent | null>(null);
  const [footer, setFooter] = useState<SiteContent | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    api.get<SiteContent>('/site/settings').then((r) => { if (r.data.title) setSettings(r.data); }).catch(() => {});
    api.get<SiteContent>('/site/footer').then((r) => { if (r.data.sections?.length) setFooter(r.data); }).catch(() => {});
    api.get<any[]>('/products').then((r) => setProductCount(r.data.length)).catch(() => {});
  }, []);

  const storeName = settings?.title || 'ALEXTRONICS';
  const aboutText = settings?.body || settings?.sections?.[0]?.content || 'Inquiry-first marketplace for quality electronics. Direct contact between buyers and sellers.';
  const phone = footer?.meta?.phone || footer?.meta?.contact || '0708309429';
  const email = footer?.meta?.email || 'alextronics.shop01@gmail.com';
  const address = footer?.meta?.address || 'Nairobi, Kenya';
  const hours = footer?.meta?.hours || 'Mon - Sat: 8:00 AM - 7:00 PM\nSun: 10:00 AM - 4:00 PM';

  return (
    <div className="w-[320px] border-l border-[#E5E7EB] bg-white flex flex-col overflow-y-auto shrink-0 max-lg:hidden">
      <div className="p-6 text-center border-b border-[#E5E7EB]">
        <div className="w-16 h-16 rounded-full bg-[#274472] flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-white">{storeName[0]}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#111827]">{storeName}</h3>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-[#22C55E] font-medium">Online</span>
        </div>
        <span className="inline-block mt-2 rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-[#6B7280] border border-[#E5E7EB]">
          Verified Business
        </span>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Business Type</p>
          <p className="text-sm text-[#111827]">Electronics Store</p>
        </div>

        {productCount !== null && (
          <div className="rounded-xl bg-[#F8FAFC] p-4 text-center border border-[#E5E7EB]">
            <Package size={20} className="mx-auto text-[#274472]" />
            <p className="mt-1 text-lg font-bold text-[#274472]">{productCount}</p>
            <p className="text-[10px] text-[#6B7280] mt-0.5">Products</p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">About</p>
          <p className="text-sm text-[#6B7280] leading-relaxed">{aboutText}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Contact</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-[#6B7280]" />
              <span className="text-sm text-[#111827]">{phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-[#6B7280]" />
              <span className="text-sm text-[#111827]">{email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={14} className="text-[#6B7280]" />
              <span className="text-sm text-[#111827]">{address}</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Hours</p>
          <div className="flex items-start gap-3">
            <Clock size={14} className="text-[#6B7280] mt-0.5" />
            <div>
              {hours.split('\n').map((line, i) => (
                <p key={i} className="text-sm text-[#111827]">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
