import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/googleOAuth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    if (!code) return NextResponse.json({ error: 'missing_code' }, { status: 400 })

    await exchangeCodeForTokens(code)

    // Redirect to admin GBP page
    const redirectTo = `/admin/gbp?connected=1&state=${encodeURIComponent(state || '')}`
    return NextResponse.redirect(new URL(redirectTo, req.url))
  } catch (e) {
    const message = e instanceof Error ? e.message : 'OAuth error'
    return NextResponse.json({ error: 'oauth_failed', message }, { status: 400 })
  }
}


