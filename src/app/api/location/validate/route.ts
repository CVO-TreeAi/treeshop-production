// TreeAI Hive Intelligence - Secure Location Validation API
// Domain Coordination: Security Intelligence + TreeAI Core + SaaS Platform

import { NextRequest, NextResponse } from 'next/server';
import { LocationServiceCoordinator } from '@/lib/services/LocationService';
import { z } from 'zod';

// Security Intelligence - Rate limiting and validation
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes

// Comprehensive Zod validation schemas
const LocationValidationSchema = z.object({
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address too long')
    .regex(/^[a-zA-Z0-9\s,.-]+$/, 'Address contains invalid characters'),
  
  coordinates: z.object({
    lat: z.number()
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude')
      .refine(val => !isNaN(val), 'Latitude must be a valid number'),
    lng: z.number()
      .min(-180, 'Invalid longitude')
      .max(180, 'Invalid longitude')
      .refine(val => !isNaN(val), 'Longitude must be a valid number'),
  }).optional(),
  
  propertyBounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }).optional(),
  
  includeTreeAIAnalysis: z.boolean().default(true),
  includeRiskAssessment: z.boolean().default(true),
  includeMarketAnalytics: z.boolean().default(false),
});

const PinDropValidationSchema = z.object({
  coordinates: z.object({
    lat: z.number()
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude'),
    lng: z.number()
      .min(-180, 'Invalid longitude') 
      .max(180, 'Invalid longitude'),
  }),
  
  address: z.string().optional(),
  
  propertyBounds: z.object({
    north: z.number(),
    south: z.number(), 
    east: z.number(),
    west: z.number(),
  }).optional(),
  
  notes: z.string().max(500, 'Notes too long').optional(),
  
  // TreeAI Analysis Options
  analysisOptions: z.object({
    includeTreeAIPricing: z.boolean().default(true),
    includeRiskProfile: z.boolean().default(true),
    includeMarketAnalytics: z.boolean().default(true),
    includePropertyInsights: z.boolean().default(true),
  }).optional(),
});

// Security Intelligence - Rate limiting store
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  clientData.count++;
  return true;
}

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return `${ip}_location_validate`;
}

// Comprehensive Address Validation with TreeAI Intelligence
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Security Intelligence - Rate limiting
    const clientId = getClientId(request);
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        rateLimitReset: Math.ceil((requestCounts.get(clientId)?.resetTime || 0) / 1000),
      }, { status: 429 });
    }

    // Initialize Hive Intelligence
    const locationService = await LocationServiceCoordinator.initializeWithHiveIntelligence();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Location services temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      }, { status: 503 });
    }

    // Validate request data
    const body = await request.json();
    const validatedData = LocationValidationSchema.parse(body);
    
    // TreeAI Core Intelligence - Address verification with comprehensive analysis
    const propertyLocation = await locationService.verifyPropertyLocation(validatedData.address);
    
    // Business Intelligence - Service area analysis
    const isWithinServiceArea = locationService.isWithinServiceArea(propertyLocation.coordinates);
    
    // TreeAI Pricing Intelligence - Travel surcharge calculation
    const travelSurcharge = locationService.calculateTravelSurcharge(
      propertyLocation.distanceFromBase.meters,
      1000, // Base price for calculation
      propertyLocation.riskProfile
    );
    
    // Hive Intelligence Coordination - Cross-domain insights
    const coordinationResult = {
      success: true,
      insights: [
        `Property verified with ${Math.round((propertyLocation.treeAIAnalysis?.estimatedCost.confidence || 0.7) * 100)}% confidence`,
        `Located in ${travelSurcharge.zone}`,
        `Market segment: ${propertyLocation.analytics?.marketSegment || 'standard'}`,
      ],
      recommendations: [
        isWithinServiceArea ? 'Location is within service area' : 'Location requires travel surcharge',
        propertyLocation.riskProfile?.accessRisk === 'high' ? 'Equipment access may be challenging' : 'Good equipment access expected',
      ],
    };

    // Response with comprehensive TreeAI analysis
    const response = {
      success: true,
      data: {
        // Core validation results
        validated: propertyLocation.verified,
        address: propertyLocation.address,
        coordinates: propertyLocation.coordinates,
        placeId: propertyLocation.placeId,
        
        // Property details
        propertyType: propertyLocation.propertyType,
        accessibilityScore: propertyLocation.accessibilityScore,
        
        // Service area information
        isWithinServiceArea,
        distanceFromBase: propertyLocation.distanceFromBase,
        serviceZone: travelSurcharge.zone,
        
        // TreeAI Intelligence (conditional)
        ...(validatedData.includeTreeAIAnalysis && {
          treeAIAnalysis: propertyLocation.treeAIAnalysis,
        }),
        
        // Security Intelligence (conditional)
        ...(validatedData.includeRiskAssessment && {
          riskProfile: propertyLocation.riskProfile,
        }),
        
        // Business Intelligence (conditional)
        ...(validatedData.includeMarketAnalytics && {
          analytics: propertyLocation.analytics,
          propertyInsights: propertyLocation.propertyInsights,
        }),
        
        // Travel and pricing
        travelSurcharge: {
          zone: travelSurcharge.zone,
          surchargePercent: travelSurcharge.surchargePercent,
          riskAdjustment: travelSurcharge.riskAdjustment,
          estimatedAmount: travelSurcharge.finalSurcharge,
        },
        
        // Hive coordination metadata
        hiveIntelligence: {
          coordinationResult,
          processingTimeMs: Date.now() - startTime,
          domainsInvolved: ['TreeAI Core', 'Security Intelligence', 'Business Intelligence', 'SaaS Platform'],
        },
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Location validation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Location validation failed',
      code: 'INTERNAL_ERROR',
      processingTimeMs: Date.now() - startTime,
    }, { status: 500 });
  }
}

