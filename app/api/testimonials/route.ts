import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Testimonial      from '@/models/Testimonial'

// GET — Saare testimonials
export async function GET() {
  try {
    await connectDB()
    const testimonials = await Testimonial.find().sort({ createdAt: -1 })
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Testimonials GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST — Naya testimonial add karo
export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    
    console.log('--- 📝 Saving Testimonial Payload:', JSON.stringify(body, null, 2));

    // Basic validation
    if (!body.name || !body.review) {
      console.error('❌ Validation Failed: Name or Review missing');
      return NextResponse.json({ error: 'Name and Review are required' }, { status: 400 })
    }

    const testimonial = await Testimonial.create(body)
    console.log('✅ Testimonial created successfully');
    return NextResponse.json(testimonial, { status: 201 })
  } catch (error: any) {
    console.error('❌ Testimonial POST error:', error.message);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
