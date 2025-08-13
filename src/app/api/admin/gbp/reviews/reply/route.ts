import { NextRequest, NextResponse } from 'next/server'
import { replyToReview } from '@/lib/googleBusiness'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/auth-middleware'

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  try {
    const body = (await req.json()) as { accountId?: string; locationId?: string; reviewId?: string; comment?: string }
    const { accountId, locationId, reviewId, comment } = body || {}
    if (!accountId || !locationId || !reviewId || !comment) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const result = await replyToReview(accountId, locationId, reviewId, comment)

    await adminDb.collection('gbp').doc('replies').collection('history').add({
      accountId,
      locationId,
      reviewId,
      comment,
      result,
      createdAt: new Date(),
    })

    return NextResponse.json({ ok: true, result })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to reply to review'
    return NextResponse.json({ error: 'reply_failed', message }, { status: 400 })
  }
}


