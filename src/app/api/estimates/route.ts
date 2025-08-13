import { NextRequest, NextResponse } from 'next/server';
import { estimateService } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    let estimates;
    
    if (leadId) {
      estimates = await estimateService.getEstimatesByLead(leadId);
    } else {
      estimates = await estimateService.getAll('estimates', 'createdAt');
    }

    return NextResponse.json(estimates);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json({ error: 'Failed to fetch estimates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const estimateData = await req.json();
    
    const id = await estimateService.createEstimate({
      leadId: estimateData.leadId,
      serviceDetails: estimateData.serviceDetails,
      pricing: estimateData.pricing,
      timeline: estimateData.timeline,
      assumptions: estimateData.assumptions || [],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'draft',
      aiGenerated: estimateData.aiGenerated || false,
      confidence: estimateData.confidence
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating estimate:', error);
    return NextResponse.json({ error: 'Failed to create estimate' }, { status: 500 });
  }
}