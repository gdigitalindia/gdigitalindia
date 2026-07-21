"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "250px",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
      }}
    >
      Loading Editor...
    </div>
  ),
});

import "react-quill-new/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link"];

export default function LegalAdmin() {
  const [slug, setSlug] = useState("privacy-policy");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchPageData = async (currentSlug: string) => {
    try {
      setMsg("");
      const res = await fetch(`/api/pages/${currentSlug}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title || "");
        setContent(data.content || "");
        setMetaTitle(data.metaTitle || "");
        setMetaDescription(data.metaDescription || "");
        setMetaKeywords(data.metaKeywords || "");
      }
    } catch (error) {
      console.error("Error loading page:", error);
    }
  };

  useEffect(() => {
    fetchPageData(slug);
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, metaTitle, metaDescription, metaKeywords }),
      });
      if (res.ok) {
        setMsg("✅ Saved successfully!");
      } else {
        setMsg("❌ Failed to save changes.");
      }
    } catch (e) {
      setMsg("❌ Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header-flex">
        <h2 className="admin-page-title">Manage <span>Legal Policies</span></h2>
      </div>

      <div className="admin-card" style={{ maxWidth: "800px", marginTop: "20px" }}>
        <form onSubmit={handleSave}>
          <div className="admin-form-group">
            <label className="admin-label">Select Page to Edit</label>
            <select
              className="admin-input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={{ width: "100%", padding: "12px", fontSize: "16px" }}
            >
              <option value="privacy-policy">Privacy Policy</option>
              <option value="terms-of-use">Terms of Use</option>
              <option value="refund-policy">Refund Policy</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Page Title</label>
            <input
              type="text"
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Page Content</label>
            <div style={{ background: "#fff", color: "#000", borderRadius: 6 }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                style={{ minHeight: "300px" }}
              />
            </div>
          </div>

          {/* SEO METADATA SECTION */}
          <div className="admin-card" style={{ background: '#f8fafc', padding: 15, marginBottom: 20 }}>
             <h4 style={{ margin: '0 0 10px 0' }}>🔍 SEO Metadata</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
               <div className="admin-form-group" style={{ margin: 0 }}>
                 <label className="admin-label">Meta Title</label>
                 <input className="admin-input" placeholder="e.g. Privacy Policy | G Digital India"
                   value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
               </div>
               <div className="admin-form-group" style={{ margin: 0 }}>
                 <label className="admin-label">Meta Description</label>
                 <textarea className="admin-input" placeholder="e.g. Our privacy policy..." style={{ minHeight: 80, resize: 'vertical' }}
                   value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
               </div>
               <div className="admin-form-group" style={{ margin: 0 }}>
                 <label className="admin-label">Meta Keywords</label>
                 <input className="admin-input" placeholder="e.g. privacy policy, terms"
                   value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} />
               </div>
             </div>
          </div>

          {msg && (
            <div
              style={{
                padding: "12px",
                borderRadius: 6,
                marginBottom: "15px",
                background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2",
                color: msg.startsWith("✅") ? "#15803d" : "#b91c1c",
                fontWeight: 600,
              }}
            >
              {msg}
            </div>
          )}

          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
