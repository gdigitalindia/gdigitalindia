import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Blog             from '@/models/Blog'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    const record = await Blog.findByIdAndUpdate(id, body, { new: true })
    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Blog PUT error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const record = await Blog.findByIdAndDelete(id)
    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Blog DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
