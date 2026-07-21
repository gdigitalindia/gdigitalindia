"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import styles from "./AboutPage.module.css";
import ConsultationButton from "@/app/components/ConsultationButton/ConsultationButton";

/* ─── SVG Icons ─────────────────────────────────────────── */
const IconHome = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconEye = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconAward = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconTrophy = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4a2 2 0 01-2-2V5h4"/><path d="M18 9h2a2 2 0 002-2V5h-4"/>
    <path d="M6 5h12v5a6 6 0 01-12 0V5z"/><path d="M9 20h6"/><path d="M12 16v4"/><path d="M8 20h8"/>
  </svg>
);
const IconUsers = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconBarChart = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconSmile = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
  </svg>
);
const IconClock = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconMonitor = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

/* ─── Static Fallback Data ───────────────────────────────── */
const defaultStats = [
  { icon: <IconClock />, number: 7, suffix: "+", label: "Years of Experience" },
  { icon: <IconUsers />, number: 100, suffix: "+", label: "Expert Team Members" },
  { icon: <IconSmile />, number: 2000, suffix: "+", label: "Satisfied Clients" },
  { icon: <IconMonitor />, number: 1000, suffix: "+", label: "Active Softwares" },
  { icon: <IconBarChart />, number: 95, suffix: "%", label: "Client Retention Rate" },
  { icon: <IconStar />, number: 5, suffix: "★", label: "Star Rating" },
  { icon: <IconTrophy />, number: 150, suffix: "+", label: "Business Partners" },
  { icon: <IconAward />, number: 12, suffix: "+", label: "Awards Won" },
];

const defaultServices = [
  "CRM Software", "PPC Management", "SEO Services", "E-Commerce Website",
  "SMO Services", "WhatsApp Marketing", "Email Marketing", "Performance Marketing",
];

