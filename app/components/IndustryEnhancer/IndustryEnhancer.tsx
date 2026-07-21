"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./IndustryEnhancer.module.css";

// ── HEALTHCARE SVG LOGOS ───────────────────────────────────
const getHealthcareLogo = (name: string) => {
  const clean = name.toLowerCase();
  
  if (clean.includes("eternal") || clean.includes("ehcc")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 10 L35 25 L25 40 L15 25 Z" fill="#e8b86d" opacity="0.8"/>
        <path d="M25 15 L31 25 L25 35 L19 25 Z" fill="#ffffff"/>
        <text x="50" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">ETERNAL</text>
        <text x="50" y="45" fill="#e8b86d" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">HOSPITAL (EHCC)</text>
      </svg>
    );
  }
  if (clean.includes("purple heron")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 15 C20 15 35 20 30 35 C35 30 40 15 20 15 Z" fill="#b86de8" />
        <path d="M22 25 L28 25 L25 35 Z" fill="#ffffff"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="15" fontFamily="Inter, sans-serif">PURPLE HERON</text>
        <text x="48" y="45" fill="#b86de8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">HOSPITALS</text>
      </svg>
    );
  }
  if (clean.includes("jaipur hearing") || clean.includes("jhs")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 25 C15 15, 35 15, 35 25 C35 35, 20 30, 20 40" stroke="#6d9fe8" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="27" cy="25" r="4" fill="#ffffff"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="15" fontFamily="Inter, sans-serif">JAIPUR HEARING</text>
        <text x="48" y="45" fill="#6d9fe8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">SOLUTIONS (JHS)</text>
      </svg>
    );
  }
  if (clean.includes("nivik")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="12" stroke="#6de8b8" strokeWidth="2"/>
        <path d="M20 25 L30 25 M25 20 L25 30" stroke="#ffffff" strokeWidth="2"/>
        <circle cx="25" cy="13" r="2" fill="#6de8b8"/>
        <circle cx="37" cy="25" r="2" fill="#6de8b8"/>
        <circle cx="25" cy="37" r="2" fill="#6de8b8"/>
        <circle cx="13" cy="25" r="2" fill="#6de8b8"/>
        <text x="50" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">NIVIK NEURO</text>
        <text x="50" y="45" fill="#6de8b8" fontSize="9" letterSpacing="1" fontFamily="Inter, sans-serif">TRAUMA HOSPITAL</text>
      </svg>
    );
  }
  if (clean.includes("nv aesthetics") || clean.includes("dental")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 20 C18 15, 32 15, 32 20 C32 30, 27 35, 27 42 C23 42, 23 30, 18 20 Z" fill="#e86d9f" opacity="0.9"/>
        <path d="M25 12 L25 16 M29 13 L27 15" stroke="#ffffff" strokeWidth="1.5"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">NV AESTHETICS</text>
        <text x="48" y="45" fill="#e86d9f" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">& DENTAL HUB</text>
      </svg>
    );
  }
  if (clean.includes("aanch")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 25 C15 18, 23 18, 23 25 C23 30, 15 35, 15 35 Z M35 25 C35 18, 27 18, 27 25 C27 30, 35 35, 35 35 Z" fill="#6de8b8" opacity="0.8"/>
        <path d="M25 20 L25 38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">AANCH CHEST</text>
        <text x="48" y="45" fill="#6de8b8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">SUPER SPECIALTY</text>
      </svg>
    );
  }
  if (clean.includes("dana shivam") || clean.includes("heart")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 15 C20 10, 10 15, 15 25 L25 38 L35 25 C40 15, 30 10, 25 15 Z" fill="#ef4444" opacity="0.8"/>
        <path d="M13 25 L18 25 L21 18 L24 32 L27 23 L30 25 L37 25" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="15" fontFamily="Inter, sans-serif">DANA SHIVAM</text>
        <text x="48" y="45" fill="#ef4444" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">HEART HOSPITAL</text>
      </svg>
    );
  }
  if (clean.includes("babylon")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="10" fill="#e8d06d" opacity="0.8"/>
        <path d="M25 15 A 8 8 0 0 1 33 23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="21" cy="22" r="1.5" fill="#ffffff"/>
        <circle cx="29" cy="22" r="1.5" fill="#ffffff"/>
        <path d="M22 28 C23 30, 27 30, 28 28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">BABYLON</text>
        <text x="48" y="45" fill="#e8d06d" fontSize="9" letterSpacing="1" fontFamily="Inter, sans-serif">CHILDREN'S HOSPITAL</text>
      </svg>
    );
  }
  if (clean.includes("sevayatan")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 35 C20 30, 25 30, 35 35 M20 28 C22 24, 28 24, 30 28" stroke="#e8b86d" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="25" cy="18" r="4" fill="#ffffff"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">SEVAYATAN</text>
        <text x="48" y="45" fill="#e8b86d" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">HOSPITAL</text>
      </svg>
    );
  }
  if (clean.includes("eva care")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 15 C17 15, 12 22, 18 30 C22 35, 25 38, 25 38 C25 38, 28 35, 32 30 C38 22, 33 15, 25 15 Z" fill="#e86d9f" opacity="0.8"/>
        <path d="M25 22 C22 22, 21 24, 21 26 C21 29, 25 33, 25 33 C25 33, 29 29, 29 26 C29 24, 28 22, 25 22 Z" fill="#ffffff"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">EVA CARE</text>
        <text x="48" y="45" fill="#e86d9f" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">CLINIC</text>
      </svg>
    );
  }
  if (clean.includes("rh+")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="20" width="20" height="20" rx="4" fill="#ef4444" opacity="0.8"/>
        <path d="M25 24 L25 36 M19 30 L31 30" stroke="#ffffff" strokeWidth="3" strokeLinecap="round"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">RH+ HEALTH</text>
        <text x="48" y="45" fill="#ef4444" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">SYSTEMS</text>
      </svg>
    );
  }

  // General Fallback Healthcare Logo
  return (
    <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="12" fill="#6d9fe8" opacity="0.8"/>
      <path d="M25 18 L25 32 M18 25 L32 25" stroke="#ffffff" strokeWidth="2.5"/>
      <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="14" fontFamily="Inter, sans-serif">{name.toUpperCase().substring(0, 12)}</text>
      <text x="48" y="45" fill="#6d9fe8" fontSize="9" letterSpacing="0.5" fontFamily="Inter, sans-serif">MEDICAL GROUP</text>
    </svg>
  );
};

