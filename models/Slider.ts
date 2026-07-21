import mongoose from 'mongoose';

const SliderSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    headline: { type: String, required: true },
    sub: { type: String, required: true },
    mediaUrl: { type: String, required: true }, // Image or Video Source
    isVideo: { type: Boolean, default: false }, // Let the user specify if it's a video
  },
  { timestamps: true }
);

export default mongoose.models.Slider || mongoose.model('Slider', SliderSchema);
