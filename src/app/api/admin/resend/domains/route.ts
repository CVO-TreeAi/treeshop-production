import { NextRequest, NextResponse } from 'next/server'
import { resendDomains, setupResendDomain } from '@/lib/resend'

export async function GET() {
  try {
    const domains = await resendDomains.list()
    return NextResponse.json({
      success: true,
      data: domains
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, domain, domainId, options } = body

    let result
    switch (action) {
      case 'create':
        result = await resendDomains.create(domain)
        break
      case 'verify':
        result = await resendDomains.verify(domainId)
        break
      case 'update':
        result = await resendDomains.update(domainId, options)
        break
      case 'setup':
        result = await setupResendDomain()
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domainId = searchParams.get('domainId')

    if (!domainId) {
      return NextResponse.json({
        success: false,
        error: 'Domain ID required'
      }, { status: 400 })
    }

    const result = await resendDomains.remove(domainId)
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}