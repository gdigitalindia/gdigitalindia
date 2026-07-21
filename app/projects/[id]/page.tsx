import { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  await connectDB();
  
  const project = await Project.findOne({ 
    $or: [
      { slug: { $regex: new RegExp('^' + decodedId + '$', 'i') } },
      { title: { $regex: new RegExp('^' + decodedId + '$', 'i') } },
      { slug: { $regex: new RegExp('^' + decodedId.replace(/ /g, '-') + '$', 'i') } },
      { _id: decodedId.match(/^[0-9a-fA-F]{24}$/) ? decodedId : null }
    ] 
  }).lean() as any;

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.metaTitle || `${project.title} | Portfolio | G Digital India`,
    description: project.metaDescription || (project.description && project.description.replace(/<[^>]*>?/gm, '').substring(0, 160)),
    keywords: project.metaKeywords || project.category,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  await connectDB();

  const projectData = await Project.findOne({ 
    $or: [
      { slug: { $regex: new RegExp('^' + decodedId + '$', 'i') } },
      { title: { $regex: new RegExp('^' + decodedId + '$', 'i') } },
      { slug: { $regex: new RegExp('^' + decodedId.replace(/ /g, '-') + '$', 'i') } },
      { _id: decodedId.match(/^[0-9a-fA-F]{24}$/) ? decodedId : null }
    ] 
  }).lean();

  const initialProject = projectData ? JSON.parse(JSON.stringify(projectData)) : null;

  return (
    <ProjectDetailClient 
      initialProject={initialProject}
      idOrSlug={id}
    />
  );
}
