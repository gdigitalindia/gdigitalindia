"use client";

import React, { useState, useEffect } from "react";
import styles from "./EnquiryModal.module.css";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setSubmitted(false); // Reset state when closed
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service: "Quick Enquiry", // Tagging source
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Enquiry Error:", error);
      alert("Failed to send enquiry. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {submitted ? (
          <div className={styles.successMsg}>
            <div className={styles.successIcon}>✓</div>
            <h3>Thank You!</h3>
            <p>Your enquiry has been sent successfully. We will get back to you shortly.</p>
            <button className={styles.submitBtn} onClick={onClose} style={{ marginTop: '30px', width: 'auto', marginInline: 'auto' }}>
              Close Modal
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2>Enquiry <em>Now</em></h2>
              <p>Fill out the form below and our experts will get in touch with you within 24 hours.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Manish Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  className={styles.input}
                  placeholder="e.g. manish@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  required
                  className={styles.input}
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  required
                  rows={4}
                  className={styles.textarea}
                  placeholder="Tell us about your project or query..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
