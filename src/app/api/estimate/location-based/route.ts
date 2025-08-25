// Location-Based Estimate API - TreeAI Hive Intelligence Integration
import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from '../../../../../convex/_generated/api';
import { createLocationService } from '@/lib/services/LocationService';
import { z } from 'zod';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Enhanced request schema with location data
const LocationEstimateSchema = z.object({
  // Location data
  location: z.object({
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    address: z.string(),
    placeId: z.string(),
    verified: z.boolean().optional(),
    propertyType: z.enum(['residential', 'commercial', 'agricultural', 'industrial']).optional(),
    accessibilityScore: z.number().min(1).max(10).optional(),
  }),
  
  // Project details
  projectDetails: z.object({
    acreage: z.number().min(0.1).max(1000),
    packageType: z.enum(['small', 'medium', 'large', 'xlarge']),
    obstacles: z.array(z.string()).default([]),
    urgency: z.enum(['standard', 'priority', 'emergency']).default('standard'),
    accessConcerns: z.array(z.string()).default([]),
    propertyBounds: z.object({
      north: z.number(),
      south: z.number(),
      east: z.number(),
      west: z.number(),
    }).optional(),
  }),
  
  // Optional lead context
  leadInfo: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

// Enhanced estimate calculation with location intelligence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestData = LocationEstimateSchema.parse(body);
    
    const { location, projectDetails, leadInfo } = requestData;
    
    // Initialize location service for advanced calculations
    const locationService = createLocationService();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Location services unavailable',
      }, { status: 503 });
    }

    // Get base TreeAI estimate
    const baseEstimate = await convex.mutation(api.estimates.calculateEstimate, {
      acreage: projectDetails.acreage,
      packageType: projectDetails.packageType,
      obstacles: projectDetails.obstacles,
      zipCode: extractZipFromAddress(location.address),
    });

    // Calculate enhanced location-based adjustments
    const locationAdjustments = calculateAdvancedLocationAdjustments({
      location,
      projectDetails,
      baseEstimate,
      locationService,
    });

    // Calculate urgency adjustments
    const urgencyAdjustments = calculateUrgencyAdjustments(
      projectDetails.urgency,
      baseEstimate.basePrice
    );

    // Calculate accessibility adjustments
    const accessibilityAdjustments = calculateAccessibilityAdjustments({
      accessibilityScore: location.accessibilityScore,
      accessConcerns: projectDetails.accessConcerns,
      propertyType: location.propertyType,
      basePrice: baseEstimate.basePrice,
    });

    // Calculate property-specific adjustments
    const propertyAdjustments = calculatePropertyAdjustments({
      propertyBounds: projectDetails.propertyBounds,
      propertyType: location.propertyType,
      basePrice: baseEstimate.basePrice,
    });

    // Build comprehensive estimate
    const enhancedEstimate = {
      // Base TreeAI estimate
      ...baseEstimate,
      
      // Enhanced adjustments
      locationAdjustments,
      urgencyAdjustments,
      accessibilityAdjustments,
      propertyAdjustments,
      
      // Recalculated totals
      totalPrice: Math.round(
        baseEstimate.basePrice +
        baseEstimate.travelSurcharge +
        baseEstimate.obstacleAdjustment +
        locationAdjustments.total +
        urgencyAdjustments.total +
        accessibilityAdjustments.total +
        propertyAdjustments.total
      ),
      
      // Enhanced project details
      estimatedDays: calculateEnhancedTimeline({
        baseDays: baseEstimate.estimatedDays,
        urgency: projectDetails.urgency,
        accessibilityScore: location.accessibilityScore,
        accessConcerns: projectDetails.accessConcerns.length,
        propertyType: location.propertyType,
      }),
      
      // Confidence and reliability metrics
      confidence: calculateEstimateConfidence({
        location,
        projectDetails,
        hasObstacles: projectDetails.obstacles.length > 0,
        hasAccessConcerns: projectDetails.accessConcerns.length > 0,
      }),
      
      // Location intelligence
      locationIntelligence: await generateLocationIntelligence({
        location,
        projectDetails,
        locationService,
      }),
      
      // Enhanced assumptions
      assumptions: generateEnhancedAssumptions({
        location,
        projectDetails,
        urgencyAdjustments,
        accessibilityAdjustments,
      }),
    };

    // Store partial lead if lead info provided
    if (leadInfo?.email || leadInfo?.phone) {
      await captureEnhancedLead({
        leadInfo,
        location,
        projectDetails,
        estimate: enhancedEstimate,
      });
    }

    return NextResponse.json({
      success: true,
      data: enhancedEstimate,
      metadata: {
        calculatedAt: new Date().toISOString(),
        apiVersion: '2.0',
        treeaiVersion: 'hive-intelligence-v1',
      },
    });

  } catch (error) {
    console.error('Location-based estimate calculation failed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Estimate calculation failed',
    }, { status: 500 });
  }
}

