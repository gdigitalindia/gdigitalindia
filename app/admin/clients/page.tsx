'use client'

import { useEffect, useState } from 'react'

interface ClientItem {
  _id: string
  name: string
  industry: string
  logoUrl: string
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) setClients(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!name.trim()) { alert('Please enter client name first'); return; }
    
    setUploading(true)

    try {
      // 1. Get signature for direct upload
      const timestamp = Math.round(new Date().getTime() / 1000)
      const folder = 'gdi/clients'
      const paramsToSign = { timestamp, folder }
      
      const sigRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paramsToSign })
      })
      const { signature } = await sigRes.json()

      // 2. Direct Upload to Cloudinary
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

      // 3. Save to DB
      const save = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, industry: industry || 'Client', logoUrl: url })
      })
      
      if (save.ok) { 
        fetchClients(); 
        setName('');
        setIndustry('');
        e.target.value = '' 
      }
      else alert('Failed to save client')
    } catch (err) { console.error(err); alert('Upload error') }
    finally { setUploading(false) }
  }

  const deleteClient = async (id: string) => {
    if (!confirm('Remove this client?')) return
    const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' })
    if (res.ok) fetchClients()
    else alert('Failed to delete')
  }

  if (loading) return <div className="admin-empty" style={{marginTop:80}}><p>Loading clients...</p></div>

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">🤝 Client Logos</h1>
        <p className="admin-page-subtitle">Manage brands/logos shown on the home page</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">📤 Add New Client</h2>
          <span className="admin-badge info">{clients.length} Total</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">Client/Brand Name *</label>
            <input className="admin-input" placeholder="e.g. Google, Tesla" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">Industry / Subtitle (optional)</label>
            <input className="admin-input" placeholder="e.g. Fintech, E-commerce" value={industry} onChange={e => setIndustry(e.target.value)} />
          </div>
          
          <div style={{ marginTop: 8 }}>
            <input type="file" accept="image/*" id="logo-upload" className="hidden"
              style={{ display: 'none' }} onChange={handleUpload} disabled={uploading || !name.trim()} />
            <label htmlFor="logo-upload" className="admin-btn-primary"
              style={{ display: 'inline-flex', cursor: 'pointer', opacity: (uploading || !name.trim()) ? 0.7 : 1 }}>
              {uploading ? '⏳ Uploading...' : '📸 Choose & Upload Logo'}
            </label>
          </div>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="admin-card"><p className="admin-empty-text">No clients added yet</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {clients.map(cl => (
            <div key={cl._id} className="admin-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <img src={cl.logoUrl} alt={cl.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: 15, margin: '0 0 4px 0' }}>{cl.name}</h3>
              <p style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>{cl.industry}</p>
              <button onClick={() => deleteClient(cl._id)} className="admin-btn-danger" style={{ width: '100%', fontSize: 12, padding: '6px' }}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
