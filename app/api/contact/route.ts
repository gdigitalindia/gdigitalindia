import { NextResponse } from 'next/server'
import { connectDB }    from '@/lib/mongodb'
import Enquiry          from '@/models/Enquiry'
import nodemailer       from 'nodemailer'

// POST — Contact form submit
export async function POST(request: Request) {
  try {
    const { name, email, phone, company, service, budget, message } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email aur message required hai' },
        { status: 400 }
      )
    }

    // MongoDB mein save karo
    await connectDB()
    await Enquiry.create({ name, email, phone, company, service, budget, message })

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('❌ Email settings missing in .env.local')
      return NextResponse.json({ success: true, warning: 'Email not sent: missing config' })
    }

    // Email Transporter setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Port 587 uses STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // 1. Admin Notification (Aapko aayega)
    const adminMailPromise = transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      process.env.EMAIL_USER,
      replyTo: email, // Direct reply to customer
      subject: `🔔 New Enquiry from ${name} — GDI Agency`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #1A1A2E 0%, #16213E 100%); padding: 30px; text-align: center;">
            <h1 style="color: #E94560; margin: 0; font-size: 28px; letter-spacing: 1px;">GDI Agency</h1>
            <p style="color: #94A3B8; margin: 10px 0 0; font-size: 14px; text-transform: uppercase;">New Inquiry Received</p>
          </div>
          <div style="padding: 30px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 12px 10px; color: #64748B; font-weight: 600; width: 120px; border-bottom: 1px solid #f1f5f9;">Name</td><td style="padding: 12px 10px; color: #1E293B; border-bottom: 1px solid #f1f5f9;">${name}</td></tr>
              <tr><td style="padding: 12px 10px; color: #64748B; font-weight: 600; border-bottom: 1px solid #f1f5f9;">Email</td><td style="padding: 12px 10px; color: #1E293B; border-bottom: 1px solid #f1f5f9;">${email}</td></tr>
              <tr><td style="padding: 12px 10px; color: #64748B; font-weight: 600; border-bottom: 1px solid #f1f5f9;">Phone</td><td style="padding: 12px 10px; color: #1E293B; border-bottom: 1px solid #f1f5f9;">${phone || 'N/A'}</td></tr>
              <tr><td style="padding: 12px 10px; color: #64748B; font-weight: 600; border-bottom: 1px solid #f1f5f9;">Service</td><td style="padding: 12px 10px; color: #1E293B; border-bottom: 1px solid #f1f5f9;">${service || 'N/A'}</td></tr>
              <tr><td style="padding: 12px 10px; color: #64748B; font-weight: 600; vertical-align: top; border-bottom: 1px solid #f1f5f9;">Message</td><td style="padding: 12px 10px; color: #1E293B; border-bottom: 1px solid #f1f5f9; line-height: 1.6;">${message}</td></tr>
            </table>
          </div>
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e1e1e1;">
            <a href="${process.env.NEXT_PUBLIC_URL}/admin/enquiries" style="background: #E94560; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: 600;">View in Admin Panel</a>
          </div>
        </div>
      `,
    })

    // 2. User Auto-Reply (Customer ko aayega)
    const userMailPromise = transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      email,
      subject: `Thank you for reaching out to G-Digital India (GDI)`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
          <div style="background: #1A1A2E; padding: 40px; text-align: center;">
            <h1 style="color: #E94560; margin: 0;">Hello, ${name}!</h1>
            <p style="color: #94A3B8; margin: 10px 0 0; font-size: 16px;">We've received your enquiry.</p>
          </div>
          <div style="padding: 40px; background: #ffffff; text-align: center; color: #334155;">
            <p style="font-size: 18px; line-height: 1.6;">Thank you for your interest in our services! Our team is reviewing your message and will get back to you within 24 hours.</p>
            <div style="margin-top: 30px; padding: 20px; background: #F1F5F9; border-radius: 8px;">
               <p style="margin: 0; font-weight: 600;">What's Next?</p>
               <p style="margin: 5px 0 0; font-size: 14px;">One of our consultants will contact you shortly to discuss your project in detail.</p>
            </div>
          </div>
          <div style="background: #1A1A2E; padding: 20px; text-align: center; color: #94A3B8; font-size: 13px;">
            © 2026 G-Digital India Agency. All rights reserved.
          </div>
        </div>
      `,
    })

    // Intezaar karo dono mails jaane ka
    const results = await Promise.allSettled([adminMailPromise, userMailPromise])
    
    // Log results for debugging
    results.forEach((res, i) => {
      if (res.status === 'rejected') {
        console.error(`Email ${i === 0 ? 'Admin' : 'User'} failed:`, res.reason)
      } else {
        console.log(`Email ${i === 0 ? 'Admin' : 'User'} sent successfully`)
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET — Saari enquiries (Admin ke liye)
export async function GET() {
  try {
    await connectDB()
    const enquiries = await Enquiry.find().sort({ createdAt: -1 })
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error('Contact GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — Enquiry delete karo (?id=xxx)
export async function DELETE(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    await Enquiry.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
