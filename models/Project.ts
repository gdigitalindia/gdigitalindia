import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  category:    { type: String, default: 'SEO' }, // SEO | Paid Ads | Social Media | Web Design
  industry:    { type: String, default: '' },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },    // Cloudinary URL
  technologies: [{ type: String }],
  liveUrl:     { type: String },
  githubUrl:   { type: String },
  challenges:  { type: String },
  solutions:   { type: String },
  results:     { type: String },
  stats: [
    {
      label: { type: String },
      value: { type: String },
    },
  ],
  clientName: { type: String },
  duration:   { type: String },
  featured:   { type: Boolean, default: false },
  order:      { type: Number,  default: 0 },
  metaTitle:       { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  metaKeywords:    { type: String, default: '' },
  createdAt:  { type: Date,    default: Date.now },
})

export default mongoose.models.Project ||
  mongoose.model('Project', ProjectSchema)
