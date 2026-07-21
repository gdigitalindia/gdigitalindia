'use client'

import { useEffect, useState } from 'react'

interface SliderItem {
  _id: string
  tag: string
  headline: string
  sub: string
  mediaUrl: string
  isVideo: boolean
}

const empty = { tag: '', headline: '', sub: '', mediaUrl: '', isVideo: false }

export default function AdminSlider() {
  const [sliders, setSliders] = useState<SliderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(empty)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/slider')
      if (res.ok) setSliders(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    
    try {
      // 1. Get signature from our API
      const timestamp = Math.round(new Date().getTime() / 1000)
      const folder = 'gdi/sliders'
      const paramsToSign = { timestamp, folder }
      
      const sigRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign })
      })
      const { signature } = await sigRes.json()

      // 2. Upload directly to Cloudinary
      const fd = new FormData()
      fd.append('file', file)
      fd.append('api_key', '129112652416313') // Aapka API Key
      fd.append('timestamp', timestamp.toString())
      fd.append('signature', signature)
      fd.append('folder', folder)
      
      const cloudName = 'dpbb27rz4' // Aapka Cloud Name
      const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: fd
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error?.message || 'Upload failed')
      }
      
      const { secure_url: url } = await res.json()
      const isVideo = resourceType === 'video'
      setFormData((p: any) => ({ ...p, mediaUrl: url, isVideo }))
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Upload failed')
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/slider/${editingId}` : '/api/slider'
    
    const payload = { ...formData }

    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    
    if (res.ok) { 
      setShowForm(false); 
      setFormData(empty); 
      setEditingId(null);
      fetchAll() 
    }
    else alert('Failed to save slider')
    setSubmitting(false)
  }

  const editOne = (s: SliderItem) => {
    setFormData({
      tag: s.tag,
      headline: s.headline,
      sub: s.sub,
      mediaUrl: s.mediaUrl || '',
      isVideo: s.isVideo || false
    })
    setEditingId(s._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this slider item?')) return
    const res = await fetch(`/api/slider/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading slider...</p>
    </div>
  )

  return (
    <div>
        <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">🎬 Hero Slider</h1>
          <p className="admin-page-subtitle">Manage homepage hero slide (Single)</p>
        </div>
        
        {/* Only show Add button if no slides exist. Otherwise, only show Cancel if currently editing/forming. */}
        {sliders.length === 0 ? (
          <button className={showForm ? 'admin-btn-secondary' : 'admin-btn-primary'} 
            onClick={() => { 
              setShowForm(!showForm); setFormData(empty); setEditingId(null); 
            }}>
            {showForm ? '✖ Cancel' : '➕ Add Slide'}
          </button>
        ) : (
          showForm && (
            <button className='admin-btn-secondary' onClick={() => { setShowForm(false); setEditingId(null); }}>
              ✖ Cancel
            </button>
          )
        )}
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 20 }}>
            {editingId ? '✏️ Edit Slide' : '✨ New Slide'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Eyebrow Tag *</label>
              <input required className="admin-input" placeholder="e.g. Innovation · Design · Growth"
                value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Headline *</label>
              <input required className="admin-input" placeholder="e.g. Building the Future Together"
                value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Subtext *</label>
              <textarea required className="admin-textarea" rows={3} placeholder="A short description..."
                value={formData.sub} onChange={e => setFormData({...formData, sub: e.target.value})} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Background Media (Image or Video) *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {formData.mediaUrl && (
                  <div style={{ width: 120, height: 80, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                    {formData.isVideo ? (
                      <video src={formData.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                    ) : (
                      <img src={formData.mediaUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                )}
                <div>
                  <input type="file" accept="image/*,video/*" id="slide-media" style={{ display: 'none' }} onChange={handleMediaUpload} />
                  <label htmlFor="slide-media" className="admin-btn-secondary" style={{ cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading Media...' : '📸 Choose Image/Video'}
                  </label>
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    Use the upload or paste a URL below.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Manual entry removed for cleaner UI */}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '10px 24px' }}>
                {submitting ? '⏳ Saving...' : '💾 Save Slide'}
              </button>
            </div>
          </form>
        </div>
      )}

      {sliders.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">🎬</div>
            <p className="admin-empty-text">No slides added yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sliders.map(s => (
            <div key={s._id} className="admin-card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 140, height: 90, borderRadius: 10, background: '#000', overflow: 'hidden' }}>
                {s.isVideo ? (
                  <video src={s.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                ) : (
                  <img src={s.mediaUrl} alt={s.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--admin-text-primary)' }}>{s.headline}</h3>
                  <span className="admin-badge primary">{s.isVideo ? 'Video' : 'Image'}</span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--admin-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.sub}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="admin-badge" style={{ fontSize: 11, background: '#e2e8f0', color: '#475569' }}>Tag: {s.tag}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 100 }}>
                <button onClick={() => editOne(s)} className="admin-btn-secondary" style={{ justifyContent: 'center' }}>✏️ Edit</button>
                <button onClick={() => deleteOne(s._id)} className="admin-btn-danger" style={{ justifyContent: 'center' }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
