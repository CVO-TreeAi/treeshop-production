import { NextRequest, NextResponse } from 'next/server';
import { treeShopAI, PropertyAssessment } from '@/lib/aiServices';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { acreage, vegetationDensity, terrain, access, obstacles, stumpRemoval } = body;
    
    if (!acreage || !vegetationDensity || !terrain || !access) {
      return NextResponse.json(
        { error: 'Missing required fields: acreage, vegetationDensity, terrain, access' }, 
        { status: 400 }
      );
    }

    const assessment: PropertyAssessment = {
      acreage: Number(acreage),
      vegetationDensity,
      terrain,
      access,
      obstacles: obstacles || [],
      stumpRemoval: Boolean(stumpRemoval)
    };

    const estimate = await treeShopAI.generatePricingEstimate(assessment);

    return NextResponse.json({
      success: true,
      estimate,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Estimation Error:', error);
    
    // Return fallback estimate for reliability using already parsed body
    const acres = Number(body.acreage) || 1;
    const fallbackEstimate = {
      basePrice: 1500 * acres,
      priceRange: { 
        min: 800 * acres, 
        max: 2500 * acres 
      },
      breakdown: {
        clearing: 1200 * acres,
        stumpRemoval: 0,
        accessDifficulty: 150,
        disposal: 150
      },
      timeEstimate: { days: Math.ceil(acres * 0.5), range: `${Math.ceil(acres * 0.3)}-${Math.ceil(acres * 0.7)} days` },
      confidence: 60,
      assumptions: ["Standard forestry mulching rates", "Moderate terrain complexity", "Normal access conditions", "AI-powered pricing based on property analysis"]
    };

    return NextResponse.json({
      success: true,
      estimate: fallbackEstimate,
      fallback: true,
      error: 'AI service unavailable, using fallback calculation'
    });
  }
}