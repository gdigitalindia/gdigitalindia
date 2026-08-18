import mongoose from 'mongoose'

const IndustrySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  short:       { type: String, required: true },
  description: { type: String, default: '' },
  content:     { type: String, default: '' },
  icon:        { type: String, default: '' },
  image:       { type: String, default: '' },
  order:       { type: Number, default: 0 },
  metaTitle:       { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords:    { type: String, default: '' },
  createdAt:   { type: Date,   default: Date.now },

  // Structured dynamic blocks
  featuresTitle: { type: String, default: '' },
  features: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  
  // Services Section (replaces rankings)
  servicesTitle: { type: String, default: '' },
  industryServices: [{
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    link: { type: String, default: '' },
  }],
  
  profilesTitle: { type: String, default: '' },
  profiles: [{
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  
  clientsTitle: { type: String, default: '' },
  clients: [{
    name: { type: String, default: '' },
    logo: { type: String, default: '' },
  }],

  // Real Results Images section
  resultImages: [{ type: String }]
})

export default mongoose.models.Industry ||
  mongoose.model('Industry', IndustrySchema)
