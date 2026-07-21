import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Project          from '@/models/Project'

// GET — Ek project by ID ya Slug
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB()
    
    // Check if it's a valid MongoId, otherwise treat as slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(id);
    }
    
    if (!project) {
      project = await Project.findOne({ slug: id });
    }

    if (!project) {
      return NextResponse.json({ error: 'Project nahi mila' }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error('Project GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT — Project update karo
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB()
    const body    = await request.json()
    const project = await Project.findByIdAndUpdate(id, body, { new: true })
    if (!project) {
      return NextResponse.json({ error: 'Project nahi mila' }, { status: 404 })
    }
    return NextResponse.json(project)
  } catch (error) {
    console.error('Project PUT error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — Project delete karo
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB()
    await Project.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Project DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
