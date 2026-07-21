import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const page = await Page.findOne({ slug: "refund-policy" }).lean() as any;
  return {
    title: page?.metaTitle || "Refund Policy | G Digital India",
    description: page?.metaDescription || "Read our refund policy for G Digital India services.",
    keywords: page?.metaKeywords || "refund policy, G Digital India",
  };
}

export default async function RefundPolicy() {
  await connectDB();
  
  let page = await Page.findOne({ slug: "refund-policy" }).lean();

  if (!page) {
    // Seed initial data if not present
    page = await Page.create({
      slug: "refund-policy",
      title: "Refund Policy",
      content: `
        <h2>1. Refund Eligibility</h2>
        <p>We want our customers to be fully satisfied with our digital marketing services. Refunds are processed based on the specific service agreement milestones.</p>
        <h2>2. Refund Process</h2>
        <p>To request a refund, you must contact us via email with a detailed explanation of your dissatisfaction within 30 days of payment.</p>
        <h2>3. Non-Refundable Services</h2>
        <p>Third-party spends (e.g., Google Ads, Meta Ads, domain purchases) are strictly non-refundable.</p>
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
