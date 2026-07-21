import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import About            from '@/models/About'

export async function GET() {
  try {
    await connectDB()
    const record = await About.findOne({})
    return NextResponse.json(record || {})
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('--- API ABOUT POST START ---')
    await connectDB()
    const body = await request.json()
    console.log('Received body keys:', Object.keys(body))

    // Simple upsert
    const updated = await About.findOneAndUpdate({}, body, { upsert: true, new: true, runValidators: false })
    
    console.log('Save SUCCESS')
    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('--- API ABOUT POST ERROR ---', error.message)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}