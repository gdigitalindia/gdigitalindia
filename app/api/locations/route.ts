import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Location from '@/models/Location'

export async function GET() {
  try {
    await connectDB()
    const records = await Location.find({}).sort({ order: 1, createdAt: -1 })
    return NextResponse.json(records)
  } catch (error) {
    console.error('Location GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }
    const record = await Location.create(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Location POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
