import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;

    let page = await Page.findOne({ slug }).lean();

    if (!page) {
      // Create default data if not found
      const titles: { [key: string]: string } = {
        "privacy-policy": "Privacy Policy",
        "terms-of-use": "Terms of Use",
        "refund-policy": "Refund Policy",
      };

      const defaults: { [key: string]: string } = {
        "privacy-policy": `
          <h2>1. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services.</p>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to send related communications.</p>
          <h2>3. Information Security</h2>
          <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
        `,
        "terms-of-use": `
          <h2>1. Agreement to Terms</h2>
          <p>By accessing our website, you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
          <h2>2. Intellectual Property</h2>
          <p>The content on this website is the exclusive property of G Digital India and is protected by international copyright, trademark, and intellectual property laws.</p>
          <h2>3. Limitation of Liability</h2>
          <p>In no event shall G Digital India be liable for any damages arising out of the use or inability to use the materials on this website.</p>
        `,
        "refund-policy": `
          <h2>1. Refund Eligibility</h2>
          <p>We want our customers to be fully satisfied with our digital marketing services. Refunds are processed based on the specific service agreement milestones.</p>
          <h2>2. Refund Process</h2>
          <p>To request a refund, you must contact us via email with a detailed explanation of your dissatisfaction within 30 days of payment.</p>
          <h2>3. Non-Refundable Services</h2>
          <p>Third-party spends (e.g., Google Ads, Meta Ads, domain purchases) are strictly non-refundable.</p>
        `,
      };

      if (titles[slug]) {
        const newPage = await Page.create({
          slug,
          title: titles[slug],
          content: defaults[slug] || "<p>Content coming soon...</p>",
        });
        page = JSON.parse(JSON.stringify(newPage));
      } else {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
    }

    return NextResponse.json(page);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await req.json();

    const updatedPage = await Page.findOneAndUpdate(
      { slug },
      { 
        title: body.title, 
        content: body.content 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

