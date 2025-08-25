// Enhanced Location Services API - TreeAI Hive Intelligence
import { NextRequest, NextResponse } from 'next/server';
import { createLocationService } from '@/lib/services/LocationService';
import { z } from 'zod';

// Request validation schemas
const GeocodeRequestSchema = z.object({
  placeId: z.string().optional(),
  address: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
}).refine(
  (data) => data.placeId || data.address || data.coordinates,
  { message: "Either placeId, address, or coordinates must be provided" }
);

const PinDropRequestSchema = z.object({
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  address: z.string().optional(),
  propertyBounds: z.object({
    north: z.number(),
    south: z.number(),
    east: z.number(),
    west: z.number(),
  }).optional(),
  notes: z.string().optional(),
});

// Geocoding and address verification
export async function POST(request: NextRequest) {
  try {
    const locationService = createLocationService();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Location services not available',
      }, { status: 503 });
    }

    const body = await request.json();
    const { placeId, address, coordinates } = GeocodeRequestSchema.parse(body);

    let result;

    if (placeId) {
      // Geocode place ID
      result = await locationService.geocodePlaceId(placeId);
    } else if (address) {
      // Verify and geocode address
      const propertyLocation = await locationService.verifyPropertyLocation(address);
      result = {
        placeId: propertyLocation.placeId,
        lat: propertyLocation.coordinates.lat,
        lng: propertyLocation.coordinates.lng,
        formattedAddress: propertyLocation.address,
        components: propertyLocation.components,
        verified: propertyLocation.verified,
        propertyType: propertyLocation.propertyType,
        accessibilityScore: propertyLocation.accessibilityScore,
        distanceFromBase: propertyLocation.distanceFromBase,
      };
    } else if (coordinates) {
      // Reverse geocode coordinates
      const pinDropResult = await locationService.processPinDropLocation({
        coordinates,
      });
      result = {
        placeId: pinDropResult.placeId,
        lat: pinDropResult.coordinates.lat,
        lng: pinDropResult.coordinates.lng,
        formattedAddress: pinDropResult.address,
        components: pinDropResult.components,
        verified: pinDropResult.verified,
        propertyType: pinDropResult.propertyType,
        accessibilityScore: pinDropResult.accessibilityScore,
        distanceFromBase: pinDropResult.distanceFromBase,
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Geocoding API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Geocoding failed',
    }, { status: 500 });
  }
}

// Pin drop location processing
export async function PUT(request: NextRequest) {
  try {
    const locationService = createLocationService();
    if (!locationService) {
      return NextResponse.json({
        success: false,
        error: 'Location services not available',
      }, { status: 503 });
    }

    const body = await request.json();
    const pinDropData = PinDropRequestSchema.parse(body);

    const propertyLocation = await locationService.processPinDropLocation(pinDropData);

    // Check if location is within service area
    const isWithinServiceArea = locationService.isWithinServiceArea(pinDropData.coordinates);
    
    // Calculate travel surcharge preview
    const travelSurcharge = locationService.calculateTravelSurcharge(
      propertyLocation.distanceFromBase.meters,
      5000 // Sample base price for surcharge calculation
    );

    return NextResponse.json({
      success: true,
      data: {
        ...propertyLocation,
        isWithinServiceArea,
        travelSurcharge: {
          zone: travelSurcharge.zone,
          surchargePercent: travelSurcharge.surchargePercent,
          estimatedSurcharge: travelSurcharge.surchargeAmount,
        },
      },
    });

  } catch (error) {
    console.error('Pin drop API error:', error);
    
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
    }, { status: 500 });
  }
}
