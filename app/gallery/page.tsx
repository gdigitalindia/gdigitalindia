import { connectDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  await connectDB();
  
  const data = await Gallery.find().sort({ createdAt: -1 }).lean();
  
  // Map DB 'url' to frontend 'src'
  const formatted = data.map((item: any) => ({
    ...item,
    src: item.url
  }));
  
  const initialItems = JSON.parse(JSON.stringify(formatted));

  return <GalleryClient initialItems={initialItems} />;
}