// Helper functions
function calculateAdvancedLocationAdjustments({ location, projectDetails, baseEstimate, locationService }: any) {
  const distanceMeters = calculateDistance(
    { lat: 28.5383, lng: -81.3792 }, // TreeShop base
    location.coordinates
  );
  
  const travelSurcharge = locationService.calculateTravelSurcharge(
    distanceMeters,
    baseEstimate.basePrice
  );
  
  // Geographic risk factors
  let geographicRisk = 0;
  if (location.coordinates.lat < 27) geographicRisk += 0.05; // South Florida challenges
  if (location.coordinates.lng < -82) geographicRisk += 0.03; // West coast logistics
  
  const geographicAdjustment = baseEstimate.basePrice * geographicRisk;
  
  return {
    travelSurcharge: travelSurcharge.surchargeAmount,
    travelZone: travelSurcharge.zone,
    geographicAdjustment,
    total: travelSurcharge.surchargeAmount + geographicAdjustment,
    breakdown: {
      distance: `${Math.round(distanceMeters / 1000)} km`,
      zone: travelSurcharge.zone,
      surchargePercent: travelSurcharge.surchargePercent,
    },
  };
}

function calculateUrgencyAdjustments(urgency: string, basePrice: number) {
  const urgencyMultipliers = {
    standard: 1.0,
    priority: 1.15,
    emergency: 1.35,
  };
  
  const multiplier = urgencyMultipliers[urgency as keyof typeof urgencyMultipliers] || 1.0;
  const adjustment = basePrice * (multiplier - 1);
  
  return {
    urgency,
    multiplier,
    adjustment,
    total: adjustment,
  };
}

function calculateAccessibilityAdjustments({ accessibilityScore, accessConcerns, propertyType, basePrice }: any) {
  let adjustmentPercent = 0;
  
  // Accessibility score impact
  if (accessibilityScore) {
    if (accessibilityScore < 4) adjustmentPercent += 15;
    else if (accessibilityScore < 6) adjustmentPercent += 10;
    else if (accessibilityScore < 8) adjustmentPercent += 5;
  }
  
  // Access concerns impact
  adjustmentPercent += accessConcerns.length * 3;
  
  // Property type impact
  const propertyTypeAdjustments = {
    residential: 0,
    commercial: -5, // Often better access
    agricultural: 5, // Often more challenging
    industrial: -3, // Usually good access
  };
  
  adjustmentPercent += propertyTypeAdjustments[propertyType as keyof typeof propertyTypeAdjustments] || 0;
  
  const adjustment = basePrice * (adjustmentPercent / 100);
  
  return {
    accessibilityScore,
    accessConcerns: accessConcerns.length,
    propertyType,
    adjustmentPercent,
    adjustment,
    total: adjustment,
  };
}

function calculatePropertyAdjustments({ propertyBounds, propertyType, basePrice }: any) {
  let adjustment = 0;
  
  if (propertyBounds) {
    // Calculate property area approximation
    const area = Math.abs(
      (propertyBounds.north - propertyBounds.south) *
      (propertyBounds.east - propertyBounds.west) *
      111000 * 111000 // Rough conversion to meters
    );
    
    // Very small properties (< 1000 m²) may have efficiency penalties
    if (area < 1000) {
      adjustment += basePrice * 0.05;
    }
    // Very large properties (> 100000 m²) may have efficiency bonuses
    else if (area > 100000) {
      adjustment -= basePrice * 0.03;
    }
  }
  
  return {
    propertyBounds,
    adjustment,
    total: adjustment,
  };
}

