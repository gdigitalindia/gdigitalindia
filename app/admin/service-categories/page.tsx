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
    matchVisual: false,
  }
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
]

interface ServiceCategory {
  _id: string
  name: string
  slug: string
  title: string
  description: string
  image: string
  contentBlocks: { title: string; text: string; image: string }[]
  order: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

const empty = { 
  name: '', slug: '', title: '', description: '', image: '', contentBlocks: [], order: 0,
  metaTitle: '', metaDescription: '', metaKeywords: '' 
}

export default function AdminServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(empty)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/service-categories')
      if (res.ok) setCategories(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, arrayIdx?: number) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'categories')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      
      if (arrayIdx !== undefined) {
        const arr = [...formData.contentBlocks]
        arr[arrayIdx].image = url
        setFormData({ ...formData, contentBlocks: arr })
      } else {
        setFormData({ ...formData, [fieldName]: url })
      }
    } catch (err) { alert('Upload failed') }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/service-categories/${editingId}` : '/api/service-categories'
    
    let payload = { ...formData }
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
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
    else alert('Failed to save category')
    setSubmitting(false)
  }

  const editOne = (c: ServiceCategory) => {
    setFormData({ 
      name: c.name, 
      slug: c.slug || '', 
      title: c.title || '', 
      description: c.description || '', 
      image: c.image || '', 
      contentBlocks: c.contentBlocks || [],
      order: c.order || 0,
      metaTitle: c.metaTitle || '',
      metaDescription: c.metaDescription || '',
      metaKeywords: c.metaKeywords || '' 
    })
    setEditingId(c._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this category?')) return
    const res = await fetch(`/api/service-categories/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  // Content Blocks Array Helpers
  const addArrayItem = (field: 'contentBlocks') => {
    setFormData((p: any) => ({ ...p, [field]: [...(p[field] || []), { title: '', text: '', image: '' }] }))
  }
  const removeArrayItem = (field: 'contentBlocks', i: number) => {
    setFormData((p: any) => { const arr = [...(p[field] || [])]; arr.splice(i, 1); return { ...p, [field]: arr } })
  }
  const updateArrayItem = (field: 'contentBlocks', i: number, subField: string, val: string) => {
    setFormData((p: any) => { const arr = [...(p[field] || [])]; arr[i] = { ...arr[i], [subField]: val }; return { ...p, [field]: arr } })
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading categories...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">📁 Service Categories</h1>
          <p className="admin-page-subtitle">Manage main categories (e.g., Digital Marketing, Website Designing)</p>
        </div>
        <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'} 
          onClick={() => { 
            if (showForm && editingId) { setEditingId(null); setFormData(empty); setShowForm(false); }
            else { setShowForm(!showForm); setFormData(empty); setEditingId(null); }
          }}>
          {showForm ? '✖ Cancel' : '➕ Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 40, animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--admin-text-primary)', marginBottom: 20 }}>
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Category Name *</label>
                <input className="admin-input" required placeholder="e.g. Digital Marketing" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Slug (optional, auto-generates)</label>
                <input className="admin-input" placeholder="e.g. digital-marketing" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Page Title</label>
                <input className="admin-input" placeholder="Hero Title for this category page" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Order</label>
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
              <label className="admin-label">Hero Main Description</label>
              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.description} onChange={val => setFormData({...formData, description: val})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Hero Main Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {formData.image && <img src={formData.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />}
                <div>
                  <input type="file" accept="image/*" id="main-img" style={{ display: 'none' }} onChange={e => handleImageUpload(e, 'image')} />
                  <label htmlFor="main-img" className="admin-btn-secondary" style={{ cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading...' : '📸 Choose Image'}
                  </label>
                </div>
              </div>
            </div>

            {/* ═══ CONTENT BLOCKS ═══ */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                 <div>
                   <h3 style={{ margin: 0, fontSize: 16 }}>📝 Alternating Content Blocks</h3>
                   <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Adds zigzag text/image sections below the hero.</p>
                 </div>
                 <button type="button" onClick={() => addArrayItem('contentBlocks')} className="admin-btn-secondary" style={{ padding: '6px 12px' }}>
                   + Add Block
                 </button>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 {(formData.contentBlocks || []).map((s: any, i: number) => (
                   <div key={i} style={{ padding: 15, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                     
                     <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                       <input className="admin-input" placeholder="Block Title" value={s.title} onChange={e => updateArrayItem('contentBlocks', i, 'title', e.target.value)} />
                       <button type="button" className="admin-btn-danger" onClick={() => removeArrayItem('contentBlocks', i)}>🗑️</button>
                     </div>

                     <div style={{ display: 'flex', gap: 20 }}>
                       {/* Image Upload for Block */}
                       <div style={{ width: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
                         {s.image ? (
                           <img src={s.image} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, background: '#e2e8f0' }} />
                         ) : (
                           <div style={{ width: '100%', height: 100, background: '#e2e8f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#64748b' }}>No Image</div>
                         )}
                         <input type="file" accept="image/*" id={`block-img-${i}`} style={{ display: 'none' }} onChange={e => handleImageUpload(e, '', i)} />
                         <label htmlFor={`block-img-${i}`} className="admin-btn-secondary" style={{ padding: '6px', fontSize: 12, textAlign: 'center', cursor: 'pointer' }}>
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
                 {(formData.contentBlocks || []).length === 0 && (
                   <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: 8 }}>No content blocks added yet.</div>
                 )}
               </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '12px 30px' }}>
                {submitting ? '⏳ Saving...' : '💾 Save Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📁</div>
            <p className="admin-empty-text">No categories added yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.map(c => (
            <div key={c._id} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: 'var(--admin-text-primary)' }}>{c.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--admin-text-secondary)' }}>Slug: /{c.slug}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--admin-text-secondary)' }}>Order: {c.order}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => editOne(c)} className="admin-btn-secondary" style={{ padding: '6px 10px', fontSize: 12 }}>✏️ Edit</button>
                <button onClick={() => deleteOne(c._id)} className="admin-btn-danger" style={{ padding: '6px 10px', fontSize: 12 }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}