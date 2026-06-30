import React, { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  initial?: number;
  onClose: () => void;
  onApply: (percent: number) => void;
  title?: string;
}

export default function DiscountModal({ open, initial = 10, onClose, onApply, title = 'Set discount percentage' }: Props) {
  const [value, setValue] = useState<number>(initial);

  useEffect(() => {
    if (open) setValue(initial);
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div className="w-[320px] rounded-lg bg-white p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">Enter a percentage from 1 to 99.</p>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={99}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full rounded-3xl border border-slate-200 px-4 py-2 outline-none"
          />
          <span className="text-sm text-slate-600">%</span>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700">Cancel</button>
          <button
            onClick={() => {
              const pct = Number(value);
              if (Number.isNaN(pct) || pct < 1 || pct > 99) return;
              onApply(pct);
            }}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
