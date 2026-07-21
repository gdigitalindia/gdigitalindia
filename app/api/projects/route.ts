import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Project          from '@/models/Project'

// GET — Saare projects
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const filter = category && category !== 'All' ? { category } : {}
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — Naya project add karo
export async function POST(request: Request) {
  try {
    await connectDB()
    const body    = await request.json()
    const project = await Project.create(body)
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