// Pin Drop Location Processing with Enhanced Security
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Security check
    const clientId = getClientId(request);
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
      }, { status: 429 });
    }

    // Initialize services
    const locationService = await LocationServiceCoordinator.initializeWithHiveIntelligence();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Location services unavailable',
      }, { status: 503 });
    }

    // Validate pin drop data
    const body = await request.json();
    const validatedData = PinDropValidationSchema.parse(body);
    
    // TreeAI Intelligence - Process pin drop with full analysis
    const propertyLocation = await locationService.processPinDropLocation({
      coordinates: validatedData.coordinates,
      address: validatedData.address,
      propertyBounds: validatedData.propertyBounds,
      notes: validatedData.notes,
    });
    
    // Enhanced analysis based on options
    const analysisOptions = validatedData.analysisOptions || {};
    
    // Service area validation
    const isWithinServiceArea = locationService.isWithinServiceArea(validatedData.coordinates);
    
    // Travel cost analysis
    const travelSurcharge = locationService.calculateTravelSurcharge(
      propertyLocation.distanceFromBase.meters,
      1200, // Base price for residential property
      propertyLocation.riskProfile
    );

    const response = {
      success: true,
      data: {
        // Core pin drop results
        coordinates: propertyLocation.coordinates,
        address: propertyLocation.address,
        placeId: propertyLocation.placeId,
        verified: propertyLocation.verified,
        
        // Property analysis
        propertyType: propertyLocation.propertyType,
        accessibilityScore: propertyLocation.accessibilityScore,
        
        // Service area status
        isWithinServiceArea,
        distanceFromBase: propertyLocation.distanceFromBase,
        
        // Conditional TreeAI analysis
        ...(analysisOptions.includeTreeAIPricing && {
          treeAIAnalysis: propertyLocation.treeAIAnalysis,
        }),
        
        ...(analysisOptions.includeRiskProfile && {
          riskProfile: propertyLocation.riskProfile,
        }),
        
        ...(analysisOptions.includeMarketAnalytics && {
          analytics: propertyLocation.analytics,
        }),
        
        ...(analysisOptions.includePropertyInsights && {
          propertyInsights: propertyLocation.propertyInsights,
        }),
        
        // Pricing information
        travelSurcharge,
        
        // Processing metadata
        processingTimeMs: Date.now() - startTime,
        hiveIntelligenceActive: true,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Pin drop processing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid pin drop data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Pin drop processing failed',
      processingTimeMs: Date.now() - startTime,
    }, { status: 500 });
  }
}

// Service Area Check - Lightweight endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({
        success: false,
        error: 'Valid lat and lng parameters required',
      }, { status: 400 });
    }

    const locationService = await LocationServiceCoordinator.initializeWithHiveIntelligence();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Service unavailable',
      }, { status: 503 });
    }

    const isWithinServiceArea = locationService.isWithinServiceArea({ lat, lng });
    
    return NextResponse.json({
      success: true,
      data: {
        coordinates: { lat, lng },
        isWithinServiceArea,
        message: isWithinServiceArea 
          ? 'Location is within our service area' 
          : 'Location is outside our service area but we may still provide service',
      },
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Service area check failed',
    }, { status: 500 });
  }
}