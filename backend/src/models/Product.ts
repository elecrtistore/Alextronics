import { Schema, model } from 'mongoose';

function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
  shareId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.shareId) {
    this.shareId = generateShareId();
  }
  next();
});

export { generateShareId };
export default model('Product', productSchema);
