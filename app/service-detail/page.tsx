"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ServiceDetail.module.css";
import ConsultationButton from "@/app/components/ConsultationButton/ConsultationButton";

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
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.15 1.19 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
);

// Offer card icons
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconLink = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
);
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const IconCode = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────
const heroStats = [
  { num: "3×",    label: "Avg. Traffic Increase" },
  { num: "2000+", label: "Clients Served" },
  { num: "7+",    label: "Years of Experience" },
  { num: "95%",   label: "Client Retention Rate" },
];

const offers = [
  { icon: <IconSearch />, title: "On-Page SEO", text: "Optimize meta tags, headings, content structure, images, and internal links to ensure search engines clearly understand your pages." },
  { icon: <IconLink />,   title: "Link Building", text: "Build high-authority backlinks through ethical outreach, guest posting, and digital PR that strengthen your domain authority." },
  { icon: <IconCode />,   title: "Technical SEO", text: "Fix crawl errors, improve site speed, implement schema markup, and ensure your site is fully indexed by Google." },
  { icon: <IconMap />,    title: "Local SEO", text: "Dominate local search results with Google Business Profile optimization, local citations, and geo-targeted keyword strategies." },
];

const steps = [
  { title: "Website Audit & Analysis",    text: "We begin with a comprehensive audit of your website — analysing technical health, keyword gaps, backlink profile, and competitor landscape." },
  { title: "Strategy & Keyword Research", text: "Our experts craft a data-driven SEO strategy targeting the right keywords that your potential customers are actually searching for." },
  { title: "On-Page Optimization",        text: "We optimize every page — titles, meta descriptions, headings, content, images and internal linking — to maximum search engine relevance." },
  { title: "Off-Page & Link Building",    text: "Through ethical link-building, guest posts, and PR campaigns, we grow your domain authority and trustworthiness in Google's eyes." },
  { title: "Reporting & Growth",          text: "Monthly detailed reports showing keyword rankings, organic traffic, leads generated, and ongoing recommendations to keep growing." },
];

const faqs = [
  { q: "How long does SEO take to show results?",             a: "SEO is a long-term investment. Most clients start seeing measurable improvements in rankings and traffic within 3–6 months. Significant growth typically happens between 6–12 months depending on competition and the current state of your website." },
  { q: "Do you offer affordable SEO packages in Jaipur?",     a: "Yes! G Digital India offers flexible and affordable SEO packages tailored to businesses of all sizes — from startups to large enterprises. Contact us to find the right package for your budget and goals." },
  { q: "What makes G Digital India the best SEO company?",    a: "We combine 7+ years of experience, a 100+ member expert team, ethical white-hat practices, and transparent monthly reporting. Our 95% client retention rate speaks for itself." },
  { q: "Do you provide Local SEO services in Jaipur?",        a: "Absolutely. We specialize in Local SEO — optimizing your Google Business Profile, building local citations, and targeting geo-specific keywords to drive foot traffic and local leads." },
  { q: "Will I get monthly reports?",                         a: "Yes. Every client receives detailed monthly reports covering keyword rankings, organic traffic, backlinks built, and actionable next steps. Full transparency is a core part of how we work." },
];

