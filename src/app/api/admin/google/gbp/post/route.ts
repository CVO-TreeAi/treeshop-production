import { NextRequest, NextResponse } from 'next/server';
import { createLocalPost } from '@/lib/googleBusiness';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import crypto from 'crypto';

interface GbpPostRequest {
  title: string;
  body: string;
  ctaUrl?: string;
  mediaUrl?: string;
  accountId?: string;
  locationId?: string;
}

const POST_TEMPLATES = [
  {
    title: "Transform Your Land with Professional Forestry Mulching",
    body: "Looking to clear overgrown land while preserving soil health? Our eco-friendly forestry mulching services leave your property ready for development or landscaping. Get your AI-powered estimate today!",
    ctaUrl: "/estimate"
  },
  {
    title: "Hurricane Season Prep: Clear Dangerous Trees & Brush",
    body: "Protect your Florida property from storm damage. Our selective land clearing removes hazardous vegetation while maintaining your property's natural beauty. Fast, professional service across Central Florida.",
    ctaUrl: "/estimate"
  },
  {
    title: "Land Development Made Easy with TreeAI",
    body: "From raw land to building-ready sites, our comprehensive land clearing services handle projects of any size. Advanced equipment, competitive pricing, and expert results. Contact us for a free consultation!",
    ctaUrl: "/estimate"
  },
  {
    title: "Preserve the Good Trees, Remove the Rest",
    body: "Unlike traditional bulldozing, our forestry mulching selectively clears unwanted vegetation while preserving valuable trees. The mulch left behind enriches your soil naturally. See the difference!",
    ctaUrl: "/estimate"
  },
  {
    title: "Fast Track Your Property Development Project",
    body: "Waiting weeks for land clearing quotes? Our AI-powered estimation gives you instant, accurate pricing. Professional forestry mulching services with transparent pricing and guaranteed results.",
    ctaUrl: "/estimate"
  }
];

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GbpPostRequest = await request.json();
    
    // Get GBP configuration
    const integrationsRef = doc(db, 'integrations', 'google');
    const integrationsSnap = await getDoc(integrationsRef);
    
    if (!integrationsSnap.exists()) {
      return NextResponse.json(
        { error: 'Google integrations not configured' }, 
        { status: 503 }
      );
    }

    const integrations = integrationsSnap.data();
    const gbpConfig = integrations.gbp;
    
    if (!gbpConfig?.postsEnabled) {
      return NextResponse.json(
        { error: 'GBP posts not enabled' }, 
        { status: 503 }
      );
    }

    // Use provided IDs or fallback to config
    const accountId = body.accountId || gbpConfig.accountId;
    const locationId = body.locationId || gbpConfig.locationId;
    
    if (!accountId || !locationId) {
      return NextResponse.json(
        { error: 'GBP account and location IDs required' }, 
        { status: 400 }
      );
    }

    // Prepare post payload
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://treeai.us/treeshop';
    const ctaUrl = body.ctaUrl ? `${siteUrl}${body.ctaUrl}` : `${siteUrl}/estimate`;
    
    const postPayload = {
      summary: `${body.title}\n\n${body.body}`,
      callToAction: {
        actionType: 'LEARN_MORE',
        url: ctaUrl
      },
      ...(body.mediaUrl && {
        media: [{ googleUrl: body.mediaUrl }]
      })
    };

    // Create the post
    const result = await createLocalPost(accountId, locationId, postPayload);
    
    // Log the event
    const eventId = crypto.randomUUID();
    await setDoc(doc(db, 'googleEvents', eventId), {
      type: 'GBP_POST',
      payload: {
        title: body.title,
        body: body.body,
        ctaUrl,
        accountId,
        locationId,
        postId: (result as any)?.name || null
      },
      ts: serverTimestamp(),
      success: true
    });

    return NextResponse.json({
      success: true,
      postId: (result as any)?.name || null,
      eventId
    });

  } catch (error) {
    console.error('GBP post creation error:', error);
    
    // Log the error
    try {
      const eventId = crypto.randomUUID();
      await setDoc(doc(db, 'googleEvents', eventId), {
        type: 'GBP_POST',
        payload: {
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        ts: serverTimestamp(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } catch (logError) {
      console.error('Failed to log GBP post error:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to create GBP post' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve post templates
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const template = url.searchParams.get('template');
    
    if (template === 'random') {
      // Return a random template
      const randomTemplate = POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)];
      return NextResponse.json(randomTemplate);
    }
    
    if (template === 'weekly') {
      // Return template based on week of year for consistency
      const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
      const templateIndex = weekOfYear % POST_TEMPLATES.length;
      return NextResponse.json(POST_TEMPLATES[templateIndex]);
    }
    
    // Return all templates
    return NextResponse.json({
      templates: POST_TEMPLATES,
      count: POST_TEMPLATES.length
    });

  } catch (error) {
    console.error('GBP templates error:', error);
    return NextResponse.json(
      { error: 'Failed to get post templates' },
      { status: 500 }
    );
  }
}