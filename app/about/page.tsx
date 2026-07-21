import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";
import SiteSettings from "@/models/SiteSettings";
import Service from "@/models/Service";
import AboutPageClient from "./AboutPageClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const conn = await connectDB();
    if (!conn) throw new Error("No DB connection");
    const data = await About.findOne().lean() as any;
    return {
      title: data?.metaTitle || "About Us | G Digital India",
      description: data?.metaDescription || "Learn more about G Digital India, the leading digital marketing agency.",
      keywords: data?.metaKeywords || "digital marketing, about us, G Digital India",
    };
  } catch {
    return {
      title: "About Us | G Digital India",
      description: "Learn more about G Digital India, the leading digital marketing agency.",
    };
  }
}

export default async function AboutPage() {
  let initialAbout = null;
  let initialSettings = null;
  let initialServices: any[] = [];

  try {
    const conn = await connectDB();
    if (conn) {
      const aboutData = await About.findOne().lean();
      const settingsData = await SiteSettings.findOne().lean();
      const servicesData = await Service.find().sort({ order: 1 }).lean();

      initialAbout = aboutData ? JSON.parse(JSON.stringify(aboutData)) : null;
      initialSettings = settingsData ? JSON.parse(JSON.stringify(settingsData)) : null;
      initialServices = JSON.parse(JSON.stringify(servicesData));
    }
  } catch (err) {
    console.error("⚠️ About page: DB fetch failed:", (err as Error).message);
  }

  return (
    <AboutPageClient 
      initialAbout={initialAbout}
      initialSettings={initialSettings}
      initialServices={initialServices}
    />
  );
}