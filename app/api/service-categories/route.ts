import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ServiceCategory from '@/models/ServiceCategory'

export async function GET() {
  try {
    await connectDB()
    const categories = await ServiceCategory.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(categories)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const data = await req.json()
    const newCategory = await ServiceCategory.create(data)
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
