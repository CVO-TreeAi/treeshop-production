import { NextRequest, NextResponse } from 'next/server';
import { createGooglePlacesManager } from '@/lib/googlePlaces';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { placeId } = body;

    if (!placeId || typeof placeId !== 'string') {
      return NextResponse.json({ error: 'PlaceId is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `geocode_${placeId}`;
    const cacheRef = doc(db, 'cache', cacheKey);
    const cachedResult = await getDoc(cacheRef);

    if (cachedResult.exists()) {
      const cached = cachedResult.data();
      const ttl = 24 * 60 * 60 * 1000; // 24 hours
      
      if (Date.now() - cached.timestamp < ttl) {
        return NextResponse.json(cached.data);
      }
    }

    // Get fresh data from Google Places API
    const placesManager = createGooglePlacesManager();
    if (!placesManager) {
      return NextResponse.json(
        { error: 'Google Places API not configured' }, 
        { status: 503 }
      );
    }

    const result = await placesManager.geocodePlaceId(placeId);

    // Cache the result
    await setDoc(cacheRef, {
      data: result,
      timestamp: Date.now(),
      ttl: 24 * 60 * 60 * 1000
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Geocode API error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode place ID' },
      { status: 500 }
    );
  }
}