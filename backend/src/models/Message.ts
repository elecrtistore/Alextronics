import { Schema, model } from 'mongoose';

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  text: string;
  readBy: { userId: string; timestamp: Date }[];
  createdAt: Date;
}

const messageSchema = new Schema({
  conversationId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  senderRole: { type: String, required: true },
  text: { type: String, required: true },
  readBy: [{
    userId: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default model<IMessage>('Message', messageSchema);
