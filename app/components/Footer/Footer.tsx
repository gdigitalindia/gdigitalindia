"use client"

import { useState, useEffect } from "react"
import { useEnquiry } from "../../context/EnquiryContext";
import styles from "./Footer.module.css"
import Link from "next/link"

const navLinks = {
  Services: [
    { label: "SEO Services", href: "/services" },
    { label: "Web Design", href: "/services" },
    { label: "Social Media", href: "/services" },
    { label: "Paid Ads", href: "/services" },
    { label: "Content Marketing", href: "/services" },
    { label: "Graphic Design", href: "/services" }
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Portfolio", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Expertise", href: "/services" },
    { label: "Contact Us", href: "/contact" }
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
    { label: "Refund Policy", href: "/refund-policy" }
  ]
}

const socials = [
  { label: "FB", name: "Facebook", href: "https://facebook.com" },
  { label: "IG", name: "Instagram", href: "https://instagram.com" },
  { label: "LI", name: "LinkedIn", href: "https://linkedin.com" },
  { label: "TW", name: "Twitter", href: "https://twitter.com" }
]

export default function Footer(){

const [email,setEmail] = useState("")
const [submitted,setSubmitted] = useState(false)
const { openModal } = useEnquiry();
const [settings, setSettings] = useState<any>({
  phones: ["+91 98765 43210"],
  emails: ["hello@gdigitalindia.com"],
  address: "Jaipur, Rajasthan, India",
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    youtube: ""
  }
})

useEffect(() => {
  fetch("/api/settings", { cache: 'no-store' })
    .then(res => res.json())
    .then(data => {
      if (data) setSettings({
        phones: data.phones || [data.phone].filter(Boolean),
        emails: data.emails || [data.email].filter(Boolean),
        address: data.address || settings.address,
        socials: data.socials || settings.socials
      })
    })
    .catch(err => console.error("Footer settings fetch error:", err))
}, [])

const dynamicSocials = [
  { label: "FB", name: "Facebook", href: settings.socials?.facebook },
  { label: "IG", name: "Instagram", href: settings.socials?.instagram },
  { label: "LI", name: "LinkedIn", href: settings.socials?.linkedin },
  { label: "TW", name: "Twitter", href: settings.socials?.twitter },
  { label: "YT", name: "YouTube", href: settings.socials?.youtube }
].filter(s => s.href); // Only show links that have a URL

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if(!email.trim()) return
  setSubmitted(true)
  setEmail("")
}