// ── REAL ESTATE SVG LOGOS ──────────────────────────────────
const getRealEstateLogo = (name: string) => {
  const clean = name.toLowerCase();
  
  if (clean.includes("manglam")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 35 L23 15 L31 35 Z M20 28 L28 28" stroke="#6d9fe8" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M35 15 L35 35 L28 35" stroke="#ffffff" strokeWidth="2"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">MANGLAM</text>
        <text x="48" y="45" fill="#6d9fe8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">BUILDERS & DEV</text>
      </svg>
    );
  }
  if (clean.includes("ashiana")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 28 L25 15 L35 28 Z" stroke="#6de8b8" strokeWidth="2.5" strokeLinejoin="round"/>
        <rect x="20" y="28" width="10" height="10" fill="#ffffff" opacity="0.8"/>
        <path d="M12 25 L12 38 L38 38 L38 25" stroke="#6de8b8" strokeWidth="1.5"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">ASHIANA</text>
        <text x="48" y="45" fill="#6de8b8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">GROUP</text>
      </svg>
    );
  }
  if (clean.includes("govindam")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 10 L38 25 L25 40 L12 25 Z" fill="#e8d06d" opacity="0.8"/>
        <path d="M25 15 L32 25 L25 35 L18 25 Z" fill="#ffffff"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">GOVINDAM</text>
        <text x="48" y="45" fill="#e8d06d" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">TOWERS</text>
      </svg>
    );
  }
  if (clean.includes("skyline")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="13" y="22" width="6" height="18" fill="#6d9fe8" opacity="0.6"/>
        <rect x="21" y="14" width="8" height="26" fill="#ffffff" opacity="0.9"/>
        <rect x="31" y="18" width="6" height="22" fill="#6d9fe8" opacity="0.8"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">SKYLINE</text>
        <text x="48" y="45" fill="#6d9fe8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">BUILDERS</text>
      </svg>
    );
  }
  if (clean.includes("chordia")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="12" stroke="#b86de8" strokeWidth="2.5"/>
        <path d="M20 20 L30 30 M30 20 L20 30" stroke="#ffffff" strokeWidth="2"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="15" fontFamily="Inter, sans-serif">CHORDIA'S</text>
        <text x="48" y="45" fill="#b86de8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">PROPERTIES</text>
      </svg>
    );
  }
  if (clean.includes("vanshdeep")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 15 L25 35 L35 15" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 35 L25 43" stroke="#ffffff" strokeWidth="2"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="15" fontFamily="Inter, sans-serif">VANSHDEEP</text>
        <text x="48" y="45" fill="#ef4444" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">BUILDERS</text>
      </svg>
    );
  }
  if (clean.includes("century")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="12" fill="#e8b86d" opacity="0.8"/>
        <text x="18" y="30" fill="#ffffff" fontWeight="bold" fontSize="12" fontFamily="Georgia, serif">C</text>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">CENTURY</text>
        <text x="48" y="45" fill="#e8b86d" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">GROUP</text>
      </svg>
    );
  }
  if (clean.includes("agi") || clean.includes("affordable")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28 L25 15 L38 28 Z" stroke="#6de8b8" strokeWidth="3" strokeLinejoin="round"/>
        <path d="M17 28 L17 38 L33 38 L33 28" fill="#ffffff" opacity="0.8"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">AGI HOUSING</text>
        <text x="48" y="45" fill="#6de8b8" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">AFFORDABLE HOMES</text>
      </svg>
    );
  }
  if (clean.includes("kiara")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 12 C18 12, 15 20, 25 35 C35 20, 32 12, 25 12 Z" fill="#e86d9f" opacity="0.8"/>
        <circle cx="25" cy="20" r="3" fill="#ffffff"/>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">KIARA</text>
        <text x="48" y="45" fill="#e86d9f" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">DEVELOPMENTS</text>
      </svg>
    );
  }
  if (clean.includes("j realty")) {
    return (
      <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 15 L35 15 L30 35 L15 35 Z" fill="#e8d06d" opacity="0.8"/>
        <text x="20" y="30" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">J</text>
        <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="16" fontFamily="Inter, sans-serif">J REALTY</text>
        <text x="48" y="45" fill="#e8d06d" fontSize="10" letterSpacing="1" fontFamily="Inter, sans-serif">ESTATE GROUP</text>
      </svg>
    );
  }

  // General Fallback Real Estate Logo
  return (
    <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 28 L25 18 L35 28 Z M20 28 L20 38 L30 38 L30 28" stroke="#6d9fe8" strokeWidth="2" strokeLinejoin="round"/>
      <text x="48" y="32" fill="#ffffff" fontWeight="bold" fontSize="14" fontFamily="Inter, sans-serif">{name.toUpperCase().substring(0, 12)}</text>
      <text x="48" y="45" fill="#6d9fe8" fontSize="9" letterSpacing="0.5" fontFamily="Inter, sans-serif">DEVELOPERS</text>
    </svg>
  );
};

