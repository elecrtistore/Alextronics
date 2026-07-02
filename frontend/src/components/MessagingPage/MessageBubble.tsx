import { Message } from '../../services/chatService';

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({
  message,
  isOwn
}: {
  message: Message;
  isOwn: boolean;
}) {
  const readCount = message.readBy.filter(r => r.userId !== message.senderId).length;
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isOwn
            ? 'bg-[#274472] text-white rounded-br-md'
            : 'bg-[#F8FAFC] text-[#111827] rounded-bl-md border border-[#E5E7EB]'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? 'text-white/60' : 'text-[#6B7280]'}`}>
          <span className="text-[10px]">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span className="text-[10px]">
              {readCount > 0 ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