/* ─── Animated Number Component ──────────────────────────── */
function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let startTime: number | null = null;
    const duration = 2000;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function AboutPageClient({ initialAbout, initialSettings, initialServices }: { initialAbout: any, initialSettings: any, initialServices: any[] }) {
  const [data] = useState<any>(initialAbout);
  const [settings] = useState<any>(initialSettings);
  const [dbServices] = useState<any[]>(initialServices);
  
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"mission" | "vision" | "values">("mission");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const isHtmlEmpty = (html: string) => {
    if (!html) return true;
    const stripped = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
    return stripped.length === 0;
  };

  const para1Content = (!data?.para1 || isHtmlEmpty(data.para1)) 
    ? ""
    : data.para1;

  const para2Content = (!data?.para2 || isHtmlEmpty(data.para2)) 
    ? ""
    : data.para2;

  const valueList = (data?.values && data.values.length > 0) ? data.values : [];
  const industryList = (data?.industries && data.industries.length > 0) ? data.industries : [];
  const statList = (settings?.counters && settings.counters.length > 0)
    ? settings.counters.map((c: any, i: number) => ({
        icon: <span style={{ fontSize: 26 }}>{c.icon || "⭐"}</span>,
        number: parseInt(c.value) || 0,
        suffix: isNaN(parseInt(c.value)) ? "" : (c.value.replace(/[0-9]/g, "") || ""),
        label: c.label,
      }))
    : defaultStats;

  return (
    <main className={styles.page}>
      {/* ════ HERO BANNER ════ */}
      <section
        className={styles.hero}
        style={data?.bgImageUrl ? { backgroundImage: `url(${data.bgImageUrl})` } : {}}
      >
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroGrid} />
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />

        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.bcLink}><IconHome /><span>Home</span></Link>
            <span className={styles.bcSep}><IconChevron /></span>
            <span className={styles.bcCurrent}>About Us</span>
          </nav>

          <div className={styles.heroTag}>
            <span className={styles.heroPulse} />
            {data?.eyebrow || "Digital Marketing Company"}
          </div>

          <div className={styles.heroActions}>
            <ConsultationButton className={styles.heroBtnPrimary}>
              Get Free Consultation <IconArrow />
            </ConsultationButton>
            <Link href="/services" className={styles.heroBtnOutline}>
              Our Services
            </Link>
          </div>

          <div className={styles.heroTrustRow}>
            <div className={styles.heroTrustItem}>
              <span className={styles.heroTrustStars}><IconStar /><IconStar /><IconStar /><IconStar /><IconStar /></span>
              <span>5-Star Rated</span>
            </div>
            <span className={styles.heroTrustDivider} />
            <div className={styles.heroTrustItem}>🏆 <span>Award Winning Agency</span></div>
            <span className={styles.heroTrustDivider} />
            <div className={styles.heroTrustItem}>✅ <span>7+ Years Experience</span></div>
          </div>
        </div>

        <div className={styles.heroWatermark} aria-hidden="true">ABOUT</div>
      </section>

      {/* ════ WHO WE ARE ════ */}
      <section className={styles.whoSection}>
        <div className={styles.container}>
          <div className={styles.whoGrid}>
            <div className={styles.whoImgSide}>
              <div className={styles.whoImgWrap}>
                <Image
                  src={data?.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"}
                  alt="G Digital India Team"
                  width={600} height={700}
                  className={styles.whoImg}
                />
                <div className={styles.whoImgOverlay} />
                <div className={styles.expBadge}>
                  <div className={styles.expBadgeNum}>{data?.badgeNum || "7+"}</div>
                  <div className={styles.expBadgeLabel}>Years of Excellence</div>
                </div>
                <div className={styles.ratingFloat}>
                  <div className={styles.ratingStars}><IconStar /><IconStar /><IconStar /><IconStar /><IconStar /></div>
                  <div className={styles.ratingText}>Trusted by 2000+ Clients</div>
                </div>
              </div>
            </div>

            <div className={styles.whoContent}>
              <span className={styles.sectionBadge}>Who We Are</span>
              <h2 className={styles.sectionTitle}>
                Digital Marketing<br />Company <span>in India</span>
              </h2>

              <div
                className={styles.whoText}
                dangerouslySetInnerHTML={{ __html: para1Content || "<p>Welcome to G Digital India. We are a leading digital marketing agency.</p>" }}
              />
              <div
                className={styles.whoText}
                dangerouslySetInnerHTML={{ __html: para2Content || "" }}
              />

              <Link href={data?.btnLink || "/contact"} className={styles.whoBtn}>
                {data?.btnText || "Contact Us"} <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section className={styles.statsSection} ref={statsRef}>
        <div className={styles.statsBg} />
        <div className={styles.container}>
          <div className={styles.statsCenterHead}>
            <span className={styles.sectionBadge}>Our Impact</span>
            <h2 className={styles.sectionTitle}>Numbers That <span>Speak</span></h2>
          </div>
          <div className={styles.statsGrid}>
            {statList.map((s: any, i: number) => (
              <div className={styles.statCard} key={i}>
                <div className={styles.statIconWrap}>{s.icon}</div>
                <div className={styles.statNumber}>
                  {statsVisible ? (
                    <AnimatedNumber target={s.number || 0} suffix={s.suffix ?? ""} />
                  ) : (
                    `0${s.suffix ?? ""}`
                  )}
                </div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MISSION / VISION / VALUES TABS ════ */}
      <section className={styles.mvSection}>
        <div className={styles.container}>
          <div className={styles.mvHead}>
            <span className={styles.sectionBadge}>Our Foundation</span>
            <h2 className={styles.sectionTitle}>What Drives <span>Us Forward</span></h2>
          </div>

          <div className={styles.tabRow}>
            {(["mission", "vision", "values"] as const).map(tab => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "mission" && <IconTarget />}
                {tab === "vision" && <IconEye />}
                {tab === "values" && <IconAward />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === "mission" && (
              <div className={styles.tabPanel}>
                <div className={styles.tabIcon}><IconTarget /></div>
                <h3>Our Mission</h3>
                <div 
                  className={styles.tabDesc}
                  dangerouslySetInnerHTML={{ __html: data?.missionText || "To provide world-class digital solutions." }} 
                />
                <div className={styles.tabPoints}>
                  <span><IconCheck /> Result-Oriented Strategies</span>
                  <span><IconCheck /> Cutting-Edge Technology</span>
                  <span><IconCheck /> Measurable ROI</span>
                </div>
              </div>
            )}
            {activeTab === "vision" && (
              <div className={styles.tabPanel}>
                <div className={styles.tabIcon}><IconEye /></div>
                <h3>Our Vision</h3>
                <div 
                  className={styles.tabDesc}
                  dangerouslySetInnerHTML={{ __html: data?.visionText || "To be the most trusted digital partner." }} 
                />
                <div className={styles.tabPoints}>
                  <span><IconCheck /> India's Top Digital Agency</span>
                  <span><IconCheck /> Empowering Every Business</span>
                  <span><IconCheck /> Innovation-Led Growth</span>
                </div>
              </div>
            )}
            {activeTab === "values" && (
              <div className={styles.tabPanel}>
                <div className={styles.tabIcon}><IconAward /></div>
                <h3>Our Core Values</h3>
                <div 
                  className={styles.tabDesc}
                  dangerouslySetInnerHTML={{ __html: data?.valuesText || "Integrity, Innovation, and Excellence." }} 
                />
                <div className={styles.tabPoints}>
                  <span><IconCheck /> 100% Transparency</span>
                  <span><IconCheck /> Ethical Practices</span>
                  <span><IconCheck /> Client-First Approach</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════ WHY CHOOSE US ════ */}
      {valueList.length > 0 && (
        <section className={styles.whySection}>
          <div className={styles.container}>
            <div className={styles.whyHead}>
              <span className={styles.sectionBadge}>Why Choose Us</span>
              <h2 className={styles.sectionTitle}>What Makes Us <span>Stand Out</span></h2>
              <p className={styles.whySubtitle}>We do not just promise results — we deliver them. Here is why hundreds of businesses trust us.</p>
            </div>

            <div className={styles.whyGrid}>
              {valueList.map((v: any, i: number) => (
                <div className={styles.whyCard} key={i}>
                  <div className={styles.whyCardNum}>0{i + 1}</div>
                  <div className={styles.whyCardIcon}>
                    {v.icon && typeof v.icon === "string" && v.icon.startsWith('fa-')
                      ? <i className={v.icon} />
                      : <span>{v.icon}</span>
                    }
                  </div>
                  <h3 className={styles.whyCardTitle}>{v.title || v.name}</h3>
                  <p className={styles.whyCardDesc}>{v.desc}</p>
                  <div className={styles.whyCardLine} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ INDUSTRIES WE SERVE ════ */}
      {industryList.length > 0 && (
        <section className={styles.industrySection}>
          <div className={styles.container}>
            <div className={styles.industryHead}>
              <span className={styles.sectionBadge}>Industries We Serve</span>
              <h2 className={styles.sectionTitle}>Powering Growth <span>Across Sectors</span></h2>
            </div>
            <div className={styles.industryGrid}>
              {industryList.map((ind: any, i: number) => (
                <div className={styles.industryCard} key={i}>
                  <div className={styles.industryIconWrap}>
                    {ind.icon && typeof ind.icon === "string" && ind.icon.startsWith('fa-')
                      ? <i className={ind.icon} />
                      : <span>{ind.icon || ind.emoji}</span>
                    }
                  </div>
                  <span>{ind.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ TEAM HIGHLIGHT ════ */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.teamGrid}>
            <div className={styles.teamContent}>
              <span className={styles.sectionBadge}>Our Team</span>
              <h2 className={styles.sectionTitle}>100+ Digital <span>Experts</span></h2>
              <div 
                className={styles.teamText}
                dangerouslySetInnerHTML={{ __html: data?.teamText || "Our team consists of passionate experts dedicated to your success." }} 
              />
              <div className={styles.teamPoints}>
                <div className={styles.teamPoint}><span className={styles.teamPointDot} />Certified Google & Meta Professionals</div>
                <div className={styles.teamPoint}><span className={styles.teamPointDot} />Dedicated Account Managers</div>
                <div className={styles.teamPoint}><span className={styles.teamPointDot} />In-house Content & Creative Team</div>
                <div className={styles.teamPoint}><span className={styles.teamPointDot} />Data Analysts & SEO Specialists</div>
              </div>
            </div>
            <div className={styles.teamImageWrap}>
              <div className={styles.teamImageGrid}>
                <div className={styles.tImgBox} style={{ background: "linear-gradient(135deg, #1a1a3e, #2d1b69)" }}>
                  <span className={styles.tImgIcon}>🚀</span>
                  <span>Strategy</span>
                </div>
                <div className={styles.tImgBox} style={{ background: "linear-gradient(135deg, #1a3a1a, #1e5a1e)" }}>
                  <span className={styles.tImgIcon}>🎨</span>
                  <span>Creative</span>
                </div>
                <div className={styles.tImgBox} style={{ background: "linear-gradient(135deg, #3a1a1a, #5a1e1e)" }}>
                  <span className={styles.tImgIcon}>📊</span>
                  <span>Analytics</span>
                </div>
                <div className={styles.tImgBox} style={{ background: "linear-gradient(135deg, #1a2a3a, #1e3a5a)" }}>
                  <span className={styles.tImgIcon}>💻</span>
                  <span>Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <span className={styles.ctaTag}>🚀 Ready to Grow?</span>
            <h2 className={styles.ctaTitle} dangerouslySetInnerHTML={{ __html: data?.ctaTitle || "Transform Your Business To <span>Next Level</span>" }} />
            <p className={styles.ctaDesc}>
              {data?.ctaDesc || "Join hands with India's most trusted digital agency."}
            </p>
            <div className={styles.ctaBtns}>
              <Link href={data?.ctaBtnLink || "/contact"} className={styles.ctaBtnPrimary}>
                {data?.ctaBtnText || "Start Your Project"} <IconArrow />
              </Link>
              <Link href="/services" className={styles.ctaBtnOutline}>
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
