import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Client from '@/models/Client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectDB()
    const clients = await Client.find().sort({ createdAt: -1 })
    return NextResponse.json(clients)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const client = await Client.create(body)
    return NextResponse.json(client)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await Client.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