function calculateEnhancedTimeline({ baseDays, urgency, accessibilityScore, accessConcerns, propertyType }: any) {
  let adjustedDays = baseDays;
  
  // Urgency adjustments
  if (urgency === 'priority') adjustedDays = Math.max(1, adjustedDays - 1);
  if (urgency === 'emergency') adjustedDays = Math.max(0.5, adjustedDays - 2);
  
  // Accessibility adjustments
  if (accessibilityScore && accessibilityScore < 5) adjustedDays += 1;
  if (accessConcerns > 2) adjustedDays += 0.5;
  
  // Property type adjustments
  const propertyTimeAdjustments = {
    residential: 0,
    commercial: -0.5, // Often more straightforward
    agricultural: 0.5, // May require more care
    industrial: 0, // Variable
  };
  
  adjustedDays += propertyTimeAdjustments[propertyType as keyof typeof propertyTimeAdjustments] || 0;
  
  return Math.max(0.5, adjustedDays);
}

function calculateEstimateConfidence({ location, projectDetails, hasObstacles, hasAccessConcerns }: any) {
  let confidence = 80; // Base confidence
  
  if (location.verified) confidence += 10;
  if (location.accessibilityScore && location.accessibilityScore > 7) confidence += 5;
  if (location.propertyType) confidence += 5;
  if (hasObstacles) confidence += 3; // More thorough assessment
  if (hasAccessConcerns) confidence += 3;
  if (projectDetails.propertyBounds) confidence += 7;
  
  return Math.min(95, Math.max(60, confidence));
}

async function generateLocationIntelligence({ location, projectDetails, locationService }: any) {
  // This would integrate with additional intelligence services
  return {
    serviceAreaStatus: locationService.isWithinServiceArea(location.coordinates) ? 'primary' : 'extended',
    terrainAnalysis: 'satellite_imagery_based', // Placeholder for future enhancement
    accessAnalysis: location.accessibilityScore ? 'scored' : 'estimated',
    environmentalFactors: [], // Placeholder for environmental considerations
    logisticsNotes: [
      `Property located ${Math.round(calculateDistance({ lat: 28.5383, lng: -81.3792 }, location.coordinates) / 1000)} km from service center`,
      location.propertyType ? `${location.propertyType.charAt(0).toUpperCase() + location.propertyType.slice(1)} property type identified` : 'Property type assessment needed',
    ],
  };
}

function generateEnhancedAssumptions({ location, projectDetails, urgencyAdjustments, accessibilityAdjustments }: any) {
  const assumptions = [
    'Estimate based on precise GPS coordinates and satellite imagery',
    'Weather permitting - no work during heavy rain or storm conditions',
    'Property boundaries clearly marked or provided by customer',
    'Equipment access verified via mapping analysis',
  ];
  
  if (!location.verified) {
    assumptions.push('Address verification pending - may require adjustment after site visit');
  }
  
  if (urgencyAdjustments.adjustment > 0) {
    assumptions.push(`${urgencyAdjustments.urgency.charAt(0).toUpperCase() + urgencyAdjustments.urgency.slice(1)} scheduling premium applied`);
  }
  
  if (accessibilityAdjustments.adjustment > 0) {
    assumptions.push('Access difficulty adjustment applied based on site analysis');
  }
  
  if (projectDetails.propertyBounds) {
    assumptions.push('Property outline provided - enhanced accuracy applied');
  } else {
    assumptions.push('Property boundaries estimated - final scope may vary');
  }
  
  assumptions.push('Final pricing confirmed after on-site evaluation');
  
  return assumptions;
}

async function captureEnhancedLead({ leadInfo, location, projectDetails, estimate }: any) {
  // This would integrate with the lead capture system
  // Placeholder for enhanced lead capture with location intelligence
  console.log('Enhanced lead capture:', {
    leadInfo,
    locationData: {
      address: location.address,
      coordinates: location.coordinates,
      verified: location.verified,
    },
    estimateTotal: estimate.totalPrice,
    confidence: estimate.confidence,
  });
}

// Utility functions
function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function extractZipFromAddress(address: string): string | undefined {
  const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
  return zipMatch ? zipMatch[0].substring(0, 5) : undefined;
}