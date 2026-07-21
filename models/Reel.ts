import mongoose from 'mongoose'

const ReelSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide Instagram Reel URL'],
  },
  caption: {
    type: String,
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.models.Reel || mongoose.model('Reel', ReelSchema)
