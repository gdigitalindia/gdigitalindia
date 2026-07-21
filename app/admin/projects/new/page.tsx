'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '150px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8 }}>Loading Editor...</div>
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

const empty = {
  title: '', slug: '', category: '', industry: '', image: '', description: '',
  technologies: '', liveUrl: '', githubUrl: '', challenges: '', solutions: '', results: '',
  stats: [], clientName: '', duration: '', order: 0,
  metaTitle: '', metaDescription: '', metaKeywords: ''
}

export default function NewProject() {
  const router = useRouter()
  const [formData, setFormData] = useState<any>(empty)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (field: string, val: any) => setFormData((p: any) => ({ ...p, [field]: val }))

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setFormData((p: any) => ({ ...p, title, slug }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'projects')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      set('image', url)
    } catch (err) { alert('Upload failed') }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
    }
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) router.push('/admin/projects')
    else { 
      const err = await res.json().catch(() => ({ error: 'Error' }))
      alert(`Failed to create project: ${err.error || 'Server error'}`); 
      setSubmitting(false) 
    }
  }

  // Stats handlers
  const addStat = () => set('stats', [...formData.stats, { label: '', value: '' }])
  const removeStat = (idx: number) => set('stats', formData.stats.filter((_: any, i: number) => i !== idx))
  const updateStat = (idx: number, field: string, val: string) => {
    const up = [...formData.stats]; up[idx] = { ...up[idx], [field]: val }; set('stats', up)
  }

  const CATEGORIES = ['Web Design', 'SEO', 'Paid Ads', 'Social Media', 'Mobile App', 'Other']

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">➕ Add New Project</h1>
          <p className="admin-page-subtitle">Fill in the details to add a new portfolio project</p>
        </div>
        <Link href="/admin/projects" className="admin-btn-secondary" style={{ textDecoration: 'none' }}>
          ← Back to Projects
        </Link>
      </div>

      <div className="admin-card" style={{ maxWidth: 860, marginBottom: 40 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Project Title *</label>
              <input className="admin-input" required placeholder="e.g. Battery Nearby Website" value={formData.title} onChange={handleTitleChange} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Slug *</label>
              <input className="admin-input" required value={formData.slug} onChange={e => set('slug', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Category *</label>
              <select className="admin-select" required value={formData.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Industry</label>
              <input className="admin-input" placeholder="e.g. Automotive" value={formData.industry} onChange={e => set('industry', e.target.value)} />
            </div>
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">Project Description (Mini Intro)</label>
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.description} onChange={val => set('description', val)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Client Name</label>
              <input className="admin-input" value={formData.clientName} onChange={e => set('clientName', e.target.value)} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Duration</label>
              <input className="admin-input" value={formData.duration} onChange={e => set('duration', e.target.value)} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Live URL</label>
              <input className="admin-input" placeholder="https://" value={formData.liveUrl} onChange={e => set('liveUrl', e.target.value)} />
            </div>
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">The Challenges</label>
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.challenges} onChange={val => set('challenges', val)} />
            </div>
          </div>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">The Solutions</label>
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.solutions} onChange={val => set('solutions', val)} />
            </div>
          </div>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">The Results</label>
            <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
              <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} value={formData.results} onChange={val => set('results', val)} />
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
               <h4 style={{ margin: 0 }}>📈 Performance Stats</h4>
               <button type="button" className="admin-btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={addStat}>+ Add Stat</button>
             </div>
             {formData.stats.map((s: any, i: number) => (
               <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, marginBottom: 8 }}>
                 <input className="admin-input" placeholder="Label (e.g. Traffic Increase)" value={s.label} onChange={e => updateStat(i, 'label', e.target.value)} />
                 <input className="admin-input" placeholder="Value (e.g. 200%)" value={s.value} onChange={e => updateStat(i, 'value', e.target.value)} />
                 <button type="button" className="admin-btn-danger" onClick={() => removeStat(i)}>🗑️</button>
               </div>
             ))}
          </div>

          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-label">Technologies (comma separated)</label>
            <input className="admin-input" placeholder="React, Node.js, etc." value={formData.technologies} onChange={e => set('technologies', e.target.value)} />
          </div>

          {/* SEO METADATA SECTION */}
          <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
             <h4 style={{ margin: '0 0 10px 0' }}>🔍 SEO Metadata</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
               <div className="admin-form-group" style={{ margin: 0 }}>
                 <label className="admin-label">Meta Title</label>
                 <input className="admin-input" placeholder="e.g. Project Name | G Digital India Portfolio"
                   value={formData.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
               </div>
               <div className="admin-form-group" style={{ margin: 0 }}>
                 <label className="admin-label">Meta Description</label>
                 <textarea className="admin-input" placeholder="e.g. Case study of..." style={{ minHeight: 80, resize: 'vertical' }}
                   value={formData.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
               </div>
               <div className="admin-form-group" style={{ margin: 0 }}>
                 <label className="admin-label">Meta Keywords</label>
                 <input className="admin-input" placeholder="e.g. web design project, SEO case study"
                   value={formData.metaKeywords} onChange={e => set('metaKeywords', e.target.value)} />
               </div>
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
             <div className="admin-form-group" style={{ flex: 1, margin: 0 }}>
               <label className="admin-label">Cover Image</label>
               <input type="file" accept="image/*" onChange={handleImageUpload} />
               {uploading && <p style={{ fontSize: 12 }}>Uploading...</p>}
             </div>
             {formData.image && <img src={formData.image} alt="prev" style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '10px 24px' }}>
              {submitting ? '⏳ Creating...' : '✅ Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}