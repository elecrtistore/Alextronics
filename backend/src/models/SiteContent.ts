import { Schema, model } from 'mongoose';

const siteContentSchema = new Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  sections: [{ heading: String, content: String }],
  meta: { type: Map, of: String, default: {} }
}, { timestamps: true });

export default model('SiteContent', siteContentSchema);
