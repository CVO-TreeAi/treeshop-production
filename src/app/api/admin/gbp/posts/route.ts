import { NextRequest, NextResponse } from 'next/server'
import { createLocalPost, LocalPostPayload } from '@/lib/googleBusiness'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/auth-middleware'

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  try {
    const body = (await req.json()) as Partial<{
      accountId: string
      locationId: string
      summary: string
      callToAction?: { actionType: string; url: string }
      mediaUrls?: string[]
      event?: { startDate?: string; endDate?: string }
    }>
    const { accountId, locationId, summary, callToAction, mediaUrls, event } = body || {}
    if (!accountId || !locationId || !summary) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    const payload: LocalPostPayload = { summary }

    if (callToAction?.actionType && callToAction?.url) {
      payload.callToAction = callToAction
    }

    if (Array.isArray(mediaUrls) && mediaUrls.length > 0) {
      payload.media = mediaUrls.map((url) => ({ googleUrl: url }))
    }

    if (event?.startDate || event?.endDate) {
      payload.event = event
    }

    const result = await createLocalPost(accountId, locationId, payload)

    await adminDb.collection('gbp').doc('posts').collection('history').add({
      accountId,
      locationId,
      payload,
      result,
      createdAt: new Date(),
    })

    return NextResponse.json({ ok: true, result })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create post'
    return NextResponse.json({ error: 'post_failed', message }, { status: 400 })
  }
}