// ── DOCTOR CAROUSEL COMPONENT ─────────────────────────────────
interface Doctor {
  name: string;
  title: string;
  desc: string;
}

const DoctorCarousel: React.FC<{ doctors: Doctor[] }> = ({ doctors }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => {
      const maxIndex = Math.max(0, doctors.length - cardsToShow);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => {
      const maxIndex = Math.max(0, doctors.length - cardsToShow);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Autoplay effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [doctors.length, cardsToShow]);

  if (doctors.length === 0) return null;

  const maxIndex = Math.max(0, doctors.length - cardsToShow);
  const offsetPercent = -(activeIndex * (100 / cardsToShow));

  return (
    <div className={styles.carouselContainer}>
      <div 
        className={styles.carouselTrack} 
        style={{ 
          transform: `translateX(${offsetPercent}%)`,
          gridTemplateColumns: `repeat(${doctors.length}, ${100 / cardsToShow}%)`
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {doctors.map((doc, i) => (
          <div className={styles.carouselSlide} key={i}>
            <div className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <div className={styles.playButton}>
                  <i className="fa-solid fa-play"></i>
                </div>
                <div className={styles.videoOverlay} />
              </div>
              <div className={styles.videoCardContent}>
                <h5 className={styles.docName}>{doc.name}</h5>
                <p className={styles.docTitle}>{doc.title}</p>
                <div 
                  className={styles.docDesc} 
                  dangerouslySetInnerHTML={{ __html: doc.desc }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length > cardsToShow && (
        <>
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev} aria-label="Previous Slide">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext} aria-label="Next Slide">
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <span 
                key={idx} 
                className={`${styles.dot} ${activeIndex === idx ? styles.activeDot : ""}`} 
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── MAIN INDUSTRY ENHANCER COMPONENT ──────────────────────────
export default function IndustryEnhancer({ slug }: { slug: string }) {
  const [mounted, setMounted] = useState(false);
  const [doctorCards, setDoctorCards] = useState<Doctor[]>([]);
  const [doctorCarouselMount, setDoctorCarouselMount] = useState<HTMLDivElement | null>(null);
  const [clientsListMount, setClientsListMount] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let attempts = 0;
    const interval = setInterval(() => {
      // ── 1. ENHANCE DOCTORS TO CAROUSEL ─────────────────────────
      const originalGrid = document.querySelector(".hc-grid-2");
      let docSuccess = false;

      if (originalGrid) {
        const cardsData: Doctor[] = [];
        const cards = originalGrid.querySelectorAll(".hc-video-card");
        
        cards.forEach((card) => {
          const nameEl = card.querySelector("h5");
          const titleEl = card.querySelector("p");
          const descEl = card.querySelector(".hc-video-desc");
          
          if (nameEl) {
            cardsData.push({
              name: nameEl.innerText.trim(),
              title: titleEl ? titleEl.innerText.trim() : "Specialist",
              desc: descEl ? descEl.innerHTML : "",
            });
          }
        });

        if (cardsData.length > 0) {
          setDoctorCards(cardsData);
          (originalGrid as HTMLElement).style.display = "none";

          let mountPoint = document.getElementById("doctor-carousel-mount");
          if (!mountPoint) {
            mountPoint = document.createElement("div");
            mountPoint.id = "doctor-carousel-mount";
            originalGrid.parentNode?.insertBefore(mountPoint, originalGrid.nextSibling);
          }
          setDoctorCarouselMount(mountPoint as HTMLDivElement);
          docSuccess = true;
        }
      } else {
        if (slug !== "healthcare") docSuccess = true;
      }

      // ── 2. ENHANCE CLIENT TEXT TAGS TO BEAUTIFUL SVG LOGOS ─────
      const clientHexContainer = document.querySelector(".hc-client-hex, .re-client-hex");
      let clientSuccess = false;

      if (clientHexContainer) {
        const tags = clientHexContainer.querySelectorAll(".hc-client-tag, .re-client-tag");
        const clientNames: string[] = [];
        
        tags.forEach((tag) => {
          clientNames.push((tag as HTMLElement).innerText.trim());
        });

        if (clientNames.length > 0) {
          (clientHexContainer as HTMLElement).style.display = "none";

          let mountPoint = document.getElementById("client-logos-mount");
          if (!mountPoint) {
            mountPoint = document.createElement("div");
            mountPoint.id = "client-logos-mount";
            clientHexContainer.parentNode?.insertBefore(mountPoint, clientHexContainer.nextSibling);
          }
          setClientsListMount(mountPoint as HTMLDivElement);
          clientSuccess = true;
        }
      } else {
        if (slug !== "healthcare" && slug !== "real-estate") clientSuccess = true;
      }

      attempts++;
      if ((docSuccess && clientSuccess) || attempts > 40) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [mounted, slug]);

  if (!mounted) return null;

  return (
    <>
      {/* Portal for Doctor Carousel */}
      {doctorCarouselMount && doctorCards.length > 0 && 
        ReactDOM.createPortal(
          <DoctorCarousel doctors={doctorCards} />, 
          doctorCarouselMount
        )
      }

      {/* Portal for Clients Logos */}
      {clientsListMount && (
        ReactDOM.createPortal(
          <div className={styles.logosGrid}>
            {Array.from(document.querySelectorAll(".hc-client-tag, .re-client-tag")).map((tag, i) => {
              const name = (tag as HTMLElement).innerText.trim();
              const isHealthcare = slug === "healthcare" || tag.className.includes("hc-client-tag");
              return (
                <div className={styles.logoCard} key={i}>
                  <div className={styles.logoWrapper}>
                    {isHealthcare ? getHealthcareLogo(name) : getRealEstateLogo(name)}
                  </div>
                  <span className={styles.logoNameLabel}>{name}</span>
                </div>
              );
            })}
          </div>,
          clientsListMount
        )
      )}
    </>
  );
}
