import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";
import Service from "@/models/Service";
import styles from "../../service-detail/ServiceDetail.module.css";
import ConsultationButton from "@/app/components/ConsultationButton/ConsultationButton";
import { Metadata } from "next";

export const revalidate = 60; 

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  await connectDB();
  const category = await ServiceCategory.findOne({ 
    $or: [
      { slug: { $regex: new RegExp('^' + decodedSlug + '$', 'i') } },
      { name: { $regex: new RegExp('^' + decodedSlug + '$', 'i') } },
      { slug: { $regex: new RegExp('^' + decodedSlug.replace(/ /g, '-') + '$', 'i') } },
      { _id: decodedSlug.match(/^[0-9a-fA-F]{24}$/) ? decodedSlug : null }
    ] 
  }).lean() as any;

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.metaTitle || `${category.name} | G Digital India`,
    description: category.metaDescription || (category.description && category.description.replace(/<[^>]*>?/gm, '').substring(0, 160)),
    keywords: category.metaKeywords || category.name,
  };
}

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

export default async function CategoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;

  // Fetch the category by slug or id
  const decodedSlug = decodeURIComponent(slug);
  const catData = await ServiceCategory.findOne({ 
    $or: [
      { slug: { $regex: new RegExp('^' + decodedSlug + '$', 'i') } },
      { name: { $regex: new RegExp('^' + decodedSlug + '$', 'i') } },
      { slug: { $regex: new RegExp('^' + decodedSlug.replace(/ /g, '-') + '$', 'i') } },
      { _id: decodedSlug.match(/^[0-9a-fA-F]{24}$/) ? decodedSlug : null }
    ] 
  }).lean();

  if (!catData) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Category not found</div>;
  }

  const category = JSON.parse(JSON.stringify(catData));

  // Fetch services that belong to this category
  const servicesData = await Service.find({ category: category.name }).sort({ order: 1 }).lean();
  const relatedServices = JSON.parse(JSON.stringify(servicesData));

  return (
    <div className={styles.page}>

      {/* ═══ HERO BANNER ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${category.image})`, opacity: 0.1 }} />
        <div className={styles.heroInner}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}><IconHome /> Home</Link>
            <span className={styles.bcSep}><IconChevron /></span>
            <span className={styles.bcCurrent}>{category.name}</span>
          </nav>

          <div className={styles.heroTag}>
            <span className={styles.heroDot} /> Category
          </div>
          <h1 className={styles.heroTitle}>
            {category.title || category.name}
          </h1>
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

      {/* ═══ TOP FULL WIDTH AREA ═══ */}


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
                      <Image
                        src={block.image}
                        alt={block.title || "Category Content"}
                        width={600} height={400}
                        className={styles.blockImage}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      {/* ═══ SERVICES IN THIS CATEGORY ═══ */}
      {relatedServices.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedInner}>
            <span className={styles.sectionLabel}>Our Services</span>
            <h2 className={styles.contentTitle}>Services in {category.name}</h2>
            <div className={styles.relatedGrid}>
              {relatedServices.map((s: any) => (
                <Link key={s._id} href={`/services/${s.slug || s._id}`} className={styles.relatedCard}>
                  <Image 
                    src={s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop"} 
                    alt={s.title} 
                    width={600} height={160} 
                    className={styles.relatedCardImg} 
                    style={{ objectFit: 'cover' }} 
                  />
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
