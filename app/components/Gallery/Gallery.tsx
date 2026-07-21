"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        // Transform the data to match expected frontend structure
        const mappedData = data.map(img => ({
          id: img._id,
          title: img.title || 'Gallery Image',
          src: img.url,
        }));
        
        setItems(mappedData);
      })
      .catch(console.error);
  }, []);

  return (
    <section className={styles.gallerySection} id="gallery">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>Our Gallery</span>
          <h2 className={styles.title}>
            Moments That <span>Define Us</span>
          </h2>
          <p className={styles.subtitle}>
            A curated gallery showcasing our finest work, creativity, and moments that reflect quality, innovation, and visual excellence.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className={styles.grid} style={{ marginTop: '40px' }}>
          {items.map((item: any, index: number) => {
            const isTall = index % 3 === 0;
            const isWide = index === 4;
            return (
              <div
                key={item.id}
                className={`${styles.gridItem} ${isTall ? styles.gridItemTall : ""} ${
                  isWide ? styles.gridItemWide : ""
                }`}
                onClick={() => setLightboxItem(item)}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={900}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <button className={styles.viewBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className={styles.loadMore}>
          <button className={styles.loadMoreBtn}>Load More Photos</button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div className={styles.lightbox} onClick={() => setLightboxItem(null)}>
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setLightboxItem(null)}
            >
              ✕
            </button>
            <Image
              src={lightboxItem.src}
              alt={lightboxItem.title}
              width={900}
              height={600}
              className={styles.lightboxImage}
              style={{ objectFit: "contain" }}
            />
            <div className={styles.lightboxInfo}>
              <div>
                <h3 className={styles.lightboxTitle}>{lightboxItem.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}