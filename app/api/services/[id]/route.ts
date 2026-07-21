import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Service          from '@/models/Service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    // Try finding by ID first, then by slug
    let record = await Service.findById(id).catch(() => null)
    if (!record) {
      record = await Service.findOne({ slug: id })
    }
    
    if (!record) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    console.error('Service GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const record = await Service.findByIdAndUpdate(id, body, { new: true })
    if (!record) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    console.error('Service PUT error:', error)
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
    const record = await Service.findByIdAndDelete(id)
    if (!record) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Service DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