const relatedServices = [
  { tag: "PPC",  title: "Google Ads Management",       href: "/services/google-ads",  text: "Run high-converting Google Ad campaigns with expert PPC management that maximizes your ROI.", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80" },
  { tag: "SMO",  title: "Social Media Optimization",   href: "/services/smo",         text: "Grow your brand presence across Facebook, Instagram, and LinkedIn with result-driven SMO strategies.", img: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80" },
  { tag: "META", title: "Meta Ads & Performance",      href: "/services/meta-ads",    text: "Drive targeted leads and sales with data-driven Facebook & Instagram ad campaigns.", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80" },
];

const sidebarLinks = [
  { label: "Google Ads",          href: "/services/google-ads" },
  { label: "Meta Ads",            href: "/services/meta-ads" },
  { label: "Social Media (SMO)",  href: "/services/smo" },
  { label: "GMB Management",      href: "/services/gmb" },
  { label: "WhatsApp Marketing",  href: "/services/whatsapp" },
  { label: "Website Design",      href: "/services/website-design" },
  { label: "CRM & Software",      href: "/services/crm" },
];

// ── FAQ Item ───────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={`${styles.faqQ} ${open ? styles.faqQActive : ""}`} onClick={() => setOpen(!open)}>
        {q}
        <span className={`${styles.faqIcon} ${open ? styles.faqIconOpen : ""}`}><IconPlus /></span>
      </button>
      <p className={`${styles.faqA} ${open ? styles.faqAOpen : ""}`}>{a}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function ServiceDetailPage() {
  return (
    <div className={styles.page}>

      {/* ═══ HERO BANNER ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}><IconHome /> Home</Link>
            <span className={styles.bcSep}><IconChevron /></span>
            <Link href="/services" className={styles.bcLink}>Services</Link>
            <span className={styles.bcSep}><IconChevron /></span>
            <Link href="/services/digital-marketing" className={styles.bcLink}>Digital Marketing</Link>
            <span className={styles.bcSep}><IconChevron /></span>
            <span className={styles.bcCurrent}>SEO</span>
          </nav>

          <div className={styles.heroTag}>
            <span className={styles.heroDot} /> SEO Services
          </div>
          <h1 className={styles.heroTitle}>
            Best SEO Company<br />in <em>Jaipur, India</em>
          </h1>
          <p className={styles.heroDesc}>
            Unlock the power of online visibility with G Digital India — your premier SEO agency in Jaipur.
            We specialize in delivering cutting-edge SEO services tailored to elevate your digital presence,
            drive organic traffic, and grow your business sustainably.
          </p>
          <div className={styles.heroActions}>
            <ConsultationButton className={styles.btnPrimary}>
              Get Free Consultation <IconArrow size={13} />
            </ConsultationButton>
            <Link href="/packages/seo" className={styles.btnSecondary}>
              View SEO Packages
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.heroStats}>
          {heroStats.map((s) => (
            <div key={s.label} className={styles.heroStat}>
              <div className={styles.heroStatNum}>{s.num}</div>
              <div className={styles.heroStatLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MAIN BODY ═══ */}
      <div className={styles.main}>

        {/* ── LEFT CONTENT ── */}
        <div className={styles.content}>

          {/* Section 1 */}
          <span className={styles.sectionLabel}>About the Service</span>
          <h2 className={styles.contentTitle}>Leading SEO Agency in Jaipur</h2>
          <p className={styles.contentText}>
            At G Digital India, we are determined to provide the best SEO services in Jaipur tailored to your
            brand, giving you a competitive edge and helping you stay ahead of the competition. As the leading
            SEO company in Jaipur, we utilize proven, white-hat strategies to optimize your website, improve
            search engine rankings, and drive high-quality organic traffic to your business.
          </p>
          <p className={styles.contentText}>
            With our dedicated approach and team of SEO experts, we ensure that your brand stands out amidst
            the digital noise — attracting more leads, more calls, and more revenue. Trust G Digital India for
            comprehensive SEO solutions that propel your business towards greater visibility and long-term success.
          </p>

          <Image
            src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=900&q=80"
            alt="SEO Services G Digital India"
            width={900} height={320}
            className={styles.contentImg}
          />

          {/* Section 2 — What We Offer */}
          <span className={styles.sectionLabel}>What We Offer</span>
          <h2 className={styles.contentTitle}>Our SEO Services in Jaipur</h2>
          <p className={styles.contentText}>
            We offer a full spectrum of SEO services designed to improve every aspect of your online presence —
            from technical foundations to content and authority-building.
          </p>

          <div className={styles.offerGrid}>
            {offers.map((o) => (
              <div key={o.title} className={styles.offerCard}>
                <div className={styles.offerCardIcon}>{o.icon}</div>
                <h3 className={styles.offerCardTitle}>{o.title}</h3>
                <p className={styles.offerCardText}>{o.text}</p>
              </div>
            ))}
          </div>

          {/* Section 3 — Process */}
          <div className={styles.processSection}>
            <span className={styles.sectionLabel}>Our Process</span>
            <h2 className={styles.contentTitle}>How We Deliver SEO Results</h2>
            <p className={styles.contentText}>
              Our proven 5-step SEO process ensures every campaign is built on solid research,
              executed with precision, and measured for continuous improvement.
            </p>
            <div className={styles.steps}>
              {steps.map((s, i) => (
                <div key={s.title} className={styles.step}>
                  <div className={styles.stepNum}>0{i + 1}</div>
                  <div>
                    <h4 className={styles.stepTitle}>{s.title}</h4>
                    <p className={styles.stepText}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 — FAQ */}
          <div className={styles.faqSection}>
            <span className={styles.sectionLabel}>FAQs</span>
            <h2 className={styles.contentTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className={styles.sidebar}>

          {/* Quick Enquiry Form */}
          <div className={styles.sideForm}>
            <h3 className={styles.sideFormTitle}>Get Free Consultation</h3>
            <p className={styles.sideFormSub}>Tell us about your project — we all get back within 24 hours.</p>
            <div className={styles.formGroup}>
              <input className={styles.formInput} type="text" placeholder="Your Name *" />
            </div>
            <div className={styles.formGroup}>
              <input className={styles.formInput} type="email" placeholder="Email Address *" />
            </div>
            <div className={styles.formGroup}>
              <input className={styles.formInput} type="tel" placeholder="Phone Number" />
            </div>
            <div className={styles.formGroup}>
              <select className={styles.formSelect}>
                <option value="">Select Service</option>
                <option>SEO Services</option>
                <option>Google Ads</option>
                <option>Meta Ads</option>
                <option>SMO Services</option>
                <option>Website Design</option>
                <option>Website Development</option>
                <option>CRM & Software</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <textarea className={styles.formTextarea} placeholder="Your Message..." />
            </div>
            <button className={styles.formBtn}>
              Submit Enquiry <IconArrow size={13} />
            </button>
          </div>

          {/* Other Services */}
          <div className={styles.sideCard}>
            <p className={styles.sideCardTitle}>Other Services</p>
            <div className={styles.relatedList}>
              {sidebarLinks.map((l) => (
                <Link key={l.label} href={l.href} className={styles.relatedLink}>
                  {l.label} <IconChevron />
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
            {relatedServices.map((r) => (
              <Link key={r.title} href={r.href} className={styles.relatedCard}>
                <Image src={r.img} alt={r.title} width={600} height={160} className={styles.relatedCardImg} />
                <div className={styles.relatedCardBody}>
                  <span className={styles.relatedCardTag}>{r.tag}</span>
                  <h3 className={styles.relatedCardTitle}>{r.title}</h3>
                  <p className={styles.relatedCardText}>{r.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}