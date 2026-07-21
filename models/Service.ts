import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  short:       { type: String, required: true },
  category:    { type: String, default: '' },
  industry:    { type: String, default: '' },
  description: { type: String, default: '' },
  descriptionHeading: { type: String, default: '' },
  highlight:   { type: String, default: '' },
  tags:        [{ type: String }],
  image:       { type: String, default: '' },
  contentBlocks: [{ title: String, text: String, image: String }],
  faqs:        [{ q: String, a: String }],
  order:       { type: Number, default: 0 },
  metaTitle:       { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords:    { type: String, default: '' },
  createdAt:   { type: Date,   default: Date.now },
})

export default mongoose.models.Service ||
  mongoose.model('Service', ServiceSchema)
