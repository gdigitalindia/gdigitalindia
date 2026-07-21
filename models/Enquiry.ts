import mongoose from 'mongoose'

const EnquirySchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, default: '' },
  company:   { type: String, default: '' },
  service:   { type: String, default: '' },
  budget:    { type: String, default: '' },
  message:   { type: String, required: true },
  status:    { type: String, default: 'new' }, // new | read | replied
  createdAt: { type: Date,   default: Date.now },
});

export default mongoose.models.Enquiry ||
  mongoose.model('Enquiry', EnquirySchema)
