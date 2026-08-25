"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ContactPage.module.css";
import Captcha from "../components/Captcha/Captcha";

// ── SVG Icons (no library) ────────────────────────────────
const IcHome = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcChev = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.15 1.19 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.86-.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>;
const IcMail = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcPin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcWhatsapp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IcFacebook = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const IcInstagram = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const IcLinkedin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const IcCheck = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

// ── Data ──────────────────────────────────────────────────
const BUDGET_OPTIONS = ["Under ₹10k", "₹10k–₹25k", "₹25k–₹50k", "₹50k–₹1L", "₹1L–₹2L", "₹2L+"];

const SERVICES = [
  "Digital Marketing",
  "Search Engine Optimization (SEO)",
  "Google Ads / PPC",
  "Meta Ads",
  "Social Media Marketing (SMO)",
  "Website Designing",
  "Website Development",
  "E-Commerce Website Development",
  "Shopify Website Development",
  "CRM & Software",
  "WhatsApp Marketing",
  "Other",
];

const PHONES = [
  "+91 9116175600",
  "+91 9116175151",
  "+91 9116175152",
  "+91 9116175153",
];

// ── Component ─────────────────────────────────────────────
export default function ContactPage() {
  const router = useRouter();
  const [budget, setBudget]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", service: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const captchaRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (captchaRef.current && !captchaRef.current.validate()) {
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget }),
      });

      if (res.ok) {
        router.push("/thank-you");
      } else {
        const data = await res.json();
        alert(data.error || "Kuch galat ho gaya, phir se koshish karein.");
      }
    } catch (err) {
      alert("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={styles.heroInner}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.bcLink}><IcHome /> Home</Link>
            <span className={styles.bcSep}><IcChev /></span>
            <span className={styles.bcCurrent}>Contact Us</span>
          </nav>

          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <div className={styles.eyebrow}><span className={styles.dot} /> Get In Touch</div>
              <h1 className={styles.heroTitle}>
                Lets Build Something<br /><em>Great Together</em>
              </h1>
              <p className={styles.heroDesc}>
                Have a project in mind? Want to grow your business online? Our team at
                G Digital India is ready to help. Fill in the form and well get back to
                you within 24 hours.
              </p>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.respBadge}>
                <span className={`${styles.respDot} ${styles.respDotGreen}`} />
                <div className={styles.respText}>
                  <strong>Team Online Now</strong>
                  <span>Mon–Sat, 9AM–7PM IST</span>
                </div>
              </div>
              <div className={styles.respBadge}>
                <span className={`${styles.respDot} ${styles.respDotOrange}`} />
                <div className={styles.respText}>
                  <strong>Reply Within 24 Hours</strong>
                  <span>Guaranteed response time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BODY ═══ */}
      <div className={styles.body}>

        {/* ── LEFT — FORM ── */}
        <div className={styles.formSide}>
          <div className={styles.formHeader}>
            <span className={styles.formLabel}>Send a Message</span>
            <h2 className={styles.formTitle}>Tell Us About Your Project</h2>
            <p className={styles.formSubtitle}>
              Share your requirements and our experts will craft the perfect
              digital strategy for your business.
            </p>
          </div>

          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}><IcCheck /></div>
              <h3 className={styles.successTitle}>Message Sent!</h3>
              <p className={styles.successText}>
                Thank you for reaching out. Our team will review your enquiry
                and get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>

              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Your Name *</label>
                  <input
                    className={styles.fieldInput}
                    type="text"
                    name="name"
                    placeholder="Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Email Address *</label>
                  <input
                    className={styles.fieldInput}
                    type="email"
                    name="email"
                    placeholder="rahul@company.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Phone Number</label>
                  <input
                    className={styles.fieldInput}
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Company / Brand</label>
                  <input
                    className={styles.fieldInput}
                    type="text"
                    name="company"
                    placeholder="Your Company Name"
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Service Required *</label>
                <select
                  className={styles.fieldSelect}
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Service...</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Estimated Budget</label>
                <div className={styles.budgetGrid}>
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      type="button"
                      key={b}
                      className={`${styles.budgetOption} ${budget === b ? styles.budgetOptionActive : ""}`}
                      onClick={() => setBudget(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Your Message</label>
                <textarea
                  className={styles.fieldTextarea}
                  name="message"
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <Captcha ref={captchaRef} />

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Sending..." : "Send Message"} <IcArrow />
              </button>
              <p className={styles.formNote}>
                We never share your information. 100% private & secure.
              </p>
            </form>
          )}
        </div>

        {/* ── RIGHT — SIDEBAR ── */}
        <aside className={styles.sidebar}>

          {/* Contact Info */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardTop}>
              <span className={styles.infoCardLabel}>Contact Information</span>
              <h3 className={styles.infoCardTitle}>G Digital India</h3>
            </div>

            <div className={styles.contactItems}>

              {/* Phones */}
              <div className={styles.contactItem}>
                <div className={styles.contactItemIcon}><IcPhone /></div>
                <div>
                  <p className={styles.contactItemLabel}>Call Us</p>
                  {PHONES.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className={styles.contactItemValue}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className={styles.contactItem}>
                <div className={styles.contactItemIcon}><IcMail /></div>
                <div>
                  <p className={styles.contactItemLabel}>Email Us</p>
                  <a href="mailto:info@gdigitalindia.com" className={styles.contactItemValue}>
                    info@gdigitalindia.com
                  </a>
                </div>
              </div>

              {/* Head Office */}
              <div className={styles.contactItem}>
                <div className={styles.contactItemIcon}><IcPin /></div>
                <div>
                  <p className={styles.contactItemLabel}>Head Office</p>
                  <span className={styles.contactItemValue}>
                    Second Floor, Shree Raj Tower 269,<br />
                    2nd, Mahavir Nagar, Maharani Farm,<br />
                    Jaipur – 302018, Rajasthan
                  </span>
                </div>
              </div>

              {/* GST Address */}
              <div className={styles.contactItem}>
                <div className={styles.contactItemIcon}><IcPin /></div>
                <div>
                  <p className={styles.contactItemLabel}>GST Address</p>
                  <span className={styles.contactItemValue}>
                    E-40, Gokul Vatika, Jawahar Circle,<br />
                    J.L.N Marg, Jaipur – 302018, Rajasthan
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Office Hours */}
          <div className={styles.hoursCard}>
            <span className={styles.hoursTitle}>Office Hours</span>
            <div className={styles.hoursList}>
              {[
                { day: "Monday",    time: "9:00 AM – 7:00 PM", open: true },
                { day: "Tuesday",   time: "9:00 AM – 7:00 PM", open: true },
                { day: "Wednesday", time: "9:00 AM – 7:00 PM", open: true },
                { day: "Thursday",  time: "9:00 AM – 7:00 PM", open: true },
                { day: "Friday",    time: "9:00 AM – 7:00 PM", open: true },
                { day: "Saturday",  time: "10:00 AM – 5:00 PM", open: true },
                { day: "Sunday",    time: "Closed", open: false },
              ].map((h) => (
                <div key={h.day} className={styles.hoursRow}>
                  <span className={styles.hoursDay}>{h.day}</span>
                  {h.open
                    ? <span className={styles.hoursTime}>{h.time}</span>
                    : <span className={styles.hoursClosed}>Closed</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className={styles.socialCard}>
            <span className={styles.socialTitle}>Follow Us</span>
            <div className={styles.socialLinks}>
              <a href="https://wa.me/9116175600" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <IcWhatsapp /> WhatsApp
              </a>
              <a href="https://facebook.com/gdigitalindia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <IcFacebook /> Facebook
              </a>
              <a href="https://instagram.com/gdigitalindia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <IcInstagram /> Instagram
              </a>
              <a href="https://linkedin.com/company/gdigitalindia" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <IcLinkedin /> LinkedIn
              </a>
            </div>
          </div>

        </aside>
      </div>

      {/* ═══ MAP ═══ */}
      <div className={styles.mapSection}>
        <span className={styles.mapLabel}>Find Us</span>
        <h2 className={styles.mapTitle}>Our Office Location</h2>
        <div className={styles.mapFrame}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.0774899999997!2d75.8163!3d26.8938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5b6de3ccc87%3A0x0!2sShree+Raj+Tower%2C+Mahavir+Nagar%2C+Jaipur!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="G Digital India Office Location"
          />
        </div>
      </div>

    </div>
  );
}