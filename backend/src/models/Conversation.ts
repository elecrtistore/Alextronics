import { Schema, model } from 'mongoose';

export interface IConversation {
  _id: string;
  participants: { userId: string; role: string; name: string }[];
  inquiryId?: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  lastMessage?: { text: string; timestamp: Date; senderId: string };
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema({
  participants: [{
    userId: { type: String, required: true },
    role: { type: String, required: true },
    name: { type: String, default: '' }
  }],
  inquiryId: { type: String },
  productId: { type: String },
  productName: { type: String },
  productImage: { type: String },
  productPrice: { type: Number },
  lastMessage: {
    text: { type: String },
    timestamp: { type: Date },
    senderId: { type: String }
  }
}, { timestamps: true });

export default model<IConversation>('Conversation', conversationSchema);
