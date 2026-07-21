'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '150px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: 8 }}>Loading Editor...</div>
})
import 'react-quill-new/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'clean']
  ],
  clipboard: {
    matchVisual: false,
  }
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
]
/* ── Font Awesome icon suggestions for "Why Choose Us" ── */
const FA_VALUE_ICONS = [
  { cls: 'fa-solid fa-user-tie',         label: 'Professional' },
  { cls: 'fa-solid fa-headset',           label: 'Support' },
  { cls: 'fa-solid fa-eye',               label: 'Transparency' },
  { cls: 'fa-solid fa-users',             label: 'Team' },
  { cls: 'fa-solid fa-chart-line',        label: 'Track Record' },
  { cls: 'fa-solid fa-star',              label: 'Ethics' },
  { cls: 'fa-solid fa-shield-halved',     label: 'Security' },
  { cls: 'fa-solid fa-rocket',            label: 'Growth' },
  { cls: 'fa-solid fa-trophy',            label: 'Award' },
  { cls: 'fa-solid fa-handshake',         label: 'Partnership' },
  { cls: 'fa-solid fa-lightbulb',         label: 'Innovation' },
  { cls: 'fa-solid fa-bullseye',          label: 'Target' },
  { cls: 'fa-solid fa-thumbs-up',         label: 'Quality' },
  { cls: 'fa-solid fa-clock',             label: 'Timely' },
  { cls: 'fa-solid fa-lock',              label: 'Trust' },
  { cls: 'fa-solid fa-layers',            label: 'Layers' },
  { cls: 'fa-solid fa-code',              label: 'Tech' },
  { cls: 'fa-solid fa-magnifying-glass',  label: 'Research' },
]

/* ── Font Awesome icon suggestions for Industries ── */
const FA_INDUSTRY_ICONS = [
  { cls: 'fa-solid fa-plane',             label: 'Travel' },
  { cls: 'fa-solid fa-hotel',             label: 'Hotel' },
  { cls: 'fa-solid fa-building',          label: 'Real Estate' },
  { cls: 'fa-solid fa-cart-shopping',     label: 'E-Commerce' },
  { cls: 'fa-solid fa-graduation-cap',    label: 'Education' },
  { cls: 'fa-solid fa-heart-pulse',       label: 'Healthcare' },
  { cls: 'fa-solid fa-industry',          label: 'Manufacturing' },
  { cls: 'fa-solid fa-coins',             label: 'Finance' },
  { cls: 'fa-solid fa-utensils',          label: 'Food' },
  { cls: 'fa-solid fa-car',               label: 'Auto' },
  { cls: 'fa-solid fa-shirt',             label: 'Fashion' },
  { cls: 'fa-solid fa-dumbbell',          label: 'Fitness' },
  { cls: 'fa-solid fa-gavel',             label: 'Legal' },
  { cls: 'fa-solid fa-seedling',          label: 'Agriculture' },
  { cls: 'fa-solid fa-microchip',         label: 'Tech' },
  { cls: 'fa-solid fa-film',              label: 'Media' },
]

const defaultValues = [
  { icon: 'fa-solid fa-user-tie',        title: 'Trained Professionals',  desc: 'Our team comprises skilled and certified digital marketing professionals with hands-on expertise.' },
  { icon: 'fa-solid fa-headset',         title: '24/7 Technical Support',  desc: 'Round-the-clock support ensures your campaigns and websites are always running.' },
  { icon: 'fa-solid fa-eye',             title: 'Work Transparency',       desc: 'We believe in complete transparency — from strategy to execution.' },
  { icon: 'fa-solid fa-users',           title: 'Team Effort',             desc: 'Every project is backed by coordinated team effort.' },
  { icon: 'fa-solid fa-chart-line',      title: 'Proven Track Record',     desc: '7+ years and 2000+ satisfied clients speak for themselves.' },
  { icon: 'fa-solid fa-star',            title: 'Ethical Work Practices',  desc: 'We follow white-hat, ethical approaches in all our services.' },
]

const defaultIndustries = [
  { icon: 'fa-solid fa-plane',            name: 'Travel & Tour' },
  { icon: 'fa-solid fa-hotel',            name: 'Hotel & Hospitality' },
  { icon: 'fa-solid fa-building',         name: 'Real Estate' },
  { icon: 'fa-solid fa-cart-shopping',    name: 'E-Commerce' },
  { icon: 'fa-solid fa-graduation-cap',   name: 'Education' },
  { icon: 'fa-solid fa-heart-pulse',      name: 'Healthcare' },
  { icon: 'fa-solid fa-industry',         name: 'Manufacturing' },
  { icon: 'fa-solid fa-coins',            name: 'Finance' },
]

