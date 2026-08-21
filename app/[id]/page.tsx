import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import ServiceCategory from "@/models/ServiceCategory";
import Package from "@/models/Package";
import Industry from "@/models/Industry";
import FaqItem from "@/app/components/FaqItem/FaqItem";
import styles from "../service-detail/ServiceDetail.module.css";
import pkgStyles from "../packages/packages.module.css";
import ConsultationButton from "@/app/components/ConsultationButton/ConsultationButton";
import ProfileSlider from "@/app/components/ProfileSlider/ProfileSlider";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PackageDetailClient from "../packages/[slug]/PackageDetailClient";

export const revalidate = 60;

// ── Inline SVG Icons ───────────────────────────────────────
const IconHome = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconArrow = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.15 1.19 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
);

async function findRecord(id: string) {
  await connectDB();
  const decoded = decodeURIComponent(id);
  const regexMatch = { $regex: new RegExp('^' + decoded + '$', 'i') };
  const idMatch = decoded.match(/^[0-9a-fA-F]{24}$/) ? decoded : null;

  // 1. Try Service
  const service = await Service.findOne({
    $or: [
      { slug: regexMatch },
      { title: regexMatch },
      { slug: { $regex: new RegExp('^' + decoded.replace(/ /g, '-') + '$', 'i') } },
      { _id: idMatch }
    ]
  }).lean();
  if (service) return { type: 'service', data: service };

  // 2. Try ServiceCategory
  const category = await ServiceCategory.findOne({
    $or: [
      { slug: regexMatch },
      { name: regexMatch },
      { slug: { $regex: new RegExp('^' + decoded.replace(/ /g, '-') + '$', 'i') } },
      { _id: idMatch }
    ]
  }).lean();
  if (category) return { type: 'category', data: category };

  // 3. Try Package
  const pkg = await Package.findOne({ slug: decoded }).lean();
  if (pkg) return { type: 'package', data: pkg };

  // 4. Try Industry
  const industry = await Industry.findOne({ slug: decoded.toLowerCase() }).lean();
  if (industry) return { type: 'industry', data: industry };

  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await findRecord(id);
  if (!result) return { title: "Not Found" };

  const { type, data } = result as any;

  if (type === 'service') {
    return {
      title: data.metaTitle || `${data.title} | G Digital India`,
      description: data.metaDescription || (data.description && data.description.replace(/<[^>]*>?/gm, '').substring(0, 160)),
      keywords: data.metaKeywords || (data.tags && data.tags.join(', ')),
    };
  }
  if (type === 'category') {
    return {
      title: data.metaTitle || `${data.name} | G Digital India`,
      description: data.metaDescription || (data.description && data.description.replace(/<[^>]*>?/gm, '').substring(0, 160)),
      keywords: data.metaKeywords || data.name,
    };
  }
  if (type === 'package') {
    return {
      title: data.metaTitle || `${data.title} | G Digital India`,
      description: data.metaDescription || data.description,
      keywords: data.metaKeywords,
    };
  }
  if (type === 'industry') {
    return {
      title: data.metaTitle || `${data.title} | G Digital India`,
      description: data.metaDescription || (data.description && data.description.replace(/<[^>]*>?/gm, '').substring(0, 160)),
      keywords: data.metaKeywords || `${data.short}, digital marketing, ${data.short} agency`,
    };
  }
  return { title: "G Digital India" };
}

