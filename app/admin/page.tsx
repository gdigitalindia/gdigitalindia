import { connectDB } from '@/lib/mongodb'
import Project from '@/models/Project'
import Gallery from '@/models/Gallery'
import Testimonial from '@/models/Testimonial'
import Enquiry from '@/models/Enquiry'
import Service from '@/models/Service'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await connectDB()

  // Fetch all counts concurrently with fallback for DB disconnect
  let counts = [0, 0, 0, 0, 0];
  let recentEnquiries: any[] = [];

  try {
    const [c, re] = await Promise.all([
      Promise.all([
        Project.countDocuments().catch(() => 0),
        Gallery.countDocuments().catch(() => 0),
        Testimonial.countDocuments().catch(() => 0),
        Enquiry.countDocuments().catch(() => 0),
        Service.countDocuments().catch(() => 0)
      ]),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).catch(() => [])
    ]);
    counts = c;
    recentEnquiries = re;
  } catch (err: any) {
    console.warn("⚠️ Dashboard data fetch failed:", err.message);
  }
  const [projectCount, galleryCount, testimonialCount, enquiryCount, serviceCount] = counts;

  const stats = [
    { label: 'Projects', value: projectCount.toString(), icon: <i className="fa-solid fa-folder-open" style={{ color: "#2563eb" }}></i>, color: 'blue' },
    { label: 'Services', value: serviceCount.toString(), icon: <i className="fa-solid fa-briefcase" style={{ color: "#6e5daa" }}></i>, color: 'indigo' },
    { label: 'Gallery', value: galleryCount.toString(), icon: <i className="fa-solid fa-images" style={{ color: "#10b981" }}></i>, color: 'green' },
    { label: 'Testimonials', value: testimonialCount.toString(), icon: <i className="fa-solid fa-star" style={{ color: "#f59e0b" }}></i>, color: 'yellow' },
    { label: 'Enquiries', value: enquiryCount.toString(), icon: <i className="fa-solid fa-envelope" style={{ color: "#8b5cf6" }}></i>, color: 'purple' },
  ]

  const quickActions = [
    { href: '/admin/projects/new', icon: <i className="fa-solid fa-plus"></i>, label: 'Add New Project' },
    { href: '/admin/services', icon: <i className="fa-solid fa-plus"></i>, label: 'Add Service' },
    { href: '/admin/gallery', icon: <i className="fa-solid fa-plus"></i>, label: 'Upload Gallery' },
    { href: '/admin/testimonials', icon: <i className="fa-solid fa-plus"></i>, label: 'Add Testimonial' },
    { href: '/admin/enquiries', icon: <i className="fa-solid fa-plus"></i>, label: 'View Enquiries' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back! Here&apos;s an overview of your website content.</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`admin-stat-card ${stat.color}`}>
            <div className={`admin-stat-icon ${stat.color}`}>
              <span>{stat.icon}</span>
            </div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">{stat.label}</p>
              <p className="admin-stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">⚡ Quick Actions</h2>
        </div>
        <div className="admin-quick-actions">
          {quickActions.map((action) => (
            <a key={action.href} href={action.href} className="admin-quick-btn">
              <span className="btn-icon">{action.icon}</span>
              <span>{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">📋 Recent Enquiries</h2>
          <a href="/admin/enquiries" className="admin-badge info" style={{ textDecoration: 'none' }}>View All</a>
        </div>
        
        {recentEnquiries.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📭</div>
            <p className="admin-empty-text">No enquiries yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentEnquiries.map((enq) => (
              <div key={enq._id} style={{ padding: '15px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: 14 }}>{enq.name}</p>
                  <p style={{ color: '#64748b', margin: 0, fontSize: 12 }}>{enq.email} • {enq.service || 'General Enquiry'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </p>
                  <a href="/admin/enquiries" style={{ fontSize: 12, color: 'var(--admin-primary)', textDecoration: 'none' }}>View →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