/* ── Icon Picker Component ── */
function IconPicker({ value, onChange, suggestions }: { value: string; onChange: (cls: string) => void; suggestions: { cls: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Preview */}
        <div style={{
          width: 42, height: 42, borderRadius: 8, background: '#f1f5f9',
          border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f97316', fontSize: 18, flexShrink: 0,
        }}>
          {value ? <i className={value} /> : <i className="fa-solid fa-icons" style={{ color: '#cbd5e1' }} />}
        </div>
        {/* Text input */}
        <input
          className="admin-input"
          placeholder="e.g. fa-solid fa-rocket"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1 }}
        />
        {/* Toggle picker */}
        <button type="button" onClick={() => setOpen(o => !o)}
          className="admin-btn-secondary" style={{ padding: '8px 12px', fontSize: 13, flexShrink: 0 }}>
          <i className="fa-solid fa-grid-2" /> Pick
        </button>
      </div>
      {/* Dropdown grid */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100,
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: 12,
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6,
          width: '100%', maxWidth: 420, marginTop: 4,
        }}>
          {suggestions.map(s => (
            <button
              key={s.cls} type="button"
              title={`${s.label} — ${s.cls}`}
              onClick={() => { onChange(s.cls); setOpen(false) }}
              style={{
                padding: '10px 6px', border: '1px solid',
                borderColor: value === s.cls ? '#f97316' : '#e2e8f0',
                borderRadius: 8, background: value === s.cls ? '#fff7ed' : '#f8fafc',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4, fontSize: 18, color: '#f97316',
                transition: 'all 0.15s',
              }}
            >
              <i className={s.cls} />
              <span style={{ fontSize: 9, color: '#64748b', lineHeight: 1 }}>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminAbout() {
  const [formData, setFormData] = useState<any>({
    eyebrow: '', titleHTML: '', tagline: '', bgImageUrl: '',
    imageUrl: '', badgeNum: '', badgeText: '',
    para1: '', para2: '', btnText: '', btnLink: '',
    missionText: '', visionText: '', valuesText: '',
    values: [],
    industries: [],
    teamText: '',
    ctaTitle: '', ctaDesc: '', ctaBtnText: '', ctaBtnLink: '',
    metaTitle: '', metaDescription: '', metaKeywords: ''
  })

  const [activeTab, setActiveTab] = useState<'hero' | 'whoweare' | 'mvv' | 'whychoose' | 'industries' | 'team' | 'cta' | 'seo'>('hero')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/about')
      if (res.ok) {
        const data = await res.json()
        if (Object.keys(data).length > 0) {
          setFormData({
            ...data,
            values:     data.values || [],
            industries: data.industries || [],
          })
        } else {
          setFormData((p: any) => ({ ...p, values: [], industries: [] }))
        }
      }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'about')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { url } = await res.json()
      setFormData((p: any) => ({ ...p, [field]: url }))
    } catch { alert('Upload failed') }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setSaved(false)
    const res = await fetch('/api/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else alert('Failed to save.')
    setSubmitting(false)
  }

  /* value helpers */
  const handleValueChange = (i: number, field: string, val: string) => {
    const arr = [...(formData.values || [])]
    if (!arr[i]) arr[i] = { icon: '', title: '', desc: '' }
    arr[i] = { ...arr[i], [field]: val }
    setFormData({ ...formData, values: arr })
  }
  const addValue    = () => setFormData({ ...formData, values: [...(formData.values || []), { icon: 'fa-solid fa-star', title: '', desc: '' }] })
  const removeValue = (i: number) => { const arr = [...(formData.values || [])]; arr.splice(i, 1); setFormData({ ...formData, values: arr }) }

  /* industry helpers */
  const handleIndustryChange = (i: number, field: string, val: string) => {
    const arr = [...(formData.industries || [])]
    if (!arr[i]) arr[i] = { icon: '', name: '' }
    arr[i] = { ...arr[i], [field]: val }
    setFormData({ ...formData, industries: arr })
  }
  const addIndustry    = () => setFormData({ ...formData, industries: [...(formData.industries || []), { icon: 'fa-solid fa-building', name: '' }] })
  const removeIndustry = (i: number) => { const arr = [...(formData.industries || [])]; arr.splice(i, 1); setFormData({ ...formData, industries: arr }) }

  if (loading) return (
    <div className="admin-empty" style={{ marginTop: 80 }}>
      <div className="admin-empty-icon">⏳</div>
      <p className="admin-empty-text">Loading About Data...</p>
    </div>
  )

  const tabs = [
    { key: 'hero',       label: 'Hero Banner',    fa: 'fa-solid fa-image' },
    { key: 'whoweare',   label: 'Who We Are',     fa: 'fa-solid fa-users' },
    { key: 'mvv',        label: 'Mission/Vision', fa: 'fa-solid fa-bullseye' },
    { key: 'whychoose',  label: 'Why Choose Us',  fa: 'fa-solid fa-star' },
    { key: 'industries', label: 'Industries',     fa: 'fa-solid fa-industry' },
    { key: 'team',       label: 'Team',           fa: 'fa-solid fa-people-group' },
    { key: 'cta',        label: 'CTA Section',    fa: 'fa-solid fa-rocket' },
    { key: 'seo',        label: 'SEO Metadata',   fa: 'fa-solid fa-magnifying-glass' },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title"><i className="fa-solid fa-address-card" style={{ marginRight: 10, color: '#f97316' }} />About Inner Page</h1>
        <p className="admin-page-subtitle">Manage all sections of the About page — fully dynamic</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '9px 18px', borderRadius: 8, border: '1px solid',
              borderColor: activeTab === tab.key ? '#f97316' : '#e2e8f0',
              background: activeTab === tab.key ? 'linear-gradient(135deg,#f97316,#fbbf24)' : '#fff',
              color: activeTab === tab.key ? '#fff' : '#64748b',
              fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 7,
            }}>
            <i className={tab.fa} /> {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        {/* ══ HERO ══ */}
        {activeTab === 'hero' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <i className="fa-solid fa-image" style={{ marginRight: 8, color: '#f97316' }} />Hero Banner Section
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Eyebrow Tag Text</label>
                <input className="admin-input" placeholder="e.g. Digital Marketing Company"
                  value={formData.eyebrow} onChange={e => setFormData({ ...formData, eyebrow: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Tagline (subtitle)</label>
                <input className="admin-input" placeholder="e.g. A reputed Digital Marketing company..."
                  value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Hero Title <span style={{ color: '#94a3b8', fontWeight: 400 }}>(HTML allowed — wrap orange text in &lt;em&gt;)</span></label>
              <textarea className="admin-textarea" rows={2} placeholder='e.g. About <em>G Digital India</em>'
                value={formData.titleHTML} onChange={e => setFormData({ ...formData, titleHTML: e.target.value })} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Hero Background Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {formData.bgImageUrl && (
                  <img src={formData.bgImageUrl} alt="BG"
                    style={{ width: 140, height: 80, objectFit: 'cover', borderRadius: 8, border: '2px solid #e2e8f0' }} />
                )}
                <div>
                  <input type="file" accept="image/*" id="hero-bg-img" style={{ display: 'none' }}
                    onChange={e => handleImageUpload(e, 'bgImageUrl')} />
                  <label htmlFor="hero-bg-img" className="admin-btn-secondary" style={{ cursor: 'pointer' }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: 6 }} />
                    {uploading ? 'Uploading...' : 'Upload Background'}
                  </label>
                  <p style={{ margin: '5px 0 0', fontSize: 11, color: '#94a3b8' }}>Recommended: 1920×1080 JPG/PNG</p>
                </div>
                {formData.bgImageUrl && (
                  <button type="button" className="admin-btn-danger"
                    onClick={() => setFormData({ ...formData, bgImageUrl: '' })}>
                    <i className="fa-solid fa-trash" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ WHO WE ARE ══ */}
        {activeTab === 'whoweare' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <i className="fa-solid fa-users" style={{ marginRight: 8, color: '#f97316' }} />Who We Are Section
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Experience Badge Number</label>
                <input className="admin-input" placeholder="e.g. 7+"
                  value={formData.badgeNum} onChange={e => setFormData({ ...formData, badgeNum: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Experience Badge Label</label>
                <input className="admin-input" placeholder="e.g. Years of Excellence"
                  value={formData.badgeText} onChange={e => setFormData({ ...formData, badgeText: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">CTA Button Text</label>
                <input className="admin-input" placeholder="e.g. Get Free Consultation"
                  value={formData.btnText} onChange={e => setFormData({ ...formData, btnText: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">CTA Button Link</label>
                <input className="admin-input" placeholder="e.g. /contact"
                  value={formData.btnLink} onChange={e => setFormData({ ...formData, btnLink: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Paragraph 1</label>
              <div style={{ background: '#fff' }}>
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  value={formData.para1}
                  onChange={val => setFormData({ ...formData, para1: val })}
                  style={{ height: 'auto' }}
                />
              </div>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Paragraph 2</label>
              <div style={{ background: '#fff' }}>
                <ReactQuill
                  theme="snow"
                  modules={quillModules}
                  formats={quillFormats}
                  value={formData.para2}
                  onChange={val => setFormData({ ...formData, para2: val })}
                  style={{ height: 'auto' }}
                />
              </div>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Main Section Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview"
                    style={{ width: 90, height: 110, objectFit: 'cover', borderRadius: 8, border: '2px solid #e2e8f0' }} />
                )}
                <div>
                  <input type="file" accept="image/*" id="main-img" style={{ display: 'none' }}
                    onChange={e => handleImageUpload(e, 'imageUrl')} />
                  <label htmlFor="main-img" className="admin-btn-secondary" style={{ cursor: 'pointer' }}>
                    <i className="fa-solid fa-camera" style={{ marginRight: 6 }} />
                    {uploading ? 'Uploading...' : 'Upload Main Image'}
                  </label>
                  <p style={{ margin: '5px 0 0', fontSize: 11, color: '#94a3b8' }}>Recommended: 600×700px portrait</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ MISSION / VISION ══ */}
        {activeTab === 'mvv' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <i className="fa-solid fa-bullseye" style={{ marginRight: 8, color: '#f97316' }} />Mission / Vision / Values
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>These texts appear in the tabbed section on the About page.</p>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label"><i className="fa-solid fa-bullseye" style={{ marginRight: 6, color: '#f97316' }} />Our Mission Text</label>
              <div style={{ background: '#fff' }}>
                <ReactQuill 
                  theme="snow" modules={quillModules} formats={quillFormats}
                  value={formData.missionText} onChange={val => setFormData({ ...formData, missionText: val })} 
                />
              </div>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label"><i className="fa-solid fa-eye" style={{ marginRight: 6, color: '#f97316' }} />Our Vision Text</label>
              <div style={{ background: '#fff' }}>
                <ReactQuill 
                  theme="snow" modules={quillModules} formats={quillFormats}
                  value={formData.visionText} onChange={val => setFormData({ ...formData, visionText: val })} 
                />
              </div>
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label"><i className="fa-solid fa-award" style={{ marginRight: 6, color: '#f97316' }} />Core Values Text</label>
              <div style={{ background: '#fff' }}>
                <ReactQuill 
                  theme="snow" modules={quillModules} formats={quillFormats}
                  value={formData.valuesText} onChange={val => setFormData({ ...formData, valuesText: val })} 
                />
              </div>
            </div>
          </div>
        )}

        {/* ══ WHY CHOOSE US ══ */}
        {activeTab === 'whychoose' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b' }}>
                  <i className="fa-solid fa-star" style={{ marginRight: 8, color: '#f97316' }} />Why Choose Us — Feature Cards
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>Click "Pick" to choose a Font Awesome icon, or type the class manually.</p>
              </div>
              <button type="button" onClick={addValue} className="admin-btn-secondary">
                <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Add Card
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(formData.values || []).map((v: any, i: number) => (
                <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>
                      <i className="fa-solid fa-grip-dots" style={{ marginRight: 6, color: '#94a3b8' }} />Card #{i + 1}
                    </span>
                    <button type="button" onClick={() => removeValue(i)} className="admin-btn-danger" style={{ padding: '5px 10px', fontSize: 12 }}>
                      <i className="fa-solid fa-trash" /> Remove
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>Font Awesome Icon</label>
                      <IconPicker value={v.icon} onChange={val => handleValueChange(i, 'icon', val)} suggestions={FA_VALUE_ICONS} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>Card Title</label>
                      <input className="admin-input" placeholder="e.g. Trained Professionals"
                        value={v.title} onChange={e => handleValueChange(i, 'title', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>Card Description</label>
                    <input className="admin-input" placeholder="Short description..."
                      value={v.desc} onChange={e => handleValueChange(i, 'desc', e.target.value)} />
                  </div>
                </div>
              ))}
              {(formData.values || []).length === 0 && (
                <div className="admin-empty">
                  <div className="admin-empty-icon" style={{ fontSize: 32 }}><i className="fa-solid fa-star" /></div>
                  <p className="admin-empty-text">No cards yet. Click "Add Card" to start.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ INDUSTRIES ══ */}
        {activeTab === 'industries' && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b' }}>
                  <i className="fa-solid fa-industry" style={{ marginRight: 8, color: '#f97316' }} />Industries We Serve
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>Click "Pick" to choose a Font Awesome icon for each industry.</p>
              </div>
              <button type="button" onClick={addIndustry} className="admin-btn-secondary">
                <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />Add Industry
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {(formData.industries || []).map((ind: any, i: number) => (
                <div key={i} style={{ padding: 16, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#475569' }}>Industry #{i + 1}</span>
                    <button type="button" onClick={() => removeIndustry(i)} className="admin-btn-danger" style={{ padding: '4px 10px', fontSize: 12 }}>
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>Font Awesome Icon</label>
                    <IconPicker value={ind.icon} onChange={val => handleIndustryChange(i, 'icon', val)} suggestions={FA_INDUSTRY_ICONS} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>Industry Name</label>
                    <input className="admin-input" placeholder="e.g. Travel & Tour"
                      value={ind.name} onChange={e => handleIndustryChange(i, 'name', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
            {(formData.industries || []).length === 0 && (
              <div className="admin-empty">
                <div className="admin-empty-icon"><i className="fa-solid fa-industry" /></div>
                <p className="admin-empty-text">No industries yet. Click "Add Industry" to start.</p>
              </div>
            )}
          </div>
        )}

        {/* ══ TEAM ══ */}
        {activeTab === 'team' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <i className="fa-solid fa-people-group" style={{ marginRight: 8, color: '#f97316' }} />Team Section Description
            </h3>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Team Description Text</label>
              <div style={{ background: '#fff' }}>
                <ReactQuill 
                  theme="snow" modules={quillModules} formats={quillFormats}
                  value={formData.teamText} onChange={val => setFormData({ ...formData, teamText: val })} 
                />
              </div>
            </div>
          </div>
        )}

        {/* ══ CTA ══ */}
        {activeTab === 'cta' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <i className="fa-solid fa-rocket" style={{ marginRight: 8, color: '#f97316' }} />CTA (Call-to-Action) Section
            </h3>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">CTA Title</label>
              <input className="admin-input" placeholder="e.g. Let's Build Something Great Together"
                value={formData.ctaTitle} onChange={e => setFormData({ ...formData, ctaTitle: e.target.value })} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">CTA Description</label>
              <textarea className="admin-textarea" rows={3} placeholder="e.g. Our team is ready to help..."
                value={formData.ctaDesc} onChange={e => setFormData({ ...formData, ctaDesc: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Button Text</label>
                <input className="admin-input" placeholder="e.g. Contact Us Today"
                  value={formData.ctaBtnText} onChange={e => setFormData({ ...formData, ctaBtnText: e.target.value })} />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label className="admin-label">Button Link</label>
                <input className="admin-input" placeholder="e.g. /contact"
                  value={formData.ctaBtnLink} onChange={e => setFormData({ ...formData, ctaBtnLink: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {/* ══ SEO ══ */}
        {activeTab === 'seo' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h3 style={{ margin: 0, fontSize: 15, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <i className="fa-solid fa-magnifying-glass" style={{ marginRight: 8, color: '#f97316' }} />SEO Metadata
            </h3>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Meta Title</label>
              <input className="admin-input" placeholder="e.g. Best Digital Marketing Agency in Jaipur | G Digital India"
                value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Meta Description</label>
              <textarea className="admin-input" placeholder="e.g. We are the leading agency..." style={{ minHeight: 80, resize: 'vertical' }}
                value={formData.metaDescription} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} />
            </div>
            <div className="admin-form-group" style={{ margin: 0 }}>
              <label className="admin-label">Meta Keywords</label>
              <input className="admin-input" placeholder="e.g. digital marketing, Jaipur, SEO agency"
                value={formData.metaKeywords} onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })} />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 24 }}>
          {saved && (
            <span style={{ color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: 6 }} />Saved successfully!
            </span>
          )}
          <button type="submit" disabled={submitting || uploading} className="admin-btn-primary" style={{ padding: '12px 36px', fontSize: 15 }}>
            {submitting
              ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} />Saving...</>
              : <><i className="fa-solid fa-floppy-disk" style={{ marginRight: 8 }} />Save Changes</>
            }
          </button>
        </div>
      </form>
    </div>
  )
}
