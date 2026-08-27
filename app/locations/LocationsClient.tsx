'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './locations.module.css'

interface LocationItem {
  _id: string
  name: string
  slug: string
  state: string
  country: string
  tagline: string
  description: string
  officeAddress: string
  phone: string
  email: string
  image: string
  featured: boolean
}

export default function LocationsClient({ initialLocations }: { initialLocations: LocationItem[] }) {
  const [locations] = useState<LocationItem[]>(initialLocations || [])
  const [search, setSearch] = useState('')

  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase()) ||
    loc.state.toLowerCase().includes(search.toLowerCase()) ||
    loc.tagline.toLowerCase().includes(search.toLowerCase()) ||
    (loc.officeAddress && loc.officeAddress.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <main className={styles.locationsPage}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Our Presence
          </span>

          <h1 className={styles.heroTitle}>
            Delivering Digital Excellence <em>Across India</em>
          </h1>

          <p className={styles.heroSubtitle}>
            Whether you need localized SEO in Jaipur, performance marketing in Delhi NCR, or branding in Mumbai — we are here to fuel your growth.
          </p>

          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by city or state (e.g. Jaipur, Delhi, Maharashtra)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className={styles.statsBand}>
        <div className={styles.statsInner}>
          <div className={styles.statItem}>
            <div className={styles.statNum}>{locations.length > 0 ? `${locations.length}+` : '10+'}</div>
            <div className={styles.statLabel}>Key Cities Covered</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>2000+</div>
            <div className={styles.statLabel}>Successful Projects</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>95%</div>
            <div className={styles.statLabel}>Client Retention</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNum}>10+</div>
            <div className={styles.statLabel}>Years Industry Excellence</div>
          </div>
        </div>
      </section>

      {/* Locations Container */}
      <div className={styles.container}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(240, 236, 228, 0.6)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: 12 }}>No locations matched your search</h3>
            <p>Try searching for a different city name or browse our available locations.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(loc => {
              const fallbackImg = "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop"
              const imgUrl = loc.image || fallbackImg

              return (
                <Link key={loc._id} href={`/locations/${loc.slug}`} className={styles.card}>
                  <div className={styles.imgWrap}>
                    <Image
                      src={imgUrl}
                      alt={loc.name}
                      fill
                      className={styles.img}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.overlay} />
                    <span className={styles.stateBadge}>{loc.state || 'India'}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <h2 className={styles.locName}>{loc.name}</h2>
                    {loc.tagline && <p className={styles.locTagline}>{loc.tagline}</p>}

                    {loc.description && (
                      <p className={styles.locDesc}>
                        {loc.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').slice(0, 130)}
                        {loc.description.length > 130 ? '...' : ''}
                      </p>
                    )}

                    {(loc.officeAddress || loc.phone || loc.email) && (
                      <div className={styles.contactInfo}>
                        {loc.officeAddress && (
                          <div className={styles.infoItem}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8b86d" strokeWidth="2.2">
                              <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{loc.officeAddress}</span>
                          </div>
                        )}
                        {loc.phone && (
                          <div className={styles.infoItem}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8b86d" strokeWidth="2.2">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            <span>{loc.phone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <span>Explore {loc.name} Services</span>
                      <span className={styles.cardArrow}>→</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
