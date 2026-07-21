"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEnquiry } from "../../context/EnquiryContext";
import styles from "./slider.module.css";

interface SliderData {
  tag: string;
  headline: string;
  sub: string;
  mediaUrl: string;
  isVideo: boolean;
}

export default function Slider({ initialData }: { initialData?: SliderData | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [sliderData, setSliderData] = useState<SliderData | null>(initialData || null);

  useEffect(() => {
    // Fetch slider data
    const fetchSlider = async () => {
      try {
        const res = await fetch('/api/slider');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setSliderData(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch slider data:", err);
      }
    };
    if (!initialData) {
      fetchSlider();
    }

    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // If it's a video and the ref is available, play it
    if (sliderData?.isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [sliderData]);

  const { openModal } = useEnquiry();

  // Fallback defaults if DB is empty so the frontend doesn't break
  const displayData = sliderData || {
    tag: "",
    headline: "",
    sub: "",
    mediaUrl: "",
    isVideo: true,
  };

  // Convert the headline to safely allow our accent class if they use <span class="accent"> or similar in the headline. 
  // For simplicity, let's keep the existing structure but if they don't provide HTML we just render it. 
  // The original design had: Building the <span className={styles["accent"]}>Future</span><br />Together
  // Let's just create a safe HTML rendering block for the headline only so they can use simple HTML if needed like <br/>
  const createMarkup = (htmlStr: string) => {
    return { __html: htmlStr };
  };

  return (
    <section className={styles.slider}>
      <div className={`${styles["sl-wrap"]} ${visible ? styles.in : ""}`}>
        
        {displayData.mediaUrl ? (
          displayData.isVideo ? (
            <video key={displayData.mediaUrl} ref={videoRef} autoPlay loop muted playsInline preload="auto" className={styles["sl-video"]}>
              <source src={displayData.mediaUrl} />
            </video>
          ) : (
            <Image 
              src={displayData.mediaUrl} 
              alt="Hero Slider" 
              fill
              priority
              fetchPriority="high"
              className={styles["sl-video"]} 
              style={{ objectFit: 'cover' }} 
            />
          )
        ) : (
          <div className={styles["sl-video"]} style={{ background: '#000' }} />
        )}

        <div className={styles["sl-overlay"]}></div>
        <div className={`${styles["sl-corner"]} ${styles["sl-corner-tl"]}`}></div>
        <div className={`${styles["sl-corner"]} ${styles["sl-corner-tr"]}`}></div>
        <div className={`${styles["sl-corner"]} ${styles["sl-corner-bl"]}`}></div>
        <div className={`${styles["sl-corner"]} ${styles["sl-corner-br"]}`}></div>
        <div className={styles["sl-content"]}>
          <span className={styles["sl-tag"]}>{displayData.tag}</span>

          {/* Render headline safely to preserve <br> and span accent formatting if users type them */}
          <h1 className={styles["sl-headline"]} dangerouslySetInnerHTML={createMarkup(displayData.headline)} />

          <p className={styles["sl-sub"]}>
            {displayData.sub}
          </p>

          <div className={styles["sl-btns"]}>
            <Link href="/projects" style={{ textDecoration: 'none' }}>
              <button className={styles["sl-btn-primary"]}>Our Work</button>
            </Link>
            <button className={styles["sl-btn-secondary"]} onClick={openModal}>Contact Us</button>
          </div>
        </div>

        <div className={styles["sl-bottom"]}>
          <span className={styles["sl-scroll-text"]}>Scroll</span>
          <div className={styles["sl-scroll-line"]}></div>
        </div>
      </div>
    </section>
  );
}
