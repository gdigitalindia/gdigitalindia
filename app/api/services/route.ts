import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Service          from '@/models/Service'

export async function GET() {
  try {
    await connectDB()
    const records = await Service.find({}).sort({ order: 1, createdAt: -1 })
    return NextResponse.json(records)
  } catch (error) {
    console.error('Service GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const record = await Service.create(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Service POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
