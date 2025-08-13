import { adminDb } from '@/lib/firebaseAdmin'

type StoredTokens = {
  accessToken: string
  refreshToken: string
  expiryDateMs: number
}

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID
const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET
const GOOGLE_OAUTH_REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI

// Scope required to manage Google Business Profile (accounts, locations, posts, reviews)
const GBP_SCOPE = 'https://www.googleapis.com/auth/business.manage'

function assertEnv() {
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REDIRECT_URI) {
    throw new Error('Missing required Google OAuth environment variables')
  }
}

export function getGoogleOAuthUrl(state = 'gbp'): string {
  assertEnv()
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', GOOGLE_OAUTH_CLIENT_ID!)
  url.searchParams.set('redirect_uri', GOOGLE_OAUTH_REDIRECT_URI!)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', GBP_SCOPE)
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('include_granted_scopes', 'true')
  url.searchParams.set('prompt', 'consent')
  url.searchParams.set('state', state)
  return url.toString()
}

export async function exchangeCodeForTokens(code: string): Promise<StoredTokens> {
  assertEnv()
  const body = new URLSearchParams({
    code,
    client_id: GOOGLE_OAUTH_CLIENT_ID!,
    client_secret: GOOGLE_OAUTH_CLIENT_SECRET!,
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URI!,
    grant_type: 'authorization_code',
  })

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${res.status} ${text}`)
  }

  const json = await res.json() as { access_token: string; refresh_token?: string; expires_in: number }

  const stored: StoredTokens = {
    accessToken: json.access_token,
    refreshToken: json.refresh_token || '',
    expiryDateMs: Date.now() + (json.expires_in * 1000) - 60_000, // refresh one minute early
  }

  await storeTokens(stored)
  return stored
}

export async function refreshAccessToken(refreshToken: string): Promise<StoredTokens> {
  assertEnv()
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: GOOGLE_OAUTH_CLIENT_ID!,
    client_secret: GOOGLE_OAUTH_CLIENT_SECRET!,
    grant_type: 'refresh_token',
  })

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token refresh failed: ${res.status} ${text}`)
  }

  const json = await res.json() as { access_token: string; expires_in: number }

  const existing = await getStoredTokens()
  const updated: StoredTokens = {
    accessToken: json.access_token,
    refreshToken: existing?.refreshToken || refreshToken,
    expiryDateMs: Date.now() + (json.expires_in * 1000) - 60_000,
  }

  await storeTokens(updated)
  return updated
}

const TOKENS_DOC_PATH = { collection: 'integrations', doc: 'google_gbp' } as const

export async function getStoredTokens(): Promise<StoredTokens | null> {
  const snap = await adminDb.collection(TOKENS_DOC_PATH.collection).doc(TOKENS_DOC_PATH.doc).get()
  if (!snap.exists) return null
  const data = snap.data() as Partial<StoredTokens> | undefined
  if (!data?.accessToken || !data?.expiryDateMs) return null
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || '',
    expiryDateMs: Number(data.expiryDateMs) || 0,
  }
}

export async function storeTokens(tokens: StoredTokens): Promise<void> {
  await adminDb.collection(TOKENS_DOC_PATH.collection).doc(TOKENS_DOC_PATH.doc).set({
    ...tokens,
    updatedAt: new Date(),
  }, { merge: true })
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getStoredTokens()
  if (!tokens) return null
  if (Date.now() < tokens.expiryDateMs) return tokens.accessToken
  if (!tokens.refreshToken) return null
  const refreshed = await refreshAccessToken(tokens.refreshToken)
  return refreshed.accessToken
}


