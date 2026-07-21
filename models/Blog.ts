import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: String, required: true },
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);