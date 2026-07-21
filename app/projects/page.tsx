import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectsPageClient from "./ProjectsPageClient";

export const revalidate = 60; 

export default async function ProjectsPage() {
  await connectDB();
  
  const data = await Project.find().sort({ order: 1 }).lean();
  const projects = JSON.parse(JSON.stringify(data));

  return <ProjectsPageClient initialProjects={projects} />;
}