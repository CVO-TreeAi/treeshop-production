import { NextRequest, NextResponse } from 'next/server';
import { createGoogleAdsManager } from '@/lib/googleAds';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { headers } from 'next/headers';
import crypto from 'crypto';

interface OfflineConversionRequest {
  events: {
    proposalId: string;
    kind: 'accepted' | 'deposit';
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    value?: number;
    currency?: string;
    ts: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication (implement your auth logic)
    const headersList = headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: OfflineConversionRequest = await request.json();
    const { events } = body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'Events array is required' }, { status: 400 });
    }

    const adsManager = createGoogleAdsManager();
    if (!adsManager) {
      return NextResponse.json({ error: 'Google Ads not configured' }, { status: 503 });
    }

    // Get conversion action IDs from integrations config
    const integrationsRef = doc(db, 'integrations', 'google');
    const integrationsSnap = await getDoc(integrationsRef);
    
    if (!integrationsSnap.exists()) {
      return NextResponse.json({ error: 'Google integrations not configured' }, { status: 503 });
    }

    const integrations = integrationsSnap.data();
    const adsConfig = integrations.ads;
    
    if (!adsConfig?.conversionActions) {
      return NextResponse.json({ error: 'Conversion actions not configured' }, { status: 503 });
    }

    // Process each event
    const conversions = [];
    const processedEvents = [];

    for (const event of events) {
      const { proposalId, kind, gclid, gbraid, wbraid, value, currency, ts } = event;
      
      // Skip if no click ID
      if (!gclid && !gbraid && !wbraid) {
        console.warn(`No click ID for proposal ${proposalId}, skipping OCI`);
        continue;
      }

      // Get the appropriate conversion action
      let conversionAction: string;
      if (kind === 'accepted') {
        conversionAction = adsConfig.conversionActions.leadAccepted;
      } else if (kind === 'deposit') {
        conversionAction = adsConfig.conversionActions.depositPaid;
      } else {
        console.warn(`Unknown event kind: ${kind}`);
        continue;
      }

      if (!conversionAction) {
        console.warn(`No conversion action configured for kind: ${kind}`);
        continue;
      }

      // Check for duplicate (idempotency)
      const eventHash = crypto.createHash('sha256')
        .update(`${proposalId}_${kind}_${gclid || gbraid || wbraid}_${ts}`)
        .digest('hex');
      
      const existingEventRef = doc(db, 'googleEvents', `oci_${eventHash}`);
      const existingEventSnap = await getDoc(existingEventRef);
      
      if (existingEventSnap.exists()) {
        console.log(`OCI event already processed: ${eventHash}`);
        processedEvents.push({
          proposalId,
          kind,
          status: 'duplicate',
          eventId: `oci_${eventHash}`
        });
        continue;
      }

      // Create conversion record
      conversions.push({
        gclid,
        gbraid,
        wbraid,
        conversionAction,
        conversionDateTime: new Date(ts).toISOString(),
        conversionValue: value,
        currencyCode: currency || 'USD',
        orderId: proposalId
      });

      processedEvents.push({
        proposalId,
        kind,
        status: 'queued',
        eventId: `oci_${eventHash}`,
        conversionAction
      });
    }

    if (conversions.length === 0) {
      return NextResponse.json({ 
        uploaded: 0, 
        message: 'No conversions to upload',
        events: processedEvents 
      });
    }

    // Upload to Google Ads
    const result = await adsManager.uploadOfflineConversions(conversions);

    // Store events in Firestore
    const promises = processedEvents.map(async (event, index) => {
      if (event.status === 'duplicate') return;
      
      const success = index < result.uploaded;
      const eventDoc = {
        proposalId: event.proposalId,
        type: 'ADS_OCI' as const,
        payload: {
          kind: event.kind,
          conversionAction: event.conversionAction,
          ...conversions[index]
        },
        ts: serverTimestamp(),
        success,
        error: success ? null : result.errors[index] || 'Unknown error'
      };

      await setDoc(doc(db, 'googleEvents', event.eventId), eventDoc);
    });

    await Promise.all(promises);

    return NextResponse.json({
      uploaded: result.uploaded,
      errors: result.errors,
      events: processedEvents
    });

  } catch (error) {
    console.error('Offline conversion upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload offline conversions' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get conversion actions for configuration
    const adsManager = createGoogleAdsManager();
    if (!adsManager) {
      return NextResponse.json({ error: 'Google Ads not configured' }, { status: 503 });
    }

    const conversionActions = await adsManager.getConversionActions();
    
    return NextResponse.json({
      conversionActions,
      configured: conversionActions.length > 0
    });

  } catch (error) {
    console.error('Get conversion actions error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversion actions' },
      { status: 500 }
    );
  }
}