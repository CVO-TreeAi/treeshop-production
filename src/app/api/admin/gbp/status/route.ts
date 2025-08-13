import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(request: Request) {
  // Narrow Request to NextRequest via type assertion for middleware
  const unauthorized = await (requireAuth() as unknown as (req: Request) => Promise<Response | null>)(request)
  if (unauthorized) return unauthorized
  try {
    const snap = await adminDb.collection('integrations').doc('google_gbp').get()
    const data = snap.exists ? snap.data() : null
    const connected = Boolean(data?.accessToken)
    return NextResponse.json({ connected })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'status_error'
    return NextResponse.json({ connected: false, error: message }, { status: 200 })
  }
}


