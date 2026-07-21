import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ServiceCategory from '@/models/ServiceCategory'

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await context.params
    const category = await ServiceCategory.findOne({ 
      $or: [{ slug: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] 
    })
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const data = await req.json()
    const { id } = await context.params
    const updated = await ServiceCategory.findByIdAndUpdate(id, data, { new: true })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await context.params
    const deleted = await ServiceCategory.findByIdAndDelete(id)
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
