"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Captcha from "../components/Captcha/Captcha";

const IconArrow = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function IndustryConsultationForm({
  sourceName,
  isService = false,
}: {
  sourceName: string;
  isService?: boolean;
}) {
  const router = useRouter();
  const captchaRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (captchaRef.current && !captchaRef.current.validate()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = isService ? "/api/enquiry" : "/api/contact";
      const payload = isService
        ? { ...formData, service: sourceName }
        : { ...formData, service: `Industry - ${sourceName}` };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/thank-you");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input
        required
        name="name"
        type="text"
        placeholder="Your Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />
      <input
        required
        name="email"
        type="email"
        placeholder="Email Address *"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />
      <input
        required
        name="phone"
        type="tel"
        placeholder="Phone Number *"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />
      <textarea
        name="message"
        placeholder={isService ? "Your Message..." : "Tell us about your business goals..."}
        rows={3}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px 14px', color: '#fff', fontSize: '0.9rem', outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />

      {/* Security Captcha */}
      <Captcha ref={captchaRef} />

      <button
        type="submit"
        disabled={loading}
        style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: '6px', padding: '14px 24px', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s ease' }}
      >
        {loading ? "Submitting..." : "Submit Enquiry"} <IconArrow size={13} />
      </button>
    </form>
  );
}
