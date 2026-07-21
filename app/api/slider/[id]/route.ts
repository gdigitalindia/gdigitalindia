import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Slider           from '@/models/Slider'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()

    const record = await Slider.findByIdAndUpdate(id, body, { new: true })
    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Slider PUT error:', error)
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
    const record = await Slider.findByIdAndDelete(id)
    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Slider DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
