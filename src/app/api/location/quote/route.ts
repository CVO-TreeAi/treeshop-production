// TreeAI Hive Intelligence - Comprehensive Location Quote API
// Domain Coordination: TreeAI Core + Business Intelligence + Security Intelligence + SaaS Platform

import { NextRequest, NextResponse } from 'next/server';
import { LocationServiceCoordinator } from '@/lib/services/LocationService';
import { z } from 'zod';

// Enhanced quote request validation
const QuoteRequestSchema = z.object({
  // Location identification
  address: z.string().min(5).optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
  placeId: z.string().optional(),
  
  // Project specifications
  projectDetails: z.object({
    serviceType: z.enum(['forestry-mulching', 'land-clearing', 'stump-grinding', 'brush-clearing']),
    acreage: z.number().min(0.1).max(1000),
    estimatedTreeDensity: z.enum(['light', 'moderate', 'heavy', 'extreme']),
    terrainType: z.enum(['flat', 'rolling', 'steep', 'mixed']).default('rolling'),
    accessibilityRating: z.number().min(1).max(10).default(7),
  }),
  
  // Property context
  propertyInfo: z.object({
    type: z.enum(['residential', 'commercial', 'agricultural', 'industrial']).default('residential'),
    buildingProximity: z.boolean().default(false),
    utilityLines: z.boolean().default(false),
    wetlands: z.boolean().default(false),
    environmentalRestrictions: z.array(z.string()).default([]),
  }),
  
  // Timeline and urgency
  timeline: z.object({
    preferredStartDate: z.string().optional(),
    projectUrgency: z.enum(['standard', 'priority', 'emergency']).default('standard'),
    seasonalConstraints: z.boolean().default(false),
  }),
  
  // Quote options
  quoteOptions: z.object({
    includeDetailedBreakdown: z.boolean().default(true),
    includeAlternativeOptions: z.boolean().default(true),
    includeSeasonalPricing: z.boolean().default(false),
    includeFinancing: z.boolean().default(false),
  }),
}).refine(
  data => data.address || data.coordinates || data.placeId,
  { message: "Either address, coordinates, or placeId must be provided" }
);

// TreeAI Service Pricing Matrix
const SERVICE_PRICING = {
  'forestry-mulching': {
    baseRate: 2800,
    description: 'Forestry mulching and brush clearing',
    unit: 'per acre',
    densityMultipliers: {
      light: 0.8,
      moderate: 1.0,
      heavy: 1.4,
      extreme: 1.9
    }
  },
  'land-clearing': {
    baseRate: 3200,
    description: 'Complete land clearing and site preparation',
    unit: 'per acre',
    densityMultipliers: {
      light: 0.7,
      moderate: 1.0,
      heavy: 1.5,
      extreme: 2.2
    }
  },
  'stump-grinding': {
    baseRate: 150,
    description: 'Stump grinding and removal',
    unit: 'per stump',
    densityMultipliers: {
      light: 1.0,
      moderate: 1.2,
      heavy: 1.5,
      extreme: 2.0
    }
  },
  'brush-clearing': {
    baseRate: 1800,
    description: 'Brush and undergrowth clearing',
    unit: 'per acre',
    densityMultipliers: {
      light: 0.6,
      moderate: 1.0,
      heavy: 1.3,
      extreme: 1.8
    }
  }
};

