'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const CKEditor = dynamic(
  () => import('ckeditor4-react').then(mod => mod.CKEditor),
  { ssr: false, loading: () => <div className="admin-input">Loading Editor...</div> }
)

interface Industry {
  _id: string
  title: string
  slug: string
  short: string
  description: string
  content: string
  icon: string
  image: string
  order: number
  
  // Custom Dynamic sections
  featuresTitle?: string
  features?: Array<{ title: string; description: string }>
  servicesTitle?: string
  industryServices?: Array<{ name: string; icon: string; description: string; link: string }>
  profilesTitle?: string
  profiles?: Array<{ name: string; designation: string; description: string }>
  clientsTitle?: string
  clients?: string[]
  resultImages?: string[]
}

const emptyIndustry = {
  title: '',
  slug: '',
  short: '',
  description: '',
  content: '',
  icon: 'fa-solid fa-notes-medical',
  image: '',
  order: 0,
  featuresTitle: '',
  features: [] as Array<{ title: string; description: string }>,
  servicesTitle: 'Our Services for You',
  industryServices: [
    { name: 'Google Ads', icon: '', description: 'High-converting Google ad campaigns to drive targeted traffic.', link: '' },
    { name: 'Video Marketing', icon: '', description: 'Engaging video content that captures attention and builds brand trust.', link: '' },
    { name: 'Meta Ads', icon: '', description: 'Precision-targeted Facebook & Instagram ads for maximum ROI.', link: '' },
    { name: 'SEO', icon: '', description: 'Rank higher on Google and drive organic traffic to your business.', link: '' },
    { name: 'Website Development', icon: '', description: 'Fast, responsive websites built to convert visitors into customers.', link: '' },
    { name: 'WhatsApp Marketing', icon: '', description: 'Direct customer engagement via WhatsApp broadcasts and automation.', link: '' },
    { name: 'CRM', icon: '', description: 'Manage leads and customer relationships with a smart CRM system.', link: '' },
    { name: 'IVR', icon: '', description: 'Automated calling systems to streamline your customer support.', link: '' },
    { name: 'AI Calling', icon: '', description: 'AI-powered calling agents for lead follow-ups and outreach.', link: '' },
    { name: 'GMB', icon: '', description: 'Google My Business optimization for local search dominance.', link: '' },
    { name: 'Social Media Management', icon: '', description: 'Consistent, engaging content across all social platforms.', link: '' },
  ] as Array<{ name: string; icon: string; description: string; link: string }>,
  profilesTitle: '',
  profiles: [] as Array<{ name: string; designation: string; description: string }>,
  clientsTitle: '',
  clients: [] as string[],
  resultImages: [] as string[]
}

