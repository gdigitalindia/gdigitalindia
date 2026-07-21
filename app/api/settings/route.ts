import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SiteSettings from '@/models/SiteSettings'

export const dynamic = 'force-dynamic'

// GET — fetch current settings
export async function GET() {
  try {
    await connectDB()
    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create({})
    }
    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Settings GET error:', error.message || error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// PUT — update settings (Singleton)
export async function PUT(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const { _id, __v, ...updateData } = body

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      },
      { 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true,
        runValidators: true 
      }
    )

    return NextResponse.json({ success: true, settings })
  } catch (error: any) {
    console.error('Settings PUT error:', error.message || error)
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 })
  }
}
