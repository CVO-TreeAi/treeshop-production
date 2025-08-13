import { NextRequest, NextResponse } from 'next/server'
import { getGoogleOAuthUrl } from '@/lib/googleOAuth'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  try {
    const url = getGoogleOAuthUrl('gbp')
    return NextResponse.json({ url })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'OAuth not configured'
    return NextResponse.json({ error: 'config_error', message }, { status: 400 })
  }
}


