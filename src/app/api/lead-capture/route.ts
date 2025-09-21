import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, address, service } = body

    // Validate required fields
    if (!name || !email || !phone || !address || !service) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Send email to office
    const { data, error } = await resend.emails.send({
      from: 'Tree Shop Leads <onboarding@resend.dev>',
      to: ['office@fltreeshop.com'],
      subject: `New Lead: ${name} - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #166534;">New Lead from Tree Shop Landing Page</h2>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Service Interested In:</strong> ${service}</p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Action Required:</strong> Please contact this lead within 24 hours.</p>
          </div>

          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">

          <p style="color: #6b7280; font-size: 12px;">
            This lead was captured from the Tree Shop landing page at ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: 'Tree Shop <onboarding@resend.dev>',
      to: [email],
      subject: 'Thank you for contacting Tree Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #166534;">Thank You for Contacting Tree Shop</h2>

          <p>Hi ${name},</p>

          <p>We've received your request for a free estimate for ${service}. One of our team members will contact you within 24 hours to discuss your project and schedule a site visit.</p>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Your Information</h3>
            <p><strong>Service Requested:</strong> ${service}</p>
            <p><strong>Property Address:</strong> ${address}</p>
          </div>

          <p>If you have any immediate questions, please don't hesitate to call us at (123) 456-7890.</p>

          <p>Thank you for choosing Tree Shop!</p>

          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">

          <p style="color: #6b7280; font-size: 12px;">
            Tree Shop - Professional Land Clearing Services<br>
            Licensed & Insured | Serving Central Florida
          </p>
        </div>
      `
    })

    return NextResponse.json(
      { message: 'Lead captured successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}