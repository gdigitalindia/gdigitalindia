'use client'

import { useEffect, useState } from 'react'

interface GalleryImage {
  _id: string
  url: string
  title?: string
  category?: string
}

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Events')

  useEffect(() => { fetchImages() }, [])

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) setImages(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!title.trim()) { alert('Please enter a title first'); return; }
    
    setUploading(true)

    try {
      // 1. Get signature
      const timestamp = Math.round(new Date().getTime() / 1000)
      const folder = 'gdi/gallery'
      const paramsToSign = { timestamp, folder }
      
      const sigRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign })
      })
      const { signature } = await sigRes.json()

      // 2. Direct Upload
      const fd = new FormData()
      fd.append('file', file)
      fd.append('api_key', '129112652416313')
      fd.append('timestamp', timestamp.toString())
      fd.append('signature', signature)
      fd.append('folder', folder)

      const up = await fetch(`https://api.cloudinary.com/v1_1/dpbb27rz4/image/upload`, { 
        method: 'POST', 
        body: fd 
      })

      if (!up.ok) throw new Error('Upload failed')
      const { secure_url: url } = await up.json()

      // 3. Save to DB with user values
      const save = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, category, title })
      })
      if (save.ok) { 
        fetchImages(); 
        setTitle('');
        e.target.value = '' 
      }
      else alert('Failed to save image')
    } catch (err) { console.error(err); alert('Upload error') }
    finally { setUploading(false) }
  }

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return
    const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' })
    if (res.ok) setImages(imgs => imgs.filter(i => i._id !== id))
    else alert('Failed to delete')
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading gallery...</p>
    </div>
  )

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">🖼️ Gallery</h1>
        <p className="admin-page-subtitle">Upload and manage your gallery images</p>
      </div>

      {/* Upload Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">📤 Upload New Image</h2>
          <span className="admin-badge success">{images.length} images</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">Image Title *</label>
            <input 
              className="admin-input" 
              placeholder="Enter image title..." 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">Category *</label>
            <select 
              className="admin-input" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Events">Events</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Projects">Projects</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
            <input type="file" accept="image/*" id="gallery-upload" className="hidden"
              style={{ display: 'none' }} onChange={handleUpload} disabled={uploading || !title.trim()} />
            <label htmlFor="gallery-upload" className="admin-btn-primary"
              style={{ display: 'inline-flex', cursor: 'pointer', opacity: (uploading || !title.trim()) ? 0.7 : 1 }}>
              {uploading ? '⏳ Uploading...' : '📸 Choose & Upload Image'}
            </label>
            {!title.trim() && <span style={{ fontSize: 12, color: 'red' }}>* Enter title first</span>}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">🖼️</div>
            <p className="admin-empty-text">No images uploaded yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {images.map(img => (
            <div key={img._id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={img.url} alt={img.title || "Gallery Image"}
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 10, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#64748b' }}>
                    {img.category || 'Events'}
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--admin-text-primary)', marginBottom: 10, 
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.title || 'Untitled Image'}
                </p>
                <button onClick={() => deleteImage(img._id)} className="admin-btn-danger"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '6px' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
