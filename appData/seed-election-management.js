// seed-election-management.js
// Run with: node appData/seed-election-management.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb://gdigitalindia2_db_user:NCdIHHmCP8eNyC9j@ac-rcmtkhm-shard-00-00.r1lhqir.mongodb.net:27017,ac-rcmtkhm-shard-00-01.r1lhqir.mongodb.net:27017,ac-rcmtkhm-shard-00-02.r1lhqir.mongodb.net:27017/gdi-db?ssl=true&authSource=admin&retryWrites=true&w=majority";

const CARD_STYLES = `
<style>
  .gdi-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    margin: 24px 0 35px;
    width: 100%;
  }
  @media (max-width: 640px) {
    .gdi-cards-grid {
      grid-template-columns: 1fr;
    }
  }
  .gdi-feature-card {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.09) !important;
    border-radius: 16px !important;
    padding: 28px 20px 24px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative !important;
    overflow: hidden !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
    backdrop-filter: blur(8px) !important;
  }
  .gdi-feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent-border, #f97316);
    opacity: 0;
    transition: opacity 0.35s ease;
  }
  .gdi-feature-card:hover {
    transform: translateY(-6px) !important;
    background: rgba(255, 255, 255, 0.055) !important;
    border-color: var(--accent-border, rgba(249, 115, 22, 0.45)) !important;
    box-shadow: 0 16px 36px -10px var(--accent-glow, rgba(249, 115, 22, 0.2)) !important;
  }
  .gdi-feature-card:hover::before {
    opacity: 1;
  }
  .gdi-icon-circle {
    width: 66px !important;
    height: 66px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-bottom: 18px !important;
    background: var(--circle-bg, rgba(249, 115, 22, 0.12)) !important;
    border: 1px solid var(--circle-border, rgba(249, 115, 22, 0.25)) !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease !important;
    flex-shrink: 0 !important;
  }
  .gdi-feature-card:hover .gdi-icon-circle {
    transform: scale(1.12) rotate(3deg) !important;
    box-shadow: 0 8px 24px var(--accent-glow, rgba(249, 115, 22, 0.25)) !important;
  }
  .gdi-icon-circle svg {
    width: 30px !important;
    height: 30px !important;
    stroke: var(--circle-stroke, #f97316) !important;
    fill: none !important;
    stroke-width: 2 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    display: block !important;
  }
  .gdi-card-title {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 1.12rem !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    margin: 0 0 8px 0 !important;
    line-height: 1.35 !important;
  }
  .gdi-card-desc {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 0.88rem !important;
    color: #94a3b8 !important;
    line-height: 1.6 !important;
    margin: 0 !important;
  }
</style>
`;

