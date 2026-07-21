import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";
import SiteSettings from "@/models/SiteSettings";
import Service from "@/models/Service";
import AboutPageClient from "./AboutPageClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const data = await About.findOne().lean() as any;
  return {
    title: data?.metaTitle || "About Us | G Digital India",
    description: data?.metaDescription || "Learn more about G Digital India, the leading digital marketing agency.",
    keywords: data?.metaKeywords || "digital marketing, about us, G Digital India",
  };
}

export default async function AboutPage() {
  await connectDB();

  const aboutData = await About.findOne().lean();
  const settingsData = await SiteSettings.findOne().lean();
  const servicesData = await Service.find().sort({ order: 1 }).lean();

  const initialAbout = aboutData ? JSON.parse(JSON.stringify(aboutData)) : null;
  const initialSettings = settingsData ? JSON.parse(JSON.stringify(settingsData)) : null;
  const initialServices = JSON.parse(JSON.stringify(servicesData));

  return (
    <AboutPageClient 
      initialAbout={initialAbout}
      initialSettings={initialSettings}
      initialServices={initialServices}
    />
  );
}