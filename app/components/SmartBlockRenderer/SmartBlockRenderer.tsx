import React from "react";

interface SmartBlockRendererProps {
  html: string;
}

const PALETTES = [
  { border: "#06b6d4", glow: "rgba(6, 182, 212, 0.25)", bg: "rgba(6, 182, 212, 0.12)", stroke: "#22d3ee" },
  { border: "#f97316", glow: "rgba(249, 115, 22, 0.25)", bg: "rgba(249, 115, 22, 0.12)", stroke: "#fb923c" },
  { border: "#10b981", glow: "rgba(16, 185, 129, 0.25)", bg: "rgba(16, 185, 129, 0.12)", stroke: "#34d399" },
  { border: "#f59e0b", glow: "rgba(245, 158, 11, 0.25)", bg: "rgba(245, 158, 11, 0.12)", stroke: "#fbbf24" },
  { border: "#a855f7", glow: "rgba(168, 85, 247, 0.25)", bg: "rgba(168, 85, 247, 0.12)", stroke: "#c084fc" },
  { border: "#f43f5e", glow: "rgba(244, 63, 94, 0.25)", bg: "rgba(244, 63, 94, 0.12)", stroke: "#fb7185" },
  { border: "#3b82f6", glow: "rgba(59, 130, 246, 0.25)", bg: "rgba(59, 130, 246, 0.12)", stroke: "#60a5fa" },
  { border: "#ec4899", glow: "rgba(236, 72, 153, 0.25)", bg: "rgba(236, 72, 153, 0.12)", stroke: "#f472b6" },
  { border: "#6366f1", glow: "rgba(99, 102, 241, 0.25)", bg: "rgba(99, 102, 241, 0.12)", stroke: "#818cf8" },
  { border: "#84cc16", glow: "rgba(132, 204, 22, 0.25)", bg: "rgba(132, 204, 22, 0.12)", stroke: "#a3e635" },
];

