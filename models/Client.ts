import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  industry: { type: String, default: 'Client' },
  logoUrl:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Client || mongoose.model('Client', ClientSchema)
