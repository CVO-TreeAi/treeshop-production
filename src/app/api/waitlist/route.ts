import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../convex/_generated/api'
import { Resend } from 'resend'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, email, phone, currentRevenue, operationsChallenges } = body

    // Validate required fields
    if (!companyName || !email || !phone || !currentRevenue) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Add to waitlist via Convex
    const result = await convex.mutation(api.waitlist.addWaitlistSignup, {
      companyName,
      email,
      phone,
      currentRevenue,
      operationsChallenges,
      source: 'tech-page'
    })

    // Send notification email to you
    const { data, error } = await resend.emails.send({
      from: 'TreeAI Waitlist <onboarding@resend.dev>',
      to: ['office@fltreeshop.com'],
      subject: `🚀 New TreeAI Waitlist Signup #${result.signupNumber}: ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">New TreeAI Waitlist Signup!</h2>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Company Information</h3>
            <p><strong>Company:</strong> ${companyName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Current Revenue:</strong> ${currentRevenue}</p>
            ${operationsChallenges ? `<p><strong>Operations Challenge:</strong> ${operationsChallenges}</p>` : ''}
          </div>

          <div style="background-color: ${result.foundingMember ? '#fef3c7' : '#f3f4f6'}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Signup #${result.signupNumber}</strong></p>
            ${result.foundingMember ?
              `<p style="margin: 0; color: #d97706;"><strong>✨ FOUNDING MEMBER STATUS</strong></p>
               <p style="margin: 0; color: #92400e;">Founding spots remaining: ${result.spotsRemaining}</p>` :
              `<p style="margin: 0;">Standard waitlist member</p>`
            }
          </div>

          <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Next Steps:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Send TreeAI Field Guide PDF to ${email}</li>
              <li>Add to beta testing list</li>
              <li>Schedule follow-up call to discuss their operations challenges</li>
              ${result.foundingMember ? '<li><strong>Priority founding member onboarding</strong></li>' : ''}
            </ul>
          </div>

          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">

          <p style="color: #6b7280; font-size: 12px;">
            This signup was captured from the TreeAI Technology page at ${new Date().toLocaleString()}
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Error sending waitlist notification email:', error)
      // Don't fail the signup if email fails
    }

    // Send confirmation email to the signup
    await resend.emails.send({
      from: 'TreeAI <onboarding@resend.dev>',
      to: [email],
      subject: `Welcome to TreeAI - ${result.foundingMember ? 'Founding Member' : 'Waitlist'} Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Welcome to TreeAI!</h2>

          <p>Hi ${companyName},</p>

          <p>Thank you for joining the TreeAI waitlist! You're now part of the revolution transforming tree care operations through systematic, data-driven approaches.</p>

          ${result.foundingMember ? `
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f59e0b;">
            <h3 style="color: #d97706; margin-top: 0;">🎉 Congratulations - Founding Member Status!</h3>
            <p style="color: #92400e; margin: 0;">You're signup #${result.signupNumber} and qualify for exclusive founding member benefits:</p>
            <ul style="color: #92400e;">
              <li><strong>50% discount</strong> for your first year</li>
              <li>Lifetime priority support</li>
              <li>Feature request influence</li>
              <li>Free 30-day launch program ($2,500 value)</li>
              <li>Beta access to new features</li>
            </ul>
            <p style="color: #d97706; margin: 0;"><strong>Only ${result.spotsRemaining} founding member spots remaining!</strong></p>
          </div>
          ` : `
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">You're on the TreeAI Waitlist</h3>
            <p style="color: #166534; margin: 0;">Signup #${result.signupNumber} - You'll get early access when we launch in Q2 2025.</p>
          </div>
          `}

          <h3 style="color: #166534;">What happens next?</h3>
          <ol>
            <li><strong>TreeAI Field Guide:</strong> You'll receive a detailed PDF explaining our complete system</li>
            <li><strong>Beta Testing Invitation:</strong> Help us refine TreeAI before public launch</li>
            <li><strong>Early Access:</strong> Start using TreeAI before general availability</li>
            <li><strong>Launch Day:</strong> Priority onboarding and setup support</li>
          </ol>

          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0;">Your TreeAI Journey Begins</h3>
            <p style="color: #166534;">
              <strong>Launch Timeline:</strong> Q2 2025<br>
              <strong>Your Status:</strong> ${result.foundingMember ? 'Founding Member' : 'Waitlist Member'}<br>
              <strong>Revenue Category:</strong> ${currentRevenue}<br>
              <strong>Signup Number:</strong> #${result.signupNumber}
            </p>
          </div>

          <p>Questions about TreeAI? Reply to this email or call us at (386) 843-5266.</p>

          <p>Welcome to the future of tree care operations!</p>

          <p><strong>The TreeAI Team</strong><br>
          Tree Shop LLC</p>

          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">

          <p style="color: #6b7280; font-size: 12px;">
            TreeAI: Stop guessing. Start systematizing. Scale profitably.<br>
            This email was sent because you signed up for the TreeAI waitlist at treeshop.app/tech
          </p>
        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: result.foundingMember
        ? `Welcome, Founding Member #${result.signupNumber}! Check your email for next steps.`
        : `Welcome to TreeAI! You're #${result.signupNumber} on the waitlist.`,
      foundingMember: result.foundingMember,
      signupNumber: result.signupNumber,
      spotsRemaining: result.spotsRemaining
    })

  } catch (error) {
    console.error('Error processing waitlist signup:', error)

    if (error instanceof Error && error.message.includes('already registered')) {
      return NextResponse.json(
        { error: 'This email is already registered for the TreeAI waitlist' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process waitlist signup. Please try again.' },
      { status: 500 }
    )
  }
}