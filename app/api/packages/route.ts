import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Package          from '@/models/Package'

export async function GET() {
  try {
    await connectDB()
    const records = await Package.find({}).sort({ order: 1, createdAt: -1 })
    return NextResponse.json(records)
  } catch (error) {
    console.error('Package GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const record = await Package.create(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Package POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
