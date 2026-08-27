'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8 }}>Loading Editor...</div>
})
import 'react-quill-new/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'clean']
  ],
  clipboard: { matchVisual: false }
}

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'
]

interface LocationItem {
  _id: string
  name: string
  slug: string
  state: string
  country: string
  tagline: string
  description: string
  content: string
  officeAddress: string
  phone: string
  email: string
  image: string
  featured: boolean
  order: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

const emptyLocation = {
  name: '',
  slug: '',
  state: 'Rajasthan',
  country: 'India',
  tagline: '',
  description: '',
  content: '',
  officeAddress: '',
  phone: '',
  email: '',
  image: '',
  featured: false,
  order: 0,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: ''
}

const SAMPLE_SEED_LOCATIONS = [
  {
    name: 'Jaipur',
    slug: 'jaipur',
    state: 'Rajasthan',
    country: 'India',
    tagline: 'Best Digital Marketing & Web Development Company in Jaipur',
    description: 'Empowering businesses in Jaipur with premier SEO, PPC, Social Media, and custom Web Development services.',
    content: '<p>G Digital India is Jaipur’s leading digital growth agency. We specialize in driving targeted traffic, generating high-quality leads, and crafting high-converting websites for businesses across Jaipur.</p><h3>Why Choose G Digital India in Jaipur?</h3><p>Our experienced team delivers customized digital marketing strategies tailored to the local Jaipur market as well as global expansion.</p>',
    officeAddress: 'Tonk Road, Malviya Nagar, Jaipur, Rajasthan 302017',
    phone: '+91 98765 43210',
    email: 'jaipur@gdigitalindia.com',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop',
    featured: true,
    order: 1,
    metaTitle: 'Digital Marketing & Web Design Company in Jaipur | G Digital India',
    metaDescription: 'Looking for top digital marketing services in Jaipur? G Digital India offers SEO, Web Design, PPC, and Branding tailored for growth.'
  },
  {
    name: 'Delhi NCR',
    slug: 'delhi-ncr',
    state: 'Delhi',
    country: 'India',
    tagline: 'Premier Digital Agency Serving Delhi, Gurgaon & Noida',
    description: 'Scalable performance marketing, corporate branding, and enterprise IT solutions in the Delhi National Capital Region.',
    content: '<p>Expand your enterprise footprint in Delhi NCR with our high-impact performance marketing campaigns and custom enterprise software development.</p>',
    officeAddress: 'Connaught Place, New Delhi 110001',
    phone: '+91 98765 43211',
    email: 'delhi@gdigitalindia.com',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop',
    featured: true,
    order: 2,
    metaTitle: 'Digital Marketing Agency in Delhi NCR | G Digital India',
    metaDescription: 'Leading digital marketing agency in Delhi NCR. Performance marketing, SEO, PPC, and Web Development.'
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    state: 'Maharashtra',
    country: 'India',
    tagline: 'Result-Driven Marketing & Branding Solutions in Mumbai',
    description: 'Transforming brands in Mumbai with creative social media management, Google Ads, and e-commerce solutions.',
    content: '<p>From startups to corporate giants in Mumbai, G Digital India provides 360-degree digital transformation services.</p>',
    officeAddress: 'Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
    phone: '+91 98765 43212',
    email: 'mumbai@gdigitalindia.com',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop',
    featured: true,
    order: 3,
    metaTitle: 'Digital Marketing Services in Mumbai | G Digital India',
    metaDescription: 'Top digital marketing company in Mumbai specializing in performance marketing and web design.'
  }
]

export default function AdminLocations() {
  const [locations, setLocations] = useState<LocationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(emptyLocation)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/locations')
      if (res.ok) {
        setLocations(await res.json())
      }
    } catch (e) {
      console.error('Fetch locations error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: data })
      if (res.ok) {
        const json = await res.json()
        setFormData((prev: any) => ({ ...prev, image: json.url }))
      } else {
        alert('Image upload failed')
      }
    } catch {
      alert('Upload error')
    } finally {
      setUploading(false)
    }
  }

