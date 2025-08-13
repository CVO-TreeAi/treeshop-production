import { NextRequest, NextResponse } from 'next/server'

// Firebase disabled for Convex migration
export async function GET() {
  return NextResponse.json({ error: 'Firebase disabled for Convex migration' }, { status: 501 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Firebase disabled for Convex migration' }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Firebase disabled for Convex migration' }, { status: 501 })
}