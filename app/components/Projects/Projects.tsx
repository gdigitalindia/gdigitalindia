"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Projects.module.css";

interface RawProject {
  _id?: string;
  _originalId?: string;
  title?: string;
  slug?: string;
  category?: string;
  industry?: string;
  description?: string;
  desc?: string;
  image?: string;
  img?: string;
  technologies?: string[];
  tags?: string[];
  liveUrl?: string;
  clientName?: string;
  duration?: string;
  stats?: { label?: string; val?: string; value?: string }[];
}

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
};

export default function Projects({ initialData }: { initialData?: RawProject[] }) {
  const [projects, setProjects] = useState<RawProject[]>(initialData || []);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setProjects(initialData);
      return;
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch(console.error);
  }, [initialData]);

  // Extract unique categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const all = activeFilter === "All"
      ? projects
      : projects.filter(
          (p) => (p.category || "").toLowerCase() === activeFilter.toLowerCase()
        );
    // Homepage: show only first 3 (1 row). All others on /projects page.
    return all.slice(0, 3);
  }, [activeFilter, projects]);

  return (
    <section className={styles.section} id="work">
      {/* Background Ambience */}
      <div className={styles.bgGlowOrb1} />
      <div className={styles.bgGlowOrb2} />
      <div className={styles.gridOverlay} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Featured Case Studies
            </div>
            <h2 className={styles.title}>
              Results That <br />
              <span className={styles.gradientText}>Speak Louder</span>
            </h2>
          </div>

          <div className={styles.headerRight}>
            <p className={styles.subtitle}>
              From high-converting e-commerce storefronts to enterprise lead acquisition funnels — discover how we transform digital brands.
            </p>
            <div className={styles.countBadge}>
              <span>{projects.length < 10 ? `0${projects.length}` : projects.length}</span> Showcased Brands
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        {categories.length > 1 && (
          <div className={styles.filterContainer}>
            <div className={styles.filterTrack}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects Showcase Grid */}
        <div className={styles.grid}>
          {filteredProjects.map((p, idx) => {
            const id = p._id || p._originalId || `p-${idx}`;
            const slug = p.slug || id;
            const title = p.title || "Featured Project";
            const image = p.image || p.img || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop";
            const category = p.category || "Web Design";
            const industry = (p.industry || "").trim();
            const rawDesc = p.description || p.desc || "";
            const cleanDesc = stripHtml(rawDesc);
            const liveUrl = p.liveUrl;
            const techList = p.technologies && p.technologies.length > 0 ? p.technologies : ["Custom Development", "UI/UX"];

            return (
              <div key={id} className={styles.card}>
                {/* Browser Mockup Window Header */}
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
                    <span>{liveUrl ? liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : `${slug}.gdigitalindia.com`}</span>
                  </div>
                  <div className={styles.cardIndex}>{(idx + 1).toString().padStart(2, "0")}</div>
                </div>

                {/* Project Media Wrapper */}
                <div className={styles.mediaWrap}>
                  <Image
                    src={image}
                    alt={title}
                    width={700}
                    height={380}
                    className={styles.mediaImg}
                  />

                  {/* Hover Overlay */}
                  <Link href={`/projects/${slug}`} className={styles.mediaOverlay}>
                    <span className={styles.viewCasePill}>
                      View Case Study
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </span>
                  </Link>

                  {/* Badges floating on image */}
                  <div className={styles.floatingBadges}>
                    <span className={styles.categoryBadge}>{category}</span>
                    {industry && <span className={styles.industryBadge}>{industry}</span>}
                  </div>
                </div>


                {/* Card Content Body */}
                <div className={styles.body}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/projects/${slug}`}>{title}</Link>
                    </h3>
                  </div>

                  <p className={styles.cardDesc}>
                    {cleanDesc.length > 160 ? `${cleanDesc.substring(0, 160)}...` : cleanDesc}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className={styles.techWrap}>
                    {techList.slice(0, 4).map((tech, tIdx) => (
                      <span key={tIdx} className={styles.techPill}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className={styles.cardFooter}>
                    <Link href={`/projects/${slug}`} className={styles.btnPrimary}>
                      Case Study
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>

                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnSecondary}
                      >
                        Live Website
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar — View All Projects */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomLine} />
          <Link href="/projects" className={styles.viewAllBtn}>
            <span>Explore All Projects & Live Demos</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"/>
              <polyline points="7 7 17 7 17 17"/>
            </svg>
          </Link>
          <div className={styles.bottomLine} />
        </div>
      </div>
    </section>
  );
}