"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectsPage.module.css";

// ── Icons ──────────────────────────────────────────────────
const IcHome = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcChevR = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcChevL = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IcArrow = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcExLink = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
};

export default function ProjectsPageClient({ initialProjects }: { initialProjects: any[] }) {
  const [projects] = useState<any[]>(initialProjects || []);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  // Dynamic categories from projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter(
      (p) => (p.category || "").toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter, projects]);

  const lbIdx = lightboxId !== null ? filtered.findIndex((p: any) => p._id === lightboxId) : -1;
  const lbProject = lbIdx >= 0 ? filtered[lbIdx] : null;

  const goPrev = () => lbIdx > 0 && setLightboxId(filtered[lbIdx - 1]._id);
  const goNext = () => lbIdx < filtered.length - 1 && setLightboxId(filtered[lbIdx + 1]._id);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "Escape") setLightboxId(null);
  };

  return (
    <div className={styles.page} onKeyDown={handleKey} tabIndex={-1}>
      {/* ═══ HERO BANNER ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}><IcHome /> Home</Link>
            <span className={styles.bcSep}><IcChevR /></span>
            <span className={styles.bcCurrent}>Client Portfolio</span>
          </nav>

          <div className={styles.heroFlex}>
            <div className={styles.heroLeft}>
              <div className={styles.eyebrow}>
                <span className={styles.dot} />
                Selected Case Studies & Works
              </div>
              <h1 className={styles.heroTitle}>
                Crafting Digital Assets <br />
                <em>That Fuel Scalable Growth</em>
              </h1>
              <p className={styles.heroDesc}>
                Explore our portfolio of high-performing e-commerce stores, custom websites, performance marketing campaigns, and business software delivered for top brands across India & globally.
              </p>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>5000+</div>
                <div className={styles.hStatLabel}>Projects Delivered</div>
              </div>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>2000+</div>
                <div className={styles.hStatLabel}>Satisfied Clients</div>
              </div>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>10+</div>
                <div className={styles.hStatLabel}>Years Experience</div>
              </div>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>98%</div>
                <div className={styles.hStatLabel}>Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STICKY FILTER BAR ═══ */}
      <div className={styles.filterBar}>
        <div className={styles.filterBarInner}>
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`${styles.fTab} ${activeFilter === cat ? styles.fTabActive : ""}`}
              >
                {cat} <span className={styles.fTabCount}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ MAIN PROJECTS SHOWCASE ═══ */}
      <main className={styles.main}>
        <div className={styles.countRow}>
          <p className={styles.countText}>
            Displaying <span>{filtered.length}</span> curated {filtered.length === 1 ? "project" : "projects"}
            {activeFilter !== "All" && <> in <span>{activeFilter}</span></>}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📂</div>
            <h3>No projects found in this category</h3>
            <p>Try selecting "All" or browse our other service categories.</p>
            <button onClick={() => setActiveFilter("All")} className={styles.resetBtn}>
              Show All Projects
            </button>
          </div>
        ) : (
          <div className={styles.projectGrid}>
            {filtered.map((project: any, i: number) => {
              const slug = project.slug || project._id;
              const title = project.title || "Featured Case Study";
              const image = project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop";
              const category = project.category || "Web Design";
              const industry = (project.industry || "Business").trim();
              const cleanDesc = stripHtml(project.description);
              const liveUrl = project.liveUrl;
              const techList = project.technologies && project.technologies.length > 0 ? project.technologies : ["PHP", "E-Commerce", "UI/UX"];

              return (
                <div key={project._id || i} className={styles.card}>
                  {/* Browser Mockup Header */}
                  <div className={styles.cardChrome}>
                    <div className={styles.chromeDots}>
                      <span className={`${styles.dot} ${styles.dotRed}`} />
                      <span className={`${styles.dot} ${styles.dotYellow}`} />
                      <span className={`${styles.dot} ${styles.dotGreen}`} />
                    </div>
                    <div className={styles.chromeUrl}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span>{liveUrl ? liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : `${(project.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.com`}</span>
                    </div>
                    <div className={styles.cardIndex}>{(i + 1).toString().padStart(2, "0")}</div>
                  </div>

                  {/* Thumbnail / Image Area — Canvas + Contain */}
                  <div className={styles.cardThumb}>
                    <Link href={`/projects/${slug}`} className={styles.thumbLink}>
                      <Image
                        src={image}
                        alt={title}
                        width={600}
                        height={340}
                        className={styles.thumbImg}
                      />
                    </Link>

                    {/* Hover Overlay (on cardThumb) */}
                    <Link href={`/projects/${slug}`} className={styles.thumbOverlay}>
                      <span className={styles.viewPill}>
                        Explore Case Study
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </span>
                    </Link>

                    {/* Floating Badges */}
                    <div className={styles.cardBadges}>
                      <span className={styles.categoryBadge}>{category}</span>
                      {industry && <span className={styles.industryBadge}>{industry}</span>}
                    </div>

                    {/* Quick View Button */}
                    <button
                      type="button"
                      className={styles.quickViewBtn}
                      onClick={() => setLightboxId(project._id)}
                      title="Quick Preview"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <div className={styles.titleArea}>
                      <h2 className={styles.cardTitle}>
                        <Link href={`/projects/${slug}`}>{title}</Link>
                      </h2>
                    </div>

                    <p className={styles.cardDesc}>
                      {cleanDesc.length > 180 ? `${cleanDesc.substring(0, 180)}...` : cleanDesc}
                    </p>

                    {/* Technologies */}
                    <div className={styles.techTags}>
                      {techList.slice(0, 4).map((tech: string, tIdx: number) => (
                        <span key={tIdx} className={styles.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.cardActions}>
                      <Link href={`/projects/${slug}`} className={styles.btnPrimary}>
                        Case Study <IcArrow />
                      </Link>

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          className={styles.btnSecondary}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IcExLink /> Live Site
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaTag}>🚀 Ready To Elevate Your Brand?</div>
          <h2 className={styles.ctaTitle}>Want Scalable Growth & Real ROI Like These Brands?</h2>
          <p className={styles.ctaDesc}>
            Let's discuss your goals. Our expert designers, full-stack developers, and growth strategists are ready to build something remarkable for your business.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className={styles.ctaBtnPrimary}>
              Get Free Growth Strategy <IcArrow />
            </Link>
            <a href="tel:+919828448888" className={styles.ctaBtnSecondary}>
              Speak With Our Expert 📞
            </a>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE QUICK VIEW MODAL ═══ */}
      {lbProject && (
        <div
          className={styles.lightbox}
          onClick={(e) => e.target === e.currentTarget && setLightboxId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lbProject.title}
        >
          <div className={styles.lbBox}>
            <button className={styles.lbClose} onClick={() => setLightboxId(null)} aria-label="Close">
              <IcX />
            </button>

            <div className={styles.lbImgWrap}>
              <Image
                src={lbProject.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"}
                alt={lbProject.title}
                width={1200}
                height={680}
                className={styles.lbImg}
                priority
              />
            </div>

            <div className={styles.lbContent}>
              <div className={styles.lbHeader}>
                <div>
                  <span className={styles.lbCategory}>{lbProject.category} · {lbProject.industry || "Business"}</span>
                  <h3 className={styles.lbTitle}>{lbProject.title}</h3>
                </div>
                <div className={styles.lbNav}>
                  <button className={styles.lbNavBtn} onClick={goPrev} disabled={lbIdx === 0} aria-label="Previous">
                    <IcChevL />
                  </button>
                  <span className={styles.lbCounter}>{lbIdx + 1} / {filtered.length}</span>
                  <button className={styles.lbNavBtn} onClick={goNext} disabled={lbIdx === filtered.length - 1} aria-label="Next">
                    <IcChevR />
                  </button>
                </div>
              </div>

              <p className={styles.lbDesc}>
                {stripHtml(lbProject.description)}
              </p>

              {lbProject.technologies && (
                <div className={styles.lbTags}>
                  {lbProject.technologies.map((t: string) => (
                    <span key={t} className={styles.lbTag}>{t}</span>
                  ))}
                </div>
              )}

              <div className={styles.lbActions}>
                <Link href={`/projects/${lbProject.slug || lbProject._id}`} className={styles.btnPrimary} onClick={() => setLightboxId(null)}>
                  View Full Case Study <IcArrow />
                </Link>
                {lbProject.liveUrl && (
                  <a href={lbProject.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                    <IcExLink /> Visit Live Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
