'use client'

import { useEffect, useState } from 'react'

interface Counter {
  label: string
  value: string
  icon: string
}

interface Settings {
  phones: string[]
  emails: string[]
  address: string
  counters: Counter[]
  socials: {
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
    youtube: string
    whatsapp: string
  }
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

const defaultSettings: Settings = {
  phones: [], emails: [], address: '', counters: [],
  socials: {
    facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '', whatsapp: ''
  },
  metaTitle: '', metaDescription: '', metaKeywords: ''
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setSettings({
          ...defaultSettings,
          ...data,
          // Handle old structure migration if any
          phones: data.phones || (data.phone ? [data.phone, data.phone2].filter(Boolean) : []),
          emails: data.emails || (data.email ? [data.email] : []),
          socials: data.socials || defaultSettings.socials
        })
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else alert('Failed to save settings')
    } catch (e) { alert('Error saving'); console.error(e) }
    finally { setSaving(false) }
  }

  // Dynamic Array Helpers
  const addItem = (field: 'phones' | 'emails') => {
    setSettings(s => ({ ...s, [field]: [...s[field], ''] }))
  }
  const removeItem = (field: 'phones' | 'emails', i: number) => {
    setSettings(s => ({ ...s, [field]: s[field].filter((_, idx) => idx !== i) }))
  }
  const updateItem = (field: 'phones' | 'emails', i: number, val: string) => {
    setSettings(s => ({
      ...s,
      [field]: s[field].map((v, idx) => idx === i ? val : v)
    }))
  }

  // Counter helpers
  const addCounter = () => {
    setSettings(s => ({ ...s, counters: [...s.counters, { label: '', value: '', icon: '🏆' }] }))
  }
  const removeCounter = (i: number) => {
    setSettings(s => ({ ...s, counters: s.counters.filter((_, idx) => idx !== i) }))
  }
  const updateCounter = (i: number, field: keyof Counter, val: string) => {
    setSettings(s => ({
      ...s,
      counters: s.counters.map((c, idx) => idx === i ? { ...c, [field]: val } : c)
    }))
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading settings...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">⚙️ Global Settings</h1>
          <p className="admin-page-subtitle">Manage site-wide information — contact, socials, and counters</p>
        </div>
        {saved && (
          <div className="admin-badge success" style={{ fontSize: 13, padding: '8px 16px', animation: 'fadeIn 0.3s ease' }}>
            ✅ Saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* ── Contact Information ── */}
        <div className="admin-card">
          <div className="admin-card-header" style={{ marginBottom: 20 }}>
            <h2 className="admin-card-title">📞 Contact Details</h2>
            <span className="admin-badge info">Multiple supported</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
            {/* PHONES */}
            <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                 <label className="admin-label" style={{ margin: 0 }}>Phone Numbers</label>
                 <button type="button" onClick={() => addItem('phones')} className="admin-btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}>+ Add Phone</button>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                 {settings.phones.map((p, i) => (
                   <div key={i} style={{ display: 'flex', gap: 8 }}>
                     <input className="admin-input" placeholder="+91 98765 43210" value={p} onChange={e => updateItem('phones', i, e.target.value)} />
                     <button type="button" onClick={() => removeItem('phones', i)} className="admin-btn-danger" style={{ padding: '8px 12px' }}>🗑️</button>
                   </div>
                 ))}
                 {settings.phones.length === 0 && <p style={{ fontSize: 12, color: '#666' }}>No phone numbers added</p>}
               </div>
            </div>

            {/* EMAILS */}
            <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                 <label className="admin-label" style={{ margin: 0 }}>Email Addresses</label>
                 <button type="button" onClick={() => addItem('emails')} className="admin-btn-secondary" style={{ fontSize: 11, padding: '4px 8px' }}>+ Add Email</button>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                 {settings.emails.map((m, i) => (
                   <div key={i} style={{ display: 'flex', gap: 8 }}>
                     <input className="admin-input" type="email" placeholder="info@company.com" value={m} onChange={e => updateItem('emails', i, e.target.value)} />
                     <button type="button" onClick={() => removeItem('emails', i)} className="admin-btn-danger" style={{ padding: '8px 12px' }}>🗑️</button>
                   </div>
                 ))}
                 {settings.emails.length === 0 && <p style={{ fontSize: 12, color: '#666' }}>No email addresses added</p>}
               </div>
            </div>
          </div>

          <div className="admin-form-group" style={{ marginTop: 24 }}>
            <label className="admin-label">Office Address</label>
            <textarea className="admin-textarea" rows={2} placeholder="123, MG Road, New Delhi..."
              value={settings.address}
              onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} />
          </div>
        </div>

        {/* ── Social Media Links ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">🌐 Social Media Links</h2>
            <span className="admin-badge primary">Dynamic Links</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {Object.keys(settings.socials).filter(p => p !== 'whatsapp').map((platform) => (
              <div className="admin-form-group" key={platform} style={{ margin: 0 }}>
                <label className="admin-label" style={{ textTransform: 'capitalize' }}>{platform} URL</label>
                <input className="admin-input" placeholder={`https://${platform}.com/...`}
                  value={(settings.socials as any)[platform]}
                  onChange={e => setSettings(s => ({ ...s, socials: { ...s.socials, [platform]: e.target.value } }))} />
              </div>
            ))}
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">WhatsApp Number (with country code)</label>
              <input className="admin-input" placeholder="e.g. 919876543210"
                value={settings.socials?.whatsapp}
                onChange={e => setSettings(s => ({ ...s, socials: { ...s.socials, whatsapp: e.target.value } }))} />
            </div>
          </div>
        </div>

        {/* ── Counters ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">📊 Homepage Counters</h2>
            <button type="button" className="admin-btn-primary" onClick={addCounter}
              style={{ fontSize: 13, padding: '7px 14px' }}>
              ➕ Add Counter
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {settings.counters.map((counter, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: 12, alignItems: 'end', padding: '14px 16px', background: 'var(--admin-body-bg)', borderRadius: 10, border: '1px solid var(--admin-border)' }}>
                <div>
                  <label className="admin-label" style={{ fontSize: 11 }}>Icon</label>
                  <input className="admin-input" value={counter.icon} onChange={e => updateCounter(i, 'icon', e.target.value)} style={{ fontSize: 20, textAlign: 'center' }} />
                </div>
                <div>
                  <label className="admin-label" style={{ fontSize: 11 }}>Label</label>
                  <input className="admin-input" value={counter.label} onChange={e => updateCounter(i, 'label', e.target.value)} />
                </div>
                <div>
                  <label className="admin-label" style={{ fontSize: 11 }}>Value</label>
                  <input className="admin-input" value={counter.value} onChange={e => updateCounter(i, 'value', e.target.value)} />
                </div>
                <button type="button" onClick={() => removeCounter(i)} className="admin-btn-danger" style={{ padding: '10px 12px' }}>🗑️</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEO Metadata ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">🔍 SEO Metadata (Homepage)</h2>
            <span className="admin-badge primary">SEO Ready</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Meta Title</label>
              <input className="admin-input" placeholder="e.g. Best Digital Marketing Agency in Jaipur"
                value={settings.metaTitle}
                onChange={e => setSettings(s => ({ ...s, metaTitle: e.target.value }))} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Meta Description</label>
              <textarea className="admin-textarea" rows={3} placeholder="e.g. We provide the best SEO, Web Design and PPC services..."
                value={settings.metaDescription}
                onChange={e => setSettings(s => ({ ...s, metaDescription: e.target.value }))} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Meta Keywords</label>
              <input className="admin-input" placeholder="e.g. digital marketing, seo, web design"
                value={settings.metaKeywords}
                onChange={e => setSettings(s => ({ ...s, metaKeywords: e.target.value }))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <button type="submit" className="admin-btn-primary" disabled={saving} style={{ padding: '12px 32px', fontSize: 15 }}>
            {saving ? '⏳ Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
