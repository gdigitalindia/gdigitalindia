"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import styles from "../components/Services/Services.module.css"
import Link from "next/link"

// Color palette for services
const colorPalette = ["#e8b86d", "#6d9fe8", "#e86d9f", "#6de8b8", "#b86de8", "#e8d06d"]

interface Service {
  _id?: string
  id?: string
  slug?: string
  title: string
  short: string
  description?: string
  desc?: string
  highlight?: string
  tags?: string[]
  image?: string
  img?: string
  color?: string
  order?: number
}

export default function Services() {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/service-categories")
        if (!res.ok) throw new Error("Failed to fetch categories")
        const data = await res.json()
        
        // Transform API data to match component expectations and add colors
        const transformedData = data.map((category: any, index: number) => ({
          _id: category._id,
          id: String(index + 1).padStart(2, "0"),
          title: category.title || category.name,
          short: category.name || category.title,
          desc: category.description || "",
          highlight: category.highlight || "",
          tags: category.tags || [],
          img: category.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
          color: colorPalette[index % colorPalette.length],
          slug: category.slug,
        }))
        
        setServices(transformedData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const svc = services[active]

  // Canvas animation effect
  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas || !svc) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let animId: number

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

      const accent = svc?.color || "#e8b86d"

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

  }, [active])


  const handleSelect = (idx: number) => {

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
            {loading ? "Loading services..." : `${services.length} services. One unified goal — to make your brand the most recognisable.`}
          </p>

        </div>

        {error && (
          <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p>Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p>No services available</p>
          </div>
        ) : (
          <div className={styles["sv-grid"]}>

            <div className={styles["sv-list"]}>

              {services.map((s, i) => (

                <button
                  key={s._id || i}
                  className={`${styles["sv-item"]} ${i === active ? styles["sv-item-active"] : ""}`}
                  onClick={() => handleSelect(i)}
                  style={{ "--svc-color": s.color } as React.CSSProperties}
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
                style={{ "--svc-color": svc.color } as React.CSSProperties}
              >

                <div className={styles["sv-detail-img-wrap"]}>

                  <Image
                    src={svc.img || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"}
                    alt={svc.title}
                    width={600}
                    height={400}
                    className={styles["sv-detail-img"]}
                  />

                </div>

                <div className={styles["sv-detail-body"]}>

                  <span className={styles["sv-detail-short"]}>{svc.short}</span>

                  <h3 className={styles["sv-detail-title"]}>{svc.title}</h3>

                  <p className={styles["sv-detail-desc"]}>{svc.desc}</p>

                  {svc.highlight && (
                    <div className={styles["sv-highlight"]}>
                      <span className={styles["sv-highlight-bar"]} />
                      <span className={styles["sv-highlight-text"]}>{svc.highlight}</span>
                    </div>
                  )}

                  {svc.tags && svc.tags.length > 0 && (
                    <div className={styles["sv-tags"]}>
                      {svc.tags.map((t) => (
                        <span key={t} className={styles["sv-tag"]}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/services-category/${svc.slug || svc._id}`} className={styles["sv-cta"]}>
                    Get Started →
                  </Link>

                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </section>
  )
}