export default async function DynamicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await findRecord(id);

  if (!result) notFound();

  const { type, data } = result as any;

  // ─── PACKAGE PAGE ───────────────────────────────────────────
  if (type === 'package') {
    const pkg = JSON.parse(JSON.stringify(data));
    return <PackageDetailClient pkg={pkg} />;
  }

  // ─── CATEGORY PAGE ──────────────────────────────────────────
  if (type === 'category') {
    const category = JSON.parse(JSON.stringify(data));
    const servicesData = await Service.find({ category: category.name }).sort({ order: 1 }).lean();
    const relatedServices = JSON.parse(JSON.stringify(servicesData));

    return (
      <div className={styles.page}>
        {/* ═══ HERO BANNER ═══ */}
        <section className={styles.hero}>
          <div className={styles.heroBg} style={{ backgroundImage: `url(${category.image})`, opacity: 0.1 }} />
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/" className={styles.bcLink}><IconHome /> Home</Link>
              <span className={styles.bcSep}><IconChevron /></span>
              <span className={styles.bcCurrent}>{category.name}</span>
            </nav>
            <div className={styles.heroTag}>
              <span className={styles.heroDot} /> Category
            </div>
            <h1 className={styles.heroTitle}>{category.title || category.name}</h1>
            <p className={styles.heroDesc}>
              {category.description
                ? category.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, 180) + (category.description.replace(/<[^>]*>/g, '').length > 180 ? '...' : '')
                : "Professional solutions tailored to grow your business sustainably."
              }
            </p>
            <div className={styles.heroActions}>
              <ConsultationButton className={styles.btnPrimary}>
                Get Free Consultation <IconArrow size={13} />
              </ConsultationButton>
            </div>
          </div>
        </section>

        {/* Alternating Content Blocks */}
        {category.contentBlocks && category.contentBlocks.length > 0 && (
          <div className={styles.contentBlocks}>
            {category.contentBlocks.map((block: any, i: number) => {
              const isReverse = i % 2 === 0;
              return (
                <div key={i} className={`${styles.contentBlock} ${isReverse ? styles.contentBlockReverse : ""}`}>
                  <div className={styles.blockText}>
                    {block.title && <h3>{block.title}</h3>}
                    <div dangerouslySetInnerHTML={{ __html: block.text }} />
                  </div>
                  {block.image && (
                    <div className={styles.blockImageWrapper}>
                      <Image src={block.image} alt={block.title || "Category Content"} width={600} height={400} className={styles.blockImage} style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Services in this Category */}
        {relatedServices.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedInner}>
              <span className={styles.sectionLabel}>Our Services</span>
              <h2 className={styles.contentTitle}>Services in {category.name}</h2>
              <div className={styles.relatedGrid}>
                {relatedServices.map((s: any) => (
                  <Link key={s._id} href={`/${s.slug || s._id}`} className={styles.relatedCard}>
                    <Image src={s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"} alt={s.title} width={600} height={160} className={styles.relatedCardImg} style={{ objectFit: 'cover' }} />
                    <div className={styles.relatedCardBody}>
                      <span className={styles.relatedCardTag}>{s.short}</span>
                      <h3 className={styles.relatedCardTitle}>{s.title}</h3>
                      <p className={styles.relatedCardText}>
                        {s.highlight || (s.description && s.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 100) + '...')}
                      </p>
                      <span className={styles.relatedCardLink}>Read More <IconArrow size={12} /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ─── INDUSTRY PAGE ──────────────────────────────────────────
  if (type === 'industry') {
    const industry = JSON.parse(JSON.stringify(data));
    const allIndustriesData = await Industry.find().sort({ order: 1 }).lean();
    const allIndustries = JSON.parse(JSON.stringify(allIndustriesData));

    return (
      <div className={styles.page}>
        {/* Hero Banner */}
        <section className={styles.hero}>
          <div className={styles.heroBg} style={{ backgroundImage: `url(${industry.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920"})`, opacity: 0.12 }} />
          <div className={`${styles.heroInner} dyn-hero-inner`}>

            {/* Left: Text Content */}
            <div className="dyn-hero-left">
              {/* Breadcrumb */}
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/" className={styles.bcLink}><IconHome /> Home</Link>
                <span className={styles.bcSep}><IconChevron /></span>
                <span className={styles.bcCurrent}>{industry.short}</span>
              </nav>

              <div className={styles.heroTag}>
                <span className={styles.heroDot} /> {industry.short} Sector
              </div>
              <h1 className={styles.heroTitle}>{industry.title}</h1>
              <p className={styles.heroDesc}>{industry.description}</p>
              <div className={styles.heroActions}>
                <ConsultationButton className={styles.btnPrimary}>
                  Get Free Consultation <IconArrow size={13} />
                </ConsultationButton>
              </div>
            </div>

            {/* Right: Consultation Form */}
            <div className="dyn-hero-right">
              <div style={{
                background: 'rgba(15,15,15,0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Get Free Consultation</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '22px', lineHeight: 1.5 }}>Tell us about your project — we will get back within 24 hours.</p>
                <form action="/api/contact" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="hidden" name="source" value={`Industry - ${industry.short}`} />
                  <input required name="name" type="text" placeholder="Your Name *" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input required name="email" type="email" placeholder="Email Address *" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input required name="phone" type="tel" placeholder="Phone Number *" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <textarea name="message" placeholder="Tell us about your business goals..." rows={3} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  <button type="submit" style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: '6px', padding: '14px 24px', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s ease' }}>
                    Submit Enquiry <IconArrow size={13} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Full Width */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 70px' }}>
          <div 
            style={{ 
              color: 'var(--admin-text-secondary)', 
              lineHeight: '1.8', 
              fontSize: '1.1rem' 
            }}
            dangerouslySetInnerHTML={{ __html: industry.content || "<p>Our professional marketing and web development services are customized to meet the unique challenges of this industry.</p>" }}
          />

          {/* Scoped CSS styling for dynamic blocks */}
          <style dangerouslySetInnerHTML={{ __html: `
            .dyn-sec-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #fff; margin-bottom: 12px; border-left: 4px solid #f97316; padding-left: 15px; line-height: 1.2; margin-top: 40px; }
            .dyn-intro { font-size: 1.1rem; line-height: 1.8; color: #94a3b8; margin-bottom: 20px; }
            .dyn-flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 15px; margin-bottom: 40px; }
            .dyn-flow-card { border-radius: 16px; padding: 28px 24px 24px; transition: all 0.35s ease; position: relative; overflow: hidden; border: 1px solid rgba(249,115,22,0.15); background: linear-gradient(145deg, rgba(249,115,22,0.07) 0%, rgba(20,20,20,0.6) 100%); }
            .dyn-flow-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #f97316, #fb923c); border-radius: 16px 16px 0 0; }
            .dyn-flow-card:nth-child(2)::before { background: linear-gradient(90deg, #ea580c, #f97316); }
            .dyn-flow-card:nth-child(2) { background: linear-gradient(145deg, rgba(234,88,12,0.08) 0%, rgba(20,20,20,0.6) 100%); border-color: rgba(234,88,12,0.2); }
            .dyn-flow-card:nth-child(3)::before { background: linear-gradient(90deg, #fb923c, #fbbf24); }
            .dyn-flow-card:nth-child(3) { background: linear-gradient(145deg, rgba(251,146,60,0.07) 0%, rgba(20,20,20,0.6) 100%); border-color: rgba(251,146,60,0.18); }
            .dyn-flow-card:nth-child(4)::before { background: linear-gradient(90deg, #f97316, #ef4444); }
            .dyn-flow-card:nth-child(4) { background: linear-gradient(145deg, rgba(249,115,22,0.08) 0%, rgba(20,20,20,0.6) 100%); border-color: rgba(249,115,22,0.2); }
            .dyn-flow-card:nth-child(5)::before { background: linear-gradient(90deg, #fbbf24, #f97316); }
            .dyn-flow-card:nth-child(5) { background: linear-gradient(145deg, rgba(251,191,36,0.06) 0%, rgba(20,20,20,0.6) 100%); border-color: rgba(251,191,36,0.15); }
            .dyn-flow-card:nth-child(6)::before { background: linear-gradient(90deg, #c2410c, #f97316); }
            .dyn-flow-card:nth-child(6) { background: linear-gradient(145deg, rgba(194,65,12,0.08) 0%, rgba(20,20,20,0.6) 100%); border-color: rgba(194,65,12,0.2); }
            .dyn-flow-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(249,115,22,0.15); border-color: rgba(249,115,22,0.4); }
            .dyn-flow-number { font-size: 4rem; font-weight: 900; color: rgba(249,115,22,0.1); position: absolute; top: 8px; right: 18px; line-height: 1; letter-spacing: -2px; }
            .dyn-flow-card h4 { font-size: 1.1rem; color: #fff; margin: 0 0 10px; font-weight: 800; }
            .dyn-flow-card p { font-size: 0.88rem; color: #94a3b8; margin: 0; line-height: 1.65; }
            .dyn-results-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 40px; background: rgba(255,255,255,0.01); border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
            .dyn-results-table th, .dyn-results-table td { padding: 14px 18px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.95rem; }
            .dyn-results-table th { background: rgba(255,255,255,0.03); color: #fff; font-weight: 700; }
            .dyn-results-table tr:hover { background: rgba(255,255,255,0.02); }
            .dyn-badge { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); padding: 3px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
            .dyn-video-card h5 { color: #fff; font-size: 1.05rem; margin: 0 0 5px; font-weight: 700; }
            .dyn-video-card p { color: #f97316; font-size: 0.85rem; margin: 0 0 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
            .dyn-video-desc { color: #94a3b8 !important; font-size: 0.85rem !important; line-height: 1.6; display: block; }
            .dyn-client-hex { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; margin-bottom: 40px; }
            .dyn-client-tag { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 30px; padding: 8px 18px; font-size: 0.9rem; color: #cbd5e1; font-weight: 600; transition: all 0.2s ease; }
            .dyn-client-tag:hover { border-color: #f97316; color: #fff; background: rgba(249,115,22,0.1); }
            /* Services Grid */
            .dyn-services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 22px; margin-top: 24px; margin-bottom: 50px; }
            .dyn-service-card { display: flex; flex-direction: column; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; overflow: hidden; transition: all 0.35s ease; cursor: pointer; }
            .dyn-service-card:hover { transform: translateY(-8px); border-color: rgba(249,115,22,0.5); box-shadow: 0 20px 55px rgba(249,115,22,0.15); }
            .dyn-service-img-wrap { width: 100%; height: 180px; overflow: hidden; position: relative; }
            .dyn-service-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; display: block; }
            .dyn-service-card:hover .dyn-service-img { transform: scale(1.08); }
            .dyn-service-img-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%); pointer-events: none; }
            .dyn-service-img-placeholder { display: flex; align-items: center; justify-content: center; background: rgba(249,115,22,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
            .dyn-service-body { display: flex; flex-direction: column; gap: 8px; padding: 20px 20px 18px; flex: 1; }
            .dyn-service-name { color: #fff; font-size: 1.1rem; font-weight: 800; margin: 0; line-height: 1.3; }
            .dyn-service-desc { color: #94a3b8; font-size: 0.85rem; margin: 0; line-height: 1.55; flex: 1; }
            .dyn-service-arrow { color: #f97316; margin-top: 12px; display: inline-flex; align-items: center; gap: 7px; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.75; transition: all 0.3s ease; }
            .dyn-service-card:hover .dyn-service-arrow { opacity: 1; gap: 11px; }
            /* CTA Strip Button */
            .cta-strip-btn { display: inline-flex !important; align-items: center; gap: 10px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important; color: #fff !important; border: none !important; border-radius: 10px !important; padding: 16px 32px !important; font-size: 0.95rem !important; font-weight: 800 !important; letter-spacing: 0.04em; cursor: pointer; box-shadow: 0 8px 30px rgba(249,115,22,0.4); transition: all 0.3s ease; white-space: nowrap; }
            .cta-strip-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(249,115,22,0.55); }
            /* Client Logos Marquee */
            .dyn-clients-wrapper { position: relative; overflow: hidden; margin-top: 24px; }
            .dyn-clients-wrapper::before, .dyn-clients-wrapper::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
            .dyn-clients-wrapper::before { left: 0; background: linear-gradient(to right, #0a0a0a 0%, transparent 100%); }
            .dyn-clients-wrapper::after { right: 0; background: linear-gradient(to left, #0a0a0a 0%, transparent 100%); }
            .dyn-clients-track { display: flex; gap: 20px; width: max-content; animation: clientsScroll 30s linear infinite; }
            .dyn-clients-track:hover { animation-play-state: paused; }
            @keyframes clientsScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .dyn-client-logo-card { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px 24px; width: 160px; transition: all 0.3s ease; cursor: default; }
            .dyn-client-logo-card:hover { border-color: rgba(249,115,22,0.4); background: rgba(255,255,255,0.07); box-shadow: 0 8px 30px rgba(0,0,0,0.4); transform: translateY(-3px); }
            .dyn-client-logo-img { width: 120px; height: 60px; object-fit: contain; filter: grayscale(20%) brightness(1.05); transition: all 0.3s ease; }
            .dyn-client-logo-card:hover .dyn-client-logo-img { filter: grayscale(0%) brightness(1.1); }
            .dyn-client-logo-fallback { width: 64px; height: 64px; border-radius: 14px; background: linear-gradient(135deg, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.06) 100%); border: 1px solid rgba(249,115,22,0.25); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 900; color: #f97316; }
            .dyn-client-logo-name { color: #94a3b8; font-size: 0.75rem; font-weight: 600; text-align: center; line-height: 1.3; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            /* Why Choose Us Grid */
            .dyn-why-choose { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: center; }
            .dyn-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .dyn-stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 22px; text-align: center; transition: all 0.3s ease; }
            .dyn-stat-card:hover { border-color: rgba(249,115,22,0.3); background: rgba(255,255,255,0.05); transform: translateY(-3px); }
            .dyn-stat-num { font-size: 2.3rem; font-weight: 900; color: #f97316; margin-bottom: 6px; font-family: 'Playfair Display', serif; }
            .dyn-stat-label { color: #cbd5e1; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
            @media (max-width: 900px) {
              .dyn-why-choose { grid-template-columns: 1fr; gap: 30px; }
            }
            /* Hero Split Grid */
            .dyn-hero-inner { display: flex; align-items: center; gap: 50px; }
            .dyn-hero-left { flex: 1; min-width: 0; }
            .dyn-hero-right { flex: 0 0 380px; max-width: 380px; position: relative; z-index: 1; }
            @media (max-width: 900px) {
              .dyn-hero-inner { flex-direction: column; gap: 30px; }
              .dyn-hero-right { flex: 1 1 100%; max-width: 100%; width: 100%; }
            }
          ` }} />

          {/* DYNAMIC CONVERSION STAGES BLOCK */}
          {industry.features && industry.features.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 className="dyn-sec-title">{industry.featuresTitle || "Our Conversion Funnel Framework"}</h3>
              <div className="dyn-flow-grid">
                {industry.features.map((feat: any, idx: number) => (
                  <div key={idx} className="dyn-flow-card">
                    <span className="dyn-flow-number">{(idx + 1).toString().padStart(2, '0')}</span>
                    <h4>{feat.title}</h4>
                    <p>{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* DYNAMIC SERVICES SECTION */}
          {industry.industryServices && industry.industryServices.length > 0 && (() => {
            const svcImgMap: Record<string, string> = {
              'google ads':        'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&q=80',
              'video marketing':   'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=80',
              'meta ads':         'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&q=80',
              'seo':              'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80',
              'website development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
              'whatsapp marketing': 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&q=80',
              'crm':              'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
              'ivr':              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
              'ai calling':       'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
              'gmb':              'https://images.unsplash.com/photo-1527430253228-e93688616381?w=600&q=80',
              'social media management': 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80',
            }
            return (
              <div style={{ marginTop: '50px' }}>
                <h3 className="dyn-sec-title">{industry.servicesTitle || 'Our Services for You'}</h3>
                <p className="dyn-intro">Comprehensive digital solutions tailored for the {industry.short} industry.</p>
                <div className="dyn-services-grid">
                  {industry.industryServices.map((svc: any, idx: number) => {
                    const fallback = svcImgMap[svc.name?.toLowerCase()] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
                    const imgSrc = svc.image || svc.icon || fallback
                    return (
                      <a key={idx} href={svc.link || '#'} className="dyn-service-card" style={{ textDecoration: 'none' }}>
                        <div className="dyn-service-img-wrap">
                          <img src={imgSrc} alt={svc.name} className="dyn-service-img" />
                          <div className="dyn-service-img-overlay" />
                        </div>
                        <div className="dyn-service-body">
                          <h4 className="dyn-service-name">{svc.name}</h4>
                          {svc.description && <p className="dyn-service-desc">{svc.description}</p>}
                          <span className="dyn-service-arrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                            Learn More
                          </span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            )
          })()}




          {/* ── CTA STRIP (above clients) ── */}
          {industry.clients && industry.clients.length > 0 && (
            <div style={{
              marginTop: '50px',
              background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 50%, rgba(15,15,15,0) 100%)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: '20px',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '32px',
              flexWrap: 'wrap',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative glow orb */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                right: '-40px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Left — Text */}
              <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                <p style={{
                  color: '#f97316',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Ready to Grow Your {industry.short} Business?
                </p>
                <h3 style={{
                  color: '#fff',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.85rem)',
                  fontWeight: 900,
                  lineHeight: 1.25,
                  margin: '0 0 10px',
                }}>
                  Join 500+ {industry.short} Brands That Trust G Digital India
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  Get a customised digital marketing strategy built exclusively for the {industry.short} industry — at zero cost.
                </p>
              </div>

              {/* Right — Button */}
              <div style={{ flexShrink: 0 }}>
                <ConsultationButton className="cta-strip-btn">
                  Get Free Strategy Call <IconArrow size={15} />
                </ConsultationButton>
              </div>
            </div>
          )}

          {/* DYNAMIC CLIENTS MARQUEE */}
          {industry.clients && industry.clients.length > 0 && (
            <div style={{ marginTop: '50px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 className="dyn-sec-title" style={{ marginTop: 0 }}>{industry.clientsTitle || 'Our Prestigious Clients'}</h3>
                  <p className="dyn-intro" style={{ margin: 0 }}>Brands that trust us to drive their digital growth.</p>
                </div>
                <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: '30px', padding: '6px 18px', fontSize: '0.82rem', fontWeight: 800, color: '#f97316', letterSpacing: '0.05em', flexShrink: 0 }}>
                  {industry.clients.length}+ Happy Clients
                </div>
              </div>

              {/* Marquee ticker */}
              <div className="dyn-clients-wrapper">
                <div className="dyn-clients-track">
                  {/* Original set */}
                  {industry.clients.map((client: any, idx: number) => (
                    <div key={`a-${idx}`} className="dyn-client-logo-card">
                      {client.logo ? (
                        <img src={client.logo} alt={client.name || `Client ${idx + 1}`} className="dyn-client-logo-img" />
                      ) : (
                        <div className="dyn-client-logo-fallback">
                          {(client.name || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      {client.name && <span className="dyn-client-logo-name">{client.name}</span>}
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {industry.clients.map((client: any, idx: number) => (
                    <div key={`b-${idx}`} className="dyn-client-logo-card" aria-hidden="true">
                      {client.logo ? (
                        <img src={client.logo} alt="" className="dyn-client-logo-img" />
                      ) : (
                        <div className="dyn-client-logo-fallback">
                          {(client.name || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      {client.name && <span className="dyn-client-logo-name">{client.name}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC REAL RESULTS IMAGES BLOCK */}
          {industry.resultImages && industry.resultImages.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 className="dyn-sec-title">See Our Real Results</h3>
              <p className="dyn-intro">Our performance speaks for itself — real clients, real growth.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {industry.resultImages.map((imgUrl: string, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Result ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '12px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Sectors Row */}
          <div style={{ marginTop: '50px', padding: '24px 30px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>Other Sectors We Serve</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {allIndustries.filter((ind: any) => ind._id !== industry._id).slice(0, 6).map((ind: any) => (
                <Link key={ind._id} href={`/${ind.slug}`} className={styles.relatedLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '30px', padding: '8px 18px', fontSize: '0.9rem', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s ease' }}>
                  {ind.short} <IconChevron />
                </Link>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '30px', padding: '40px 30px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px' }}>
            <div className="dyn-why-choose">
              {/* Left Column: Checklist */}
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.7rem', marginBottom: '20px', fontWeight: 800 }}>Why Choose G Digital India?</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    "10+ Years of Excellence in Digital Marketing",
                    "Certified Google & Meta Partner Agency",
                    "Team Strength of 100+ Skilled Professionals",
                    "Award-Winning Performance Marketing Agency",
                    "Trusted by Businesses Across Multiple Industries",
                    "Strong Presence in 10+ Cities Across India",
                    `Specialized expertise in ${industry.short} Digital Marketing.`
                  ].map((point, idx) => (
                    <li key={idx} style={{ color: '#cbd5e1', fontSize: '1.05rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <svg style={{ flexShrink: 0, marginTop: '3px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
                <ConsultationButton className={styles.btnPrimary}>
                  Let's Discuss Your Growth Strategy <IconArrow size={13} />
                </ConsultationButton>
              </div>

              {/* Right Column: Achievements Stats */}
              <div className="dyn-stats-grid">
                <div className="dyn-stat-card">
                  <div className="dyn-stat-num">10+</div>
                  <div className="dyn-stat-label">Years Experience</div>
                </div>
                <div className="dyn-stat-card">
                  <div className="dyn-stat-num">500+</div>
                  <div className="dyn-stat-label">Happy Clients</div>
                </div>
                <div className="dyn-stat-card">
                  <div className="dyn-stat-num">100+</div>
                  <div className="dyn-stat-label">Team Members</div>
                </div>
                <div className="dyn-stat-card">
                  <div className="dyn-stat-num">98%</div>
                  <div className="dyn-stat-label">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── SERVICE PAGE ────────────────────────────────────────────
  if (type === 'service') {
    const service = JSON.parse(JSON.stringify(data));
    const servicesData = await Service.find().sort({ order: 1 }).lean();
    const services = JSON.parse(JSON.stringify(servicesData));

    // Filter related services based on the same category
    const sameCategoryServices = services.filter((s: any) => s._id !== service._id && s.category === service.category);
    const otherCategoryServices = services.filter((s: any) => s._id !== service._id && s.category !== service.category);
    const relatedList = [...sameCategoryServices, ...otherCategoryServices].slice(0, 3);

    return (
      <div className={styles.page}>

        {/* ═══ HERO BANNER ═══ */}
        <section className={styles.hero}>
          <div className={styles.heroBg} style={{ backgroundImage: `url(${service.image})`, opacity: 0.1 }} />
          <div className={`${styles.heroInner} dyn-hero-inner`}>

            {/* Left: Text Content */}
            <div className={`${styles.heroLeft} dyn-hero-left`}>
              {/* Breadcrumb */}
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/" className={styles.bcLink}><IconHome /> Home</Link>
                <span className={styles.bcSep}><IconChevron /></span>
                <Link href="/services" className={styles.bcLink}>Services</Link>
                <span className={styles.bcSep}><IconChevron /></span>
                <span className={styles.bcCurrent}>{service.short}</span>
              </nav>

              <div className={styles.heroTag}>
                <span className={styles.heroDot} /> {service.short} Services
              </div>
              <h1 className={styles.heroTitle}>
                {service.descriptionHeading || service.title}
              </h1>
              <div
                className={styles.heroDesc}
                dangerouslySetInnerHTML={{ __html: service.description || service.highlight || "Professional solutions tailored to grow your business sustainably." }}
              />
            </div>

            {/* Right: Quick Enquiry Form */}
            <div className={`${styles.heroRight} dyn-hero-right`}>
              <div style={{
                background: 'rgba(15,15,15,0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                backdropFilter: 'blur(12px)',
              }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Get Free Consultation</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '22px', lineHeight: 1.5 }}>Tell us about your project — we will get back within 24 hours.</p>
                <form action="/api/enquiry" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="hidden" name="service" value={service.title} />
                  <input required name="name" type="text" placeholder="Your Name *" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input required name="email" type="email" placeholder="Email Address *" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input required name="phone" type="tel" placeholder="Phone Number *" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <textarea name="message" placeholder="Your Message..." rows={3} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  <button type="submit" style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: '6px', padding: '14px 24px', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s ease' }}>
                    Submit Enquiry <IconArrow size={13} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* ═══ BOTTOM BODY (Full Width Content) ═══ */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 70px' }}>

          {/* Alternating Content Blocks */}
          {service.contentBlocks && service.contentBlocks.length > 0 && (
            <div className={styles.contentBlocks} style={{ padding: 0, margin: '0 0 40px 0', maxWidth: '100%' }}>
              {service.contentBlocks.map((block: any, i: number) => {
                const isReverse = i % 2 === 0;
                return (
                  <div key={i} className={`${styles.contentBlock} ${isReverse ? styles.contentBlockReverse : ""}`}>
                    <div className={styles.blockText}>
                      {block.title && <h3>{block.title}</h3>}
                      <div
                        style={{ color: '#94a3b8', lineHeight: 1.8 }}
                        dangerouslySetInnerHTML={{ __html: block.text }}
                      />
                    </div>
                    {block.image && (
                      <div className={styles.blockImageWrapper}>
                        <Image src={block.image} alt={block.title || "Service Content"} width={600} height={400} className={styles.blockImage} style={{ objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Section 4 — FAQ */}
          {service.faqs && service.faqs.length > 0 && (
            <div className={styles.faqSection} style={{ marginTop: '50px' }}>
              <span className={styles.sectionLabel}>FAQs</span>
              <h2 className={styles.contentTitle}>Frequently Asked Questions</h2>
              <div className={styles.faqList}>
                {service.faqs.map((f: any, i: number) => <FaqItem key={i} q={f.q} a={f.a} />)}
              </div>
            </div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '40px' }}>
            {service.tags?.map((tag: string) => (
              <span key={tag} style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: '#f97316', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Other Services Row at bottom */}
          <div style={{ marginTop: '50px', padding: '24px 30px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>Other Services We Offer</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {services.filter((s: any) => s._id !== service._id).slice(0, 8).map((s: any) => (
                <Link key={s._id} href={`/${s.slug || s._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '30px', padding: '8px 18px', fontSize: '0.9rem', color: '#cbd5e1', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s ease' }}>
                  {s.title} <IconChevron />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* ═══ RELATED SERVICES ═══ */}
        <section className={styles.relatedSection}>
          <div className={styles.relatedInner}>
            <span className={styles.sectionLabel}>Related Services</span>
            <h2 className={styles.contentTitle}>You Might Also Need</h2>
            <div className={styles.relatedGrid}>
              {relatedList.map((s: any) => (
                <Link key={s._id} href={`/${s.slug || s._id}`} className={styles.relatedCard}>
                  <Image src={s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"} alt={s.title} width={600} height={160} className={styles.relatedCardImg} style={{ objectFit: 'cover' }} />
                  <div className={styles.relatedCardBody}>
                    <span className={styles.relatedCardTag}>{s.short}</span>
                    <h3 className={styles.relatedCardTitle}>{s.title}</h3>
                    <p className={styles.relatedCardText}>
                      {s.highlight || (s.description && s.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').substring(0, 100) + '...')}
                    </p>
                    <span className={styles.relatedCardLink}>Read More <IconArrow size={12} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>
    );
  }

  notFound();
}
