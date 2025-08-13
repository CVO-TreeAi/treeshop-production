import { NextRequest, NextResponse } from 'next/server'
import { listAccounts } from '@/lib/googleBusiness'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized
  try {
    const accounts = await listAccounts()
    return NextResponse.json(accounts)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to list accounts'
    return NextResponse.json({ error: 'fetch_failed', message }, { status: 400 })
  }
}


