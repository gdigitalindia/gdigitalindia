import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // SEO, SMO, PPC, Website
  description: { type: String },
  plans: [{
    name: { type: String, required: true }, // Startup Plan, Growth Plan, etc.
    priceMonthly: { type: String, required: true },
    priceYearly: { type: String, required: true },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    ctaText: { type: String, default: 'Enquiry Now' }
  }],
  // SEO Metadata
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
