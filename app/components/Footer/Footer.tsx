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
    { label: "Locations", href: "/locations" },
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
    <span className={styles["ft-copy"]}>© {new Date().getFullYear()} G-Digital India. All rights reserved.</span>

    {/* Google Partner Badge */}
    <a
      href="https://share.google/Nwf2i1uq15ueeWs65"
      target="_blank"
      rel="noopener noreferrer"
      className={styles["ft-google-badge"]}
      title="Verified Google Partner"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span>Google Partner</span>
    </a>
  </div>
</div>

</footer>

)
}
