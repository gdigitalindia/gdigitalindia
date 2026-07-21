import { NextResponse } from 'next/server'
import { uploadBuffer } from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File
    const folder   = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'File required hai' }, { status: 400 })
    }

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary instead of local filesystem
    const url = await uploadBuffer(buffer, folder)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
