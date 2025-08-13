import { NextRequest, NextResponse } from 'next/server'
import { listReviews } from '@/lib/googleBusiness'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  try {
    const { searchParams } = new URL(req.url)
    const accountId = searchParams.get('accountId')
    const locationId = searchParams.get('locationId')
    if (!accountId || !locationId) return NextResponse.json({ error: 'missing_ids' }, { status: 400 })

    const data = await listReviews(accountId, locationId)

    // Optional: store a snapshot for internal moderation/display
    await adminDb.collection('gbp').doc('latestReviews').set({
      accountId,
      locationId,
      data,
      updatedAt: new Date(),
    }, { merge: true })

    return NextResponse.json(data)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to list reviews'
    return NextResponse.json({ error: 'fetch_failed', message }, { status: 400 })
  }
}


