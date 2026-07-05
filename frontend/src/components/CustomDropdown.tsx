import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type DropdownOption = { label: string; value: string };

type CustomDropdownProps = {
  selected: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  label?: string;
};

export default function CustomDropdown({ selected, options, onSelect, label }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full rounded-full border px-4 py-3 text-left text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary/25 ${
          open ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-white text-charcoal'
        }`}
        aria-label={label}
      >
        <span className="block truncate">{selected}</span>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-3xl border border-border bg-white shadow-xl">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition ${
                option.value === selected
                  ? 'bg-primary text-white font-semibold rounded-lg'
                  : 'text-charcoal hover:bg-slate-50'
              } ${index === 0 ? 'rounded-t-3xl' : ''} ${index === options.length - 1 ? 'rounded-b-3xl' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
