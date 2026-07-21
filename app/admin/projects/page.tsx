'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project {
  _id: string
  title: string
  category: string
  image: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  order: number
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) setProjects(await res.json())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) setProjects(p => p.filter(x => x._id !== id))
    else alert('Failed to delete')
  }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading projects...</p>
    </div>
  )

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="admin-page-title">💼 Projects</h1>
          <p className="admin-page-subtitle">Add, edit or remove your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary" style={{ textDecoration: 'none' }}>
          ➕ Add New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <div className="admin-empty-icon">📭</div>
            <p className="admin-empty-text">No projects yet</p>
            <p className="admin-empty-sub">Click "Add New Project" to get started</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {projects.map((project) => (
            <div key={project._id} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Image */}
              <div style={{ position: 'relative' }}>
                <img
                  src={project.image || 'https://via.placeholder.com/400x180?text=No+Image'}
                  alt={project.title}
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
                <span className="admin-badge info" style={{ position: 'absolute', top: 10, right: 10 }}>
                  {project.category}
                </span>
              </div>
              {/* Content */}
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--admin-text-primary)', marginBottom: 6 }}>
                  {project.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', lineHeight: 1.5, marginBottom: 12,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {project.technologies?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="admin-badge info" style={{ fontSize: 11 }}>{tech}</span>
                  ))}
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    href={`/admin/projects/${project._id}/edit`}
                    className="admin-btn-secondary"
                    style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: 13, padding: '8px 12px' }}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="admin-btn-danger"
                    style={{ flex: 1, justifyContent: 'center', fontSize: 13 }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
