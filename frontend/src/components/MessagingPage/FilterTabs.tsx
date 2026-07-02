export default function FilterTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const tabs = ['All', 'Unread'];
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === tab
              ? 'bg-[#274472] text-white'
              : 'bg-[#F8FAFC] text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