const electionService = {
  title: "Election Management Solution",
  slug: "election-management-solution",
  short: "Election Management",
  category: "IT Solutions & Software",
  industry: "",
  descriptionHeading: "Smart Election Management Solutions – चुनाव की तैयारी, हमारे साथ!",
  description: `<p>G Digital India provides a comprehensive <strong>Election Management Solution</strong> powered by advanced mobile technology and digital tools. Our platform helps candidates, political parties, and campaign managers streamline their entire election campaign — from voter management to publicity materials.</p>
<p>We offer a <strong>Voter App with Mobile Thermal Printer Support</strong> that allows you to search voters, print voter slips, manage alphabetical voter lists, and run bulk communication campaigns — all from your smartphone.</p>`,
  highlight: "Complete digital election campaign management with voter slip printing, bulk messaging, OBD campaigns, and election publicity solutions.",
  tags: [
    "Election Management",
    "Voter App",
    "Voter Slip Printer",
    "Digital Voter List",
    "OBD Campaigns",
    "Election Publicity",
    "Bulk WhatsApp",
    "Voice Call Campaign"
  ],
  image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80",
  contentBlocks: [
    {
      title: "Election Management Tools",
      text: `${CARD_STYLES}
<p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">Our election management tools are designed to give you a complete edge during elections:</p>
<div class="gdi-cards-grid">

  <!-- 1. Voter Searching App -->
  <div class="gdi-feature-card" style="--accent-border: #06b6d4; --accent-glow: rgba(6, 182, 212, 0.25); --circle-bg: rgba(6, 182, 212, 0.12); --circle-border: rgba(6, 182, 212, 0.3); --circle-stroke: #22d3ee;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><circle cx="12" cy="10" r="3"/><line x1="14.5" y1="12.5" x2="17" y2="15"/></svg>
    </div>
    <h4 class="gdi-card-title">Voter Searching App</h4>
    <p class="gdi-card-desc">Instantly search any voter by name, EPIC, or mobile number</p>
  </div>

  <!-- 2. Voter Slip Printer -->
  <div class="gdi-feature-card" style="--accent-border: #f97316; --accent-glow: rgba(249, 115, 22, 0.25); --circle-bg: rgba(249, 115, 22, 0.12); --circle-border: rgba(249, 115, 22, 0.3); --circle-stroke: #fb923c;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    </div>
    <h4 class="gdi-card-title">Voter Slip Printer</h4>
    <p class="gdi-card-desc">Print voter slips wirelessly using portable mobile thermal printers</p>
  </div>

  <!-- 3. Digital Voter List -->
  <div class="gdi-feature-card" style="--accent-border: #10b981; --accent-glow: rgba(16, 185, 129, 0.25); --circle-bg: rgba(16, 185, 129, 0.12); --circle-border: rgba(16, 185, 129, 0.3); --circle-stroke: #34d399;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>
    </div>
    <h4 class="gdi-card-title">Digital Voter List</h4>
    <p class="gdi-card-desc">Alphabetical and house-wise voter list management at your fingertips</p>
  </div>

  <!-- 4. House Wise Voter Slip -->
  <div class="gdi-feature-card" style="--accent-border: #f59e0b; --accent-glow: rgba(245, 158, 11, 0.25); --circle-bg: rgba(245, 158, 11, 0.12); --circle-border: rgba(245, 158, 11, 0.3); --circle-stroke: #fbbf24;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><polyline points="9 10 12 12 15 9"/></svg>
    </div>
    <h4 class="gdi-card-title">House Wise Voter Slip</h4>
    <p class="gdi-card-desc">Organize and distribute voter slips booth-by-booth efficiently</p>
  </div>

  <!-- 5. Printed Voter Slips -->
  <div class="gdi-feature-card" style="--accent-border: #a855f7; --accent-glow: rgba(168, 85, 247, 0.25); --circle-bg: rgba(168, 85, 247, 0.12); --circle-border: rgba(168, 85, 247, 0.3); --circle-stroke: #c084fc;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    </div>
    <h4 class="gdi-card-title">Printed Voter Slips</h4>
    <p class="gdi-card-desc">High-quality printed voter slip materials ready for door-to-door distribution</p>
  </div>

  <!-- 6. Dummy Voting Machine -->
  <div class="gdi-feature-card" style="--accent-border: #f43f5e; --accent-glow: rgba(244, 63, 94, 0.25); --circle-bg: rgba(244, 63, 94, 0.12); --circle-border: rgba(244, 63, 94, 0.3); --circle-stroke: #fb7185;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="10" y2="8"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="6" y1="16" x2="10" y2="16"/><circle cx="16" cy="8" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="16" cy="16" r="2"/></svg>
    </div>
    <h4 class="gdi-card-title">Dummy Voting Machine</h4>
    <p class="gdi-card-desc">Hands-on EVM demonstration setup for voter awareness and mock polls</p>
  </div>

  <!-- 7. Booth Bags -->
  <div class="gdi-feature-card" style="--accent-border: #3b82f6; --accent-glow: rgba(59, 130, 246, 0.25); --circle-bg: rgba(59, 130, 246, 0.12); --circle-border: rgba(59, 130, 246, 0.3); --circle-stroke: #60a5fa;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    </div>
    <h4 class="gdi-card-title">Booth Bags</h4>
    <p class="gdi-card-desc">Complete branded booth management kits for polling agents</p>
  </div>

  <!-- 8. Pop Up Campaigns -->
  <div class="gdi-feature-card" style="--accent-border: #ec4899; --accent-glow: rgba(236, 72, 153, 0.25); --circle-bg: rgba(236, 72, 153, 0.12); --circle-border: rgba(236, 72, 153, 0.3); --circle-stroke: #f472b6;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
    </div>
    <h4 class="gdi-card-title">Pop Up Campaigns</h4>
    <p class="gdi-card-desc">On-ground flash campaigns and street publicity drives</p>
  </div>

  <!-- 9. OBD Campaigns -->
  <div class="gdi-feature-card" style="--accent-border: #6366f1; --accent-glow: rgba(99, 102, 241, 0.25); --circle-bg: rgba(99, 102, 241, 0.12); --circle-border: rgba(99, 102, 241, 0.3); --circle-stroke: #818cf8;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14 2a6 6 0 0 1 6 6"/><path d="M14 6a2 2 0 0 1 2 2"/></svg>
    </div>
    <h4 class="gdi-card-title">OBD Campaigns</h4>
    <p class="gdi-card-desc">Automated outbound voice call broadcasts delivering candidate speeches</p>
  </div>

  <!-- 10. Meta Campaigns -->
  <div class="gdi-feature-card" style="--accent-border: #84cc16; --accent-glow: rgba(132, 204, 22, 0.25); --circle-bg: rgba(132, 204, 22, 0.12); --circle-border: rgba(132, 204, 22, 0.3); --circle-stroke: #a3e635;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
    </div>
    <h4 class="gdi-card-title">Meta Campaigns</h4>
    <p class="gdi-card-desc">Geo-targeted Facebook and Instagram advertising across constituency</p>
  </div>

  <!-- 11. Bulk SMS Marketing -->
  <div class="gdi-feature-card" style="--accent-border: #f43f5e; --accent-glow: rgba(244, 63, 94, 0.25); --circle-bg: rgba(244, 63, 94, 0.12); --circle-border: rgba(244, 63, 94, 0.3); --circle-stroke: #fb7185;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/></svg>
    </div>
    <h4 class="gdi-card-title">Bulk SMS Marketing</h4>
    <p class="gdi-card-desc">Instant personalized mass SMS broadcasts to reach every voter directly</p>
  </div>

  <!-- 12. WhatsApp Marketing -->
  <div class="gdi-feature-card" style="--accent-border: #10b981; --accent-glow: rgba(16, 185, 129, 0.25); --circle-bg: rgba(16, 185, 129, 0.12); --circle-border: rgba(16, 185, 129, 0.3); --circle-stroke: #34d399;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9.5 9.5c.3 1.5 1.5 2.7 3 3l1.5-1.5"/></svg>
    </div>
    <h4 class="gdi-card-title">WhatsApp Marketing</h4>
    <p class="gdi-card-desc">Bulk WhatsApp outreach with video appeals, manifestos, and interactive replies</p>
  </div>

</div>`,
      image: ""
    },
    {
      title: "Election Publicity Solution",
      text: `${CARD_STYLES}
<p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">Make your election campaign visible and impactful with our full range of Election Publicity Materials:</p>
<div class="gdi-cards-grid">

  <!-- 1. T-Shirts -->
  <div class="gdi-feature-card" style="--accent-border: #f97316; --accent-glow: rgba(249, 115, 22, 0.25); --circle-bg: rgba(249, 115, 22, 0.12); --circle-border: rgba(249, 115, 22, 0.3); --circle-stroke: #fb923c;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
    </div>
    <h4 class="gdi-card-title">T-Shirts</h4>
    <p class="gdi-card-desc">Custom branded election campaign t-shirts for party workers</p>
  </div>

  <!-- 2. Wall Clock -->
  <div class="gdi-feature-card" style="--accent-border: #06b6d4; --accent-glow: rgba(6, 182, 212, 0.25); --circle-bg: rgba(6, 182, 212, 0.12); --circle-border: rgba(6, 182, 212, 0.3); --circle-stroke: #22d3ee;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </div>
    <h4 class="gdi-card-title">Wall Clock</h4>
    <p class="gdi-card-desc">Branded election wall clocks for voter homes and meeting halls</p>
  </div>

  <!-- 3. Flags & Banners -->
  <div class="gdi-feature-card" style="--accent-border: #f43f5e; --accent-glow: rgba(244, 63, 94, 0.25); --circle-bg: rgba(244, 63, 94, 0.12); --circle-border: rgba(244, 63, 94, 0.3); --circle-stroke: #fb7185;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
    </div>
    <h4 class="gdi-card-title">Flags & Banners</h4>
    <p class="gdi-card-desc">High-visibility party flags, cloth banners, and vehicle flags</p>
  </div>

  <!-- 4. Campaign Caps -->
  <div class="gdi-feature-card" style="--accent-border: #10b981; --accent-glow: rgba(16, 185, 129, 0.25); --circle-bg: rgba(16, 185, 129, 0.12); --circle-border: rgba(16, 185, 129, 0.3); --circle-stroke: #34d399;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M2 17a5 5 0 0 0 10 0V9a4 4 0 0 0-8 0v8"/><path d="M12 17h10a2 2 0 0 0 0-4h-3"/></svg>
    </div>
    <h4 class="gdi-card-title">Campaign Caps</h4>
    <p class="gdi-card-desc">Branded election campaign caps & sun visors for mass rallies</p>
  </div>

  <!-- 5. Patka / Scarves -->
  <div class="gdi-feature-card" style="--accent-border: #f59e0b; --accent-glow: rgba(245, 158, 11, 0.25); --circle-bg: rgba(245, 158, 11, 0.12); --circle-border: rgba(245, 158, 11, 0.3); --circle-stroke: #fbbf24;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M4 19l4-14 8 14-4-2-4 2z"/><circle cx="12" cy="7" r="2"/></svg>
    </div>
    <h4 class="gdi-card-title">Patka / Scarves</h4>
    <p class="gdi-card-desc">Traditional party scarves, stoles, and ceremonial election patkas</p>
  </div>

  <!-- 6. Jhallar (Lari) -->
  <div class="gdi-feature-card" style="--accent-border: #a855f7; --accent-glow: rgba(168, 85, 247, 0.25); --circle-bg: rgba(168, 85, 247, 0.12); --circle-border: rgba(168, 85, 247, 0.3); --circle-stroke: #c084fc;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M2 6c3 3 7 3 10 0s7-3 10 0"/><path d="M2 12c3 3 7 3 10 0s7-3 10 0"/><path d="M2 18c3 3 7 3 10 0s7-3 10 0"/></svg>
    </div>
    <h4 class="gdi-card-title">Jhallar (Lari)</h4>
    <p class="gdi-card-desc">Decorative campaign bunting strings for street and stage decorations</p>
  </div>

  <!-- 7. Pocket Badge -->
  <div class="gdi-feature-card" style="--accent-border: #3b82f6; --accent-glow: rgba(59, 130, 246, 0.25); --circle-bg: rgba(59, 130, 246, 0.12); --circle-border: rgba(59, 130, 246, 0.3); --circle-stroke: #60a5fa;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>
    <h4 class="gdi-card-title">Pocket Badge</h4>
    <p class="gdi-card-desc">Custom ID badges, photo badges, and pocket cards for party cadre</p>
  </div>

  <!-- 8. Key Chain -->
  <div class="gdi-feature-card" style="--accent-border: #ec4899; --accent-glow: rgba(236, 72, 153, 0.25); --circle-bg: rgba(236, 72, 153, 0.12); --circle-border: rgba(236, 72, 153, 0.3); --circle-stroke: #f472b6;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/></svg>
    </div>
    <h4 class="gdi-card-title">Key Chain</h4>
    <p class="gdi-card-desc">Custom branded acrylic and metallic keychain giveaways</p>
  </div>

  <!-- 9. Diary & Planners -->
  <div class="gdi-feature-card" style="--accent-border: #6366f1; --accent-glow: rgba(99, 102, 241, 0.25); --circle-bg: rgba(99, 102, 241, 0.12); --circle-border: rgba(99, 102, 241, 0.3); --circle-stroke: #818cf8;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="13" y2="11"/></svg>
    </div>
    <h4 class="gdi-card-title">Diary & Planners</h4>
    <p class="gdi-card-desc">Branded executive notebooks and diaries for key leaders</p>
  </div>

  <!-- 10. Custom Pens -->
  <div class="gdi-feature-card" style="--accent-border: #84cc16; --accent-glow: rgba(132, 204, 22, 0.25); --circle-bg: rgba(132, 204, 22, 0.12); --circle-border: rgba(132, 204, 22, 0.3); --circle-stroke: #a3e635;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
    </div>
    <h4 class="gdi-card-title">Custom Pens</h4>
    <p class="gdi-card-desc">Printed promotional pens for widespread distribution</p>
  </div>

</div>`,
      image: ""
    },
    {
      title: "Voter App – Mobile Thermal Printer Support",
      text: `${CARD_STYLES}
<p style="color: #94a3b8; font-size: 1.05rem; line-height: 1.8; margin-bottom: 20px;">Our dedicated Voter App is the heart of our election management solution. Key features include:</p>
<div class="gdi-cards-grid">

  <!-- 1. Search (Khoje) -->
  <div class="gdi-feature-card" style="--accent-border: #f97316; --accent-glow: rgba(249, 115, 22, 0.25); --circle-bg: rgba(249, 115, 22, 0.12); --circle-border: rgba(249, 115, 22, 0.3); --circle-stroke: #fb923c;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </div>
    <h4 class="gdi-card-title">Search (Khoje)</h4>
    <p class="gdi-card-desc">Find any voter within seconds by name, father name, or EPIC ID</p>
  </div>

  <!-- 2. Advance Search -->
  <div class="gdi-feature-card" style="--accent-border: #06b6d4; --accent-glow: rgba(6, 182, 212, 0.25); --circle-bg: rgba(6, 182, 212, 0.12); --circle-border: rgba(6, 182, 212, 0.3); --circle-stroke: #22d3ee;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
    </div>
    <h4 class="gdi-card-title">Advance Search</h4>
    <p class="gdi-card-desc">Filter voters dynamically by ward, booth number, age range, or gender</p>
  </div>

  <!-- 3. EVM Ballot Paper -->
  <div class="gdi-feature-card" style="--accent-border: #10b981; --accent-glow: rgba(16, 185, 129, 0.25); --circle-bg: rgba(16, 185, 129, 0.12); --circle-border: rgba(16, 185, 129, 0.3); --circle-stroke: #34d399;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    </div>
    <h4 class="gdi-card-title">EVM Ballot Paper</h4>
    <p class="gdi-card-desc">Digital ballot preparation and candidate serial display preview</p>
  </div>

  <!-- 4. List (Suchi) -->
  <div class="gdi-feature-card" style="--accent-border: #f59e0b; --accent-glow: rgba(245, 158, 11, 0.25); --circle-bg: rgba(245, 158, 11, 0.12); --circle-border: rgba(245, 158, 11, 0.3); --circle-stroke: #fbbf24;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    </div>
    <h4 class="gdi-card-title">List (Suchi)</h4>
    <p class="gdi-card-desc">Full alphabetical, family-wise, and booth-wise voter lists</p>
  </div>

  <!-- 5. Language (Bhasha) -->
  <div class="gdi-feature-card" style="--accent-border: #a855f7; --accent-glow: rgba(168, 85, 247, 0.25); --circle-bg: rgba(168, 85, 247, 0.12); --circle-border: rgba(168, 85, 247, 0.3); --circle-stroke: #c084fc;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
    </div>
    <h4 class="gdi-card-title">Language (Bhasha)</h4>
    <p class="gdi-card-desc">Easy one-tap switching between Hindi and English interface</p>
  </div>

  <!-- 6. Bulk Message -->
  <div class="gdi-feature-card" style="--accent-border: #f43f5e; --accent-glow: rgba(244, 63, 94, 0.25); --circle-bg: rgba(244, 63, 94, 0.12); --circle-border: rgba(244, 63, 94, 0.3); --circle-stroke: #fb7185;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/></svg>
    </div>
    <h4 class="gdi-card-title">Bulk Message</h4>
    <p class="gdi-card-desc">Directly broadcast instant SMS updates and appeal messages to voters</p>
  </div>

  <!-- 7. Bulk WhatsApp -->
  <div class="gdi-feature-card" style="--accent-border: #84cc16; --accent-glow: rgba(132, 204, 22, 0.25); --circle-bg: rgba(132, 204, 22, 0.12); --circle-border: rgba(132, 204, 22, 0.3); --circle-stroke: #a3e635;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M9.5 9.5c.3 1.5 1.5 2.7 3 3l1.5-1.5"/></svg>
    </div>
    <h4 class="gdi-card-title">Bulk WhatsApp</h4>
    <p class="gdi-card-desc">Mass WhatsApp voter campaigns with flyers, video clips, and PDFs</p>
  </div>

  <!-- 8. Voice Call -->
  <div class="gdi-feature-card" style="--accent-border: #3b82f6; --accent-glow: rgba(59, 130, 246, 0.25); --circle-bg: rgba(59, 130, 246, 0.12); --circle-border: rgba(59, 130, 246, 0.3); --circle-stroke: #60a5fa;">
    <div class="gdi-icon-circle">
      <svg viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    </div>
    <h4 class="gdi-card-title">Voice Call</h4>
    <p class="gdi-card-desc">Automated outbound voice call broadcasts in candidate's voice</p>
  </div>

</div>`,
      image: ""
    }
  ],
  faqs: [
    {
      q: "What is the Election Management Solution by G Digital India?",
      a: "It is a comprehensive digital platform that helps candidates and political parties manage their election campaigns efficiently — including voter management, voter slip printing, bulk messaging, OBD calls, and election publicity materials."
    },
    {
      q: "How does the Voter App work?",
      a: "The Voter App connects with a mobile thermal printer via Bluetooth. You can search for voters, print voter slips on-the-spot, view alphabetical or house-wise voter lists, and communicate with voters through bulk SMS, WhatsApp, and voice calls."
    },
    {
      q: "What types of election publicity materials do you provide?",
      a: "We provide T-shirts, wall clocks, flags, caps, patka, jhallar (lari), pocket badges, key chains, diaries, and pens — all custom branded with your campaign details."
    },
    {
      q: "Do you support Meta (Facebook/Instagram) advertising for elections?",
      a: "Yes! We run targeted Meta Campaigns on Facebook and Instagram to reach voters in your constituency with personalized political ads and messaging."
    },
    {
      q: "What is an OBD Campaign?",
      a: "OBD (Outbound Dialing) Campaign is an automated voice call system that delivers your pre-recorded campaign message to thousands of voters simultaneously — an extremely effective and low-cost outreach tool."
    },
    {
      q: "How can I get started with your Election Management Solution?",
      a: "Simply call us at +91 9116175151 or fill out the enquiry form. Our team will schedule a demo and create a customized election campaign plan for you."
    }
  ],
  order: 9,
  metaTitle: "Election Management Solution | Voter App & Election Publicity | G Digital India",
  metaDescription: "Complete Election Management Solution by G Digital India – Voter App, voter slip printing, digital voter list, OBD campaigns, bulk WhatsApp, and election publicity materials. Call +91 9116175151",
  metaKeywords: "election management solution, voter app, voter slip printer, digital voter list, OBD campaign, election publicity, bulk WhatsApp election, election t-shirts Jaipur"
};

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('gdi-db');
    const collection = db.collection('services');

    // Update the service document
    const result = await collection.updateOne(
      { slug: 'election-management-solution' },
      { $set: electionService },
      { upsert: true }
    );
    console.log('Service updated successfully with self-contained SVG cards and styles!', result);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

main();
