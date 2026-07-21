'use client'

import { useEffect, useState } from 'react'

interface Plan {
  name: string
  priceMonthly: string
  priceYearly: string
  features: string[]
  isPopular: boolean
  ctaText: string
}

interface Package {
  _id: string
  title: string
  slug: string
  category: string
  description: string
  plans: Plan[]
  order: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
}

interface PackageCategory {
  _id: string
  name: string
}

const emptyPlan = { name: '', priceMonthly: '', priceYearly: '', features: [], isPopular: false, ctaText: 'Enquiry Now' }
const empty = { 
  title: '', slug: '', category: '', description: '', plans: [], order: 0, 
  metaTitle: '', metaDescription: '', metaKeywords: '' 
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [categories, setCategories] = useState<PackageCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>(empty)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [pkgRes, catRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/package-categories')
      ])
      if (pkgRes.ok) setPackages(await pkgRes.json())
      if (catRes.ok) setCategories(await catRes.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setFormData({ ...formData, title, slug: editingId ? formData.slug : slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/packages/${editingId}` : '/api/packages'
    
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    
    if (res.ok) { 
      setShowForm(false); 
      setFormData(empty); 
      setEditingId(null);
      fetchAll() 
    } else {
      const data = await res.json()
      alert(data.error || 'Failed to save package')
    }
    setSubmitting(false)
  }

  const editOne = (p: Package) => {
    setFormData({ ...p })
    setEditingId(p._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this package?')) return
    const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
    else alert('Failed to delete')
  }

  const addPlan = () => {
    setFormData({ ...formData, plans: [...(formData.plans || []), { ...emptyPlan, features: [''] }] })
  }
  const removePlan = (idx: number) => {
    setFormData({ ...formData, plans: formData.plans.filter((_: any, i: number) => i !== idx) })
  }
  const updatePlan = (idx: number, field: string, val: any) => {
    const updated = [...formData.plans]
    updated[idx] = { ...updated[idx], [field]: val }
    setFormData({ ...formData, plans: updated })
  }

  const addFeature = (planIdx: number) => {
    const updated = [...formData.plans]
    updated[planIdx].features = [...updated[planIdx].features, '']
    setFormData({ ...formData, plans: updated })
  }
  const updateFeature = (planIdx: number, featIdx: number, val: string) => {
    const updated = [...formData.plans]
    updated[planIdx].features[featIdx] = val
    setFormData({ ...formData, plans: updated })
  }
  const removeFeature = (planIdx: number, featIdx: number) => {
    const updated = [...formData.plans]
    updated[planIdx].features = updated[planIdx].features.filter((_: any, i: number) => i !== featIdx)
    setFormData({ ...formData, plans: updated })
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading packages...</p>
    </div>
  )

  return (
    <div>
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">📦 Packages</h1>
          <p className="admin-page-subtitle">Manage your service pricing packages</p>
        </div>
        <button className={showForm && !editingId ? 'admin-btn-secondary' : 'admin-btn-primary'} 
          onClick={() => { 
            setShowForm(!showForm); setFormData(empty); setEditingId(null); 
          }}>
          {showForm ? '✖ Cancel' : '➕ Add Package'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 30, animation: 'fadeIn 0.3s ease' }}>
          <h2 className="admin-card-title" style={{ marginBottom: 20 }}>
            {editingId ? '✏️ Edit Package' : '✨ New Package'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Package Title *</label>
                <input required className="admin-input" placeholder="e.g. SEO Packages"
                  value={formData.title} onChange={handleTitleChange} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Slug *</label>
                <input required className="admin-input" placeholder="e.g. seo-packages"
                  value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Category *</label>
                <select required className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Display Order</label>
                <input type="number" className="admin-input" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
              </div>
            </div>

            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Short Description</label>
              <textarea className="admin-input" placeholder="e.g. Packages That Drive More Traffic..." style={{ minHeight: 60 }}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* PLANS SECTION */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                <h4 style={{ margin: 0 }}>💰 Pricing Plans</h4>
                <button type="button" className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}
                  onClick={addPlan}>+ Add Plan</button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
                {formData.plans.map((plan: any, pi: number) => (
                  <div key={pi} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, position: 'relative' }}>
                    <button type="button" className="admin-btn-danger" style={{ position: 'absolute', top: 10, right: 10, padding: '5px 8px' }}
                      onClick={() => removePlan(pi)}>🗑️</button>
                    
                    <div className="admin-form-group">
                      <label className="admin-label">Plan Name</label>
                      <input className="admin-input" placeholder="e.g. Startup Plan" value={plan.name} onChange={e => updatePlan(pi, 'name', e.target.value)} />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Monthly Price</label>
                        <input className="admin-input" placeholder="e.g. 8000" value={plan.priceMonthly} onChange={e => updatePlan(pi, 'priceMonthly', e.target.value)} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Yearly Price</label>
                        <input className="admin-input" placeholder="e.g. 80000" value={plan.priceYearly} onChange={e => updatePlan(pi, 'priceYearly', e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 15, marginBottom: 15 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                        <input type="checkbox" checked={plan.isPopular} onChange={e => updatePlan(pi, 'isPopular', e.target.checked)} />
                        Most Popular?
                      </label>
                    </div>

                    <div className="admin-form-group" style={{ margin: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label className="admin-label" style={{ margin: 0 }}>Features</label>
                        <button type="button" className="admin-btn-secondary" style={{ padding: '2px 8px', fontSize: 11 }}
                          onClick={() => addFeature(pi)}>+ Add</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {plan.features.map((feat: string, fi: number) => (
                          <div key={fi} style={{ display: 'flex', gap: 6 }}>
                            <input className="admin-input" style={{ fontSize: 13 }} placeholder="e.g. No. of Keywords - Up to 10" value={feat} onChange={e => updateFeature(pi, fi, e.target.value)} />
                            <button type="button" className="admin-btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeFeature(pi, fi)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO METADATA SECTION */}
            <div className="admin-card" style={{ background: '#f8fafc', padding: 15 }}>
               <h4 style={{ margin: '0 0 10px 0' }}>🔍 SEO Metadata</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Title</label>
                   <input className="admin-input" placeholder="e.g. Best SEO Packages | G Digital India"
                     value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
                 </div>
                 <div className="admin-form-group" style={{ margin: 0 }}>
                   <label className="admin-label">Meta Description</label>
                   <textarea className="admin-input" placeholder="e.g. Check our affordable SEO packages..." style={{ minHeight: 80 }}
                     value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} />
                 </div>
               </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={submitting} className="admin-btn-primary" style={{ padding: '12px 32px' }}>
                {submitting ? '⏳ Saving...' : '💾 Save Package'}
              </button>
            </div>
          </form>
        </div>
      )}

      {packages.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📦</div>
            <p className="admin-empty-text">No packages added yet</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {packages.map(p => (
            <div key={p._id} className="admin-card" style={{ padding: 25 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 20 }}>{p.title}</h3>
                  <span className="admin-badge primary" style={{ marginTop: 5 }}>{p.category}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => editOne(p)} className="admin-btn-secondary" style={{ padding: '6px 10px' }}>✏️</button>
                  <button onClick={() => deleteOne(p._id)} className="admin-btn-danger" style={{ padding: '6px 10px' }}>🗑️</button>
                </div>
              </div>
              <div style={{ color: '#64748b', fontSize: 14, marginBottom: 15 }}>
                {p.plans?.length || 0} Pricing Plans added
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.plans?.map((plan, i) => <span key={i} className="admin-badge info" style={{ fontSize: 11 }}>{plan.name}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
