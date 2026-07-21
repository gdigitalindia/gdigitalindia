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
    [{ 'header': [1, 2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'clean']
  ],
  clipboard: {
    matchVisual: false,
  }
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image'
]

interface Blog {
  _id: string
  slug: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  image: string
  content: string
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

const empty = { slug: '', category: '', title: '', excerpt: '', author: '', date: '', readTime: '', image: '', content: '', featured: false, metaTitle: '', metaDescription: '', metaKeywords: '' }

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(empty)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) setBlogs(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'blogs')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setFormData((p: any) => ({ ...p, image: url }))
    } catch (err) { alert('Upload failed') }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs'
    
    const payload = { ...formData }
    if (!payload.slug && payload.title) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
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
    else alert('Failed to save blog')
    setSubmitting(false)
  }

  const editOne = (b: Blog) => {
    setFormData({
      slug: b.slug,
      category: b.category,
      title: b.title,
      excerpt: b.excerpt,
      author: b.author,
      date: b.date,
      readTime: b.readTime,
      image: b.image || '',
      content: b.content || '',
      featured: b.featured || false,
      metaTitle: b.metaTitle || '',
      metaDescription: b.metaDescription || '',
      metaKeywords: b.metaKeywords || ''
    })
    setEditingId(b._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading blogs...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">📝 Blogs</h1>
          <p className="admin-page-subtitle">Manage your blog posts</p>
        </div>
        <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'} 
          onClick={() => { 
            setShowForm(!showForm); setFormData(empty); setEditingId(null); 
          }}>
          {showForm ? '✖ Cancel' : '➕ Add Blog'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 20 }}>
            {editingId ? '✏️ Edit Blog' : '✨ New Blog'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Blog Title *</label>
                <input required className="admin-input" placeholder="e.g. AI Revolution in 2025"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Slug (optional, auto-generated)</label>
                <input className="admin-input" placeholder="e.g. ai-revolution-2025"
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Category *</label>
                <input required className="admin-input" placeholder="e.g. SEO"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Author *</label>
                <input required className="admin-input" placeholder="e.g. John Doe"
                  value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Excerpt *</label>
              <textarea required className="admin-textarea" rows={3} placeholder="A short description of the post..."
                value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Full Content *</label>
              <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write your full blog content here..."
                  value={formData.content} 
                  onChange={val => setFormData({...formData, content: val})} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: '20px' }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Date *</label>
                <input required className="admin-input" placeholder="e.g. Mar 28, 2025"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Read Time *</label>
                <input required className="admin-input" placeholder="e.g. 8 min read"
                  value={formData.readTime} onChange={e => setFormData({...formData, readTime: e.target.value})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <input 
                    type="checkbox" 
                    id="featured" 
                    checked={formData.featured} 
                    onChange={e => setFormData({...formData, featured: e.target.checked})} 
                />
                <label htmlFor="featured" className="admin-label" style={{ margin: 0, cursor: 'pointer' }}>Set as Featured Post</label>
            </div>

            {/* SEO METADATA SECTION */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
               <h4 style={{ margin: '0 0 10px 0' }}>🔍 SEO Metadata</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Title</label>
                   <input className="admin-input" placeholder="e.g. AI Revolution in 2025 | Blog"
                     value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
                 </div>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Description</label>
                   <textarea className="admin-input" placeholder="e.g. Read about the upcoming AI revolution..." style={{ minHeight: 80, resize: 'vertical' }}
                     value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} />
                 </div>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Keywords</label>
                   <input className="admin-input" placeholder="e.g. AI, Revolution, 2025, technology"
                     value={formData.metaKeywords} onChange={e => setFormData({...formData, metaKeywords: e.target.value})} />
                 </div>
               </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Cover Image *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {formData.image && (
                  <img src={formData.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                )}
                <div>
                  <input type="file" accept="image/*" id="blog-img" style={{ display: 'none' }} onChange={handleImageUpload} />
                  <label htmlFor="blog-img" className="admin-btn-secondary" style={{ cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? '⏳ Uploading...' : '📸 Choose Image'}
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '10px 24px' }}>
                {submitting ? '⏳ Saving...' : '💾 Save Blog'}
              </button>
            </div>
          </form>
        </div>
      )}

      {blogs.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📝</div>
            <p className="admin-empty-text">No blogs added yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {blogs.map(b => (
            <div key={b._id} className="admin-card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
              {b.image ? (
                <img src={b.image} alt={b.title} style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  📝
                </div>
              )}
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--admin-text-primary)' }}>{b.title}</h3>
                  <span className="admin-badge info">{b.category}</span>
                  {b.featured && <span className="admin-badge primary">Featured</span>}
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: 14, color: 'var(--admin-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.excerpt}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="admin-badge" style={{ fontSize: 11, background: '#e2e8f0', color: '#475569' }}>{b.date}</span>
                  <span className="admin-badge" style={{ fontSize: 11, background: '#e2e8f0', color: '#475569' }}>{b.author}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 100 }}>
                <button onClick={() => editOne(b)} className="admin-btn-secondary" style={{ justifyContent: 'center' }}>✏️ Edit</button>
                <button onClick={() => deleteOne(b._id)} className="admin-btn-danger" style={{ justifyContent: 'center' }}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
