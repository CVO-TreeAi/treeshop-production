import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, eventParams } = body;

    // Add site source identification
    const enrichedParams = {
      ...eventParams,
      site_source: 'treeshop.app',
      timestamp: new Date().toISOString(),
    };

    // Send to Google Analytics 4
    if (process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET) {
      const ga4Response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: eventParams.client_id || 'server_side_client',
            events: [{
              name: eventName,
              params: enrichedParams,
            }],
          }),
        }
      );

      if (!ga4Response.ok) {
        console.error('GA4 tracking failed:', await ga4Response.text());
      }
    }

    return NextResponse.json({ 
      success: true,
      site: 'treeshop.app',
      event: eventName 
    });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}