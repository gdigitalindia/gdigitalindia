"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../components/Gallery/Gallery.module.css";

const filters = ["All", "Events", "Infrastructure", "Projects"];

export default function GalleryClient({ initialItems }: { initialItems: any[] }) {
  const [galleryItems] = useState<any[]>(initialItems);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section className={styles.gallerySection} id="gallery" style={{paddingTop:"150px", minHeight: '80vh'}}>
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

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`${styles.filterBtn} ${
                activeFilter === f ? styles.filterBtnActive : ""
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid State */}
        {filtered.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>No images found in this category.</div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((item, index) => {
              const isTall = index % 3 === 0;
              const isWide = index === 4;
              return (
                <div
                  key={item._id || index}
                  className={`${styles.gridItem} ${isTall ? styles.gridItemTall : ""} ${
                    isWide ? styles.gridItemWide : ""
                  }`}
                  onClick={() => setLightboxItem(item)}
                >
                  <Image
                    src={item.src}
                    alt={item.title || "Gallery"}
                    width={900}
                    height={600}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                      <span className={styles.itemCategory}>{item.category}</span>
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
        )}
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
              alt={lightboxItem.title || "Gallery"}
              width={1200}
              height={800}
              className={styles.lightboxImage}
              style={{ objectFit: "contain" }}
            />
            <div className={styles.lightboxInfo}>
              <div>
                <h3 className={styles.lightboxTitle}>{lightboxItem.title}</h3>
                <p className={styles.lightboxCategory}>{lightboxItem.category}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
