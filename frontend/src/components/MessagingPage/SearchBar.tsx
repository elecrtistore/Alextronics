import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search conversations..."
        className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#274472]"
      />
    </div>
  );
}
