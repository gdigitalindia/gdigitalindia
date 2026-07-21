"use client"

import { useEffect, useState } from "react"
import styles from "./Clients.module.css"

interface Counter {
  label: string
  value: string
}

export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [stats, setStats] = useState<Counter[]>([
    { value: "150+", label: "Happy Clients" },
    { value: "₹50Cr+", label: "Revenue Generated" },
    { value: "12", label: "Industries Served" },
    { value: "98%", label: "Retention Rate" }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats
    fetch("/api/settings", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.counters && data.counters.length > 0) {
          setStats(data.counters)
        }
      })
      .catch(err => console.error("Failed to fetch client stats:", err))

    // Fetch clients
    fetch("/api/clients")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setClients(data)
      })
      .catch(err => console.error("Failed to fetch clients:", err))
      .finally(() => setLoading(false))
  }, [])

  // Split clients into two halves for the two marquee rows
  const half = Math.ceil(clients.length / 2)
  const row1 = clients.slice(0, half)
  const row2 = clients.slice(half)

  // If no clients yet and still loading, show a placeholder row or loading state
  if (clients.length === 0 && loading) return null;

  return (
    <section className={styles.cl}>

      <div className={styles["cl-bg"]}>
        <div className={`${styles["cl-bg-glow"]} ${styles["cl-bg-glow-1"]}`} />
        <div className={`${styles["cl-bg-glow"]} ${styles["cl-bg-glow-2"]}`} />
      </div>

      <div className={styles["cl-wrap"]}>

        {/* Header */}
        <div className={styles["cl-header"]}>
          <div className={styles["cl-header-inner"]}>
            <div className={styles["cl-dash"]} />
            <span className={styles["cl-eyebrow"]}>Trusted By</span>
            <div className={styles["cl-dash"]} />
          </div>

          <h2 className={styles["cl-title"]}>
            Brands That <em>Chose</em> Growth
          </h2>

          <p className={styles["cl-desc"]}>
            From emerging startups to established enterprises — these are the brands
            we helped dominate their markets.
          </p>
        </div>

        {/* Stats */}
        <div className={styles["cl-stats"]}>
          {stats.map((s, i) => (
            <div className={styles["cl-stat"]} key={i}>
              <span className={styles["cl-stat-val"]}>{s.value}</span>
              <span className={styles["cl-stat-lbl"]}>{s.label}</span>
            </div>
          ))}
        </div>

        {clients.length > 0 && (
          <>
            {/* Marquee Row 1 */}
            <div className={styles["cl-marquee-wrap"]}>
              <div className={styles["cl-fade-left"]} />
              <div className={styles["cl-fade-right"]} />

              <div className={styles["cl-marquee"]}>
                <div className={`${styles["cl-marquee-track"]} ${styles["cl-track-fwd"]}`}>
                  {[...row1, ...row1, ...row1].map((c, i) => (
                    <div className={styles["cl-logo-card"]} key={i}>
                      <div className={styles["cl-logo-inner"]}>
                        <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          <img src={c.logoUrl} alt={c.name} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'grayscale(1) brightness(1.5)', opacity: 0.8 }} />
                        </div>
                        <span className={styles["cl-logo-name"]}>{c.name}</span>
                        <span className={styles["cl-logo-industry"]}>{c.industry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Marquee Row 2 */}
            <div className={styles["cl-marquee-wrap"]} style={{ marginTop: 20 }}>
              <div className={styles["cl-fade-left"]} />
              <div className={styles["cl-fade-right"]} />

              <div className={styles["cl-marquee"]}>
                <div className={`${styles["cl-marquee-track"]} ${styles["cl-track-rev"]}`}>
                  {[...row2, ...row2, ...row2].map((c, i) => (
                    <div className={styles["cl-logo-card"]} key={i}>
                      <div className={styles["cl-logo-inner"]}>
                        <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          <img src={c.logoUrl} alt={c.name} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'grayscale(1) brightness(1.5)', opacity: 0.8 }} />
                        </div>
                        <span className={styles["cl-logo-name"]}>{c.name}</span>
                        <span className={styles["cl-logo-industry"]}>{c.industry}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        <div className={styles["cl-bottom"]}>
          <p className={styles["cl-bottom-text"]}>
            Ready to join them?
          </p>

          <button className={styles["cl-cta"]} onClick={() => window.location.href = '/contact'}>
            Start Your Growth Journey →
          </button>
        </div>

      </div>
    </section>
  )
}