import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const page = await Page.findOne({ slug: "terms-of-use" }).lean() as any;
  return {
    title: page?.metaTitle || "Terms of Use | G Digital India",
    description: page?.metaDescription || "Read our terms of use for using G Digital India services.",
    keywords: page?.metaKeywords || "terms of use, G Digital India",
  };
}

export default async function TermsOfUse() {
  await connectDB();
  
  let page = await Page.findOne({ slug: "terms-of-use" }).lean();

  if (!page) {
    // Seed initial data if not present
    page = await Page.create({
      slug: "terms-of-use",
      title: "Terms of Use",
      content: `
        <h2>1. Agreement to Terms</h2>
        <p>By accessing our website, you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
        <h2>2. Intellectual Property</h2>
        <p>The content on this website is the exclusive property of G Digital India and is protected by international copyright, trademark, and intellectual property laws.</p>
        <h2>3. Limitation of Liability</h2>
        <p>In no event shall G Digital India be liable for any damages arising out of the use or inability to use the materials on this website.</p>
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
