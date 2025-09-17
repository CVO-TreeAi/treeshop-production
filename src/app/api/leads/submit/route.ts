import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from "convex/browser"
import { api } from '../../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create the lead using Convex API
    const leadId = await convex.mutation(api.leads.create, body.args)

    return NextResponse.json({
      success: true,
      id: leadId,
      value: { id: leadId }
    })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Update the lead using Convex API
    await convex.mutation(api.leads.update, body.args)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead update error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead'
    }, { status: 500 })
  }
}