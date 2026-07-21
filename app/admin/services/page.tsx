'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8 }}>Loading Editor...</div>
})
import 'react-quill-new/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
  clipboard: {
    // This will clean up pasted HTML
    matchVisual: false,
  }
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
]

interface Service {
  _id: string
  title: string
  slug: string
  category: string
  industry: string
  short: string
  description: string
  descriptionHeading: string
  highlight: string
  tags: string[]
  image: string
  contentBlocks: { title: string; text: string; image: string }[]
  faqs: { q: string; a: string }[]
  order: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

const empty = { 
  title: '', slug: '', category: '', industry: '', short: '', description: '', descriptionHeading: '', highlight: '', tags: [], image: '', 
  contentBlocks: [], faqs: [], order: 0, metaTitle: '', metaDescription: '', metaKeywords: '' 
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(empty)
  const [categories, setCategories] = useState<any[]>([])
  const [tagsInput, setTagsInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [res, catRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/service-categories')
      ])
      if (res.ok) setServices(await res.json())
      if (catRes.ok) setCategories(await catRes.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'services')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setFormData((p: any) => ({ ...p, image: url }))
    } catch (err) { alert('Upload failed') }
    setUploading(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setFormData({ ...formData, title, slug: editingId ? formData.slug : slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/services/${editingId}` : '/api/services'
    
    const payload = { ...formData, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) }

    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    
    if (res.ok) { 
      setShowForm(false); 
      setFormData(empty); 
      setTagsInput('');
      setEditingId(null);
      fetchAll() 
    }
    else {
      const data = await res.json()
      alert(data.error || 'Failed to save service')
    }
    setSubmitting(false)
  }

  const editOne = (s: Service) => {
    setFormData({
      title: s.title,
      slug: s.slug || '',
      short: s.short,
      category: s.category || '',
      industry: s.industry || '',
      description: s.description,
      descriptionHeading: s.descriptionHeading || '',
      highlight: s.highlight,
      image: s.image || '',
      contentBlocks: s.contentBlocks || [],
      faqs: s.faqs || [],
      order: s.order || 0,
      metaTitle: s.metaTitle || '',
      metaDescription: s.metaDescription || '',
      metaKeywords: s.metaKeywords || ''
    })
    setTagsInput((s.tags || []).join(', '))
    setEditingId(s._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this service?')) return
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  // Dynamic Array Handlers
  const addArrayItem = (key: string, item: any) => {
    setFormData({ ...formData, [key]: [...(formData[key] || []), item] })
  }
  const removeArrayItem = (key: string, idx: number) => {
    setFormData({ ...formData, [key]: formData[key].filter((_: any, i: number) => i !== idx) })
  }
  const updateArrayItem = (key: string, idx: number, field: string, val: any) => {
    const updated = [...formData[key]]
    updated[idx] = { ...updated[idx], [field]: val }
    setFormData({ ...formData, [key]: updated })
  }

  const handleBlockImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'services/blocks')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      updateArrayItem('contentBlocks', idx, 'image', url)
    } catch (err) { alert('Upload failed') }
    setUploading(false)
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading services...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">🛠️ Services</h1>
          <p className="admin-page-subtitle">Manage your service offerings</p>
        </div>
        <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'} 
          onClick={() => { 
            setShowForm(!showForm); setFormData(empty); setTagsInput(''); setEditingId(null); 
          }}>
          {showForm ? '✖ Cancel' : '➕ Add Service'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 20 }}>
            {editingId ? '✏️ Edit Service' : '✨ New Service'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Service Title *</label>
                <input required className="admin-input" placeholder="e.g. Search Engine Optimization"
                  value={formData.title} onChange={handleTitleChange} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Slug *</label>
                <input required className="admin-input" placeholder="e.g. seo-services"
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Short Name *</label>
                <input required className="admin-input" placeholder="e.g. SEO"
                  value={formData.short} onChange={e => setFormData({...formData, short: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Category (For Mega Menu) *</label>
                <select required className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Description Heading (Replaces 'About the Service')</label>
              <input className="admin-input" placeholder="e.g. Google Ads"
                value={formData.descriptionHeading} onChange={e => setFormData({...formData, descriptionHeading: e.target.value})} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Description</label>
              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.description} onChange={val => setFormData({...formData, description: val})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Highlight Stats/Text</label>
              <input className="admin-input" placeholder="e.g. Avg. 340% increase in organic traffic"
                value={formData.highlight} onChange={e => setFormData({...formData, highlight: e.target.value})} />
            </div>

            {/* CONTENT BLOCKS SECTION */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                 <h4 style={{ margin: 0 }}>📝 Alternating Content Blocks</h4>
                 <button type="button" className="admin-btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}
                   onClick={() => addArrayItem('contentBlocks', { title: '', text: '', image: '' })}>+ Add Block</button>
               </div>
               {formData.contentBlocks.map((s: any, i: number) => (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 15, border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 15, background: '#fff' }}>
                   <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                     <input style={{ flex: 1 }} className="admin-input" placeholder="Block Title" value={s.title} onChange={e => updateArrayItem('contentBlocks', i, 'title', e.target.value)} />
                     <button type="button" className="admin-btn-danger" onClick={() => removeArrayItem('contentBlocks', i)}>🗑️</button>
                   </div>
                   <div style={{ display: 'flex', gap: 15 }}>
                     {/* Image Upload for Block */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '200px' }}>
                        {s.image ? (
                          <img src={s.image} alt="Block Image" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                        ) : (
                          <div style={{ width: '100%', height: 120, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                        )}
                        <input type="file" accept="image/*" id={`block-img-${i}`} style={{ display: 'none' }} onChange={(e) => handleBlockImageUpload(i, e)} />
                        <label htmlFor={`block-img-${i}`} className="admin-btn-secondary" style={{ cursor: 'pointer', textAlign: 'center', fontSize: 12 }}>
                           Choose Image
                        </label>
                     </div>
                     {/* Editor */}
                     <div style={{ flex: 1, borderRadius: 8, overflow: 'hidden' }}>
                      <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={s.text} onChange={val => updateArrayItem('contentBlocks', i, 'text', val)} />
                     </div>
                   </div>
                 </div>
               ))}
            </div>


            {/* FAQS SECTION */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                 <h4 style={{ margin: 0 }}>❓ FAQs</h4>
                 <button type="button" className="admin-btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}
                   onClick={() => addArrayItem('faqs', { q: '', a: '' })}>+ Add FAQ</button>
               </div>
               {formData.faqs.map((s: any, i: number) => (
                 <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10, border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 10 }}>
                   <div style={{ display: 'flex', gap: 10 }}>
                     <input style={{ flex: 1 }} className="admin-input" placeholder="Question" value={s.q} onChange={e => updateArrayItem('faqs', i, 'q', e.target.value)} />
                     <button type="button" className="admin-btn-danger" onClick={() => removeArrayItem('faqs', i)}>🗑️</button>
                   </div>
                   <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                    <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={s.a} onChange={val => updateArrayItem('faqs', i, 'a', val)} />
                   </div>
                 </div>
               ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Tags (comma separated)</label>
                <input className="admin-input" placeholder="e.g. Technical SEO, Link Building"
                  value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Order (display Priority)</label>
                <input type="number" className="admin-input" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
              </div>
            </div>

            {/* SEO METADATA SECTION */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
               <h4 style={{ margin: '0 0 10px 0' }}>🔍 SEO Metadata</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Title</label>
                   <input className="admin-input" placeholder="e.g. Best SEO Services in Jaipur | G Digital India"
                     value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
                 </div>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Description</label>
                   <textarea className="admin-input" placeholder="e.g. We provide top-notch SEO services..." style={{ minHeight: 80, resize: 'vertical' }}
                     value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} />
                 </div>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Keywords</label>
                   <input className="admin-input" placeholder="e.g. SEO services, digital marketing, Jaipur SEO"
                     value={formData.metaKeywords} onChange={e => setFormData({...formData, metaKeywords: e.target.value})} />
                 </div>
               </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Cover Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {formData.image && (
                  <img src={formData.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <div>
                  <input type="file" accept="image/*" id="svc-img" style={{ display: 'none' }} onChange={handleImageUpload} />
                  <label htmlFor="svc-img" className="admin-btn-secondary" style={{ cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading...' : '📸 Choose Image'}
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '10px 24px' }}>
                {submitting ? '⏳ Saving...' : '💾 Save Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      {services.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">🛠️</div>
            <p className="admin-empty-text">No services added yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {services.map(s => (
            <div key={s._id} className="admin-card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
              {s.image ? (
                <img src={s.image} alt={s.title} style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  🛠️
                </div>
              )}
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--admin-text-primary)' }}>{s.title}</h3>
                  <span className="admin-badge primary">{s.short}</span>
                  {s.category && <span className="admin-badge" style={{ background: '#e2e8f0', color: '#475569' }}>{s.category}</span>}
                </div>
                <div 
                  className="admin-preview-text"
                  style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--admin-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: s.description }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  {s.tags?.map((t, i) => <span key={i} className="admin-badge info" style={{ fontSize: 11 }}>{t}</span>)}
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
