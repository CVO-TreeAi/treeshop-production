import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from "convex/browser"
import { api } from '../../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Capture full lead submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      sessionId,
      name,
      email, 
      phone,
      address,
      zipCode,
      acreage,
      selectedPackage,
      obstacles,
      estimatedTotal,
      pricePerAcre,
      travelSurcharge,
      assumptions,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer
    } = body

    // Create the full lead
    const leadId = await convex.mutation(api.leads.createLead, {
      name,
      email,
      phone,
      address,
      zipCode,
      acreage,
      selectedPackage,
      obstacles,
      leadSource: "website",
      leadPage: "estimate",
      estimatedTotal,
      pricePerAcre,
      travelSurcharge,
      assumptions,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
    })

    // Create estimate if we have pricing data
    if (estimatedTotal && acreage) {
      const estimateId = await convex.mutation(api.estimates.createEstimate, {
        leadId: leadId as string,
        acreage,
        packageType: selectedPackage,
        obstacles: obstacles || [],
        basePrice: estimatedTotal - (travelSurcharge || 0),
        travelSurcharge: travelSurcharge || 0,
        obstacleAdjustment: 0,
        totalPrice: estimatedTotal,
        aiConfidence: 0.85,
        aiAssumptions: assumptions,
      })

      // Send proposal email notification (simplified - skip Convex notification)
      console.log('Proposal created for customer:', email)

      // Send actual proposal email via Gmail API
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-gmail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailType: 'customer_proposal',
            data: {
              customerName: name,
              customerEmail: email,
              projectAddress: address,
              acreage,
              packageType: selectedPackage,
              totalPrice: estimatedTotal,
              basePrice: estimatedTotal - (travelSurcharge || 0),
              travelSurcharge: travelSurcharge || 0,
              obstacleAdjustment: 0,
              assumptions: assumptions || [],
              estimatedDays: Math.ceil(acreage * 0.5), // Rough estimate
            }
          })
        })
        
        const emailResult = await emailResponse.json()
        
        if (!emailResult.success) {
          console.error('Failed to send proposal email:', emailResult.error)
        } else {
          console.log('Proposal email sent successfully:', emailResult.messageId)
        }
      } catch (error) {
        console.error('Error sending proposal email:', error)
      }
    }

    // Send new lead notification to admin (only if we have pricing data)
    console.log('New lead created:', leadId)

    // Send actual admin notification email via Gmail API (only with complete data)
    if (estimatedTotal && acreage) {
      try {
        const leadScore = estimatedTotal >= 15000 || acreage >= 10 ? 'hot' : 
                         acreage >= 5 ? 'warm' : 'cold'

        const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-gmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'admin_new_lead',
          data: {
            name,
            email,
            phone,
            address,
            acreage,
            selectedPackage,
            obstacles: obstacles || [],
            estimatedTotal,
            leadScore,
            leadSource: 'website',
            utmSource,
            utmMedium,
            utmCampaign,
          }
        })
      })
      
      const adminEmailResult = await adminEmailResponse.json()
      
      if (!adminEmailResult.success) {
        console.error('Failed to send admin notification:', adminEmailResult.error)
      } else {
        console.log('Admin notification sent successfully:', adminEmailResult.messageId)
      }
      } catch (error) {
        console.error('Error sending admin notification:', error)
      }
    }

    // Mark any partial lead as completed
    if (sessionId) {
      try {
        await convex.mutation(api.leads.completeLeadFromPartial, {
          sessionId,
          finalData: {
            name,
            email,
            phone,
            address,
            zipCode,
            acreage,
            selectedPackage,
            obstacles,
          },
          estimateData: estimatedTotal ? {
            estimatedTotal,
            pricePerAcre: pricePerAcre || 0,
            travelSurcharge: travelSurcharge || 0,
            assumptions: assumptions || [],
          } : undefined,
        })
      } catch (error) {
        console.warn('No partial lead to complete:', error)
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead captured successfully',
      data: {
        leadScore: await getLeadScore(leadId),
        estimatedTotal,
        proposalSent: !!estimatedTotal,
      }
    })

  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to capture lead',
    }, { status: 500 })
  }
}

// Helper function to get lead score
async function getLeadScore(leadId: string) {
  try {
    const lead = await convex.query(api.leads.getLeadById, { 
      id: leadId as any 
    })
    return lead?.leadScore || 'cold'
  } catch {
    return 'cold'
  }
}