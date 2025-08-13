import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/auth-middleware'
import { listReviews } from '@/lib/googleBusiness'

// Cron-safe: if header X-Cron-Key matches env CRON_SECRET, bypass auth for scheduled jobs
function isCronAuthorized(req: NextRequest): boolean {
  const cronKey = process.env.CRON_SECRET
  const header = req.headers.get('x-cron-key')
  return Boolean(cronKey && header && header === cronKey)
}

export async function POST(req: NextRequest) {
  if (!isCronAuthorized(req)) {
    const unauthorized = await requireAuth()(req)
    if (unauthorized) return unauthorized
  }

  try {
    const cfgSnap = await adminDb.collection('gbp').doc('config').get()
    const cfg = cfgSnap.exists ? cfgSnap.data() as { accountId?: string; locationId?: string } : {}
    const accountId = cfg.accountId
    const locationId = cfg.locationId
    if (!accountId || !locationId) {
      return NextResponse.json({ error: 'missing_config' }, { status: 400 })
    }

    const data = await listReviews(accountId, locationId)
    await adminDb.collection('siteSettings').doc('gbp').set({
      rating: null,
      total: Array.isArray((data as any)?.reviews) ? (data as any).reviews.length : null,
      reviews: Array.isArray((data as any)?.reviews)
        ? (data as any).reviews.map((r: any) => ({
            author_name: r.reviewer?.displayName || r.authorName || 'Customer',
            rating: Number(r.starRating || r.rating || 0),
            text: r.comment || r.text || ''
          })).slice(0, 20)
        : [],
      updatedAt: new Date(),
    }, { merge: true })

    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'sync_failed'
    return NextResponse.json({ error: 'sync_failed', message }, { status: 500 })
  }
}


