'use client'

import { useEffect, useState } from 'react'

interface Enquiry {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  budget?: string
  message: string
  createdAt: string
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => { fetchEnquiries() }, [])

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/contact')
      if (res.ok) setEnquiries(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry forever?')) return
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' })
      if (res.ok) setEnquiries(prev => prev.filter(e => e._id !== id))
      else alert('Failed to delete')
    } catch (e) { alert('Error deleting') }
  }

  const filtered = filter
    ? enquiries.filter(e =>
        e.name.toLowerCase().includes(filter.toLowerCase()) ||
        e.email.toLowerCase().includes(filter.toLowerCase()) ||
        e.service?.toLowerCase().includes(filter.toLowerCase())
      )
    : enquiries

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading enquiries...</p>
    </div>
  )

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">💬 Enquiries</h1>
          <p className="admin-page-subtitle">All contact form submissions from your website</p>
        </div>
        <span className="admin-badge info" style={{ fontSize: 14, padding: '6px 14px' }}>
          {enquiries.length} total
        </span>
      </div>

      {enquiries.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📬</div>
            <p className="admin-empty-text">No enquiries yet</p>
            <p className="admin-empty-sub">When visitors fill your contact form, they&apos;ll appear here</p>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="admin-card" style={{ padding: '16px 20px', marginBottom: 20 }}>
            <input
              className="admin-input"
              placeholder="🔍 Search by name, email or service..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>

          {/* Summary count */}
          {filter && (
            <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 12 }}>
              Showing {filtered.length} of {enquiries.length} enquiries
            </p>
          )}

          {/* Enquiry Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(enq => (
              <div key={enq._id} className="admin-card"
                style={{ borderLeft: '4px solid var(--admin-purple)', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === enq._id ? null : enq._id)}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  {/* Avatar initial */}
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f5f3ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 700, color: 'var(--admin-purple)', flexShrink: 0 }}>
                    {enq.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: 'var(--admin-text-primary)' }}>{enq.name}</span>
                      {enq.service && <span className="admin-badge info" style={{ fontSize: 11 }}>{enq.service}</span>}
                      {enq.budget && <span className="admin-badge secondary" style={{ fontSize: 11, background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>{enq.budget}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 18, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: '#2563eb' }}>✉️ {enq.email}</span>
                      {enq.phone && <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>📞 {enq.phone}</span>}
                      {enq.company && <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>🏢 {enq.company}</span>}
                      <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        🗓️ {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--admin-text-muted)', transition: '0.2s',
                    transform: expanded === enq._id ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>

                {/* Expanded message */}
                {expanded === enq._id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--admin-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--admin-text-secondary)',
                        textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Message</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteEnquiry(enq._id); }}
                            className="admin-badge danger" 
                            style={{ border: 'none', cursor: 'pointer', padding: '4px 10px' }}
                        >
                            🗑️ Delete Enquiry
                        </button>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--admin-text-primary)', lineHeight: 1.7,
                      background: 'var(--admin-body-bg)', padding: '12px 16px', borderRadius: 8 }}>
                      {enq.message}
                    </p>
                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <a href={`mailto:${enq.email}`} className="admin-btn-primary"
                        style={{ textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>
                        ✉️ Reply via Email
                      </a>
                      {enq.phone && (
                        <a href={`tel:${enq.phone}`} className="admin-btn-secondary"
                          style={{ textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>
                          📞 Call
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
