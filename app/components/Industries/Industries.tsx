"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Industries.module.css";

interface Industry {
  _id: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
  image?: string;
  order: number;
}

export default function Industries({ initialData }: { initialData?: Industry[] }) {
  const [items, setItems] = useState<Industry[]>(initialData || []);

  useEffect(() => {
    if (initialData && initialData.length > 0) return;
    fetch("/api/industries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(console.error);
  }, [initialData]);

  if (!items || items.length === 0) return null;

  return (
    <section className={styles.industriesSection} id="industries">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>INDUSTRIES WE SERVE</span>
          <h2 className={styles.title}>
            Tailored Solutions For <span>Your Industry</span>
          </h2>
          <p className={styles.subtitle}>
            We combine industry expertise with cutting-edge digital marketing to drive results that matter for your business.
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item._id} className={styles.card}>
              <div className={styles.cardBg} style={{ backgroundImage: item.image ? `url(${item.image})` : 'none' }}></div>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <div className={styles.iconContainer}>
                  <i className={`${item.icon || "fa-solid fa-laptop-code"} ${styles.icon}`}></i>
                </div>
                <h3 className={styles.cardTitle}>{item.short}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
                <Link href={`/industries/${item.slug}`} className={styles.learnMoreBtn}>
                  Learn More
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.arrowIcon}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className={styles.cardGlow}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
