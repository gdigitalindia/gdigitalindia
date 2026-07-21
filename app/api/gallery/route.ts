import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Gallery          from '@/models/Gallery'

// GET — Saari gallery images
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const filter  = category && category !== 'All' ? { category } : {}
    const images  = await Gallery.find(filter).sort({ createdAt: -1 })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — Nayi gallery image add karo
export async function POST(request: Request) {
  try {
    await connectDB()
    const body  = await request.json()
    const image = await Gallery.create(body)
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — Gallery image delete karo (?id=xxx)
export async function DELETE(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    await Gallery.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
