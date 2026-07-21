import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
