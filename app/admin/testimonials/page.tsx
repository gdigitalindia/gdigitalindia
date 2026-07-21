'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '120px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8 }}>Loading Editor...</div>
})
import 'react-quill-new/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
  clipboard: {
    matchVisual: false,
  }
}

const quillFormats = [
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
]

interface Testimonial {
  _id: string
  name: string
  role: string
  company: string
  review: string
  avatar?: string
  rating?: number
  metric?: string
  short?: string
  industry?: string
  initials?: string
}

const empty = { name: '', role: '', company: '', review: '', avatar: '', rating: 5, metric: '', short: '', industry: '', initials: '' }

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(empty)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/testimonials')
      if (res.ok) setTestimonials(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'testimonials')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) { const { url } = await res.json(); setFormData(p => ({ ...p, avatar: url }) ) }
    else alert('Upload failed')
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials'
    
    const payload = { ...formData }
    if (!payload.initials && payload.name) {
      payload.initials = payload.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    
    if (res.ok) { 
      setShowForm(false); 
      setFormData(empty); 
      setEditingId(null);
      fetchAll() 
    }
    else alert('Failed to save testimonial')
    setSubmitting(false)
  }

  const editOne = (t: Testimonial) => {
    setFormData({
      name: t.name,
      role: t.role,
      company: t.company,
      review: t.review,
      avatar: t.avatar || '',
      rating: t.rating || 5,
      metric: t.metric || '',
      short: t.short || '',
      industry: t.industry || '',
      initials: t.initials || ''
    })
    setEditingId(t._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  const setRating = (r: number) => setFormData(p => ({ ...p, rating: r }))

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading testimonials...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">⭐ Testimonials</h1>
          <p className="admin-page-subtitle">Manage customer reviews and feedback</p>
        </div>
        <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'} 
          onClick={() => { 
            if (showForm && editingId) {
              setEditingId(null);
              setFormData(empty);
            } else {
              setShowForm(!showForm);
              setFormData(empty);
              setEditingId(null);
            }
          }}>
          {showForm ? '✖ Cancel' : '➕ Add Testimonial'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ borderLeft: '4px solid var(--admin-primary)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--admin-text-primary)', marginBottom: 20 }}>
            {editingId ? 'Edit Testimonial' : 'New Testimonial'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Name *</label>
                <input className="admin-input" required placeholder="Client name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Role *</label>
                <input className="admin-input" required placeholder="e.g. CEO" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Company *</label>
                <input className="admin-input" required placeholder="Company name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Industry</label>
                <input className="admin-input" placeholder="e.g. Fintech / D2C" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
               <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Short Highlight (e.g. "Revenue doubled")</label>
                <input className="admin-input" placeholder="Brief snippet" value={formData.short} onChange={e => setFormData({...formData, short: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Star Rating</label>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, padding: 0,
                        color: star <= (formData.rating || 0) ? '#fbbf24' : '#e5e7eb' }}> ★ </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Metric Value & Label * (e.g. "9x ROAS Achieved")</label>
              <input className="admin-input" required placeholder="Metric snippet" value={formData.metric} onChange={e => setFormData({...formData, metric: e.target.value})} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Full Review *</label>
              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.review} onChange={val => setFormData({...formData, review: val})} />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Avatar Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: 13 }} />
                {uploading && <span style={{ fontSize: 13, color: 'var(--admin-primary)' }}>⏳ Uploading...</span>}
              </div>
              {formData.avatar && (
                <div style={{ marginTop: 12, position: 'relative', width: 80, height: 80 }}>
                  <img src={formData.avatar} alt="preview" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setFormData(p => ({ ...p, avatar: '' }))}
                    style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20 }}> ✕ </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="admin-btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              <button type="submit" className="admin-btn-primary" disabled={submitting}>
                {submitting ? '⏳ Saving...' : (editingId ? '✅ Update Testimonial' : '✅ Save Testimonial')}
              </button>
            </div>
          </form>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">⭐</div>
            <p className="admin-empty-text">No testimonials yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
          {testimonials.map(t => (
            <div key={t._id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 12, borderLeft: '4px solid var(--admin-warning)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => editOne(t)} className="admin-btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}> ✏️ Edit </button>
                <button onClick={() => deleteOne(t._id)} className="admin-btn-danger" style={{ padding: '6px 10px', fontSize: 12 }}> 🗑️ Delete </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flexShrink: 0 }}>
                  {t.avatar ? <img src={t.avatar} alt={t.name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} /> : 
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#d97706' }}> {t.name[0]} </div>
                  }
                </div>
                <div style={{ flex: 1, paddingRight: 80 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, color: 'var(--admin-text-primary)', fontSize: 16 }}>{t.name}</span>
                    <span className="admin-badge warning" style={{ fontSize: 10 }}>⭐ {t.rating || 5}/5</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 4 }}> {t.role} at <strong>{t.company}</strong> </p>
                </div>
              </div>
              <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, border: '1px inset #eee' }}>
                {t.short && <strong style={{ display: 'block', fontSize: 13, marginBottom: 4, color: 'var(--admin-primary)' }}>"{t.short}"</strong>}
                <div className="admin-preview-text" style={{ fontSize: 14, color: 'var(--admin-text-primary)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }} dangerouslySetInnerHTML={{ __html: t.review }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