  const handleNameChange = (name: string) => {
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setFormData((prev: any) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : autoSlug
    }))
  }

  const editOne = (loc: LocationItem) => {
    setFormData({
      name: loc.name || '',
      slug: loc.slug || '',
      state: loc.state || 'Rajasthan',
      country: loc.country || 'India',
      tagline: loc.tagline || '',
      description: loc.description || '',
      content: loc.content || '',
      officeAddress: loc.officeAddress || '',
      phone: loc.phone || '',
      email: loc.email || '',
      image: loc.image || '',
      featured: loc.featured || false,
      order: loc.order || 0,
      metaTitle: loc.metaTitle || '',
      metaDescription: loc.metaDescription || '',
      metaKeywords: loc.metaKeywords || ''
    })
    setEditingId(loc._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return
    try {
      const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' })
      if (res.ok) fetchAll()
      else alert('Failed to delete location')
    } catch {
      alert('Delete error')
    }
  }

  const seedSampleData = async () => {
    if (!confirm('Seed sample locations (Jaipur, Delhi NCR, Mumbai)?')) return
    setSubmitting(true)
    try {
      for (const loc of SAMPLE_SEED_LOCATIONS) {
        await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loc)
        })
      }
      await fetchAll()
      alert('Sample locations seeded successfully!')
    } catch (e) {
      console.error(e)
      alert('Error seeding locations')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Location name is required')
      return
    }
    setSubmitting(true)
    try {
      const url = editingId ? `/api/locations/${editingId}` : '/api/locations'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowForm(false)
        setEditingId(null)
        setFormData(emptyLocation)
        fetchAll()
      } else {
        const errJson = await res.json()
        alert(`Failed to save: ${errJson.error || 'Unknown error'}`)
      }
    } catch (e) {
      console.error(e)
      alert('Submission error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading locations...</p>
    </div>
  )

  return (
    <div>
      {/* Header Bar */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="admin-page-title">📍 Locations</h1>
          <p className="admin-page-subtitle">Manage regional target locations & local office pages</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {locations.length === 0 && (
            <button className="admin-btn-secondary" onClick={seedSampleData} disabled={submitting}>
              ⚡ Seed Sample Locations
            </button>
          )}
          <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'}
            onClick={() => {
              setShowForm(!showForm)
              setFormData(emptyLocation)
              setEditingId(null)
            }}>
            {showForm ? '✖ Cancel' : '➕ Add Location'}
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 20 }}>
            {editingId ? '✏️ Edit Location' : '✨ New Location'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Location Name *</label>
                <input required className="admin-input" placeholder="e.g. Jaipur"
                  value={formData.name} onChange={e => handleNameChange(e.target.value)} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Slug (URL) *</label>
                <input required className="admin-input" placeholder="e.g. jaipur"
                  value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">State / Region</label>
                <input className="admin-input" placeholder="e.g. Rajasthan"
                  value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Country</label>
                <input className="admin-input" placeholder="e.g. India"
                  value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Headline / Tagline</label>
              <input className="admin-input" placeholder="e.g. Best Digital Marketing & Web Development Company in Jaipur"
                value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Local Office Address</label>
                <input className="admin-input" placeholder="e.g. Malviya Nagar, Jaipur 302017"
                  value={formData.officeAddress} onChange={e => setFormData({ ...formData, officeAddress: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Local Phone</label>
                <input className="admin-input" placeholder="e.g. +91 98765 43210"
                  value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Local Email</label>
                <input className="admin-input" placeholder="e.g. jaipur@gdigitalindia.com"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Banner Image URL / Upload</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input className="admin-input" placeholder="https://..." value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })} />
                <label className="admin-btn-secondary" style={{ cursor: 'pointer', flexShrink: 0, padding: '10px 16px' }}>
                  {uploading ? 'Uploading...' : '📁 Upload'}
                  <input type="file" accept="image/*" hidden onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {formData.image && (
                <div style={{ marginTop: 8 }}>
                  <img src={formData.image} alt="Preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Short Description</label>
              <textarea className="admin-textarea" rows={3} placeholder="Brief summary of services for this location..."
                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Full Page Content (Rich Text)</label>
              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write full location details, local services, client stories..."
                  value={formData.content}
                  onChange={val => setFormData({ ...formData, content: val })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
                <span>Featured Location</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label className="admin-label" style={{ margin: 0 }}>Display Order:</label>
                <input type="number" className="admin-input" style={{ width: 80 }} value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 16 }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>🔍 SEO Metadata</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-label">Meta Title</label>
                  <input className="admin-input" placeholder="e.g. Digital Marketing Company in Jaipur | G Digital India"
                    value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-label">Meta Description</label>
                  <textarea className="admin-textarea" rows={2} placeholder="Meta description for search engines..."
                    value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ margin: 0 }}>
                  <label className="admin-label">Meta Keywords</label>
                  <input className="admin-input" placeholder="e.g. digital marketing jaipur, seo jaipur, web design jaipur"
                    value={formData.metaKeywords} onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" className="admin-btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? '💾 Update Location' : '🚀 Save Location'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations List */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h3 className="admin-card-title" style={{ margin: 0 }}>
            Location Records ({locations.length})
          </h3>
          <input
            className="admin-input"
            style={{ maxWidth: 300 }}
            placeholder="🔍 Search locations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredLocations.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📍</div>
            <p className="admin-empty-text">No locations found.</p>
            {locations.length === 0 && (
              <button className="admin-btn-primary" style={{ marginTop: 12 }} onClick={seedSampleData}>
                ⚡ Seed Sample Locations
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Slug / URL</th>
                  <th>State</th>
                  <th>Office / Contact</th>
                  <th>Featured</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocations.map(loc => (
                  <tr key={loc._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {loc.image ? (
                          <img src={loc.image} alt={loc.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            📍
                          </div>
                        )}
                        <div>
                          <strong style={{ display: 'block', color: '#0f172a' }}>{loc.name}</strong>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{loc.tagline || 'No tagline'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>
                        /locations/{loc.slug}
                      </code>
                    </td>
                    <td>{loc.state || 'India'}</td>
                    <td>
                      <div style={{ fontSize: 12, color: '#475569' }}>
                        <div>{loc.officeAddress || '—'}</div>
                        <div>{loc.phone}</div>
                      </div>
                    </td>
                    <td>
                      {loc.featured ? (
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                          ★ Featured
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: 12 }}>Standard</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => editOne(loc)}>
                          ✏️ Edit
                        </button>
                        <button className="admin-btn-danger" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => deleteOne(loc._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
