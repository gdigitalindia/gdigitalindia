"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./About.module.css"

export default function AboutSection({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  
  useEffect(() => {
    if (initialData) return;
    const fetchAbout = async () => {

      try {
        const res = await fetch('/api/about')
        if (res.ok) {
          const fetchedData = await res.json()
          if(fetchedData && Object.keys(fetchedData).length > 0 && fetchedData.titleHTML) {
            setData(fetchedData)
          }
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  if (loading) return null;
  if (!data) return null; // Hide section if no data configured

  const defaultValues = [
    { icon: "◎", title: "Strategy First", desc: "Every campaign starts with deep research & a custom growth blueprint." },
    { icon: "◈", title: "Creative That Converts", desc: "Visuals and copy engineered to stop the scroll and drive action." },
    { icon: "◉", title: "Data-Driven Always", desc: "Real-time analytics, A/B testing, and continuous optimisation." }
  ]

  const tickerItems = [
    "SEO","·","Paid Media","·","Social Strategy","·","Content Marketing","·",
    "Web Design","·","Email Funnels","·","Analytics","·","Brand Identity","·",
    "SEO","·","Paid Media","·","Social Strategy","·","Content Marketing","·",
    "Web Design","·","Email Funnels","·","Analytics","·","Brand Identity","·"
  ]

  const content = data;

  const createMarkup = (htmlStr: string) => {
    return { __html: htmlStr || "" };
  }

  return (
    <section className={styles.ab}>
      <div className={styles["ab-bg"]}>
        {content.bgImageUrl && (
          <Image
            src={content.bgImageUrl}
            alt="about background"
            width={1920}
            height={1080}
            className={styles["ab-bg-img"]}
            priority
          />
        )}
        <div className={styles["ab-bg-overlay"]} />
        <div className={`${styles["ab-orb"]} ${styles["ab-orb-1"]}`} />
        <div className={`${styles["ab-orb"]} ${styles["ab-orb-2"]}`} />
        <div className={`${styles["ab-orb"]} ${styles["ab-orb-3"]}`} />
        <div className={styles["ab-grid"]} />
      </div>

      <div className={styles["ab-wrap"]}>
        <div className={styles["ab-eyebrow"]}>
          <div className={styles["ab-eyebrow-line"]} />
          <span>{content.eyebrow}</span>
          <div className={styles["ab-eyebrow-line"]} />
        </div>

        <div className={styles["ab-hero-text"]}>
          <h2 className={styles["ab-title"]} dangerouslySetInnerHTML={createMarkup(content.titleHTML)} />
          <p className={styles["ab-tagline"]}>
            {content.tagline}
          </p>
        </div>

        <div className={styles["ab-split"]}>
          {/* IMAGE CARD */}
          <div className={styles["ab-img-card"]}>
            {content.imageUrl ? (
              <Image
                src={content.imageUrl}
                alt="Team working"
                width={600}
                height={800}
                className={styles["ab-card-img"]}
                style={{ objectFit: 'cover' }}
              />
            ) : (
                <div className={styles["ab-card-img"]} style={{ background: '#111' }} />
            )}
            <div className={styles["ab-card-badge"]}>
              <span className={styles["ab-badge-num"]}>{content.badgeNum}</span>
              <span className={styles["ab-badge-txt"]} dangerouslySetInnerHTML={createMarkup(content.badgeText)} />
            </div>
            <div className={styles["ab-card-glow"]} />
          </div>

          {/* CONTENT */}
          <div className={styles["ab-content"]}>
            <p className={styles["ab-para"]} dangerouslySetInnerHTML={createMarkup(content.para1)} />
            
            {content.para2 && (
              <p className={styles["ab-para"]} dangerouslySetInnerHTML={createMarkup(content.para2)} />
            )}

            {content.values && content.values.length > 0 && (
              <div className={styles["ab-values"]}>
                {content.values.map((v: any, idx: number) => (
                  <div className={styles["ab-val-item"]} key={idx}>
                    <span className={styles["ab-val-icon"]}>
                      {v.icon && v.icon.includes('fa-') ? <i className={v.icon}></i> : v.icon}
                    </span>
                    <div>
                      <strong className={styles["ab-val-title"]}>
                        {v.title}
                      </strong>
                      <p className={styles["ab-val-desc"]}>
                        {v.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className={styles["ab-btn"]} onClick={() => { window.location.href = content.btnLink }}>
              {content.btnText}
            </button>
          </div>
        </div>

        {/* TICKER */}
        <div className={styles["ab-ticker"]}>
          <div className={styles["ab-ticker-track"]}>
            {tickerItems.map((item, i) => (
              <span
                key={i}
                className={item === "·" ? styles["ab-dot"] : styles["ab-tick-item"]}
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