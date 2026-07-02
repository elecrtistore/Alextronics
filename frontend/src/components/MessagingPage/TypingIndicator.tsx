export default function TypingIndicator({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <div className="flex items-center gap-2 px-6 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-[#6B7280] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-[#6B7280]">{name} is typing...</span>
    </div>
  );
}
