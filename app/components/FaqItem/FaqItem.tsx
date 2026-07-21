"use client";

import { useState } from "react";
import styles from "../../service-detail/ServiceDetail.module.css";

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={`${styles.faqQ} ${open ? styles.faqQActive : ""}`} onClick={() => setOpen(!open)}>
        {q}
        <span className={`${styles.faqIcon} ${open ? styles.faqIconOpen : ""}`}><IconPlus /></span>
      </button>
      <div className={`${styles.faqA} ${open ? styles.faqAOpen : ""}`} dangerouslySetInnerHTML={{ __html: a }} />
    </div>
  );
}