export default function AdminIndustries() {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(emptyIndustry)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // For easy Client names comma-separated rendering
  const [clientsText, setClientsText] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/industries')
      if (res.ok) {
        setIndustries(await res.json())
      }
    } catch (e) {
      console.error("Fetch error:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'industries')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setFormData((p: any) => ({ ...p, image: url }))
    } catch (err) {
      alert('Upload failed')
    }
    setUploading(false)
  }

  const handleResultImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'industries/results')
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        if (res.ok) {
          const { url } = await res.json()
          uploadedUrls.push(url)
        }
      } catch (err) { console.error('Upload failed', err) }
    }
    setFormData((p: any) => ({ ...p, resultImages: [...(p.resultImages || []), ...uploadedUrls] }))
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Auto-generate slug if not provided
    if (!formData.slug && formData.short) {
      formData.slug = formData.short.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    // Split clients text into array
    const clientsArray = clientsText
      ? clientsText.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const payload = {
      ...formData,
      clients: clientsArray
    }

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/industries/${editingId}` : '/api/industries'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setShowForm(false)
      setFormData(emptyIndustry)
      setClientsText('')
      setEditingId(null)
      fetchAll()
    } else {
      alert('Failed to save industry')
    }
    setSubmitting(false)
  }

  const editOne = (item: Industry) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      short: item.short,
      description: item.description,
      content: item.content || '',
      icon: item.icon || 'fa-solid fa-notes-medical',
      image: item.image || '',
      order: item.order || 0,
      featuresTitle: item.featuresTitle || '',
      features: item.features || [],
      servicesTitle: item.servicesTitle || '',
      industryServices: item.industryServices || [],
      profilesTitle: item.profilesTitle || '',
      profiles: item.profiles || [],
      clientsTitle: item.clientsTitle || '',
      resultImages: item.resultImages || []
    })
    setClientsText(item.clients ? item.clients.join(', ') : '')
    setEditingId(item._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this industry?')) return
    const res = await fetch(`/api/industries/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading industries...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">🏢 Industries We Serve</h1>
          <p className="admin-page-subtitle">Manage dynamic industries and custom section templates dynamically</p>
        </div>
        <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'}
          onClick={() => {
            setShowForm(!showForm)
            setFormData(emptyIndustry)
            setClientsText('')
            setEditingId(null)
          }}>
          {showForm ? '✖ Cancel' : '➕ Add Industry'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 20 }}>
            {editingId ? '✏️ Edit Industry' : '✨ New Industry'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Short Name * (e.g. Healthcare)</label>
                <input required className="admin-input" placeholder="e.g. Healthcare"
                  value={formData.short} onChange={e => setFormData({...formData, short: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Slug * (e.g. healthcare)</label>
                <input required className="admin-input" placeholder="e.g. healthcare"
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Full Page Title * (e.g. Digital Marketing for Healthcare)</label>
              <input required className="admin-input" placeholder="e.g. Healthcare Digital Marketing & Growth Solutions"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Icon Class * (FontAwesome)</label>
                <input required className="admin-input" placeholder="e.g. fa-solid fa-notes-medical"
                  value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Display Order</label>
                <input type="number" className="admin-input" placeholder="e.g. 0"
                  value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Short Description (for home page card)</label>
              <textarea className="admin-input" style={{ minHeight: '80px' }} placeholder="Provide a short excerpt..."
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Detailed Introduction Content (top paragraph)</label>
              <div style={{ background: '#fff', color: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                <CKEditor 
                  editorUrl="https://cdn.ckeditor.com/4.25.1-lts/full-all/ckeditor.js"
                  initData={formData.content} 
                  data={formData.content}
                  onChange={(evt: any) => setFormData({...formData, content: evt.editor.getData()})} 
                />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Cover/Banner Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {formData.image && (
                  <img src={formData.image} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <div>
                  <input type="file" accept="image/*" id="ind-img" style={{ display: 'none' }} onChange={handleImageUpload} />
                  <label htmlFor="ind-img" className="admin-btn-secondary" style={{ cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading...' : '📸 Choose Image'}
                  </label>
                </div>
              </div>
            </div>

            {/* ── HIGH FIDELITY DYNAMIC SECTIONS ── */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', marginTop: '10px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '6px', fontWeight: 'bold' }}>🛠️ Dynamic Structured Sections (No HTML Required)</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>Fill these fields to dynamically render beautiful conversion grids, tables, card carousels, and client lists on the inner page.</p>

              {/* 1. FEATURES SECTION */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
                <h4 style={{ color: '#f97316', fontSize: '1.05rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>🔗 1. Conversion Stages / Process Flow Block</h4>
                <div className="admin-form-group" style={{ margin: '0 0 15px 0' }}>
                  <label className="admin-label">Section Title</label>
                  <input className="admin-input" placeholder="e.g., How We Do It: The Patient Conversion Cycle"
                    value={formData.featuresTitle} onChange={e => setFormData({...formData, featuresTitle: e.target.value})} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(formData.features || []).map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input className="admin-input" placeholder="Stage Title (e.g. A. Branding & Credibility)"
                          value={item.title} onChange={e => {
                            const arr = [...formData.features]
                            arr[idx].title = e.target.value
                            setFormData({...formData, features: arr})
                          }} />
                        <textarea className="admin-input" placeholder="Stage Description..." style={{ minHeight: '60px' }}
                          value={item.description} onChange={e => {
                            const arr = [...formData.features]
                            arr[idx].description = e.target.value
                            setFormData({...formData, features: arr})
                          }} />
                      </div>
                      <button type="button" className="admin-btn-danger" style={{ padding: '8px 12px' }}
                        onClick={() => {
                          const arr = formData.features.filter((_: any, i: number) => i !== idx)
                          setFormData({...formData, features: arr})
                        }}>🗑️</button>
                    </div>
                  ))}
                </div>
                <button type="button" className="admin-btn-secondary" style={{ marginTop: 12 }}
                  onClick={() => setFormData({...formData, features: [...(formData.features || []), { title: '', description: '' }]})}>
                  ➕ Add Conversion Stage Card
                </button>
              </div>

              {/* 2. SERVICES SECTION */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
                <h4 style={{ color: '#f97316', fontSize: '1.05rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>🚀 2. Services Section</h4>
                <div className="admin-form-group" style={{ margin: '0 0 15px 0' }}>
                  <label className="admin-label">Section Title</label>
                  <input className="admin-input" placeholder="e.g., Our Services for You"
                    value={formData.servicesTitle || ''} onChange={e => setFormData({...formData, servicesTitle: e.target.value})} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(formData.industryServices || []).map((item: any, idx: number) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                      {/* Row 1: Name + Link */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <input className="admin-input" placeholder="Service Name (e.g. Google Ads)"
                          value={item.name} onChange={e => {
                            const arr = [...formData.industryServices]
                            arr[idx].name = e.target.value
                            setFormData({...formData, industryServices: arr})
                          }} />
                        <input className="admin-input" placeholder="Link URL (e.g. /services/google-ads)"
                          value={item.link} onChange={e => {
                            const arr = [...formData.industryServices]
                            arr[idx].link = e.target.value
                            setFormData({...formData, industryServices: arr})
                          }} />
                      </div>
                      {/* Row 2: Description */}
                      <input className="admin-input" placeholder="Short Description (optional)" style={{ marginBottom: 10 }}
                        value={item.description} onChange={e => {
                          const arr = [...formData.industryServices]
                          arr[idx].description = e.target.value
                          setFormData({...formData, industryServices: arr})
                        }} />
                      {/* Row 3: Image Upload + Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.image && (
                          <img src={item.image} alt="preview" style={{ width: 80, height: 55, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                        )}
                        <label style={{ cursor: 'pointer', background: 'rgba(249,115,22,0.1)', border: '1px dashed rgba(249,115,22,0.4)', borderRadius: 8, padding: '8px 14px', color: '#f97316', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                          🖼️ {item.image ? 'Change Image' : 'Upload Image'}
                          <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              setUploading(true)
                              const fd = new FormData()
                              fd.append('file', file)
                              fd.append('folder', 'industries/services')
                              try {
                                const res = await fetch('/api/upload', { method: 'POST', body: fd })
                                if (res.ok) {
                                  const { url } = await res.json()
                                  const arr = [...formData.industryServices]
                                  arr[idx].image = url
                                  setFormData({...formData, industryServices: arr})
                                }
                              } catch(err) { alert('Upload failed') }
                              setUploading(false)
                            }}
                          />
                        </label>
                        {item.image && (
                          <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                            onClick={() => {
                              const arr = [...formData.industryServices]
                              arr[idx].image = ''
                              setFormData({...formData, industryServices: arr})
                            }}>✕ Remove</button>
                        )}
                        <button type="button" className="admin-btn-danger" style={{ padding: '8px 12px', marginLeft: 'auto' }}
                          onClick={() => {
                            const arr = formData.industryServices.filter((_: any, i: number) => i !== idx)
                            setFormData({...formData, industryServices: arr})
                          }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" className="admin-btn-secondary" style={{ marginTop: 12 }}
                  onClick={() => setFormData({...formData, industryServices: [...(formData.industryServices || []), { name: '', icon: '', image: '', description: '', link: '' }]})}>
                  ➕ Add Service
                </button>
              </div>

              {/* 3. PROFILES CAROUSEL SECTION */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 20, marginBottom: 20 }}>
                <h4 style={{ color: '#f97316', fontSize: '1.05rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>🎬 3. Video Marketing & Profiles Carousel Block</h4>
                <div className="admin-form-group" style={{ margin: '0 0 15px 0' }}>
                  <label className="admin-label">Section Title</label>
                  <input className="admin-input" placeholder="e.g., Doctor Video Marketing & Profiles"
                    value={formData.profilesTitle} onChange={e => setFormData({...formData, profilesTitle: e.target.value})} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {(formData.profiles || []).map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <input className="admin-input" placeholder="Name (e.g. Dr. Rahul Sharma)"
                            value={item.name} onChange={e => {
                              const arr = [...formData.profiles]
                              arr[idx].name = e.target.value
                              setFormData({...formData, profiles: arr})
                            }} />
                          <input className="admin-input" placeholder="Subtitle/Designation"
                            value={item.designation} onChange={e => {
                              const arr = [...formData.profiles]
                              arr[idx].designation = e.target.value
                              setFormData({...formData, profiles: arr})
                            }} />
                        </div>
                        <textarea className="admin-input" placeholder="Description/Result achieved..." style={{ minHeight: '50px' }}
                          value={item.description} onChange={e => {
                            const arr = [...formData.profiles]
                            arr[idx].description = e.target.value
                            setFormData({...formData, profiles: arr})
                          }} />
                      </div>
                      <button type="button" className="admin-btn-danger" style={{ padding: '8px 12px' }}
                        onClick={() => {
                          const arr = formData.profiles.filter((_: any, i: number) => i !== idx)
                          setFormData({...formData, profiles: arr})
                        }}>🗑️</button>
                    </div>
                  ))}
                </div>
                <button type="button" className="admin-btn-secondary" style={{ marginTop: 12 }}
                  onClick={() => setFormData({...formData, profiles: [...(formData.profiles || []), { name: '', designation: '', description: '' }]})}>
                  ➕ Add Profile/Video Card
                </button>
              </div>

              {/* 4. CLIENTS HEX TAGS */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 20 }}>
                <h4 style={{ color: '#f97316', fontSize: '1.05rem', margin: '0 0 15px 0', fontWeight: 'bold' }}>🏆 4. Prestigious Clients Badge Block</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label className="admin-label">Section Title</label>
                    <input className="admin-input" placeholder="e.g., Our Prestigious Healthcare Clients"
                      value={formData.clientsTitle} onChange={e => setFormData({...formData, clientsTitle: e.target.value})} />
                  </div>
                  <div className="admin-form-group" style={{ margin: 0 }}>
                    <label className="admin-label">Clients List (Comma-separated)</label>
                    <input className="admin-input" placeholder="Client Name 1, Client Name 2, Client Name 3"
                      value={clientsText} onChange={e => setClientsText(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* 5. REAL RESULTS IMAGES */}
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 20, marginTop: 20 }}>
                <h4 style={{ color: '#f97316', fontSize: '1.05rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>📸 5. See Our Real Results — Screenshots</h4>
                <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 16 }}>Upload screenshots of actual results (ROAS, rankings, analytics, etc.). These will appear in the "See our Real Results" section on the page.</p>

                {(formData.resultImages || []).length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
                    {(formData.resultImages || []).map((url: string, idx: number) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={url} alt={`Result ${idx + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                        <button
                          type="button"
                          onClick={() => {
                            const arr = (formData.resultImages as string[]).filter((_: string, i: number) => i !== idx)
                            setFormData({ ...formData, resultImages: arr })
                          }}
                          style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <input type="file" accept="image/*" multiple id="result-imgs" style={{ display: 'none' }} onChange={handleResultImageUpload} />
                  <label htmlFor="result-imgs" className="admin-btn-secondary" style={{ cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading...' : '📸 Upload Screenshot(s)'}
                  </label>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', marginLeft: 12 }}>Ek saath multiple images select kar sakte hain</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button type="button" className="admin-btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
              <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '10px 24px' }}>
                {submitting ? '⏳ Saving...' : '💾 Save Industry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {industries.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">🏢</div>
            <p className="admin-empty-text">No industries added yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {industries.map(item => (
            <div key={item._id} className="admin-card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
              {item.image ? (
                <img src={item.image} alt={item.short} style={{ width: 100, height: 70, borderRadius: 10, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 100, height: 70, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  <i className={item.icon || "fa-solid fa-industry"}></i>
                </div>
              )}
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--admin-text-primary)' }}>{item.short}</h3>
                  <span className="admin-badge primary">Order: {item.order}</span>
                  <span className="admin-badge info">{item.slug}</span>
                </div>
                <p style={{ margin: '0', fontSize: 14, color: 'var(--admin-text-secondary)' }}>
                  {item.title}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
                  {item.description}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 100 }}>
                <button onClick={() => editOne(item)} className="admin-btn-secondary" style={{ justifyContent: 'center' }}>✏️ Edit</button>
                <button onClick={() => deleteOne(item._id)} className="admin-btn-danger" style={{ justifyContent: 'center' }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
