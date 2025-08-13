import { getValidAccessToken } from '@/lib/googleOAuth'

const GBP_INFO_API = 'https://mybusinessbusinessinformation.googleapis.com/v1'
const GBP_ACCOUNTS_API = 'https://mybusinessaccountmanagement.googleapis.com/v1'
const GBP_V4_API = 'https://mybusiness.googleapis.com/v4'

async function authHeaders(): Promise<HeadersInit> {
  const token = await getValidAccessToken()
  if (!token) {
    throw new Error('No valid Google access token. Connect your Google Business Profile in Admin > GBP.')
  }
  return { Authorization: `Bearer ${token}` }
}

export type GbpAccount = { name: string; accountName?: string; organizationInfo?: { registeredLegalName?: string } }
export type GbpLocation = { name: string; title?: string; storeCode?: string }
export type GbpReviewer = { displayName?: string }
export type GbpReview = { name?: string; reviewId?: string; reviewer?: GbpReviewer; starRating?: string | number; rating?: number; comment?: string; text?: string }

type AccountsResponse = { accounts?: GbpAccount[]; items?: GbpAccount[] }
type LocationsResponse = { locations?: GbpLocation[]; items?: GbpLocation[] }
type ReviewsResponse = { reviews?: GbpReview[]; review?: GbpReview[]; items?: GbpReview[] }

export async function listAccounts(): Promise<AccountsResponse> {
  const headers = await authHeaders()
  const res = await fetch(`${GBP_ACCOUNTS_API}/accounts`, { headers })
  if (!res.ok) throw new Error(`Accounts fetch failed: ${res.status}`)
  return (await res.json()) as AccountsResponse
}

export async function listLocations(accountName: string): Promise<LocationsResponse> {
  const headers = await authHeaders()
  const res = await fetch(`${GBP_INFO_API}/${encodeURIComponent(accountName)}/locations`, { headers })
  if (!res.ok) throw new Error(`Locations fetch failed: ${res.status}`)
  return (await res.json()) as LocationsResponse
}

// Reviews are served from the older v4 API
export async function listReviews(accountId: string, locationId: string): Promise<ReviewsResponse> {
  const headers = await authHeaders()
  const res = await fetch(`${GBP_V4_API}/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews`, { headers })
  if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`)
  return (await res.json()) as ReviewsResponse
}

// Create a local post (Posts API is part of v4 as well)
export type LocalPostPayload = {
  summary: string
  callToAction?: { actionType: string; url: string }
  media?: { googleUrl: string }[]
  event?: { startDate?: string; endDate?: string }
}

export async function createLocalPost(accountId: string, locationId: string, post: LocalPostPayload): Promise<unknown> {
  const headers = { ...(await authHeaders()), 'Content-Type': 'application/json' }
  const res = await fetch(`${GBP_V4_API}/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/localPosts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Create post failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<unknown>
}

export async function replyToReview(accountId: string, locationId: string, reviewId: string, comment: string): Promise<unknown> {
  const headers = { ...(await authHeaders()), 'Content-Type': 'application/json' }
  const res = await fetch(`${GBP_V4_API}/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews/${encodeURIComponent(reviewId)}/reply`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ comment })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Reply failed: ${res.status} ${text}`)
  }
  return res.json() as Promise<unknown>
}


