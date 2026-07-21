import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  company:  { type: String, default: '' },
  role:     { type: String, default: '' },
  review:   { type: String, required: true },
  rating:   { type: Number, default: 5 },   // 1-5
  metric:   { type: String, default: '' },  // e.g. "420% Traffic Growth"
  avatar:   { type: String, default: '' },  // Cloudinary URL
  initials: { type: String, default: '' },  // e.g. "AM"
  short:    { type: String, default: '' },  // e.g. "Revenue doubled in 5 months"
  industry: { type: String, default: '' },  // e.g. "Fintech"
  featured: { type: Boolean, default: false },
  createdAt:{ type: Date,   default: Date.now },
})

export default mongoose.models.Testimonial ||
  mongoose.model('Testimonial', TestimonialSchema)
