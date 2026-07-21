'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Script from 'next/script'
import './layout.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('adminLoggedIn') !== 'true') {
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    router.push('/admin/login')
  }

  const isActive = (path: string) => {
    if (!pathname) return false
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
  }

  // Hide login page from this layout
  if (pathname === '/admin/login') return <>{children}</>

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <i className="fa-solid fa-chart-pie"></i> },
    { href: '/admin/slider', label: 'Slider', icon: <i className="fa-solid fa-film"></i> },
    { href: '/admin/about', label: 'About', icon: <i className="fa-solid fa-address-card"></i> },
    { href: '/admin/service-categories', label: 'Service Categories', icon: <i className="fa-solid fa-list"></i> },
    { href: '/admin/services', label: 'Service Sub Categories', icon: <i className="fa-solid fa-briefcase"></i> },
    { href: '/admin/industries', label: 'Industries We Serve', icon: <i className="fa-solid fa-industry"></i> },
    { href: '/admin/projects', label: 'Projects', icon: <i className="fa-solid fa-folder-open"></i> },
    { href: '/admin/packages', label: 'Packages', icon: <i className="fa-solid fa-box-open"></i> },
    { href: '/admin/package-categories', label: 'Package Categories', icon: <i className="fa-solid fa-tags"></i> },
    {href: '/admin/gallery', label: 'Gallery', icon: <i className="fa-solid fa-images"></i> },
    { href: '/admin/testimonials', label: 'Testimonials', icon: <i className="fa-solid fa-star"></i> },
    { href: '/admin/clients', label: 'Clients', icon: <i className="fa-solid fa-handshake"></i> },
    { href: '/admin/reels', label: 'YouTube Shorts', icon: <i className="fa-brands fa-youtube"></i> },
    { href: '/admin/blogs', label: 'Blogs', icon: <i className="fa-solid fa-pen-nib"></i> },
    { href: '/admin/legal', label: 'Legal Policies', icon: <i className="fa-solid fa-shield-halved"></i> },
    { href: '/admin/enquiries', label: 'Enquiries', icon: <i className="fa-solid fa-envelope"></i> },
    { href: '/admin/settings', label: 'Settings', icon: <i className="fa-solid fa-gear"></i> },
  ]

  return (
    <div className="admin-root">
      {/* Hide root Navbar/Footer */}
      <style>{`
        .navbar, footer { display: none !important; }
      `}</style>

      {/* ── Header ── */}
      <header className="admin-header">
        <div className="admin-header-brand">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: 22,
              cursor: 'pointer',
              color: '#64748b',
              marginRight: 8,
            }}
            className="mobile-hamburger"
            aria-label="Toggle sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="admin-header-logo">
            <Link href="/" target='_blank'>
              <img src="/images/logo.png" alt="logo" />
            </Link>
          </div>
        </div>

        <div>
          <h1 className="admin-header-title">
            Admin <span>Panel</span>
          </h1>
        </div>

        <div className="admin-header-actions">
          <span className="admin-header-badge">● Live</span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <span><i className="fa-solid fa-right-from-bracket"></i></span> Logout
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="admin-body">
        {/* Sidebar */}
        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <p className="admin-nav-label">Main Menu</p>
          <nav className="admin-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-link${isActive(item.href) ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-link-icon">{item.icon}</span>
                <span className="admin-link-text">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-user">
              <div className="admin-sidebar-avatar">A</div>
              <div className="admin-sidebar-user-info">
                <p className="admin-sidebar-username">Administrator</p>
                <p className="admin-sidebar-role">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>

      {/* Font Awesome */}
      <Script src="https://kit.fontawesome.com/a076d05399.js" strategy="afterInteractive" />
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
      />
    </div>
  )
}
