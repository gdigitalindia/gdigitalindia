"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../ProjectDetail.module.css";

// ── Icons ──────────────────────────────────────────────────
const IcHome = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcChevR = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcExLink = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IcArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  industry: string;
  image: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  stats: { label: string; value: string }[];
  clientName: string;
  duration: string;
}

export default function ProjectDetailClient({ initialProject, idOrSlug }: { initialProject: Project | null, idOrSlug: string }) {
  const [project, setProject] = useState<Project | null>(initialProject);
  const [loading, setLoading] = useState(!initialProject);

  useEffect(() => {
    if (!initialProject) {
      const fetchProject = async () => {
        try {
          const res = await fetch(`/api/projects/${idOrSlug}`);
          if (res.ok) {
            setProject(await res.json());
          }
        } catch (err) {
          console.error("Error fetching project:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [idOrSlug, initialProject]);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner}>⏳</div>
        <p>Loading case study...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.loadingWrap}>
        <h2>Project Not Found</h2>
        <p>The case study you are looking for does not exist or has been moved.</p>
        <Link href="/projects" className={styles.backBtn}>
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ═══ HERO BANNER ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920"})` }} />
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}><IcHome /> Home</Link>
            <IcChevR />
            <Link href="/projects" className={styles.bcLink}>Portfolio</Link>
            <IcChevR />
            <span className={styles.bcCurrent}>{project.title}</span>
          </nav>

          <div className={styles.heroBadgeRow}>
            <span className={styles.heroTag}>{project.category || "Web Design"}</span>
            {project.industry && <span className={styles.industryTag}>{project.industry}</span>}
          </div>

          <h1 className={styles.heroTitle}>{project.title}</h1>

          {/* Quick Meta Strip */}
          <div className={styles.heroMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Client Brand</span>
              <span className={styles.metaValue}>{project.clientName || project.title}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Industry</span>
              <span className={styles.metaValue}>{project.industry || "E-Commerce"}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Timeframe</span>
              <span className={styles.metaValue}>{project.duration || "2026 / Active"}</span>
            </div>
            {project.liveUrl && (
              <div className={styles.metaItemAction}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.heroLiveBtn}
                >
                  <IcExLink /> Launch Live Website
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ MAIN CASE STUDY BODY ═══ */}
      <div className={styles.main}>
        <div className={styles.contentBody}>
          {/* Featured Showcase Browser Mockup with Custom Canvas Background */}
          {project.image && (
            <div className={styles.mockupWrapper}>
              <div className={styles.mockupChrome}>
                <div className={styles.chromeDots}>
                  <span className={`${styles.dot} ${styles.dotRed}`} />
                  <span className={`${styles.dot} ${styles.dotYellow}`} />
                  <span className={`${styles.dot} ${styles.dotGreen}`} />
                </div>
                <div className={styles.chromeUrl}>
                  <span>{project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : `${project.slug}.com`}</span>
                </div>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.chromeLiveLink}>
                    Open Site ↗
                  </a>
                )}
              </div>

              {/* Rich Canvas Background for Logo / Mockup */}
              <div className={styles.canvasBackground}>
                <div className={styles.canvasGlow} />
                <div className={styles.canvasGridPattern} />
                <div className={styles.imageContainer}>
                  <Image
                    src={project.image}
                    alt={`${project.title} Showcase`}
                    width={900}
                    height={500}
                    className={styles.caseImage}
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {/* Project Overview */}
          <section className={styles.cardSection}>
            <span className={styles.sectionLabel}>Executive Summary</span>
            <h2 className={styles.sectionTitle}>About The Project</h2>
            <div className={styles.richText} dangerouslySetInnerHTML={{ __html: project.description }} />
          </section>

          {/* Challenges & Solutions (Split Grid) */}
          <div className={styles.twoColGrid}>
            {project.challenges && (
              <section className={styles.splitCard}>
                <div className={styles.splitCardHeader}>
                  <span className={styles.iconBadgeRed}>🎯</span>
                  <div>
                    <span className={styles.sectionLabel}>Objectives & Needs</span>
                    <h3 className={styles.splitTitle}>The Challenges</h3>
                  </div>
                </div>
                <div className={styles.richText} dangerouslySetInnerHTML={{ __html: project.challenges }} />
              </section>
            )}

            {project.solutions && (
              <section className={styles.splitCard}>
                <div className={styles.splitCardHeader}>
                  <span className={styles.iconBadgeOrange}>⚡</span>
                  <div>
                    <span className={styles.sectionLabel}>Strategy & Execution</span>
                    <h3 className={styles.splitTitle}>Our Solutions</h3>
                  </div>
                </div>
                <div className={styles.richText} dangerouslySetInnerHTML={{ __html: project.solutions }} />
              </section>
            )}
          </div>

          {/* Final Impact & Outcomes */}
          {project.results && (
            <section className={styles.impactCard}>
              <span className={styles.sectionLabel}>Business Impact</span>
              <h2 className={styles.sectionTitle}>Key Results & Outcomes</h2>
              <div className={styles.richText} dangerouslySetInnerHTML={{ __html: project.results }} />

              {project.stats && project.stats.length > 0 && (
                <div className={styles.statsGrid}>
                  {project.stats.map((s, i) => (
                    <div key={i} className={styles.statCard}>
                      <span className={styles.statValue}>{s.value}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ═══ STICKY SIDEBAR ═══ */}
        <aside className={styles.sidebar}>
          {/* Quick Specs Box */}
          <div className={styles.sideBox}>
            <h3 className={styles.sideTitle}>Project Scope</h3>
            
            <div className={styles.sideMetaGroup}>
              <span className={styles.sideMetaLabel}>Category</span>
              <span className={styles.sideMetaVal}>{project.category}</span>
            </div>

            <div className={styles.sideMetaGroup}>
              <span className={styles.sideMetaLabel}>Industry Sector</span>
              <span className={styles.sideMetaVal}>{project.industry || "E-Commerce"}</span>
            </div>

            <div className={styles.sideMetaGroup}>
              <span className={styles.sideMetaLabel}>Core Technologies</span>
              <div className={styles.techList}>
                {project.technologies?.map((t) => (
                  <span key={t} className={styles.techTag}>{t}</span>
                ))}
              </div>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sidebarLiveBtn}
              >
                <IcExLink /> Launch Live Website
              </a>
            )}
          </div>

          {/* High-Converting CTA Box */}
          <div className={styles.ctaBox}>
            <span className={styles.ctaBoxTag}>🚀 Growth Partners</span>
            <h3 className={styles.ctaBoxTitle}>Want Similar Results For Your Business?</h3>
            <p className={styles.ctaBoxDesc}>
              Let our expert digital team create a high-converting website & marketing funnel for your brand.
            </p>
            <Link href="/contact" className={styles.ctaBoxBtn}>
              Schedule Free Consultation <IcArrow />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
