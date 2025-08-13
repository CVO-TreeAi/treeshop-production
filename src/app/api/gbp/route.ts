type PlaceDetailsResult = { rating?: number; user_ratings_total?: number; reviews?: Array<{ author_name: string; rating: number; text: string }>; }
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
// Note: This endpoint uses Google Places for public review snippets.
// Business Profile admin features live under /api/admin/gbp/*.

export async function GET() {
  try {
    const placeId = process.env.GBP_PLACE_ID;
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if(!placeId || !key){
      return NextResponse.json({ error: 'missing_config' }, { status: 400 });
    }
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('key', key);
    url.searchParams.set('fields', 'rating,user_ratings_total,reviews');
    const res = await fetch(url.toString());
    const data = await res.json() as { result?: PlaceDetailsResult };
    const result: PlaceDetailsResult = data.result || {};


    await adminDb.collection('siteSettings').doc('gbp').set({
      rating: result.rating ?? null,
      total: result.user_ratings_total ?? null,
      reviews: (result.reviews || []).map((r)=>({ author_name: r.author_name, rating: r.rating, text: r.text })).slice(0,10),
      updatedAt: new Date(),
    }, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (_e) {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
