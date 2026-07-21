import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Blog             from '@/models/Blog'

export async function GET() {
  try {
    await connectDB().catch(() => null)
    const records = await Blog.find({}).sort({ createdAt: -1 }).catch(() => [])
    return NextResponse.json(records)
  } catch (error) {
    console.error('Blog GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const record = await Blog.create(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
