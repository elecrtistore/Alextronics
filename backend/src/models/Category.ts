import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

export default model('Category', categorySchema);
