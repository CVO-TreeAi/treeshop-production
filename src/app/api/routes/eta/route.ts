import { NextRequest, NextResponse } from 'next/server';
import { createGooglePlacesManager } from '@/lib/googlePlaces';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originZip, placeId } = body;

    if (!originZip || !placeId) {
      return NextResponse.json(
        { error: 'originZip and placeId are required' }, 
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `eta_${originZip}_${placeId}`;
    const cacheRef = doc(db, 'cache', cacheKey);
    const cachedResult = await getDoc(cacheRef);

    if (cachedResult.exists()) {
      const cached = cachedResult.data();
      const ttl = 4 * 60 * 60 * 1000; // 4 hours for ETA data
      
      if (Date.now() - cached.timestamp < ttl) {
        return NextResponse.json(cached.data);
      }
    }

    // Get fresh data from Google Distance Matrix API
    const placesManager = createGooglePlacesManager();
    if (!placesManager) {
      return NextResponse.json(
        { error: 'Google Places API not configured' }, 
        { status: 503 }
      );
    }

    const result = await placesManager.getDistanceMatrix(originZip, placeId);

    // Add derived data for business logic
    const enhancedResult = {
      ...result,
      distanceMiles: Math.round(result.distanceMeters * 0.000621371), // Convert to miles
      durationMinutes: Math.round(result.durationSeconds / 60),
      isFarZone: result.distanceMeters > 80467, // > 50 miles
      estimatedSurcharge: result.distanceMeters > 80467 ? 
        Math.round((result.distanceMeters - 80467) * 0.000621371 * 2) : 0 // $2/mile over 50 miles
    };

    // Cache the result
    await setDoc(cacheRef, {
      data: enhancedResult,
      timestamp: Date.now(),
      ttl: 4 * 60 * 60 * 1000
    });

    return NextResponse.json(enhancedResult);

  } catch (error) {
    console.error('ETA API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ETA' },
      { status: 500 }
    );
  }
}