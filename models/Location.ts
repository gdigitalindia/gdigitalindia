import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  state:         { type: String, default: 'Rajasthan' },
  country:       { type: String, default: 'India' },
  tagline:       { type: String, default: '' },
  description:   { type: String, default: '' },
  content:       { type: String, default: '' },
  officeAddress: { type: String, default: '' },
  phone:         { type: String, default: '' },
  email:         { type: String, default: '' },
  image:         { type: String, default: '' },
  featured:      { type: Boolean, default: false },
  order:         { type: Number, default: 0 },
  metaTitle:       { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords:    { type: String, default: '' },
  createdAt:     { type: Date, default: Date.now },

  // Optional custom blocks
  features: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  faqs: [{
    q: { type: String, default: '' },
    a: { type: String, default: '' }
  }]
})

export default mongoose.models.Location || mongoose.model('Location', LocationSchema)
