import { NextRequest, NextResponse } from 'next/server'
import { listLocations } from '@/lib/googleBusiness'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  try {
    const { searchParams } = new URL(req.url)
    const accountName = searchParams.get('accountName')
    if (!accountName) return NextResponse.json({ error: 'missing_account' }, { status: 400 })
    const locations = await listLocations(accountName)
    return NextResponse.json(locations)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to list locations'
    return NextResponse.json({ error: 'fetch_failed', message }, { status: 400 })
  }
}


