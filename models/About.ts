import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema(
  {
    // ── Hero / Banner ──────────────────────────────
    eyebrow:    { type: String, default: "Digital Marketing Company" },
    titleHTML:  { type: String, default: "About <em>G Digital India</em>" },
    tagline:    { type: String, default: "A reputed and well-established Digital Marketing company based in Jaipur, Rajasthan. We commit, We deliver." },
    bgImageUrl: { type: String, default: "" },

    // ── Who We Are Section ─────────────────────────
    imageUrl:   { type: String, default: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" },
    badgeNum:   { type: String, default: "7+" },
    badgeText:  { type: String, default: "Years of Excellence" },
    para1:      { type: String, default: "We are <strong>G Digital India</strong> — a premier digital marketing agency based in Jaipur, Rajasthan. For over 7 years, we have been empowering businesses to grow their digital presence, generate quality leads, and achieve measurable results." },
    para2:      { type: String, default: "From startups to established enterprises, our team of 100+ digital experts crafts customized strategies that drive real business growth. We are not just an agency — we are your dedicated <strong>digital growth partner</strong>." },
    btnText:    { type: String, default: "Get Free Consultation" },
    btnLink:    { type: String, default: "/contact" },

    // ── Mission & Vision ──────────────────────────
    missionText: { type: String, default: "Our mission is to empower businesses of all sizes to thrive in the digital era by providing comprehensive and results-driven digital marketing solutions. We are committed to delivering exceptional value through innovative strategies, cutting-edge technologies, and a relentless pursuit of excellence." },
    visionText:  { type: String, default: "Our vision is to become India's most trusted digital growth partner — where brands harness the full potential of digital marketing to connect with their audience and achieve remarkable growth." },
    valuesText:  { type: String, default: "Our values define who we are and how we work. Transparency, integrity, innovation, and a relentless commitment to client success guide every decision we make." },

    // ── Why Choose Us (value cards) ────────────────
    values: [
      {
        icon:  { type: String },
        title: { type: String },
        desc:  { type: String },
      }
    ],

    // ── Industries We Serve ────────────────────────
    industries: [
      {
        icon: { type: String },
        name:  { type: String },
      }
    ],

    // ── Team Section ───────────────────────────────
    teamText: { type: String, default: "Behind every successful campaign is a passionate team of strategists, designers, developers, and analysts working in perfect sync." },

    // ── CTA Section ────────────────────────────────
    ctaTitle:   { type: String, default: "Let's Build Something Great Together" },
    ctaDesc:    { type: String, default: "Our team is ready to help you dominate the digital space. Get a free consultation and discover how we can transform your business." },
    ctaBtnText: { type: String, default: "Contact Us Today" },
    ctaBtnLink: { type: String, default: "/contact" },

    // ── SEO Metadata ───────────────────────────────
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model('About', AboutSchema);
