import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsPageClient from "./ProjectsPageClient";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    const conn = await connectDB();
    if (conn) {
      const data = await Project.find().sort({ order: 1 }).lean();
      projects = JSON.parse(JSON.stringify(data));
    }
  } catch (err) {
    console.error('⚠️ Projects page: DB fetch failed:', (err as Error).message);
  }

  return <ProjectsPageClient initialProjects={projects} />;
}