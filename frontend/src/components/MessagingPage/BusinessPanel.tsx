import { Phone, Mail, MapPin, Clock, AlertTriangle } from 'lucide-react';

export default function BusinessPanel() {
  return (
    <div className="w-[320px] border-l border-[#E5E7EB] bg-white flex flex-col overflow-y-auto shrink-0 max-lg:hidden">
      <div className="p-6 text-center border-b border-[#E5E7EB]">
        <div className="w-16 h-16 rounded-full bg-[#274472] flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-white">A</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#111827]">ALEXTRONICS</h3>
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

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Products', value: '200+' },
            { label: 'Rating', value: '4.8' },
            { label: 'Response', value: '<5min' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[#F8FAFC] p-3 text-center border border-[#E5E7EB]">
              <p className="text-lg font-bold text-[#274472]">{s.value}</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">About</p>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Inquiry-first marketplace for quality electronics. Direct contact between buyers and sellers.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Contact</p>
          <div className="space-y-3">
            {[
              { icon: Phone, label: '+254 708 309 429' },
              { icon: Mail, label: 'info@alextronics.com' },
              { icon: MapPin, label: 'Nairobi, Kenya' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <c.icon size={14} className="text-[#6B7280]" />
                <span className="text-sm text-[#111827]">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Hours</p>
          <div className="flex items-start gap-3">
            <Clock size={14} className="text-[#6B7280] mt-0.5" />
            <div>
              <p className="text-sm text-[#111827]">Mon - Sat: 8:00 AM - 7:00 PM</p>
              <p className="text-sm text-[#111827]">Sun: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Social</p>
          <div className="flex gap-3">
            {['FB', 'IG', 'TT', 'YT'].map((s) => (
              <button key={s} className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] text-xs font-bold text-[#6B7280] hover:bg-[#274472] hover:text-white transition">
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
          <button className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition w-full">
            <AlertTriangle size={14} />
            Block Notifications
          </button>
          <button className="flex items-center gap-2 text-sm text-[#EF4444] hover:text-red-700 transition w-full">
            <AlertTriangle size={14} />
            Report Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
