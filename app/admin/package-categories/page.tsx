'use client'

import { useEffect, useState } from 'react'

interface Category {
  _id: string
  name: string
  slug: string
  order: number
}

export default function AdminPackageCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', order: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/package-categories')
      if (res.ok) setCategories(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setFormData({ ...formData, name, slug: editingId ? formData.slug : slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/package-categories/${editingId}` : '/api/package-categories'
    
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    })
    
    if (res.ok) { 
      setShowForm(false); setFormData({ name: '', slug: '', order: 0 }); setEditingId(null); fetchAll() 
    }
  }

  const editOne = (c: Category) => {
    setFormData({ name: c.name, slug: c.slug, order: c.order })
    setEditingId(c._id)
    setShowForm(true)
  }

  const deleteOne = async (id: string) => {
    if (!confirm('Delete this category?')) return
    const res = await fetch(`/api/package-categories/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAll()
  }

  if (loading) return <div className="admin-empty">Loading...</div>

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">📁 Package Categories</h1>
        <button className="admin-btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', slug: '', order: 0 }) }}>
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="admin-card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 15, alignItems: 'flex-end' }}>
            <div className="admin-form-group" style={{ margin: 0, flex: 2 }}>
              <label className="admin-label">Category Name</label>
              <input required className="admin-input" value={formData.name} onChange={handleNameChange} />
            </div>
            <div className="admin-form-group" style={{ margin: 0, flex: 2 }}>
              <label className="admin-label">Slug</label>
              <input required className="admin-input" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div className="admin-form-group" style={{ margin: 0, flex: 1 }}>
              <label className="admin-label">Order</label>
              <input type="number" className="admin-input" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
            </div>
            <button type="submit" className="admin-btn-primary">Save</button>
          </form>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {categories.map(c => (
          <div key={c._id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <strong style={{ fontSize: 18 }}>{c.name}</strong>
              <code style={{ marginLeft: 15, color: '#64748b' }}>{c.slug}</code>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => editOne(c)} className="admin-btn-secondary">Edit</button>
              <button onClick={() => deleteOne(c._id)} className="admin-btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
