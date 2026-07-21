import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Testimonial      from '@/models/Testimonial'

// GET — Ek testimonial by ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB()
    const testimonial = await Testimonial.findById(id)
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT — Update testimonial
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB()
    const body = await request.json()
    const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true })
    if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — Delete testimonial
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB()
    const result = await Testimonial.findByIdAndDelete(id)
    return NextResponse.json({ success: true, deleted: !!result })
  } catch (error) {
    console.error('Testimonial DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
