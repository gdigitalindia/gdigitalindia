import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const page = await Page.findOne({ slug: "privacy-policy" }).lean() as any;
  return {
    title: page?.metaTitle || "Privacy Policy | G Digital India",
    description: page?.metaDescription || "Read our privacy policy to understand how we handle your data.",
    keywords: page?.metaKeywords || "privacy policy, G Digital India",
  };
}

export default async function PrivacyPolicy() {
  await connectDB();
  
  let page = await Page.findOne({ slug: "privacy-policy" }).lean();

  if (!page) {
    // Seed initial data if not present
    page = await Page.create({
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: `
        <h2>1. Information We Collect</h2>
        <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to send related communications.</p>
        <h2>3. Information Security</h2>
        <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
      `,
    });
  }

  const safePage = JSON.parse(JSON.stringify(page));

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: "150px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#888", marginBottom: "30px", textTransform: "uppercase", letterSpacing: "1px" }}>
          <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#fff" }}>{safePage.title}</span>
        </div>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, margin: "0 0 30px 0", fontFamily: "var(--font-satoshi, sans-serif)" }}>
          {safePage.title}
        </h1>

        <div 
          style={{
            fontSize: "16px",
            color: "#ccc",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}
          dangerouslySetInnerHTML={{ __html: safePage.content }} 
        />

      </div>
    </main>
  );
}
