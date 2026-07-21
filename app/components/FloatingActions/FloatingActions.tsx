"use client"

import { useEffect, useState } from "react"
import { useEnquiry } from "../../context/EnquiryContext"
import styles from "./FloatingActions.module.css"

export default function FloatingActions() {
  const [settings, setSettings] = useState<any>(null)
  const { openModal } = useEnquiry()
  
  useEffect(() => {
    fetch("/api/settings", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error)
  }, [])

  if (!settings) return null

  const primaryPhone = settings.phones?.[0] || ""
  const whatsappNumber = settings.socials?.whatsapp || ""

  return (
    <div className={styles.floatingContainer}>
      {/* Enquiry Button */}
      <button 
        className={`${styles.actionBtn} ${styles.enquiryBtn}`}
        onClick={openModal}
        title="Enquiry Now"
      >
        <div className={styles.iconBox}>
          <i className="fa-solid fa-paper-plane"></i>
        </div>
        <span className={styles.label}>Enquiry Now</span>
      </button>

      {/* WhatsApp Button */}
      {whatsappNumber && (
        <a 
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${styles.actionBtn} ${styles.whatsappBtn}`}
          title="Chat with us"
        >
          <div className={styles.iconBox}>
            <i className="fa-brands fa-whatsapp"></i>
          </div>
          <span className={styles.label}>Chat with us</span>
        </a>
      )}

      {/* Call Button */}
      {primaryPhone && (
        <a 
          href={`tel:${primaryPhone.replace(/\s/g, "")}`}
          className={`${styles.actionBtn} ${styles.callBtn}`}
          title="Call us"
        >
          <div className={styles.iconBox}>
            <i className="fa-solid fa-phone-volume"></i>
          </div>
          <span className={styles.label}>Call Us</span>
        </a>
      )}
    </div>
  )
}
