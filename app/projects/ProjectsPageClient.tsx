"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectsPage.module.css";

// ── Icons ──────────────────────────────────────────────────
const IcHome = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcChevR = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcChevL = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IcArrow = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcEye = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcX = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcExLink = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

const FILTERS = ["All", "Website Design", "Digital Marketing", "CRM & Software"];

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

export default function ProjectsPageClient({ initialProjects }: { initialProjects: any[] }) {
  const [projects] = useState<any[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxId, setLightboxId]     = useState<string | null>(null);

  const filtered = useMemo(() =>
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter),
    [activeFilter, projects]
  );

  const lbIdx     = lightboxId !== null ? filtered.findIndex((p: any) => p._id === lightboxId) : -1;
  const lbProject = lbIdx >= 0 ? filtered[lbIdx] : null;

  const goPrev = () => lbIdx > 0 && setLightboxId(filtered[lbIdx - 1]._id);
  const goNext = () => lbIdx < filtered.length - 1 && setLightboxId(filtered[lbIdx + 1]._id);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft")  goPrev();
    if (e.key === "Escape")     setLightboxId(null);
  };

  return (
    <div className={styles.page} onKeyDown={handleKey} tabIndex={-1}>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}><IcHome /> Home</Link>
            <span className={styles.bcSep}><IcChevR /></span>
            <span className={styles.bcCurrent}>Portfolio</span>
          </nav>

          <div className={styles.heroFlex}>
            <div>
              <div className={styles.eyebrow}><span className={styles.dot} /> Our Portfolio</div>
              <h1 className={styles.heroTitle}>
                Work That Speaks<br /><em>Louder Than Words</em>
              </h1>
              <p className={styles.heroDesc}>
                Real projects. Real clients. Real results. Explore our complete portfolio of
                website design, digital marketing, and software projects delivered by G Digital India.
              </p>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>5000+</div>
                <div className={styles.hStatLabel}>Projects</div>
              </div>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>2000+</div>
                <div className={styles.hStatLabel}>Clients</div>
              </div>
              <div className={styles.hStat}>
                <div className={styles.hStatNum}>10+</div>
                <div className={styles.hStatLabel}>Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.countRow}>
          <p className={styles.countText}>
            Showing <span>{filtered.length}</span> projects
            {activeFilter !== "All" && <> in <span>{activeFilter}</span></>}
          </p>
        </div>

        <div className={styles.projectList}>
          {filtered.map((project: any, i: number) => (
            <div key={project._id} className={styles.card}>
              <div className={styles.cardThumb} onClick={() => setLightboxId(project._id)}>
                <Image
                  src={project.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"}
                  alt={project.title}
                  fill
                  sizes="(max-width:700px) 100vw, 340px"
                  style={{ objectFit: "cover" }}
                />
                <div className={styles.thumbGlow} />
                <span className={styles.thumbIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.categoryBadge}>{project.category}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardIndustry}>{project.industry || 'Business'}</span>
                    <span className={styles.cardNum}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className={styles.cardTitle}>{project.title}</h2>
                  <div className={styles.cardDesc} dangerouslySetInnerHTML={{ __html: stripHtml(project.description) }} />
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.cardTags}>
                    {project.technologies?.slice(0, 3).map((t: string) => (
                      <span key={t} className={styles.cardTag}>{t}</span>
                    ))}
                  </div>
                  <div className={styles.cardActions}>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className={styles.previewBtn}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IcExLink /> Live Site
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Want Results Like These?</h2>
          <p className={styles.ctaDesc}>
            Lets discuss your project. Our team is ready to build something
            great for your business too.
          </p>
          <Link href="/contact" className={styles.ctaBtn}>
            Start Your Project <IcArrow />
          </Link>
        </div>
      </section>

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

            <Image
              src={lbProject.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1020"}
              alt={lbProject.title}
              width={1020}
              height={600}
              className={styles.lbImg}
              priority
            />

            <div className={styles.lbMeta}>
              <div className={styles.lbLeft}>
                <p className={styles.lbCategory}>{lbProject.category} · {lbProject.industry}</p>
                <h3 className={styles.lbTitle}>{lbProject.title}</h3>
                <div className={styles.lbTags}>
                  {lbProject.technologies?.map((t: string) => (
                    <span key={t} className={styles.lbTag}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.lbRight}>
                <span className={styles.lbCounter}>
                  {lbIdx + 1} / {filtered.length}
                </span>
                <div className={styles.lbNav}>
                  <button className={styles.lbNavBtn} onClick={goPrev} disabled={lbIdx === 0} aria-label="Previous">
                    <IcChevL />
                  </button>
                  <button className={styles.lbNavBtn} onClick={goNext} disabled={lbIdx === filtered.length - 1} aria-label="Next">
                    <IcChevR />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
