import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Location from '@/models/Location'
import Service from '@/models/Service'
import { Metadata } from 'next'
import ConsultationButton from '@/app/components/ConsultationButton/ConsultationButton'
import styles from '../locations.module.css'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    await connectDB()
    const loc = await Location.findOne({ $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }] }).lean() as any
    if (!loc) return { title: 'Location | G Digital India' }

    return {
      title: loc.metaTitle || `${loc.tagline || loc.name} | G Digital India`,
      description: loc.metaDescription || loc.description || `Leading Digital Marketing & Web Development Company in ${loc.name}.`,
      keywords: loc.metaKeywords || `digital marketing ${loc.name}, seo ${loc.name}, web design ${loc.name}`,
    }
  } catch {
    return { title: 'Location | G Digital India' }
  }
}

export const dynamic = 'force-dynamic'

const cleanNbsp = (html?: string) => {
  if (!html) return ''
  return html
    .replace(/&nbsp;/gi, ' ')
    .replace(/margin-left\s*:\s*-[^; "']+/gi, 'margin-left:0')
    .replace(/margin\s*:\s*-[^; "']+/gi, 'margin:0')
    .replace(/text-indent\s*:\s*-[^; "']+/gi, 'text-indent:0')
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let loc: any = null
  let services: any[] = []

  try {
    await connectDB()
    const locData = await Location.findOne({ $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }] }).lean()
    if (locData) {
      loc = JSON.parse(JSON.stringify(locData))
    }

    const servicesData = await Service.find().sort({ order: 1 }).limit(6).lean()
    services = JSON.parse(JSON.stringify(servicesData))
  } catch (err) {
    console.error('Location detail fetch error:', err)
  }

  if (!loc) {
    notFound()
  }

  const fallbackImg = "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop"
  const heroImg = loc.image || fallbackImg

  return (
    <main className={styles.locationsPage}>
      {/* Hero Banner */}
      <section className={styles.hero} style={{ textAlign: 'left', padding: '120px 24px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(240,236,228,0.5)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/locations" style={{ color: 'inherit', textDecoration: 'none' }}>Locations</Link>
              <span>/</span>
              <span style={{ color: '#e8b86d' }}>{loc.name}</span>
            </div>

            <span className={styles.stateBadge} style={{ position: 'static', display: 'inline-block', marginBottom: 16 }}>
              {loc.state || 'India'}
            </span>

            <h1 className={styles.heroTitle} style={{ textAlign: 'left', fontSize: '2.8rem' }}>
              Digital Marketing & Web Services in <em>{loc.name}</em>
            </h1>

            {loc.tagline && (
              <p style={{ fontSize: '1.2rem', color: '#e8b86d', marginBottom: 16, fontWeight: 500 }}>
                {loc.tagline}
              </p>
            )}

            {loc.description && (
              <p className={styles.heroSubtitle} style={{ textAlign: 'left', fontSize: '1rem', marginBottom: 28 }}>
                {loc.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
              </p>
            )}

            {/* Local Office Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
              {loc.officeAddress && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(240,236,228,0.8)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8b86d" strokeWidth="2">
                    <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span><strong>Office:</strong> {loc.officeAddress}</span>
                </div>
              )}
              {loc.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(240,236,228,0.8)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8b86d" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span><strong>Phone:</strong> {loc.phone}</span>
                </div>
              )}
              {loc.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(240,236,228,0.8)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8b86d" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span><strong>Email:</strong> {loc.email}</span>
                </div>
              )}
            </div>

            <ConsultationButton style={{ padding: '14px 32px', background: '#e8b86d', color: '#060810', borderRadius: 50, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              Get Free Consultation in {loc.name} →
            </ConsultationButton>
          </div>

          <div style={{ position: 'relative', height: 380, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Image
              src={heroImg}
              alt={loc.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,8,16,0.6) 0%, transparent 60%)' }} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 80px' }}>
        {loc.content && (
          <div style={{ margin: '0 0 60px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#fff', marginBottom: 24, borderLeft: '4px solid #e8b86d', paddingLeft: 16 }}>
              Overview & Digital Market in {loc.name}
            </h2>
            <div
              style={{ color: 'rgba(240,236,228,0.75)', lineHeight: 1.8, fontSize: '1.05rem', wordBreak: 'normal', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: cleanNbsp(loc.content) }}
            />
          </div>
        )}

        {/* Services Offered in Location */}
        {services.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', color: '#fff', marginBottom: 12 }}>
              Services We Offer in {loc.name}
            </h2>
            <p style={{ color: 'rgba(240,236,228,0.6)', marginBottom: 36 }}>
              End-to-end digital solutions designed to help businesses in {loc.name} dominate search rankings and generate revenue.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {services.map((svc: any) => (
                <Link
                  key={svc._id}
                  href={`/${svc.slug || svc._id}`}
                  style={{
                    display: 'block',
                    padding: 24,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: 8 }}>{svc.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(240,236,228,0.6)', lineHeight: 1.6, marginBottom: 16 }}>
                    {svc.short ? `${svc.short} services tailored for businesses in ${loc.name}.` : `Professional ${svc.title} services in ${loc.name}.`}
                  </p>
                  <span style={{ color: '#e8b86d', fontSize: 13, fontWeight: 600 }}>Explore Service →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action Box */}
        <div
          style={{
            marginTop: 80,
            padding: '48px 36px',
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(232,184,109,0.12) 0%, rgba(6,8,16,0.95) 100%)',
            border: '1px solid rgba(232,184,109,0.25)',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.2rem', color: '#fff', marginBottom: 16 }}>
            Ready to Expand Your Business in {loc.name}?
          </h2>
          <p style={{ maxWidth: 650, margin: '0 auto 28px', color: 'rgba(240,236,228,0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Connect with our digital marketing specialists today. We will audit your current online presence and build a custom strategy for {loc.name}.
          </p>
          <ConsultationButton style={{ padding: '16px 36px', background: '#e8b86d', color: '#060810', borderRadius: 50, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}>
            Book Your Strategy Call →
          </ConsultationButton>
        </div>
      </div>
    </main>
  )
}
