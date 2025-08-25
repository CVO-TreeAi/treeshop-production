// TreeAI Hive Intelligence - Location Analytics API
// Domain Coordination: Business Intelligence + Data Intelligence + TreeAI Core

import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Analytics request validation
const AnalyticsRequestSchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly']).default('monthly'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  includeGeographic: z.boolean().default(true),
  includeMarketSegmentation: z.boolean().default(true),
  includeRiskTrends: z.boolean().default(true),
  includePropertyTypes: z.boolean().default(true),
  includeTreeAIMetrics: z.boolean().default(true),
});

// Business Intelligence - Location Analytics Dashboard
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    const analyticsData = AnalyticsRequestSchema.parse({
      period: searchParams.get('period') || 'monthly',
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      includeGeographic: searchParams.get('includeGeographic') !== 'false',
      includeMarketSegmentation: searchParams.get('includeMarketSegmentation') !== 'false',
      includeRiskTrends: searchParams.get('includeRiskTrends') !== 'false',
      includePropertyTypes: searchParams.get('includePropertyTypes') !== 'false',
      includeTreeAIMetrics: searchParams.get('includeTreeAIMetrics') !== 'false',
    });

    // Calculate date range
    const endDate = analyticsData.endDate ? new Date(analyticsData.endDate) : new Date();
    let startDate: Date;
    
    switch (analyticsData.period) {
      case 'daily':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarterly':
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    if (analyticsData.startDate) {
      startDate = new Date(analyticsData.startDate);
    }

    // Fetch leads data for analysis
    const leads = await convex.query(api.leads.list, {
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
    });

    // Process analytics data
    const analytics = {
      period: analyticsData.period,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      
      // Core metrics
      summary: {
        totalLeads: leads.length,
        averageProjectValue: leads.reduce((sum, lead) => 
          sum + (lead.estimatedTotal || 0), 0) / leads.length || 0,
        conversionRate: leads.filter(lead => 
          ['won', 'quoted'].includes(lead.status)).length / leads.length || 0,
      },
    };

    // Geographic insights
    if (analyticsData.includeGeographic) {
      const zipAnalysis = leads.reduce((acc, lead) => {
        const zip = lead.zipCode || lead.locationData?.components?.zip || 'Unknown';
        if (!acc[zip]) {
          acc[zip] = {
            zipCode: zip,
            leadCount: 0,
            totalValue: 0,
            conversions: 0,
          };
        }
        acc[zip].leadCount++;
        acc[zip].totalValue += lead.estimatedTotal || 0;
        if (['won', 'quoted'].includes(lead.status)) {
          acc[zip].conversions++;
        }
        return acc;
      }, {} as Record<string, any>);

      analytics.geographic = {
        topPerformingZips: Object.values(zipAnalysis)
          .map((zip: any) => ({
            zipCode: zip.zipCode,
            leadCount: zip.leadCount,
            averageValue: zip.totalValue / zip.leadCount,
            conversionRate: zip.conversions / zip.leadCount,
          }))
          .sort((a: any, b: any) => b.leadCount - a.leadCount)
          .slice(0, 10),
      };
    }

    // Market segmentation analysis
    if (analyticsData.includeMarketSegmentation) {
      const segmentData = leads.reduce((acc, lead) => {
        const segment = lead.locationData?.analytics?.marketSegment || 'standard';
        if (!acc[segment]) {
          acc[segment] = { count: 0, totalValue: 0 };
        }
        acc[segment].count++;
        acc[segment].totalValue += lead.estimatedTotal || 0;
        return acc;
      }, {} as Record<string, any>);

      analytics.marketSegmentation = {
        premium: {
          count: segmentData.premium?.count || 0,
          avgValue: segmentData.premium ? 
            segmentData.premium.totalValue / segmentData.premium.count : 0,
        },
        standard: {
          count: segmentData.standard?.count || 0,
          avgValue: segmentData.standard ? 
            segmentData.standard.totalValue / segmentData.standard.count : 0,
        },
        budget: {
          count: segmentData.budget?.count || 0,
          avgValue: segmentData.budget ? 
            segmentData.budget.totalValue / segmentData.budget.count : 0,
        },
      };
    }

    // Risk assessment trends
    if (analyticsData.includeRiskTrends) {
      const riskData = leads.reduce((acc, lead) => {
        const riskLevel = lead.locationData?.riskProfile?.accessRisk || 'moderate';
        acc[riskLevel] = (acc[riskLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      analytics.riskTrends = {
        lowRisk: riskData.low || 0,
        moderateRisk: riskData.moderate || 0,
        highRisk: riskData.high || 0,
      };
    }

    // Property type performance
    if (analyticsData.includePropertyTypes) {
      const propertyData = leads.reduce((acc, lead) => {
        const propertyType = lead.locationData?.propertyType || 'residential';
        if (!acc[propertyType]) {
          acc[propertyType] = { count: 0, totalValue: 0 };
        }
        acc[propertyType].count++;
        acc[propertyType].totalValue += lead.estimatedTotal || 0;
        return acc;
      }, {} as Record<string, any>);

      analytics.propertyTypeMetrics = {
        residential: {
          count: propertyData.residential?.count || 0,
          avgValue: propertyData.residential ? 
            propertyData.residential.totalValue / propertyData.residential.count : 0,
        },
        commercial: {
          count: propertyData.commercial?.count || 0,
          avgValue: propertyData.commercial ? 
            propertyData.commercial.totalValue / propertyData.commercial.count : 0,
        },
        agricultural: {
          count: propertyData.agricultural?.count || 0,
          avgValue: propertyData.agricultural ? 
            propertyData.agricultural.totalValue / propertyData.agricultural.count : 0,
        },
        industrial: {
          count: propertyData.industrial?.count || 0,
          avgValue: propertyData.industrial ? 
            propertyData.industrial.totalValue / propertyData.industrial.count : 0,
        },
      };
    }

    // TreeAI performance metrics
    if (analyticsData.includeTreeAIMetrics) {
      const treeAILeads = leads.filter(lead => lead.locationData?.treeAIAnalysis);
      
      if (treeAILeads.length > 0) {
        const avgConfidence = treeAILeads.reduce((sum, lead) => 
          sum + (lead.locationData?.treeAIAnalysis?.estimatedCost.confidence || 0), 0
        ) / treeAILeads.length;

        // Estimate pricing accuracy by comparing estimated vs actual (when available)
        const accuracyData = treeAILeads
          .filter(lead => lead.estimatedTotal && lead.locationData?.treeAIAnalysis)
          .map(lead => {
            const estimated = lead.locationData!.treeAIAnalysis!.estimatedCost.totalEstimate;
            const actual = lead.estimatedTotal!;
            return Math.abs(estimated - actual) / actual;
          });

        const pricingAccuracy = accuracyData.length > 0 ? 
          1 - (accuracyData.reduce((sum, acc) => sum + acc, 0) / accuracyData.length) : 0;

        analytics.treeAIMetrics = {
          averageConfidence: avgConfidence,
          pricingAccuracy: pricingAccuracy,
          costSavingsGenerated: treeAILeads.length * 150, // Estimated time savings
          usageRate: treeAILeads.length / leads.length,
        };
      } else {
        analytics.treeAIMetrics = {
          averageConfidence: 0,
          pricingAccuracy: 0,
          costSavingsGenerated: 0,
          usageRate: 0,
        };
      }
    }

    // Processing metadata
    analytics.metadata = {
      processingTimeMs: Date.now() - startTime,
      dataPoints: leads.length,
      hiveIntelligenceActive: true,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });

  } catch (error) {
    console.error('Location analytics error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid analytics request',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Analytics generation failed',
      processingTimeMs: Date.now() - startTime,
    }, { status: 500 });
  }
}

// Store analytics data (for caching and historical tracking)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const analyticsData = AnalyticsRequestSchema.parse(body);
    
    // This would typically store analytics in the locationAnalytics table
    // For now, return success as the GET endpoint provides real-time analytics
    
    return NextResponse.json({
      success: true,
      message: 'Analytics data processed',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Analytics storage failed',
    }, { status: 500 });
  }
}