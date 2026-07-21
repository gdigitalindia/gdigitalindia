import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import PackageCategory  from '@/models/PackageCategory'

export async function GET() {
  try {
    await connectDB()
    const records = await PackageCategory.find({}).sort({ order: 1, name: 1 })
    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const record = await PackageCategory.create(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
