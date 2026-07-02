import { Conversation } from '../../services/chatService';

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default function ConversationItem({
  conversation,
  isSelected,
  onClick,
  currentUserId
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  currentUserId: string;
}) {
  const other = conversation.participants.find(p => p.userId !== currentUserId) || conversation.participants[0];
  const name = other?.name || 'Customer';
  const time = conversation.lastMessage?.timestamp
    ? new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
  const hasUnread = conversation.lastMessage && conversation.lastMessage.senderId !== currentUserId;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition duration-200 ${
        isSelected ? 'bg-[#274472] text-white' : 'hover:bg-[#F8FAFC]'
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{ backgroundColor: stringToColor(other.userId || conversation._id) }}
      >
        {getInitials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-[#111827]'}`}>{name}</span>
          {time && <span className={`text-xs shrink-0 ml-2 ${isSelected ? 'text-white/70' : 'text-[#6B7280]'}`}>{time}</span>}
        </div>
        <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#6B7280]'}`}>
          {conversation.productName || 'General inquiry'}
        </p>
        {conversation.lastMessage && (
          <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-white/60' : 'text-[#6B7280]'}`}>
            {conversation.lastMessage.text}
          </p>
        )}
      </div>
      {hasUnread && (
        <span className="w-2.5 h-2.5 rounded-full bg-[#274472] shrink-0" />
      )}
    </button>
  );
}
