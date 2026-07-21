import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema({
  title:     { type: String },
  category:  { type: String, default: 'Events' }, // Events | Infrastructure | Projects
  url:       { type: String, required: true },     // Cloudinary URL
  createdAt: { type: Date,   default: Date.now },
})

export default mongoose.models.Gallery ||
  mongoose.model('Gallery', GallerySchema)
