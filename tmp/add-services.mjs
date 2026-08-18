// Script to add all 11 services to every industry in DB
const BASE = 'http://localhost:3000'

const SERVICES = [
  { name: 'Google Ads',              icon: '', image: '', description: 'High-converting Google ad campaigns to drive targeted traffic and leads.', link: '' },
  { name: 'Video Marketing',         icon: '', image: '', description: 'Engaging video content that captures attention and builds brand trust.', link: '' },
  { name: 'Meta Ads',                icon: '', image: '', description: 'Precision-targeted Facebook & Instagram ads for maximum ROI.', link: '' },
  { name: 'SEO',                     icon: '', image: '', description: 'Rank higher on Google and drive organic traffic to your business.', link: '' },
  { name: 'Website Development',     icon: '', image: '', description: 'Fast, responsive websites built to convert visitors into customers.', link: '' },
  { name: 'WhatsApp Marketing',      icon: '', image: '', description: 'Direct customer engagement via WhatsApp broadcasts and automation.', link: '' },
  { name: 'CRM',                     icon: '', image: '', description: 'Manage leads and customer relationships with a smart CRM system.', link: '' },
  { name: 'IVR',                     icon: '', image: '', description: 'Automated calling systems to streamline your customer support.', link: '' },
  { name: 'AI Calling',              icon: '', image: '', description: 'AI-powered calling agents for lead follow-ups and outreach.', link: '' },
  { name: 'GMB',                     icon: '', image: '', description: 'Google My Business optimization for local search dominance.', link: '' },
  { name: 'Social Media Management', icon: '', image: '', description: 'Consistent, engaging content across all social platforms.', link: '' },
]

async function run() {
  // 1. Get all industries
  const res = await fetch(`${BASE}/api/industries`)
  const industries = await res.json()
  console.log(`Found ${industries.length} industries`)

  for (const ind of industries) {
    const id = ind._id
    console.log(`\nUpdating: ${ind.short} (${id})`)

    // Merge existing services with new ones (avoid duplicates by name)
    const existing = ind.industryServices || []
    const existingNames = existing.map((s) => s.name?.toLowerCase())
    const toAdd = SERVICES.filter(s => !existingNames.includes(s.name.toLowerCase()))
    const merged = [...existing, ...toAdd]

    const payload = {
      ...ind,
      servicesTitle: ind.servicesTitle || 'Our Services for You',
      industryServices: merged,
    }

    const put = await fetch(`${BASE}/api/industries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (put.ok) {
      console.log(`  ✅ ${ind.short} updated — ${merged.length} services`)
    } else {
      const txt = await put.text()
      console.log(`  ❌ Failed: ${put.status} — ${txt.slice(0, 200)}`)
    }
  }

  console.log('\n🎉 All done!')
}

run().catch(console.error)
