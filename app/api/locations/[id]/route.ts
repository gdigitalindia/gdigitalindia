import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Location from '@/models/Location'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    let record = await Location.findById(id).catch(() => null)
    if (!record) {
      record = await Location.findOne({ slug: id })
    }
    if (!record) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    return NextResponse.json(record)
  } catch (error) {
    console.error('Location GET ID error:', error)
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
    const record = await Location.findByIdAndUpdate(id, body, { new: true })
    if (!record) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    return NextResponse.json(record)
  } catch (error) {
    console.error('Location PUT error:', error)
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
    const record = await Location.findByIdAndDelete(id)
    if (!record) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('Location DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
