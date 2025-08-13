import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { headers } from 'next/headers';
import crypto from 'crypto';

export interface AnalyticsEvent {
  name: string;
  proposalId?: string;
  customerHash?: string;
  params?: Record<string, any>;
  attribution?: {
    gclid?: string | null;
    gbraid?: string | null;
    wbraid?: string | null;
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
      term?: string;
      content?: string;
    };
    firstTouchTs?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsEvent = await request.json();
    const { name, proposalId, customerHash, params = {}, attribution } = body;

    // Validate required fields
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Event name is required' }, { status: 400 });
    }

    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '';
    
    // Generate client_id for GA4 if not provided
    const clientId = params.client_id || crypto.randomUUID();

    // Create event payload for GA4
    const ga4Event = {
      client_id: clientId,
      user_id: customerHash,
      events: [{
        name,
        params: {
          ...params,
          proposal_id: proposalId,
          page_location: params.page_location || request.nextUrl.origin,
          page_title: params.page_title || 'TreeAI Pro Website',
          user_agent: userAgent,
          ip_override: ip,
          ...attribution
        }
      }]
    };

    // Send to GA4 Measurement Protocol
    const ga4Response = await sendToGA4(ga4Event);
    
    // Store event in Firestore for tracking
    const eventId = crypto.randomUUID();
    await setDoc(doc(db, 'googleEvents', eventId), {
      proposalId: proposalId || null,
      type: 'GA4_EVENT',
      payload: {
        event_name: name,
        client_id: clientId,
        user_id: customerHash,
        params,
        attribution
      },
      ts: serverTimestamp(),
      ga4_response: ga4Response.ok
    });

    return NextResponse.json({ ok: true, eventId });

  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' }, 
      { status: 500 }
    );
  }
}

async function sendToGA4(eventData: any): Promise<Response> {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID || 'G-GM7WD5TG62';
  const apiSecret = process.env.GA4_API_SECRET;

  if (!apiSecret) {
    console.warn('GA4_API_SECRET not configured, skipping GA4 send');
    return new Response('{}', { status: 200 });
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });

    return response;
  } catch (error) {
    console.error('GA4 API error:', error);
    throw error;
  }
}