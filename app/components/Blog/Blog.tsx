"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import styles from "./Blog.module.css"

const tickerItems = [
  "SEO","·","Content Strategy","·","Paid Media","·","Social Media","·",
  "Analytics","·","Email Marketing","·","Brand Growth","·","CRO","·",
  "SEO","·","Content Strategy","·","Paid Media","·","Social Media","·",
  "Analytics","·","Email Marketing","·","Brand Growth","·","CRO","·",
]

interface Blog {
  _id: string
  slug: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
  image: string
  featured: boolean
}

export default function BlogSection({ initialData }: { initialData?: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialData || [])
  const [loading, setLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData && initialData.length > 0) return;
    const fetchBlogs = async () => {

      try {
        const res = await fetch("/api/blogs")
        if (res.ok) {
          const data = await res.json()
          setBlogs(data)
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <section className={styles.bl}>
        <div className={styles["bl-wrap"]} style={{ textAlign: "center", padding: "100px 0" }}>
          <p>Loading blogs...</p>
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null; // hide section if no blogs exist
  }

  // Find featured post (or just pick the first one if none explicitly featured)
  let featured = blogs.find((p) => p.featured)
  if (!featured) featured = blogs[0]

  // Filter out the featured post from the rest and limit to 3 to show exactly 4 blogs total
  const rest = blogs.filter((p) => p._id !== featured?._id).slice(0, 3)

  return (
    <section className={styles.bl}>

      {/* Background — same as About */}
      <div className={styles["bl-bg"]}>
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
          alt="bg"
          width={800}
          height={600}
          className={styles["bl-bg-img"]}
        />
        <div className={styles["bl-bg-overlay"]} />
        <div className={`${styles["bl-orb"]} ${styles["bl-orb-1"]}`} />
        <div className={`${styles["bl-orb"]} ${styles["bl-orb-2"]}`} />
        <div className={`${styles["bl-orb"]} ${styles["bl-orb-3"]}`} />
        <div className={styles["bl-grid"]} />
      </div>

      <div className={styles["bl-wrap"]}>

        {/* Eyebrow */}
        <div className={styles["bl-eyebrow"]}>
          <div className={styles["bl-eyebrow-line"]} />
          <span>From the Blog</span>
          <div className={styles["bl-eyebrow-line"]} />
        </div>

        {/* Hero text */}
        <div className={styles["bl-hero-text"]}>
          <h2 className={styles["bl-title"]}>
            Insights That
            <br />
            Actually <em>Move Brands.</em>
          </h2>
          <p className={styles["bl-tagline"]}>
            Strategy, creativity, and data — distilled into ideas you can use today.
          </p>
        </div>

        {/* Featured post */}
        {featured && (
            <Link href={`/blogs/${featured.slug}`} className={styles["bl-featured"]}>
            <div className={styles["bl-feat-img-wrap"]}>
                <Image
                src={featured.image}
                alt={featured.title}
                width={800}
                height={500}
                className={styles["bl-feat-img"]}
                />
                <div className={styles["bl-feat-overlay"]} />
                <div className={styles["bl-feat-badge"]}>
                <span className={styles["bl-badge-num"]}>01</span>
                <span className={styles["bl-badge-txt"]}>
                    Featured<br />Post
                </span>
                </div>
                <span className={styles["bl-cat-pill"]}>{featured.category}</span>
            </div>

            <div className={styles["bl-feat-content"]}>
                <div className={styles["bl-feat-meta"]}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', color: '#c8a05a' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{featured.date}</span>
                </div>
                <h3 className={styles["bl-feat-title"]}>{featured.title}</h3>
                <p className={styles["bl-feat-excerpt"]}>{featured.excerpt}</p>
                <div className={styles["bl-feat-footer"]}>
                <span className={styles["bl-feat-author"]}>By {featured.author}</span>
                <span className={styles["bl-read-more"]}>Read Article →</span>
                </div>
            </div>
            </Link>
        )}

        {/* Grid */}
        <div className={styles["bl-grid-posts"]}>
          {rest.map((post, i) => (
            <Link href={`/blogs/${post.slug}`} key={post.slug} className={styles["bl-card"]}>
              <div className={styles["bl-card-img-wrap"]}>
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={240}
                  className={styles["bl-card-img"]}
                />
                <div className={styles["bl-card-overlay"]} />
                <span className={styles["bl-card-cat"]}>{post.category}</span>
              </div>
              <div className={styles["bl-card-body"]}>
                <div className={styles["bl-card-meta"]}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', color: '#c8a05a' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{post.date}</span>
                </div>
                <h3 className={styles["bl-card-title"]}>{post.title}</h3>
                <p className={styles["bl-card-excerpt"]}>{post.excerpt}</p>
                <div className={styles["bl-card-footer"]}>
                  <span className={styles["bl-card-author"]}>By {post.author}</span>
                  <span className={styles["bl-card-arrow"]}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className={styles["bl-cta-wrap"]}>
          <Link href="/blogs" className={styles["bl-btn"]}>
            View All Articles →
          </Link>
        </div>

        {/* Ticker — same as About */}
        <div className={styles["bl-ticker"]}>
          <div className={styles["bl-ticker-track"]}>
            {tickerItems.map((item, i) => (
              <span
                key={i}
                className={item === "·" ? styles["bl-dot"] : styles["bl-tick-item"]}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
