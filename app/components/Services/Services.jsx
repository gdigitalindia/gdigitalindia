"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./Services.module.css"

const defaultServices = [
  {
    id: "01",
    _id: "loading",
    slug: "loading",
    title: "Loading Services...",
    short: "...",
    desc: "Fetching services from the database...",
    highlight: "",
    tags: [],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
    color: "#e8b86d",
  }
]

const colors = ["#e8b86d", "#6d9fe8", "#e86d9f", "#6de8b8", "#b86de8", "#e8d06d"]

export default function Services({ initialData }) {
  const canvasRef = useRef(null)

  const [services, setServices] = useState(initialData && initialData.length > 0 ? initialData : defaultServices)
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (initialData && initialData.length > 0) return;
    fetch('/api/service-categories')

      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((s, i) => ({
            id: (i + 1).toString().padStart(2, '0'),
            _id: s._id,
            slug: s.slug || s._id,
            title: s.title || s.name || 'Untitled Category',
            short: s.name || s.title || 'CAT',
            desc: s.description || '',
            highlight: s.highlight || '',
            tags: s.tags || [],
            img: s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
            color: colors[i % colors.length]
          }))
          setServices(mapped)
        }
      })
      .catch(console.error)
  }, [])

  const svc = (services && services.length > 0) ? (services[active] || services[0] || defaultServices[0]) : defaultServices[0]

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.4 + 0.05,
    }))

    const draw = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const accent = services[active]?.color || "#e8b86d"

      particles.forEach((p) => {

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)

        ctx.fillStyle =
          accent +
          Math.floor(p.opacity * 255)
            .toString(16)
            .padStart(2, "0")

        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }

  }, [active, services])


  const handleSelect = (idx) => {

    if (idx === active) return

    setAnimating(true)

    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 220)
  }


  return (
    <section className={styles.sv}>

      <canvas ref={canvasRef} className={styles["sv-canvas"]} />

      <div className={styles["sv-wrap"]}>

        <div className={styles["sv-header"]}>

          <div className={styles["sv-header-left"]}>
            <span className={styles["sv-label"]}>What We Do</span>

            <h2 className={styles["sv-heading"]}>
              Services Built for <br />
              <em>Real Growth</em>
            </h2>
          </div>

          <p className={styles["sv-header-desc"]}>
            Our core services. One unified goal — to make your brand the most recognisable.
          </p>

        </div>

        <div className={styles["sv-grid"]}>

          <div className={styles["sv-list"]}>

            {services.map((s, i) => (

              <button
                key={s._id}
                className={`${styles["sv-item"]} ${i === active ? styles["sv-item-active"] : ""}`}
                onClick={() => handleSelect(i)}
                style={{ "--svc-color": s.color }}
              >

                <span className={styles["sv-item-num"]}>{s.id}</span>
                <span className={styles["sv-item-short"]}>{s.short}</span>
                <span className={styles["sv-item-name"]}>{s.title}</span>
                <span className={styles["sv-item-arrow"]}>→</span>

              </button>

            ))}

          </div>

          {svc && (
            <div
              className={`${styles["sv-detail"]} ${
                animating ? styles["sv-detail-out"] : styles["sv-detail-in"]
              }`}
              style={{ "--svc-color": svc.color }}
            >

            <div className={styles["sv-detail-img-wrap"]}>

              <Image
                src={svc.img}
                alt={svc.title}
                width={600}
                height={400}
                className={styles["sv-detail-img"]}
              />

            </div>

            <div className={styles["sv-detail-body"]}>

              <span className={styles["sv-detail-short"]}>{svc.short}</span>

              <h3 className={styles["sv-detail-title"]}>{svc.title}</h3>

              <div className={styles["sv-detail-desc"]} dangerouslySetInnerHTML={{ __html: svc.desc }} />

              {svc.highlight && (
                <div className={styles["sv-highlight"]}>
                  <span className={styles["sv-highlight-bar"]} />
                    <span className={styles["sv-highlight-text"]}>{svc.highlight}</span>
                </div>
              )}

              <div className={styles["sv-tags"]}>
                {svc.tags.map((t) => (
                  <span key={t} className={styles["sv-tag"]}>
                    {t}
                  </span>
                ))}
              </div>

              <Link href={`/services-category/${svc.slug}`} className={styles["sv-cta"]}>
                Get Started →
              </Link>

            </div>

            </div>
          )}

        </div>

      </div>

    </section>
  )
}