function getIconForTitle(title: string, index: number) {
  const t = title.toLowerCase();

  // Mobile / App / Phone
  if (t.includes("app") || t.includes("mobile") || t.includes("search") || t.includes("khoje")) {
    return (
      <svg viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
        <circle cx="12" cy="10" r="3" />
        <line x1="14.5" y1="12.5" x2="17" y2="15" />
      </svg>
    );
  }
  // Printer
  if (t.includes("print") || t.includes("thermal")) {
    return (
      <svg viewBox="0 0 24 24">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    );
  }
  // List / Checklist / Suchi
  if (t.includes("list") || t.includes("suchi") || t.includes("register")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    );
  }
  // House / Booth / Ward
  if (t.includes("house") || t.includes("booth") || t.includes("ward")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  // Slip / Ballot / Document
  if (t.includes("slip") || t.includes("ballot") || t.includes("paper") || t.includes("form")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  // Voting / EVM / Machine
  if (t.includes("voting") || t.includes("evm") || t.includes("machine") || t.includes("vote")) {
    return (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="6" y1="8" x2="10" y2="8" />
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="6" y1="16" x2="10" y2="16" />
        <circle cx="16" cy="8" r="2" />
        <circle cx="16" cy="12" r="2" />
        <circle cx="16" cy="16" r="2" />
      </svg>
    );
  }
  // Bag / Kit / Case
  if (t.includes("bag") || t.includes("kit") || t.includes("box")) {
    return (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  // Campaign / Speaker / Pop Up
  if (t.includes("pop up") || t.includes("campaign") || t.includes("loud") || t.includes("broadcast")) {
    return (
      <svg viewBox="0 0 24 24">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  }
  // Call / OBD / Voice / Dial
  if (t.includes("obd") || t.includes("call") || t.includes("voice") || t.includes("dial")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  // Meta / Ads / Social / Facebook
  if (t.includes("meta") || t.includes("facebook") || t.includes("ad") || t.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
      </svg>
    );
  }
  // T-Shirt / Cloth / Dress
  if (t.includes("shirt") || t.includes("t-shirt") || t.includes("cloth") || t.includes("wear")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    );
  }
  // Clock / Time
  if (t.includes("clock") || t.includes("time") || t.includes("watch")) {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  // Flag / Banner
  if (t.includes("flag") || t.includes("banner")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    );
  }
  // Cap / Hat
  if (t.includes("cap") || t.includes("hat")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M2 17a5 5 0 0 0 10 0V9a4 4 0 0 0-8 0v8" />
        <path d="M12 17h10a2 2 0 0 0 0-4h-3" />
      </svg>
    );
  }
  // Scarf / Patka / Ribbon
  if (t.includes("patka") || t.includes("scarf") || t.includes("ribbon") || t.includes("stole")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 19l4-14 8 14-4-2-4 2z" />
        <circle cx="12" cy="7" r="2" />
      </svg>
    );
  }
  // Bunting / Garland / Jhallar
  if (t.includes("jhallar") || t.includes("lari") || t.includes("decor") || t.includes("light")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M2 6c3 3 7 3 10 0s7-3 10 0" />
        <path d="M2 12c3 3 7 3 10 0s7-3 10 0" />
        <path d="M2 18c3 3 7 3 10 0s7-3 10 0" />
      </svg>
    );
  }
  // Badge / ID / Card / Pocket
  if (t.includes("badge") || t.includes("card") || t.includes("id") || t.includes("pocket")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  // Key / Chain
  if (t.includes("key") || t.includes("chain")) {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="7.5" cy="15.5" r="5.5" />
        <path d="M21 2l-9.6 9.6" />
        <path d="M15.5 7.5l3 3L22 7l-3-3" />
      </svg>
    );
  }
  // Diary / Notebook / Book
  if (t.includes("dairy") || t.includes("diary") || t.includes("book") || t.includes("note")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="13" y2="11" />
      </svg>
    );
  }
  // Pen / Pencil
  if (t.includes("pen") || t.includes("pencil") || t.includes("write")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
      </svg>
    );
  }
  // Message / SMS / WhatsApp / Chat
  if (t.includes("message") || t.includes("sms") || t.includes("whatsapp") || t.includes("chat")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }
  // Language / Translation
  if (t.includes("language") || t.includes("bhasha") || t.includes("translate")) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 8l6 6" />
        <path d="M4 14l6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1" />
        <path d="M22 22l-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    );
  }

  // Default elegant fallback icon (Sparkle / Target / Check)
  return (
    <svg viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

interface ParsedItem {
  title: string;
  desc: string;
}

function parseContentToCards(html: string): { introHtml: string; items: ParsedItem[]; isCardFormat: boolean } {
  if (!html) return { introHtml: "", items: [], isCardFormat: false };

  // If it already has custom card grid markup, let it render normally
  if (html.includes("gdi-cards-grid")) {
    return { introHtml: html, items: [], isCardFormat: false };
  }

  const items: ParsedItem[] = [];
  let introHtml = "";

  // 1. Try checking for <li> items
  const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
  const liMatches = [...html.matchAll(liRegex)];

  if (liMatches.length >= 2) {
    // Extract intro text before <ul> or first <li>
    const firstLiPos = html.search(/<ul|<ol|<li/i);
    if (firstLiPos > 0) {
      introHtml = html.substring(0, firstLiPos).trim();
    }

    for (const match of liMatches) {
      const content = match[1].trim();
      let title = "";
      let desc = "";

      // Match <strong>...</strong> or <b>...</b>
      const strongMatch = content.match(/<(strong|b)[^>]*>(.*?)<\/\1>(.*)/is);
      if (strongMatch) {
        title = strongMatch[2].replace(/<[^>]*>/g, "").trim();
        let rest = strongMatch[3].replace(/^[–—\-:\s]+/, "").trim();
        desc = rest.replace(/<[^>]*>/g, "").trim();
      } else {
        // Split by dash or colon
        const parts = content.replace(/<[^>]*>/g, "").split(/[–—\-:]+/);
        if (parts.length > 1) {
          title = parts[0].trim();
          desc = parts.slice(1).join(" - ").trim();
        } else {
          title = parts[0].trim();
          desc = "";
        }
      }

      if (title) {
        items.push({ title, desc });
      }
    }

    return { introHtml, items, isCardFormat: true };
  }

  // 2. Try checking for <p><strong>Title</strong></p><p>Desc</p> patterns
  const pTags = [...html.matchAll(/<p[^>]*>(.*?)<\/p>/gis)].map(m => m[1].trim()).filter(Boolean);
  
  if (pTags.length >= 4) {
    let currentTitle = "";
    let candidateItems: ParsedItem[] = [];
    let introCollected: string[] = [];
    let hasStartedItems = false;

    for (let i = 0; i < pTags.length; i++) {
      const p = pTags[i];
      const strongOnly = p.match(/^<(strong|b)[^>]*>(.*?)<\/\1>$/is);
      const strongWithDesc = p.match(/^<(strong|b)[^>]*>(.*?)<\/\1>[–—\-:\s]+(.*)$/is);

      if (strongWithDesc) {
        hasStartedItems = true;
        candidateItems.push({
          title: strongWithDesc[2].replace(/<[^>]*>/g, "").trim(),
          desc: strongWithDesc[3].replace(/<[^>]*>/g, "").trim(),
        });
      } else if (strongOnly) {
        hasStartedItems = true;
        currentTitle = strongOnly[2].replace(/<[^>]*>/g, "").trim();
        // Check if next paragraph is description
        if (i + 1 < pTags.length && !pTags[i + 1].match(/^<(strong|b)[^>]*>/is)) {
          const nextDesc = pTags[i + 1].replace(/<[^>]*>/g, "").trim();
          candidateItems.push({ title: currentTitle, desc: nextDesc });
          i++; // skip next paragraph
        } else {
          candidateItems.push({ title: currentTitle, desc: "" });
        }
      } else if (!hasStartedItems) {
        introCollected.push(`<p>${p}</p>`);
      }
    }

    if (candidateItems.length >= 2) {
      return {
        introHtml: introCollected.join(""),
        items: candidateItems,
        isCardFormat: true,
      };
    }
  }

  // Fallback: standard html
  return { introHtml: html, items: [], isCardFormat: false };
}

export default function SmartBlockRenderer({ html }: SmartBlockRendererProps) {
  const { introHtml, items, isCardFormat } = parseContentToCards(html);

  if (!isCardFormat || items.length === 0) {
    return (
      <div
        style={{ color: "#94a3b8", lineHeight: 1.8 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {introHtml && (
        <div
          style={{ color: "#94a3b8", fontSize: "1.02rem", lineHeight: 1.8, marginBottom: "20px" }}
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      )}

      <div className="gdi-cards-grid">
        {items.map((item, idx) => {
          const theme = PALETTES[idx % PALETTES.length];
          const icon = getIconForTitle(item.title, idx);

          return (
            <div
              key={idx}
              className="gdi-feature-card"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                borderRadius: "16px",
                padding: "28px 20px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
                // @ts-ignore
                "--accent-border": theme.border,
                "--accent-glow": theme.glow,
                "--circle-bg": theme.bg,
                "--circle-border": theme.border,
                "--circle-stroke": theme.stroke,
              }}
            >
              <div
                className="gdi-icon-circle"
                style={{
                  width: "66px",
                  height: "66px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                  background: theme.bg,
                  border: `1px solid ${theme.border}40`,
                  flexShrink: 0,
                }}
              >
                <div style={{ width: "30px", height: "30px", color: theme.stroke }}>
                  {React.cloneElement(icon, {
                    style: {
                      width: "100%",
                      height: "100%",
                      stroke: theme.stroke,
                      fill: "none",
                      strokeWidth: 2,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      display: "block",
                    },
                  })}
                </div>
              </div>

              <h4
                className="gdi-card-title"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1.12rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 8px 0",
                  lineHeight: 1.35,
                }}
              >
                {item.title}
              </h4>

              {item.desc && (
                <p
                  className="gdi-card-desc"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.88rem",
                    color: "#94a3b8",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
