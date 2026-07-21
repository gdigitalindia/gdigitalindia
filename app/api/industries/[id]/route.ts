import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Industry          from '@/models/Industry'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    let record = await Industry.findById(id).catch(() => null)
    if (!record) {
      record = await Industry.findOne({ slug: id })
    }
    
    if (!record) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    console.error('Industry GET error:', error)
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
    const record = await Industry.findByIdAndUpdate(id, body, { new: true })
    if (!record) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    console.error('Industry PUT error:', error)
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
    const record = await Industry.findByIdAndDelete(id)
    if (!record) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Industry DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
