import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import ServiceCategory from "@/models/ServiceCategory";
import Package from "@/models/Package";
import FaqItem from "@/app/components/FaqItem/FaqItem";
import styles from "../service-detail/ServiceDetail.module.css";
import pkgStyles from "../packages/packages.module.css";
import ConsultationButton from "@/app/components/ConsultationButton/ConsultationButton";
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

  // ─── SERVICE PAGE ────────────────────────────────────────────
  const service = JSON.parse(JSON.stringify(data));
  const servicesData = await Service.find().sort({ order: 1 }).lean();
  const services = JSON.parse(JSON.stringify(servicesData));

  return (
    <div className={styles.page}>

      {/* ═══ HERO BANNER ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${service.image})`, opacity: 0.1 }} />
        <div className={styles.heroInner}>

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
          <div className={styles.heroActions}>
            <ConsultationButton className={styles.btnPrimary}>
              Get Free Consultation <IconArrow size={13} />
            </ConsultationButton>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM BODY (FAQs + Sidebar) ═══ */}
      <div className={styles.main}>

        {/* ── LEFT CONTENT (FAQs) ── */}
        <div className={styles.content}>

          {/* Alternating Content Blocks */}
          {service.contentBlocks && service.contentBlocks.length > 0 && (
            <div className={styles.contentBlocks} style={{ padding: 0, margin: '0 0 40px 0', maxWidth: '100%' }}>
              {service.contentBlocks.map((block: any, i: number) => {
                const isReverse = i % 2 === 0;
                return (
                  <div key={i} className={`${styles.contentBlock} ${isReverse ? styles.contentBlockReverse : ""}`}>
                    <div className={styles.blockText}>
                      {block.title && <h3>{block.title}</h3>}
                      <div dangerouslySetInnerHTML={{ __html: block.text }} />
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
            <div className={styles.faqSection}>
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
              <span key={tag} style={{ background: '#f0f0f0', padding: '5px 12px', borderRadius: '20px', fontSize: '13px' }}>
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className={styles.sidebar}>

          {/* Quick Enquiry Form */}
          <div className={styles.sideForm}>
            <h3 className={styles.sideFormTitle}>Get Free Consultation</h3>
            <p className={styles.sideFormSub}>Tell us about your project — we all get back within 24 hours.</p>
            <form action="/api/enquiry" method="POST">
                <input type="hidden" name="service" value={service.title} />
                <div className={styles.formGroup}>
                <input required name="name" className={styles.formInput} type="text" placeholder="Your Name *" />
                </div>
                <div className={styles.formGroup}>
                <input required name="email" className={styles.formInput} type="email" placeholder="Email Address *" />
                </div>
                <div className={styles.formGroup}>
                <input required name="phone" className={styles.formInput} type="tel" placeholder="Phone Number *" />
                </div>
                <div className={styles.formGroup}>
                <textarea name="message" className={styles.formTextarea} placeholder="Your Message..." />
                </div>
                <button type="submit" className={styles.formBtn}>
                Submit Enquiry <IconArrow size={13} />
                </button>
            </form>
          </div>

          {/* Other Services */}
          <div className={styles.sideCard}>
            <p className={styles.sideCardTitle}>Other Services</p>
            <div className={styles.relatedList}>
              {services.filter((s: any) => s._id !== service._id).slice(0, 7).map((s: any) => (
                <Link key={s._id} href={`/${s.slug || s._id}`} className={styles.relatedLink}>
                  {s.title} <IconChevron />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div className={styles.contactCard}>
            <h4 className={styles.contactCardTitle}>Need Immediate Help?</h4>
            <p className={styles.contactCardText}>Our team is available Monday–Saturday, 9AM to 7PM.</p>
            <a href="tel:9116175600" className={styles.phoneLink}>
              <IconPhone /> +91 9116175600
            </a>
            <a href="mailto:info@gdigitalindia.com" className={styles.emailLink}>
              info@gdigitalindia.com
            </a>
          </div>

        </aside>
      </div>

      {/* ═══ RELATED SERVICES ═══ */}
      <section className={styles.relatedSection}>
        <div className={styles.relatedInner}>
          <span className={styles.sectionLabel}>Related Services</span>
          <h2 className={styles.contentTitle}>You Might Also Need</h2>
          <div className={styles.relatedGrid}>
            {services.filter((s: any) => s._id !== service._id).slice(0, 3).map((s: any) => (
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
