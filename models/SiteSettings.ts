import mongoose from 'mongoose'

const CounterSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon:  { type: String, default: '🏆' },
})

const SiteSettingsSchema = new mongoose.Schema({
  phones:  { type: [String], default: ['+91 98765 43210'] },
  emails:  { type: [String], default: ['info@greendigitalindia.com'] },
  address: { type: String,   default: 'New Delhi, India' },
  counters: { 
    type: [CounterSchema], 
    default: [
      { label: 'Happy Clients',      value: '500+', icon: '😊' },
      { label: 'Projects Completed', value: '300+', icon: '✅' },
      { label: 'Years Experience',   value: '10+',  icon: '📅' },
      { label: 'Team Members',       value: '50+',  icon: '👥' },
    ]
  },
  socials: {
    facebook:  { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    youtube:   { type: String, default: '' },
    whatsapp:  { type: String, default: '' },
  },
  metaTitle: { type: String, default: 'G Digital India | Best Digital Marketing Agency' },
  metaDescription: { type: String, default: 'We provide the best SEO, Web Design and PPC services.' },
  metaKeywords: { type: String, default: 'digital marketing, seo, web design' },
  updatedAt: { type: Date, default: Date.now },
}, { 
  timestamps: true,
  bufferCommands: true, // Explicitly enable for this model
  collection: 'sitesettings' // Force specific collection name
})

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema)

export default SiteSettings
