import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Slider           from '@/models/Slider'

export async function GET() {
  try {
    await connectDB().catch(() => null)
    const records = await Slider.find({}).sort({ createdAt: -1 }).catch(() => [])
    return NextResponse.json(records)
  } catch (error) {
    console.error('Slider GET error:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const record = await Slider.create(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Slider POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