// Comprehensive Location Quote Generation
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Initialize Hive Intelligence
    const locationService = await LocationServiceCoordinator.initializeWithHiveIntelligence();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Quote services temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      }, { status: 503 });
    }

    // Validate quote request
    const body = await request.json();
    const quoteData = QuoteRequestSchema.parse(body);
    
    // Get comprehensive location analysis
    let propertyLocation;
    
    if (quoteData.address) {
      propertyLocation = await locationService.verifyPropertyLocation(quoteData.address);
    } else if (quoteData.coordinates) {
      propertyLocation = await locationService.processPinDropLocation({
        coordinates: quoteData.coordinates
      });
    } else {
      throw new Error('Location identification failed');
    }
    
    // Get service pricing configuration
    const servicePricing = SERVICE_PRICING[quoteData.projectDetails.serviceType];
    
    // Calculate base pricing with TreeAI intelligence
    const basePricing = calculateServicePricing(
      servicePricing,
      quoteData.projectDetails,
      quoteData.propertyInfo
    );
    
    // Transportation cost calculation using TreeShop model ($350/hour)
    const transportationCost = locationService.calculateTransportationCost(
      propertyLocation.distanceFromBase.durationSeconds / 60
    );
    
    // Apply TreeAI risk and complexity adjustments
    const adjustments = calculateProjectAdjustments(
      basePricing,
      quoteData,
      propertyLocation.riskProfile,
      propertyLocation.treeAIAnalysis
    );
    
    // Timeline and urgency adjustments
    const timelineAdjustments = calculateTimelineAdjustments(
      basePricing.adjustedPrice,
      quoteData.timeline
    );
    
    // Final quote calculation
    const subtotal = basePricing.adjustedPrice + adjustments.totalAdjustments;
    const urgencyAdjustment = timelineAdjustments.urgencyMultiplier * subtotal - subtotal;
    const finalPrice = subtotal + urgencyAdjustment + transportationCost.transportationCost;
    
    // Generate alternative options if requested
    let alternatives = null;
    if (quoteData.quoteOptions.includeAlternativeOptions) {
      alternatives = generateAlternativeOptions(quoteData, basePricing, transportationCost);
    }
    
    // Generate seasonal pricing if requested
    let seasonalPricing = null;
    if (quoteData.quoteOptions.includeSeasonalPricing) {
      seasonalPricing = generateSeasonalPricing(finalPrice, quoteData.timeline);
    }
    
    // Generate financing options if requested
    let financingOptions = null;
    if (quoteData.quoteOptions.includeFinancing && finalPrice > 3000) {
      financingOptions = generateFinancingOptions(finalPrice);
    }
    
    // Business Intelligence insights
    const businessInsights = generateBusinessInsights(
      propertyLocation,
      quoteData,
      finalPrice
    );
    
    // Comprehensive quote response
    const response = {
      success: true,
      data: {
        quoteId: `TQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        
        // Core pricing
        pricing: {
          service: {
            type: quoteData.projectDetails.serviceType,
            description: servicePricing.description,
            baseRate: servicePricing.baseRate,
            unit: servicePricing.unit,
            quantity: quoteData.projectDetails.acreage,
          },
          
          breakdown: {
            baseService: basePricing.basePrice,
            complexityAdjustments: adjustments.complexityAdjustment,
            riskAdjustments: adjustments.riskAdjustment,
            accessibilityAdjustments: adjustments.accessibilityAdjustment,
            environmentalAdjustments: adjustments.environmentalAdjustment,
            urgencyAdjustment: urgencyAdjustment,
            transportation: transportationCost.transportationCost,
          },
          
          totals: {
            subtotal: subtotal,
            transportation: transportationCost.transportationCost,
            finalPrice: finalPrice,
            pricePerAcre: finalPrice / quoteData.projectDetails.acreage,
          },
          
          confidence: propertyLocation.treeAIAnalysis?.estimatedCost.confidence || 0.85,
        },
        
        // Location details
        location: {
          address: propertyLocation.address,
          coordinates: propertyLocation.coordinates,
          verified: propertyLocation.verified,
          serviceArea: locationService.isWithinServiceArea(propertyLocation.coordinates) ? 'Primary' : 'Extended',
          distanceFromBase: {
            miles: (propertyLocation.distanceFromBase.meters * 0.000621371).toFixed(1),
            drivingMinutes: Math.round(propertyLocation.distanceFromBase.durationSeconds / 60),
          },
        },
        
        // Transportation details
        transportation: {
          ...transportationCost,
          model: 'TreeShop $350/hour round-trip',
          breakdown: transportationCost.costBreakdown,
        },
        
        // Project analysis
        projectAnalysis: {
          estimatedDuration: calculateProjectDuration(quoteData.projectDetails),
          equipmentRequired: determineEquipmentNeeds(quoteData.projectDetails, quoteData.propertyInfo),
          seasonalFactors: analyzeSeasonalFactors(quoteData),
          riskFactors: propertyLocation.riskProfile?.liabilityFactors || [],
        },
        
        // Enhanced options (conditional)
        ...(alternatives && { alternatives }),
        ...(seasonalPricing && { seasonalPricing }),
        ...(financingOptions && { financingOptions }),
        
        // Business intelligence
        businessInsights,
        
        // Detailed breakdown (conditional)
        ...(quoteData.quoteOptions.includeDetailedBreakdown && {
          detailedAnalysis: {
            treeAIFactors: propertyLocation.treeAIAnalysis,
            riskAssessment: propertyLocation.riskProfile,
            marketAnalysis: propertyLocation.analytics,
          }
        }),
        
        // Metadata and next steps
        metadata: {
          quoteValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          processingTimeMs: Date.now() - startTime,
          hiveIntelligenceUsed: true,
          generatedBy: 'TreeAI Hive Intelligence v2.0',
        },
        
        nextSteps: [
          'Schedule a free on-site consultation to confirm details',
          'Review and accept quote to begin project scheduling',
          'Obtain any required permits (we can assist)',
          finalPrice > 10000 ? 'Consider financing options available' : null,
        ].filter(Boolean),
        
        recommendations: generateRecommendations(quoteData, propertyLocation, finalPrice),
      },
    };
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Location quote generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid quote request',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Quote generation failed',
      code: 'QUOTE_ERROR',
      processingTimeMs: Date.now() - startTime,
    }, { status: 500 });
  }
}

// Helper functions
function calculateServicePricing(servicePricing: any, projectDetails: any, propertyInfo: any) {
  const densityMultiplier = servicePricing.densityMultipliers[projectDetails.estimatedTreeDensity];
  const basePrice = servicePricing.baseRate * projectDetails.acreage * densityMultiplier;
  
  // Property type adjustments
  const propertyTypeMultipliers = {
    residential: 1.1,  // Higher precision required
    commercial: 1.0,   // Standard rate
    agricultural: 0.85, // Volume discount
    industrial: 1.15   // Complex requirements
  };
  
  const adjustedPrice = basePrice * propertyTypeMultipliers[propertyInfo.type];
  
  return {
    basePrice,
    densityMultiplier,
    propertyTypeMultiplier: propertyTypeMultipliers[propertyInfo.type],
    adjustedPrice,
  };
}

function calculateProjectAdjustments(basePricing: any, quoteData: any, riskProfile: any, treeAIAnalysis: any) {
  let complexityAdjustment = 0;
  let riskAdjustment = 0;
  let accessibilityAdjustment = 0;
  let environmentalAdjustment = 0;
  
  // Terrain complexity
  const terrainMultipliers = { flat: 0.9, rolling: 1.0, steep: 1.3, mixed: 1.1 };
  complexityAdjustment += basePricing.adjustedPrice * (terrainMultipliers[quoteData.projectDetails.terrainType] - 1);
  
  // Accessibility impact
  const accessibilityScore = quoteData.projectDetails.accessibilityRating;
  if (accessibilityScore < 5) {
    accessibilityAdjustment = basePricing.adjustedPrice * 0.15; // 15% surcharge for poor access
  } else if (accessibilityScore > 8) {
    accessibilityAdjustment = basePricing.adjustedPrice * -0.05; // 5% discount for excellent access
  }
  
  // Environmental factors
  if (quoteData.propertyInfo.buildingProximity) environmentalAdjustment += basePricing.adjustedPrice * 0.1;
  if (quoteData.propertyInfo.utilityLines) environmentalAdjustment += basePricing.adjustedPrice * 0.15;
  if (quoteData.propertyInfo.wetlands) environmentalAdjustment += basePricing.adjustedPrice * 0.2;
  
  // Risk factors from TreeAI analysis
  if (riskProfile?.accessRisk === 'high') riskAdjustment += basePricing.adjustedPrice * 0.1;
  if (riskProfile?.weatherVulnerability > 7) riskAdjustment += basePricing.adjustedPrice * 0.05;
  
  const totalAdjustments = complexityAdjustment + riskAdjustment + accessibilityAdjustment + environmentalAdjustment;
  
  return {
    complexityAdjustment,
    riskAdjustment,
    accessibilityAdjustment,
    environmentalAdjustment,
    totalAdjustments,
  };
}

function calculateTimelineAdjustments(basePrice: number, timeline: any) {
  const urgencyMultipliers = {
    standard: 1.0,
    priority: 1.25,
    emergency: 1.5,
  };
  
  return {
    urgencyMultiplier: urgencyMultipliers[timeline.projectUrgency],
    seasonalDiscount: timeline.seasonalConstraints ? 0.95 : 1.0,
  };
}

function generateAlternativeOptions(quoteData: any, basePricing: any, transportationCost: any) {
  return [
    {
      name: 'Standard Package',
      description: 'Our recommended approach',
      price: basePricing.adjustedPrice + transportationCost.transportationCost,
      features: ['Professional equipment', 'Debris cleanup', '1-year warranty'],
    },
    {
      name: 'Premium Package',
      description: 'Enhanced service with extras',
      price: (basePricing.adjustedPrice * 1.25) + transportationCost.transportationCost,
      features: ['Premium equipment', 'Complete cleanup', 'Soil amendment', '2-year warranty'],
    },
    {
      name: 'Budget Package',
      description: 'Cost-effective option',
      price: (basePricing.adjustedPrice * 0.85) + transportationCost.transportationCost,
      features: ['Standard equipment', 'Basic cleanup', '90-day warranty'],
    },
  ];
}

function generateSeasonalPricing(basePrice: number, timeline: any) {
  const currentMonth = new Date().getMonth();
  const seasonalFactors = {
    winter: 0.9,   // Dec, Jan, Feb - Lower demand
    spring: 1.1,   // Mar, Apr, May - Peak season
    summer: 1.0,   // Jun, Jul, Aug - Standard
    fall: 1.05,    // Sep, Oct, Nov - Moderate demand
  };
  
  let season = 'summer';
  if (currentMonth < 3 || currentMonth === 11) season = 'winter';
  else if (currentMonth < 6) season = 'spring';
  else if (currentMonth < 9) season = 'summer';
  else season = 'fall';
  
  return {
    currentSeason: season,
    seasonalMultiplier: seasonalFactors[season],
    adjustedPrice: basePrice * seasonalFactors[season],
    bestSeason: 'winter',
    bestSeasonPrice: basePrice * seasonalFactors.winter,
    bestSeasonSavings: basePrice * (seasonalFactors[season] - seasonalFactors.winter),
  };
}

function generateFinancingOptions(finalPrice: number) {
  return [
    {
      term: 12,
      monthlyPayment: Math.round((finalPrice * 1.05) / 12),
      totalCost: Math.round(finalPrice * 1.05),
      apr: '5.9%',
    },
    {
      term: 24,
      monthlyPayment: Math.round((finalPrice * 1.12) / 24),
      totalCost: Math.round(finalPrice * 1.12),
      apr: '6.9%',
    },
  ];
}

function generateBusinessInsights(propertyLocation: any, quoteData: any, finalPrice: number) {
  return {
    marketPosition: propertyLocation.analytics?.marketSegment === 'premium' ? 
      'Premium market - price competitively positioned' : 
      'Standard market - excellent value proposition',
    
    competitiveAdvantage: [
      'TreeAI-powered accurate pricing',
      'Comprehensive risk assessment',
      'Transparent cost breakdown',
    ],
    
    valueProposition: finalPrice > 5000 ? 
      'Major land improvement project - significant property value increase' :
      'Cost-effective land management solution',
      
    recommendedFollowUp: propertyLocation.analytics?.customerRetentionProbability > 0.8 ?
      'High retention probability - excellent customer fit' :
      'Standard follow-up recommended',
  };
}

function calculateProjectDuration(projectDetails: any) {
  const baseDays = projectDetails.acreage * 0.5; // 0.5 days per acre base
  const densityMultipliers = { light: 0.8, moderate: 1.0, heavy: 1.5, extreme: 2.0 };
  
  return Math.ceil(baseDays * densityMultipliers[projectDetails.estimatedTreeDensity]);
}

function determineEquipmentNeeds(projectDetails: any, propertyInfo: any) {
  const equipment = ['Forestry Mulcher', 'Support Crew'];
  
  if (projectDetails.estimatedTreeDensity === 'extreme') {
    equipment.push('Heavy-duty Mulcher', 'Additional Crew');
  }
  
  if (propertyInfo.buildingProximity) {
    equipment.push('Precision Equipment');
  }
  
  return equipment;
}

function analyzeSeasonalFactors(quoteData: any) {
  const factors = [];
  const month = new Date().getMonth();
  
  if (month >= 5 && month <= 9) {
    factors.push('Wet season considerations');
  }
  
  if (month >= 2 && month <= 7) {
    factors.push('Bird nesting season restrictions may apply');
  }
  
  if (quoteData.propertyInfo.wetlands) {
    factors.push('Wetlands restrictions during wet season');
  }
  
  return factors;
}

function generateRecommendations(quoteData: any, propertyLocation: any, finalPrice: number) {
  const recommendations = [];
  
  if (propertyLocation.riskProfile?.accessRisk === 'high') {
    recommendations.push('Schedule site visit to confirm equipment access');
  }
  
  if (finalPrice > 10000) {
    recommendations.push('Consider phasing project to spread costs over time');
  }
  
  if (quoteData.propertyInfo.utilityLines) {
    recommendations.push('Utility marking required before work begins');
  }
  
  if (propertyLocation.analytics?.marketSegment === 'premium') {
    recommendations.push('Premium service tier recommended for this market segment');
  }
  
  return recommendations;
}