return(

<footer className={styles.ft}>

{/* CTA */}
<div className={styles["ft-cta-band"]}>
  <div className={styles["ft-cta-inner"]}>
    <div className={styles["ft-cta-left"]}>
      <span className={styles["ft-cta-label"]}>Ready to scale? </span>
      <h2 className={styles["ft-cta-heading"]}>
        Let&apos;s Build Something <br/>
        <em>Remarkable.</em>
      </h2>
    </div>
    <div className={styles["ft-cta-right"]}>
      <p className={styles["ft-cta-desc"]}>
        Book a free strategy call today.
        <br/>
        Our experts are ready to help your brand grow.
      </p>
      <button className={styles["ft-cta-btn"]} onClick={openModal}>
        Start Your Project
        <span className={styles["ft-cta-btn-arrow"]}>↗</span> 
      </button>
    </div>
  </div>
  <div className={styles["ft-cta-line"]}/>
</div>

{/* Ticker */}
<div className={styles["ft-ticker"]}>
  <div className={styles["ft-ticker-track"]}>
    {[
      "SEO","✦","Paid Ads","✦","Social Media","✦","Branding","✦",
      "Web Design","✦","Performance","✦","Growth","✦","Creativity",
    ].map((item,i)=>(
      <span key={i} className={item==="✦" ? styles["ft-tick-dot"] : styles["ft-tick-item"]}>
        {item} 
      </span>
    ))}
    {/* Duplicate for infinite loop */}
    {[
      "SEO","✦","Paid Ads","✦","Social Media","✦","Branding","✦",
      "Web Design","✦","Performance","✦","Growth","✦","Creativity",
    ].map((item,i)=>(
      <span key={i+'dup'} className={item==="✦" ? styles["ft-tick-dot"] : styles["ft-tick-item"]}>
        {item} 
      </span>
    ))}
  </div>
</div>

{/* BODY */}
<div className={styles["ft-body"]}>
  <div className={styles["ft-body-inner"]}>
    {/* BRAND */}
    <div className={styles["ft-brand-col"]}>
      <Link href="/" className={styles["ft-logo"]}>
        <span className={styles["ft-logo-mark"]}>GDI</span>
        <span className={styles["ft-logo-dot"]}/> 
      </Link>
      <p className={styles["ft-brand-tagline"]}>
        Transforming brands with data-driven <br/>
        digital marketing and premium design.
      </p>
      <div className={styles["ft-socials"]}>
        {dynamicSocials.map((s)=>(
          <a key={s.name} href={s.href} className={styles["ft-social"]} target="_blank" rel="noopener noreferrer">
            <span className={styles["ft-social-label"]}>{s.label} </span>
            <span className={styles["ft-social-name"]}>{s.name} </span>
          </a>
        ))}
      </div>

      <div className={styles["ft-newsletter"]}>
        <p className={styles["ft-nl-label"]}>Get weekly growth tips</p>
        {submitted ? (
          <div className={styles["ft-nl-success"]}>
            <span className={styles["ft-nl-check"]}>✓</span>
            You&apos;re subscribed.
          </div>
        ) : (
          <div className={styles["ft-nl-form"]}>
            <input type="email" className={styles["ft-nl-input"]} placeholder="your@email.com"
              value={email} onChange={(e)=>setEmail(e.target.value)} />
            <button className={styles["ft-nl-btn"]} onClick={handleSubmit}>→</button>
          </div>
        )}
      </div>
    </div>

    {/* NAV COLS */}
    {Object.entries(navLinks).map(([col,links])=>(
      <div key={col} className={styles["ft-nav-col"]}>
        <h4 className={styles["ft-nav-heading"]}>{col}</h4>
        <ul className={styles["ft-nav-list"]}>
          {links.map((item)=>(
            <li key={item.label}>
              <Link href={item.href} className={styles["ft-nav-link"]}>
                <span className={styles["ft-nav-link-bar"]}/>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}

    {/* CONTACT */}
    <div className={styles["ft-contact-col"]}>
      <h4 className={styles["ft-nav-heading"]}>Reach Us</h4>
      <div className={styles["ft-contact-list"]}>
        {/* MULTIPLE EMAILS */}
        {(settings.emails || []).map((email: string, idx: number) => (
          <a key={idx} href={`mailto:${email}`} className={styles["ft-contact-item"]}>
            <span className={styles["ft-contact-icon"]}>✉</span> <span>{email}</span> 
          </a>
        ))}
        {/* MULTIPLE PHONES */}
        {(settings.phones || []).map((phone: string, idx: number) => (
          <a key={idx} href={`tel:${phone.replace(/\s/g, "")}`} className={styles["ft-contact-item"]}>
            <span className={styles["ft-contact-icon"]}>✆</span> <span>{phone}</span> 
          </a>
        ))}
        <div className={styles["ft-contact-item"]}>
          <span className={styles["ft-contact-icon"]}>◎</span>
          <span>{settings.address}</span>
        </div>
      </div>
      <div className={styles["ft-available"]}>
        <span className={styles["ft-available-dot"]}/>
        <span>Currently taking new projects</span>
      </div>
    </div>
  </div>
</div>

{/* WORDMARK */}
<div className={styles["ft-wordmark-wrap"]}>
  <div className={styles["ft-wordmark"]}>G-DIGITAL INDIA</div>
</div>

{/* BOTTOM */}
<div className={styles["ft-bottom"]}>
  <div className={styles["ft-bottom-inner"]}>
    <span className={styles["ft-copy"]}>© {new Date().getFullYear()} G-Digital India.</span>
  </div>
</div>

</footer>

)
}
