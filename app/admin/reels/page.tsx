'use client'

import { useEffect, useState } from 'react'

interface ReelItem {
  _id: string
  url: string
  caption: string
  order: number
}

export default function AdminReels() {
  const [reels, setReels] = useState<ReelItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => { fetchReels() }, [])

  const fetchReels = async () => {
    try {
      const res = await fetch('/api/reels')
      if (res.ok) setReels(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (res.ok) {
        setUrl('')
        fetchReels()
      }
    } catch (e) { alert('Failed to add reel') }
    finally { setSaving(false) }
  }

  const deleteReel = async (id: string) => {
    if (!confirm('Delete this reel?')) return
    const res = await fetch(`/api/reels?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchReels()
  }

  if (loading) return <div className="admin-empty" style={{ marginTop: 80 }}><p>Loading reels...</p></div>

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📱 YouTube Shorts</h1>
        <p className="admin-page-subtitle">Manage your YouTube Shorts section</p>
      </div>

      <div className="admin-card" style={{ maxWidth: 600 }}>
        <h2 className="admin-card-title">➕ Add New Video</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
          <div className="admin-form-group">
            <label className="admin-label">YouTube Short (or Insta Reel) URL *</label>
            <input 
              className="admin-input" 
              placeholder="e.g. https://www.youtube.com/shorts/VIDEO_ID" 
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>
          <button type="submit" disabled={saving} className="admin-btn-primary" style={{ width: 'max-content', padding: '10px 24px' }}>
            {saving ? '⏳ Adding...' : '✅ Add Video'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {reels.map(r => {
          let previewUrl = 'https://placehold.co/400x600?text=Short+Video';
          const ytMatch = r.url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/) || r.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
          if (ytMatch && ytMatch[1]) {
             previewUrl = `https://img.youtube.com/vi/${ytMatch[1]}/0.jpg`;
          }
          return (
            <div key={r._id} className="admin-card" style={{ padding: 15 }}>
              <div style={{ height: 400, background: '#f1f5f9', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 12 }}>
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--admin-primary)', wordBreak: 'break-all' }}>{r.url}</a>
            <button onClick={() => deleteReel(r._id)} className="admin-btn-danger" style={{ width: '100%', marginTop: 15, fontSize: 12, padding: '8px' }}>🗑️ Delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
