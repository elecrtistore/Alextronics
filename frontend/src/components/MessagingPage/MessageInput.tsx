import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({
  value,
  onChange,
  onSend,
  onTyping
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onTyping: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSend();
    }
  };

  return (
    <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); onTyping(); }}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="flex-1 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#274472] resize-none max-h-[120px]"
        />
        <button
          onClick={() => { if (value.trim()) onSend(); }}
          disabled={!value.trim()}
          className="rounded-full bg-[#274472] p-3 text-white hover:bg-[#1E3558] transition disabled:opacity-50 shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
