import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Reel from '@/models/Reel'

export async function GET() {
  try {
    await connectDB()
    const reels = await Reel.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(reels)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const reel = await Reel.create(body)
    return NextResponse.json(reel)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await Reel.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
