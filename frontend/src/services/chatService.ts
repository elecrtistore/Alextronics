import api from './api';

export interface Participant {
  userId: string;
  role: string;
  name: string;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  inquiryId?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  lastMessage?: { text: string; timestamp: string; senderId: string };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  text: string;
  readBy: { userId: string; timestamp: string }[];
  createdAt: string;
}

export async function fetchConversations() {
  const res = await api.get<Conversation[]>('/chat/conversations');
  return res.data;
}

export async function fetchConversation(id: string) {
  const res = await api.get<Conversation>(`/chat/conversations/${id}`);
  return res.data;
}

export async function fetchMessages(id: string, before?: string) {
  const params: any = {};
  if (before) params.before = before;
  const res = await api.get<Message[]>(`/chat/conversations/${id}/messages`, { params });
  return res.data;
}

export async function createConversation(data: {
  participantId: string;
  participantRole?: string;
  participantName?: string;
  inquiryId?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
}) {
  const res = await api.post<Conversation>('/chat/conversations', data);
  return res.data;
}

export async function fetchUnreadCount() {
  const res = await api.get<{ count: number }>('/chat/unread');
  return res.data.count;
}
