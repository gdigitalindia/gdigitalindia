"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import styles from "./Testimonials.module.css"

interface TestimonialData {
  _id: string
  name: string
  role: string
  company: string
  review: string
  rating?: number
  metric?: string | { val: string; label: string }
  avatar?: string
  initials?: string
  industry?: string
  short?: string
  color?: string
}

const COLORS = ["#6de8b8", "#6d9fe8", "#e86db7", "#e8b26d", "#a36de8"]

const StarRating = ({ count }: { count: number }) => (
  <div className={styles["tm-stars"]}>
    {Array.from({ length: Math.min(5, Math.max(0, count)) }).map((_, i) => (
      <span key={i} className={styles["tm-star"]}>★</span>
    ))}
  </div>
)

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const [animDir, setAnimDir] = useState("next")
  const [animating, setAnimating] = useState(false)

  const autoRef = useRef<NodeJS.Timeout | null>(null)
  const auroraRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials')
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setTestimonials(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const goTo = useCallback((idx: number, dir: string) => {
    if (animating || idx === active || testimonials.length === 0) return

    setAnimDir(dir)
    setAnimating(true)

    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 320)
  }, [animating, active, testimonials.length])

  const next = useCallback(() => {
    if (testimonials.length === 0) return
    const index = (active + 1) % testimonials.length
    goTo(index, "next")
  }, [active, goTo, testimonials.length])

  const prev = useCallback(() => {
    if (testimonials.length === 0) return
    const index = (active - 1 + testimonials.length) % testimonials.length
    goTo(index, "prev")
  }, [active, goTo, testimonials.length])

  useEffect(() => {
    if (testimonials.length === 0) return

    autoRef.current = setInterval(() => {
      setActive((curr) => {
        const nextIdx = (curr + 1) % testimonials.length
        setAnimDir("next")
        setAnimating(true)
        setTimeout(() => {
          setAnimating(false)
        }, 320)
        return nextIdx
      })
    }, 5500)

    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
    }
  }, [testimonials.length])

  const resetTimer = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    if (testimonials.length === 0) return

    autoRef.current = setInterval(() => {
      setActive((curr) => {
        const nextIdx = (curr + 1) % testimonials.length
        setAnimDir("next")
        setAnimating(true)
        setTimeout(() => {
          setAnimating(false)
        }, 320)
        return nextIdx
      })
    }, 5500)
  }

  if (loading) return (
    <div className={styles.tm} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading Stories...</p>
    </div>
  )

  if (testimonials.length === 0) return null

  // Ensure active is always within valid bounds
  const currentIndex = isNaN(active) || active >= testimonials.length ? 0 : active
  const t = testimonials[currentIndex]
  
  if (!t) return null

  const tColor = t.color || COLORS[currentIndex % COLORS.length]
  const tInitials = t.initials || t.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
  
  // Metric parsing: Robustly handle "Val Label" strings or objects
  const tMetric = typeof t.metric === 'string'
    ? { val: t.metric.split(' ')[0], label: t.metric.split(' ').slice(1).join(' ') }
    : t.metric || { val: "100%", label: "Satisfaction" }

  const tShort = t.short || (t.review?.length > 60 ? t.review.substring(0, 60) + "..." : t.review) || ""
  const tIndustry = t.industry || "Technology"

  return (
    <section className={styles.tm}>

      <canvas ref={auroraRef} className={styles["tm-aurora-canvas"]} />

      <div className={styles["tm-wrap"]}>

        <div className={styles["tm-header"]}>
          <div className={styles["tm-eyebrow"]}>
            <div className={styles["tm-eyebrow-line"]} />
            <span>Client Stories</span>
            <div className={styles["tm-eyebrow-line"]} />
          </div>

          <h2 className={styles["tm-title"]}>
            Don&apos;t Take Our <br />
            <em>Word For It.</em>
          </h2>

          <p className={styles["tm-subtitle"]}>
            Real words from real founders who took the leap.
          </p>
        </div>

        <div className={styles["tm-stage"]}>

          <button
            className={`${styles["tm-nav"]} ${styles["tm-nav-prev"]}`}
            onClick={() => {
              prev()
              resetTimer()
            }}
          >
            ←
          </button>

          <div
            className={`${styles["tm-card"]} ${
              animating
                ? styles[`tm-card-out-${animDir}`]
                : styles[`tm-card-in-${animDir}`]
            }`}
            style={{ "--tm-color": tColor } as React.CSSProperties}
          >

            <div className={styles["tm-quote-mark"]}>&quot;</div>

            <div className={styles["tm-metric"]}>
              <span className={styles["tm-metric-val"]}>{tMetric.val}</span>
              <span className={styles["tm-metric-lbl"]}>{tMetric.label}</span>
            </div>

            <StarRating count={t.rating || 5} />

            <p className={styles["tm-short"]}>&quot;{tShort}&quot;</p>

            <div className={styles["tm-text"]} dangerouslySetInnerHTML={{ __html: t.review }} />

            <div className={styles["tm-author"]}>

              <div className={styles["tm-avatar"]}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span className={styles["tm-avatar-initials"]}>{tInitials}</span>
                )}
                <div className={styles["tm-avatar-ring"]} />
              </div>

              <div className={styles["tm-author-info"]}>
                <strong className={styles["tm-author-name"]}>{t.name}</strong>

                <span className={styles["tm-author-role"]}>
                  {t.role}, {t.company}
                </span>

                <span className={styles["tm-author-industry"]}>
                  {tIndustry}
                </span>
              </div>

              <div className={styles["tm-company-badge"]}>
                <span>{t.company}</span>
              </div>

            </div>

            <div className={styles["tm-card-glow"]} />

          </div>

          <button
            className={`${styles["tm-nav"]} ${styles["tm-nav-next"]}`}
            onClick={() => {
              next()
              resetTimer()
            }}
          >
            →
          </button>

        </div>

        <div className={styles["tm-dots"]}>
          {testimonials.map((item, i) => (
            <button
              key={item._id}
              className={`${styles["tm-dot"]} ${
                i === currentIndex ? styles["tm-dot-active"] : ""
              }`}
              style={{ "--tm-color": item.color || COLORS[i % COLORS.length] } as React.CSSProperties}
              onClick={() => {
                goTo(i, i > currentIndex ? "next" : "prev")
                resetTimer()
              }}
            />
          ))}
        </div>

        <div className={styles["tm-mini-row"]}>
          {testimonials.map((item, i) => {
            const m = typeof item.metric === 'string'
              ? { val: item.metric.split(' ')[0] }
              : item.metric || { val: "100%" }
            const ini = item.initials || item.name.split(' ').map(n => n[0]).join('').toUpperCase()
            
            return (
              <button
                key={item._id}
                className={`${styles["tm-mini"]} ${
                  i === currentIndex ? styles["tm-mini-active"] : ""
                }`}
                style={{ "--tm-color": item.color || COLORS[i % COLORS.length] } as React.CSSProperties}
                onClick={() => {
                  goTo(i, i > currentIndex ? "next" : "prev")
                  resetTimer()
                }}
              >

                <div className={styles["tm-mini-avatar"]}>
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span>{ini}</span>
                  )}
                </div>

                <div className={styles["tm-mini-info"]}>
                  <span className={styles["tm-mini-name"]}>{item.name}</span>
                  <span className={styles["tm-mini-co"]}>{item.company}</span>
                </div>

                <div className={styles["tm-mini-metric"]}>
                  <span>{m.val}</span>
                </div>

              </button>
            )
          })}
        </div>

      </div>
    </section>
  )
}