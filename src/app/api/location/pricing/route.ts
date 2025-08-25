// TreeAI Hive Intelligence - Location-Based Pricing API
// Domain Coordination: TreeAI Core + Business Intelligence + Security Intelligence

import { NextRequest, NextResponse } from 'next/server';
import { LocationServiceCoordinator } from '@/lib/services/LocationService';
import { z } from 'zod';

// Enhanced pricing request validation
const PricingRequestSchema = z.object({
  // Location data
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  
  address: z.string().optional(),
  
  // Project specifics  
  acreage: z.number()
    .min(0.1, 'Minimum acreage is 0.1')
    .max(500, 'Maximum acreage is 500'),
    
  propertyType: z.enum(['residential', 'commercial', 'agricultural', 'industrial']).optional(),
  
  obstacles: z.array(z.string()).default([]),
  
  urgency: z.enum(['standard', 'priority', 'emergency']).default('standard'),
  
  // Property bounds for accuracy
  propertyBounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }).optional(),
  
  // TreeAI options
  includeDetailedAnalysis: z.boolean().default(true),
  includeRiskFactors: z.boolean().default(true),
  includeCompetitorAnalysis: z.boolean().default(false),
});

// Business Intelligence - Package definitions
const PACKAGE_DEFINITIONS = {
  residential: {
    baseRate: 1200,
    description: 'Residential property clearing',
    features: ['Brush removal', 'Small tree clearing', 'Debris cleanup'],
  },
  commercial: {
    baseRate: 900,
    description: 'Commercial property maintenance',
    features: ['Large area clearing', 'Precision work', 'Timeline flexibility'],
  },
  agricultural: {
    baseRate: 600,
    description: 'Agricultural land preparation',
    features: ['Extensive clearing', 'Efficient processing', 'Bulk pricing'],
  },
  industrial: {
    baseRate: 800,
    description: 'Industrial site preparation',
    features: ['Heavy equipment access', 'Safety protocols', 'Compliance'],
  },
};

