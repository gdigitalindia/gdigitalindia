import { connectDB } from "@/lib/mongodb";
import Package from "@/models/Package";
import PackageDetailClient from "./PackageDetailClient";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const pkg = await Package.findOne({ slug }).lean() as any;

  if (!pkg) return { title: "Package Not Found" };

  return {
    title: pkg.metaTitle || `${pkg.title} | G Digital India`,
    description: pkg.metaDescription || pkg.description,
    keywords: pkg.metaKeywords,
  };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const data = await Package.findOne({ slug }).lean();

  if (!data) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Package not found</div>;
  }

  const pkg = JSON.parse(JSON.stringify(data));

  return <PackageDetailClient pkg={pkg} />;
}
