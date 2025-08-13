import { NextRequest, NextResponse } from 'next/server';
import { createSearchConsoleManager } from '@/lib/googleSearchConsole';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sitemapUrl, autoSubmit = true } = body;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://treeai.us/treeshop';
    const defaultSitemapUrl = sitemapUrl || `${siteUrl}/sitemap.xml`;

    // Check if Search Console is configured
    const searchConsoleManager = createSearchConsoleManager();
    if (!searchConsoleManager) {
      return NextResponse.json(
        { error: 'Google Search Console not configured' },
        { status: 503 }
      );
    }

    let result;
    if (autoSubmit) {
      // Submit sitemap automatically
      result = await searchConsoleManager.submitSitemap(defaultSitemapUrl);
    } else {
      // Just verify the sitemap exists
      try {
        const response = await fetch(defaultSitemapUrl);
        result = {
          success: response.ok,
          error: response.ok ? undefined : `Sitemap not accessible: ${response.status}`
        };
      } catch (error) {
        result = {
          success: false,
          error: `Sitemap fetch error: ${error}`
        };
      }
    }

    // Log the event
    const eventId = crypto.randomUUID();
    await setDoc(doc(db, 'googleEvents', eventId), {
      type: 'SITEMAP_PING',
      payload: {
        sitemapUrl: defaultSitemapUrl,
        autoSubmit,
        result
      },
      ts: serverTimestamp(),
      success: result.success
    });

    return NextResponse.json({
      success: result.success,
      sitemapUrl: defaultSitemapUrl,
      message: result.success ? 
        'Sitemap submitted successfully' : 
        `Sitemap submission failed: ${result.error}`,
      eventId
    });

  } catch (error) {
    console.error('Sitemap submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit sitemap' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sitemapUrl = url.searchParams.get('sitemap') || 
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://treeai.us/treeshop'}/sitemap.xml`;

    const searchConsoleManager = createSearchConsoleManager();
    if (!searchConsoleManager) {
      return NextResponse.json(
        { error: 'Google Search Console not configured' },
        { status: 503 }
      );
    }

    // Get sitemap status from Search Console
    try {
      const status = await searchConsoleManager.getSitemapStatus(sitemapUrl);
      return NextResponse.json({
        sitemapUrl,
        status,
        success: true
      });
    } catch (error) {
      return NextResponse.json({
        sitemapUrl,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Sitemap status error:', error);
    return NextResponse.json(
      { error: 'Failed to get sitemap status' },
      { status: 500 }
    );
  }
}