// TreeAI Core Intelligence - Location-Based Pricing
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Initialize Hive Intelligence
    const locationService = await LocationServiceCoordinator.initializeWithHiveIntelligence();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Pricing services temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      }, { status: 503 });
    }

    // Validate pricing request
    const body = await request.json();
    const pricingData = PricingRequestSchema.parse(body);
    
    // Get comprehensive location analysis
    const propertyLocation = await locationService.processPinDropLocation({
      coordinates: pricingData.coordinates,
      address: pricingData.address,
      propertyBounds: pricingData.propertyBounds,
    });
    
    // Determine property type (use provided or detected)
    const finalPropertyType = pricingData.propertyType || propertyLocation.propertyType || 'residential';
    
    // Get package information
    const packageInfo = PACKAGE_DEFINITIONS[finalPropertyType];
    
    // TreeAI Core Intelligence - Calculate base pricing
    const basePrice = packageInfo.baseRate * pricingData.acreage;
    
    // Apply TreeAI enhancements if analysis is available
    let enhancedPricing = { basePrice, totalPrice: basePrice };
    
    if (propertyLocation.treeAIAnalysis) {
      const { estimatedCost, pricingFactors } = propertyLocation.treeAIAnalysis;
      
      // Use TreeAI pricing as primary calculation
      enhancedPricing = {
        basePrice: estimatedCost.basePrice * pricingData.acreage,
        difficultyAdjustment: estimatedCost.basePrice * estimatedCost.difficultyMultiplier,
        environmentalFactors: estimatedCost.basePrice * 
          (pricingFactors.environmentalRestrictions.length * 0.05),
        seasonalAdjustments: pricingFactors.seasonalFactors.wetlandSeason ? 
          estimatedCost.basePrice * 0.15 : 0,
        totalPrice: estimatedCost.totalEstimate * pricingData.acreage,
      };
    }
    
    // Travel and logistics
    const travelSurcharge = locationService.calculateTravelSurcharge(
      propertyLocation.distanceFromBase.meters,
      enhancedPricing.totalPrice,
      propertyLocation.riskProfile
    );
    
    // Obstacle adjustments
    const obstacleAdjustment = pricingData.obstacles.length * (enhancedPricing.basePrice * 0.1);
    
    // Urgency multiplier
    const urgencyMultipliers = {
      standard: 1.0,
      priority: 1.25,
      emergency: 1.5,
    };
    const urgencyAdjustment = enhancedPricing.totalPrice * (urgencyMultipliers[pricingData.urgency] - 1);
    
    // Final pricing calculation
    const finalPrice = enhancedPricing.totalPrice + 
                      travelSurcharge.finalSurcharge + 
                      obstacleAdjustment + 
                      urgencyAdjustment;
    
    // Business Intelligence - Market analysis
    const marketAnalysis = propertyLocation.analytics ? {
      marketSegment: propertyLocation.analytics.marketSegment,
      competitorDensity: propertyLocation.analytics.competitorDensity,
      priceElasticity: propertyLocation.analytics.priceElasticity,
      recommendedPriceRange: {
        min: finalPrice * 0.9,
        max: finalPrice * 1.1,
        optimal: finalPrice,
      },
    } : null;
    
    // Security Intelligence - Risk assessment impact
    const riskImpact = propertyLocation.riskProfile ? {
      accessRisk: propertyLocation.riskProfile.accessRisk,
      weatherRisk: propertyLocation.riskProfile.weatherVulnerability,
      insuranceComplexity: propertyLocation.riskProfile.insuranceComplexity,
      riskPremium: travelSurcharge.riskAdjustment,
    } : null;
    
    // Comprehensive pricing response
    const response = {
      success: true,
      data: {
        // Core pricing
        pricing: {
          basePrice: enhancedPricing.basePrice,
          acreage: pricingData.acreage,
          pricePerAcre: enhancedPricing.basePrice / pricingData.acreage,
          
          // Adjustments
          adjustments: {
            difficulty: enhancedPricing.difficultyAdjustment || 0,
            environmental: enhancedPricing.environmentalFactors || 0,
            seasonal: enhancedPricing.seasonalAdjustments || 0,
            obstacles: obstacleAdjustment,
            urgency: urgencyAdjustment,
            travel: travelSurcharge.finalSurcharge,
          },
          
          // Final totals
          subtotal: enhancedPricing.totalPrice,
          totalPrice: finalPrice,
          
          // Confidence and validation
          confidence: propertyLocation.treeAIAnalysis?.estimatedCost.confidence || 0.8,
          pricingSource: propertyLocation.treeAIAnalysis ? 'TreeAI Enhanced' : 'Standard Package',
        },
        
        // Location context
        location: {
          address: propertyLocation.address,
          coordinates: propertyLocation.coordinates,
          propertyType: finalPropertyType,
          isWithinServiceArea: locationService.isWithinServiceArea(pricingData.coordinates),
          serviceZone: travelSurcharge.zone,
          distanceKm: Math.round(propertyLocation.distanceFromBase.meters / 1000),
        },
        
        // Package details
        packageInfo: {
          ...packageInfo,
          selectedType: finalPropertyType,
        },
        
        // Enhanced intelligence (conditional)
        ...(pricingData.includeDetailedAnalysis && {
          treeAIAnalysis: propertyLocation.treeAIAnalysis,
        }),
        
        ...(pricingData.includeRiskFactors && {
          riskAssessment: riskImpact,
        }),
        
        ...(pricingData.includeCompetitorAnalysis && {
          marketAnalysis,
        }),
        
        // Metadata
        processingInfo: {
          processingTimeMs: Date.now() - startTime,
          hiveIntelligenceUsed: true,
          domainsCoordinated: ['TreeAI Core', 'Business Intelligence', 'Security Intelligence'],
          dataQuality: propertyLocation.verified ? 'High' : 'Moderate',
        },
        
        // Call to action
        recommendations: [
          finalPrice > 5000 ? 'Consider breaking project into phases' : 'Single-phase project recommended',
          propertyLocation.riskProfile?.accessRisk === 'high' ? 'Site visit recommended for accurate quote' : 'Remote estimate available',
          travelSurcharge.surchargePercent > 15 ? 'Schedule with nearby projects to reduce costs' : 'No special scheduling needed',
        ],
      },
    };
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Location-based pricing error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid pricing request',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Pricing calculation failed',
      code: 'PRICING_ERROR',
      processingTimeMs: Date.now() - startTime,
    }, { status: 500 });
  }
}

// Quick pricing estimate (GET endpoint for simple queries)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const acreage = parseFloat(searchParams.get('acreage') || '');
    const propertyType = searchParams.get('propertyType') as keyof typeof PACKAGE_DEFINITIONS || 'residential';
    
    if (isNaN(lat) || isNaN(lng) || isNaN(acreage)) {
      return NextResponse.json({
        success: false,
        error: 'Valid lat, lng, and acreage parameters required',
      }, { status: 400 });
    }

    const locationService = await LocationServiceCoordinator.initializeWithHiveIntelligence();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Service unavailable',
      }, { status: 503 });
    }

    // Quick distance calculation
    const baseLocation = { lat: 28.5383, lng: -81.3792 }; // Orlando base
    const R = 6371; // Earth radius in km
    const dLat = (lat - baseLocation.lat) * Math.PI / 180;
    const dLng = (lng - baseLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(baseLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    // Basic pricing
    const packageInfo = PACKAGE_DEFINITIONS[propertyType];
    const basePrice = packageInfo.baseRate * acreage;
    const travelSurcharge = distance > 50 ? basePrice * 0.15 : 0;
    const totalPrice = basePrice + travelSurcharge;
    
    return NextResponse.json({
      success: true,
      data: {
        estimateType: 'Quick Estimate',
        pricing: {
          basePrice,
          travelSurcharge,
          totalPrice,
          pricePerAcre: packageInfo.baseRate,
        },
        location: {
          coordinates: { lat, lng },
          distanceKm: Math.round(distance),
          isWithinServiceArea: distance <= 150,
        },
        disclaimer: 'This is a preliminary estimate. Contact us for detailed pricing.',
      },
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Quick pricing estimate failed',
    }, { status: 500 });
  }
}