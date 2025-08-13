import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'

type Category = 'performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa'

export async function GET(req: NextRequest) {
  const unauthorized = await requireAuth()(req)
  if (unauthorized) return unauthorized

  try {
    const { searchParams } = new URL(req.url)
    const targetUrl = searchParams.get('url') || process.env.PUBLIC_SITE_URL
    if (!targetUrl) return NextResponse.json({ error: 'missing_url' }, { status: 400 })

    const apiKey = process.env.PAGESPEED_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'missing_api_key' }, { status: 400 })

    const categories: Category[] = ['performance', 'accessibility', 'best-practices', 'seo']
    const u = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
    u.searchParams.set('url', targetUrl)
    u.searchParams.set('key', apiKey)
    for (const c of categories) u.searchParams.append('category', c)
    u.searchParams.set('strategy', 'mobile')

    const res = await fetch(u.toString())
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'lighthouse_failed', details: text }, { status: 500 })
    }
    const json = await res.json()
    const lighthouse = json.lighthouseResult
    const audits = lighthouse?.audits || {}
    const categoriesOut = lighthouse?.categories || {}

    const scores = {
      performance: Math.round((categoriesOut.performance?.score || 0) * 100),
      accessibility: Math.round((categoriesOut.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categoriesOut['best-practices']?.score || 0) * 100),
      seo: Math.round((categoriesOut.seo?.score || 0) * 100),
    }

    const actionable = [
      audits['first-contentful-paint'],
      audits['largest-contentful-paint'],
      audits['interactive'],
      audits['total-blocking-time'],
      audits['cumulative-layout-shift'],
      audits['uses-responsive-images'],
      audits['modern-image-formats'],
      audits['unused-javascript'],
      audits['server-response-time'],
      audits['render-blocking-resources'],
    ].filter(Boolean).map((a: any) => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue }))

    return NextResponse.json({ scores, actionable })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown_error'
    return NextResponse.json({ error: 'unexpected', message }, { status: 500 })
  }
}


