import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import GalleryClient from "./GalleryClient";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let initialItems: any[] = [];
  try {
    const conn = await connectDB();
    if (conn) {
      const data = await Gallery.find().sort({ createdAt: -1 }).lean();
      const formatted = data.map((item: any) => ({ ...item, src: item.url }));
      initialItems = JSON.parse(JSON.stringify(formatted));
    }
  } catch (err) {
    console.error('⚠️ Gallery page: DB fetch failed:', (err as Error).message);
  }

  return <GalleryClient initialItems={initialItems} />;
}
