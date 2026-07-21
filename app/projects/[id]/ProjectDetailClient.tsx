"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../ProjectDetail.module.css";

// ── Icons ──────────────────────────────────────────────────
const IcHome = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcChevR = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcExLink = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

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

  if (loading) return <div style={{ padding: '100px', textAlign: 'center', background: '#04060d', color: '#fff' }}>Loading project...</div>;
  if (!project) return <div style={{ padding: '100px', textAlign: 'center', background: '#04060d', color: '#fff' }}>Project not found</div>;

  return (
    <div className={styles.page}>
      
      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${project.image})`, opacity: 0.15 }} />
        <div className={styles.heroInner}>
          
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.bcLink}><IcHome /> Home</Link>
            <IcChevR />
            <Link href="/projects" className={styles.bcLink}>Portfolio</Link>
            <IcChevR />
            <span style={{ color: '#c8a05a' }}>{project.title}</span>
          </nav>

          <span className={styles.heroTag}>{project.category}</span>
          <h1 className={styles.heroTitle}>{project.title}</h1>

          <div className={styles.heroMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Client</span>
              <span className={styles.metaValue}>{project.clientName || 'Confidential'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Industry</span>
              <span className={styles.metaValue}>{project.industry || 'Business'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Timeframe</span>
              <span className={styles.metaValue}>{project.duration || '6 Weeks'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className={styles.main}>
        
        <div className={styles.contentBody}>
          
          {/* Over View */}
          <section>
            <span className={styles.sectionLabel}>Overview</span>
            <h2 className={styles.sectionTitle}>Project Summary</h2>
            <div className={styles.text} dangerouslySetInnerHTML={{ __html: project.description }} />
          </section>

          {project.image && (
            <Image 
              src={project.image} 
              alt="Project Showcase" 
              width={1200} height={675} 
              className={styles.caseImage}
            />
          )}

          {/* Challenges & Solutions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {project.challenges && (
              <section>
                <span className={styles.sectionLabel}>The Challenge</span>
                <div className={styles.text} dangerouslySetInnerHTML={{ __html: project.challenges }} />
              </section>
            )}
            {project.solutions && (
              <section>
                <span className={styles.sectionLabel}>The Solution</span>
                <div className={styles.text} dangerouslySetInnerHTML={{ __html: project.solutions }} />
              </section>
            )}
          </div>

          {/* Results */}
          {project.results && (
            <section style={{ background: 'rgba(200, 160, 90, 0.05)', padding: '40px', borderLeft: '4px solid #c8a05a' }}>
              <span className={styles.sectionLabel}>The Impact</span>
              <h2 className={styles.sectionTitle}>Final Outcome</h2>
              <div className={styles.text} dangerouslySetInnerHTML={{ __html: project.results }} />
              
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

        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          
          <div className={styles.sideBox}>
            <h3 className={styles.sideTitle}>Project Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span className={styles.metaLabel} style={{ marginBottom: '8px', display: 'block' }}>Technologies Used</span>
                <div className={styles.techList}>
                  {project.technologies?.map(t => (
                    <span key={t} className={styles.techTag}>{t}</span>
                  ))}
                </div>
              </div>
              
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener" className={styles.liveBtn}>
                  Visit Live Project <IcExLink />
                </a>
              )}
            </div>
          </div>

          <div className={styles.sideBox} style={{ background: '#c8a05a', color: '#04060d' }}>
            <h3 className={styles.sideTitle} style={{ marginBottom: '15px' }}>Hire Our Experts</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', opacity: 0.8 }}>
              Inspired by this project? Let work together to build something remarkable for your brand too.
            </p>
            <Link href="/contact" style={{ display: 'block', textAlign: 'center', padding: '12px', border: '1px solid #04060d', color: '#04060d', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              GET A QUOTE
            </Link>
          </div>

        </aside>

      </div>

    </div>
  );
}
