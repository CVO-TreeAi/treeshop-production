import { NextRequest, NextResponse } from 'next/server';
import { createSearchConsoleManager } from '@/lib/googleSearchConsole';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchConsoleManager = createSearchConsoleManager();
    if (!searchConsoleManager) {
      return NextResponse.json(
        { error: 'Google Search Console not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { 
      startDate, 
      endDate, 
      dimensions = ['query'], 
      searchType = 'web',
      rowLimit = 100 
    } = body;

    // Validate date range
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required (YYYY-MM-DD format)' },
        { status: 400 }
      );
    }

    // Query search analytics
    const result = await searchConsoleManager.querySearchAnalytics({
      startDate,
      endDate,
      dimensions,
      searchType,
      rowLimit
    });

    // Calculate summary metrics
    const summary = {
      totalClicks: 0,
      totalImpressions: 0,
      averageCTR: 0,
      averagePosition: 0,
      rowCount: result.rows?.length || 0
    };

    if (result.rows && result.rows.length > 0) {
      summary.totalClicks = result.rows.reduce((sum, row) => sum + row.clicks, 0);
      summary.totalImpressions = result.rows.reduce((sum, row) => sum + row.impressions, 0);
      summary.averageCTR = summary.totalImpressions > 0 ? 
        (summary.totalClicks / summary.totalImpressions) * 100 : 0;
      summary.averagePosition = result.rows.reduce((sum, row) => sum + row.position, 0) / result.rows.length;
    }

    return NextResponse.json({
      dateRange: { startDate, endDate },
      summary,
      data: result.rows || [],
      query: { dimensions, searchType, rowLimit }
    });

  } catch (error) {
    console.error('Search Console analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search analytics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchConsoleManager = createSearchConsoleManager();
    if (!searchConsoleManager) {
      return NextResponse.json(
        { error: 'Google Search Console not configured' },
        { status: 503 }
      );
    }

    // Get properties for verification
    const properties = await searchConsoleManager.listProperties();
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://treeai.us/treeshop';
    const isVerified = properties.some(prop => 
      prop.siteUrl === siteUrl && prop.permissionLevel === 'siteOwner'
    );

    return NextResponse.json({
      siteUrl,
      isVerified,
      properties: properties.map(prop => ({
        siteUrl: prop.siteUrl,
        permissionLevel: prop.permissionLevel
      })),
      configured: true
    });

  } catch (error) {
    console.error('Search Console properties error:', error);
    return NextResponse.json(
      { error: 'Failed to get properties' },
      { status: 500 }
    );
  }
}