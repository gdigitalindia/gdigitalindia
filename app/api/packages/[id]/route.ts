import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Package          from '@/models/Package'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const record = await Package.findById(id)
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const record = await Package.findByIdAndUpdate(id, body, { new: true })
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const record = await Package.findByIdAndDelete(id)
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
