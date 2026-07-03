import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 1 },
  sellerName: { type: String, required: true },
  sellerPhone: { type: String, required: true },
  sellerWhatsapp: { type: String, required: true },
  featured: { type: Boolean, default: false },
  specifications: { type: Map, of: String },
}, { timestamps: true });

export default model('Product', productSchema);
