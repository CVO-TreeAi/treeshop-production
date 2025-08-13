import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/auth-middleware'

// Store selected GBP account/location for scheduled syncs and defaults
export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  const doc = await adminDb.collection('gbp').doc('config').get()
  return NextResponse.json(doc.exists ? doc.data() : { accountId: null, locationId: null })
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  const body = await req.json() as { accountId?: string; locationId?: string }
  const { accountId, locationId } = body
  if (!accountId || !locationId) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }
  await adminDb.collection('gbp').doc('config').set({ accountId, locationId, updatedAt: new Date() }, { merge: true })
  return NextResponse.json({ ok: true })
}


