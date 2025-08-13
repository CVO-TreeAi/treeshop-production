'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
// FIREBASE DISABLED

type Account = { name: string; accountName?: string; organizationInfo?: { registeredLegalName?: string } }
type Location = { name: string; title?: string; storeCode?: string }

export default function AdminGBPPage() {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountName, setSelectedAccountName] = useState<string>('')
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocationId, setSelectedLocationId] = useState<string>('')
  type Review = { reviewId?: string; name?: string; reviewer?: { displayName?: string }; starRating?: string | number; rating?: number; comment?: string; text?: string }
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const [postSummary, setPostSummary] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [ctaType, setCtaType] = useState('LEARN_MORE')
  const [message, setMessage] = useState<string>('')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({})
  const [savedConfig, setSavedConfig] = useState<{ accountId?: string; locationId?: string } | null>(null)

  const authedFetch = async (url: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (options.headers) Object.assign(headers, options.headers as Record<string, string>)
    try {
      const token = await auth?.currentUser?.getIdToken(true)
      if (token) headers['Authorization'] = `Bearer ${token}`
      if (process.env.NODE_ENV === 'development' && !token) {
        headers['Authorization'] = 'Bearer dev'
      }
    } catch {}
    return fetch(url, { ...options, headers })
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('connected') === '1') setConnected(true)
    // polling status in case we land without param
    authedFetch('/api/admin/gbp/status').then(async (r) => {
      if (!r.ok) return
      const j = await r.json()
      if (j?.connected) setConnected(true)
    }).catch(() => {})
    authedFetch('/api/admin/gbp/config').then(async (r) => {
      if (!r.ok) return
      const j = await r.json()
      setSavedConfig(j)
    }).catch(() => {})
  }, [])

  const connectGbp = async () => {
    setConnecting(true)
    try {
      const res = await authedFetch('/api/admin/gbp/connect')
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setMessage('OAuth not configured')
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to start OAuth'
      setMessage(msg)
    } finally {
      setConnecting(false)
    }
  }

  const loadAccounts = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await authedFetch('/api/admin/gbp/accounts')
      if (!res.ok) throw new Error('Failed to load accounts')
      const json = await res.json()
      const items = Array.isArray(json?.accounts) ? json.accounts : (json?.items || [])
      setAccounts(items)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error loading accounts'
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const loadLocations = async (accountName: string) => {
    if (!accountName) return
    setLoading(true)
    setMessage('')
    try {
      const res = await authedFetch(`/api/admin/gbp/locations?accountName=${encodeURIComponent(accountName)}`)
      if (!res.ok) throw new Error('Failed to load locations')
      const json = await res.json()
      const items = Array.isArray(json?.locations) ? json.locations : (json?.items || [])
      setLocations(items)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error loading locations'
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const loadReviews = async () => {
    if (!selectedAccountName || !selectedLocationId) return
    setLoading(true)
    setMessage('')
    try {
      const parts = selectedAccountName.split('/')
      const accountId = parts[parts.length - 1]
      const locationId = selectedLocationId.split('/').pop() || ''
      const res = await authedFetch(`/api/admin/gbp/reviews?accountId=${encodeURIComponent(accountId)}&locationId=${encodeURIComponent(locationId)}`)
      if (!res.ok) throw new Error('Failed to load reviews')
      const json = await res.json()
      const items = Array.isArray(json?.reviews) ? json.reviews : (json?.review || json?.items || [])
      setReviews(items)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error loading reviews'
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const publishPost = async () => {
    setLoading(true)
    setMessage('')
    try {
      const accountId = selectedAccountName.split('/').pop() || ''
      const locationId = selectedLocationId.split('/').pop() || ''
      const body: { accountId: string; locationId: string; summary: string; callToAction?: { actionType: string; url: string } } = { accountId, locationId, summary: postSummary }
      if (ctaUrl) body.callToAction = { actionType: ctaType, url: ctaUrl }

      const res = await authedFetch('/api/admin/gbp/posts', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || 'Failed to publish post')
      setMessage('Post published successfully')
      setPostSummary('')
      setCtaUrl('')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error publishing post'
      setMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const canOperate = useMemo(() => Boolean(connected), [connected])

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Google Business Profile</h1>
          <p className="text-gray-300">Connect, view reviews, and publish posts directly from TreeAI Admin</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Connection</h2>
            <p className="text-sm text-gray-400 mb-4">Authorize TreeAI to manage your Business Profile</p>
            <button
              disabled={connecting}
              onClick={connectGbp}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-black font-semibold disabled:opacity-70"
            >{connecting ? 'Connecting…' : connected ? 'Re-connect Google' : 'Connect Google'}</button>
            {connected && (
              <div className="mt-3 text-xs text-green-300">Connected. You can now fetch accounts, locations, and reviews.</div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3">Accounts & Locations</h2>
            <div className="flex gap-2 mb-3">
              <button onClick={loadAccounts} className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm">Load Accounts</button>
              <select
                className="bg-gray-800 border border-gray-700 rounded px-2 py-2 text-sm flex-1"
                aria-label="Select Google Business account"
                value={selectedAccountName}
                onChange={(e) => {
                  setSelectedAccountName(e.target.value)
                  setLocations([])
                  setSelectedLocationId('')
                  if (e.target.value) loadLocations(e.target.value)
                }}
              >
                <option value="">Select Account</option>
                {accounts.map((a, idx) => (
                  <option key={idx} value={a.name}>{a.organizationInfo?.registeredLegalName || a.accountName || a.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <select
                className="bg-gray-800 border border-gray-700 rounded px-2 py-2 text-sm flex-1"
                aria-label="Select location"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((l, idx) => (
                  <option key={idx} value={l.name}>{l.title || l.storeCode || l.name}</option>
                ))}
              </select>
              <button disabled={!selectedAccountName || !selectedLocationId} onClick={loadReviews} className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm disabled:opacity-50">Load Reviews</button>
              <button
                disabled={!selectedAccountName || !selectedLocationId}
                onClick={async () => {
                  try {
                    const accountId = selectedAccountName.split('/').pop() || ''
                    const locationId = selectedLocationId.split('/').pop() || ''
                    const res = await authedFetch('/api/admin/gbp/config', {
                      method: 'POST',
                      body: JSON.stringify({ accountId, locationId })
                    })
                    const j = await res.json()
                    if (!res.ok) throw new Error(j?.message || 'Failed to save')
                    setSavedConfig({ accountId, locationId })
                    setMessage('Default location saved for sync')
                  } catch (e) {
                    const msg = e instanceof Error ? e.message : 'Save failed'
                    setMessage(msg)
                  }
                }}
                className="px-3 py-2 rounded bg-green-600 hover:bg-green-500 text-black text-sm disabled:opacity-50"
              >Save as default</button>
            </div>
            {savedConfig?.locationId && (
              <div className="text-xs text-gray-400 mt-2">Default: {savedConfig.accountId}/{savedConfig.locationId}</div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <div className="text-xs text-gray-400">Showing latest from selected location</div>
          </div>
          {reviews.length === 0 ? (
            <div className="text-gray-400 text-sm">No reviews loaded yet.</div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i: number) => (
                <div key={i} className="p-3 bg-gray-800/50 rounded border border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">{r.reviewer?.displayName || r.authorName || 'Customer'}</div>
                    <div className="text-yellow-400 text-sm">{r.starRating || r.rating || ''}</div>
                  </div>
                  <div className="text-gray-300 text-sm mt-1">{r.comment || r.text || ''}</div>
                  <div className="mt-2">
                    <button
                      onClick={() => setReplyOpen((prev) => ({ ...prev, [String(r.reviewId || r.name || i)]: !prev[String(r.reviewId || r.name || i)] }))}
                      className="text-xs text-green-400 hover:text-green-300"
                    >{replyOpen[String(r.reviewId || r.name || i)] ? 'Cancel' : 'Reply'}</button>
                  </div>
                  {replyOpen[String(r.reviewId || r.name || i)] && (
                    <div className="mt-2 flex gap-2">
                      <input
                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
                        placeholder="Write a public reply"
                        value={replyDrafts[String(r.reviewId || r.name || i)] || ''}
                        onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [String(r.reviewId || r.name || i)]: e.target.value }))}
                      />
                      <button
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-black text-xs"
                        onClick={async () => {
                          try {
                            const accountId = selectedAccountName.split('/').pop() || ''
                            const locationId = selectedLocationId.split('/').pop() || ''
                            const reviewId = (r.reviewId || (r.name || '').split('/').pop() || '') as string
                            const comment = replyDrafts[String(r.reviewId || r.name || i)] || ''
                            if (!reviewId || !comment) return
                            const res = await authedFetch('/api/admin/gbp/reviews/reply', {
                              method: 'POST',
                              body: JSON.stringify({ accountId, locationId, reviewId, comment })
                            })
                            const json = await res.json()
                            if (!res.ok) throw new Error(json?.message || 'Reply failed')
                            setMessage('Reply posted')
                            setReplyDrafts((prev) => ({ ...prev, [String(r.reviewId || r.name || i)]: '' }))
                            setReplyOpen((prev) => ({ ...prev, [String(r.reviewId || r.name || i)]: false }))
                          } catch (e) {
                            const msg = e instanceof Error ? e.message : 'Failed to post reply'
                            setMessage(msg)
                          }
                        }}
                      >Post</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Post</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <input value={postSummary} onChange={(e) => setPostSummary(e.target.value)} placeholder="Post summary" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
            <div className="flex gap-2">
              <select value={ctaType} onChange={(e) => setCtaType(e.target.value)} aria-label="Select call to action type" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm">
                <option value="LEARN_MORE">LEARN_MORE</option>
                <option value="ORDER">ORDER</option>
                <option value="BOOK">BOOK</option>
                <option value="SIGN_UP">SIGN_UP</option>
                <option value="CALL">CALL</option>
              </select>
              <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="CTA URL" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm flex-1" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button disabled={!postSummary || !selectedAccountName || !selectedLocationId || !canOperate} onClick={publishPost} className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-black font-semibold disabled:opacity-50">Publish to Google</button>
            <Link className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white text-sm" href="https://developers.google.com/apis-explorer" target="_blank">API Explorer</Link>
          </div>
          {message && <div className="mt-3 text-sm text-gray-300">{message}</div>}
        </div>

      </main>
      <Footer />
    </div>
  )
}


