import { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";
import Script from "next/script";
import { connectDB } from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";
import Service from "@/models/Service";
import Package from "@/models/Package";
import { syncWebsiteServices, syncOtherSolutions } from "@/lib/dbInit";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "G Digital India | Best Digital Marketing Agency",
  description: "G Digital India provides top-notch SEO, Web Development, and Digital Marketing solutions.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let menuData: any[] = [];
  let packageData: any[] = [];

  try {
    await connectDB();
    await syncWebsiteServices();
    await syncOtherSolutions();
    const [categories, services, packages] = await Promise.all([
      ServiceCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      Service.find().lean(),
      Package.find().sort({ order: 1 }).lean()
    ]);

    menuData = JSON.parse(JSON.stringify(
      categories.map((cat: any) => ({
        category: cat,
        services: services.filter((s: any) => s.category === cat.name)
      }))
    ));

    packageData = JSON.parse(JSON.stringify(packages));
  } catch (err) {
    console.error('⚠️ DB unavailable during build, using empty defaults:', (err as Error).message);
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://db.onlinewebfonts.com/c/c37a9f31696dbcc8b86a42827beae565?family=Europa+Grotesk+SH+DemBol" />
      </head>
      <body>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" strategy="afterInteractive" />
        <ClientLayout menuData={menuData} packageData={packageData}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}