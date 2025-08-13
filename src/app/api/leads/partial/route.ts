import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from "convex/browser"
import { api } from '../../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Save partial lead form data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      sessionId,
      formData,
      step,
      pageUrl,
      utmSource,
      utmMedium, 
      utmCampaign,
      referrer
    } = body

    // Save partial lead
    const partialLeadId = await convex.mutation(api.leads.savePartialLead, {
      sessionId: sessionId || `session_${Date.now()}_${Math.random()}`,
      formData,
      pageUrl: pageUrl || 'unknown',
      step,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
    })

    return NextResponse.json({
      success: true,
      partialLeadId,
      sessionId,
      message: 'Progress saved',
      data: {
        step,
        fieldsCompleted: Object.keys(formData).length,
      }
    })

  } catch (error) {
    console.error('Partial lead save error:', error)
    return NextResponse.json({
      success: false, 
      error: 'Failed to save progress',
    }, { status: 500 })
  }
}

// Get partial lead data for session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID required',
      }, { status: 400 })
    }

    // Get partial leads for this session
    const partialLeads = await convex.query(api.leads.getPartialLeads, {
      status: 'partial'
    })
    
    const sessionLead = partialLeads.find(lead => lead.sessionId === sessionId)
    
    return NextResponse.json({
      success: true,
      data: sessionLead || null,
      found: !!sessionLead,
    })

  } catch (error) {
    console.error('Get partial lead error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve saved progress',
    }, { status: 500 })
  }
}