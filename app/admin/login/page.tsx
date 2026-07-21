'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../layout.css'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('adminLoggedIn') === 'true') {
      router.push('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate small delay for UX
    await new Promise(r => setTimeout(r, 500))

    if (password === 'admin123') {
      sessionStorage.setItem('adminLoggedIn', 'true')
      router.push('/admin')
    } else {
      setError('❌ Invalid password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <style>{`.navbar, footer { display: none !important; }`}</style>
      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-logo">GDI</div>

        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">Enter your password to access the admin panel</p>

        <form onSubmit={handleSubmit}>
          <label className="admin-login-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login-input"
            placeholder="Enter admin password"
            autoComplete="current-password"
          />

          {error && (
            <div className="admin-login-error">{error}</div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.75 : 1 }}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#334155' }}>
          Green Digital India — Admin Portal
        </p>
      </div>
    </div>
  )
}
