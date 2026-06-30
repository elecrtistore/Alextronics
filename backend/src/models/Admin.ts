import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
  firebaseUID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

export default model('Admin', adminSchema);
