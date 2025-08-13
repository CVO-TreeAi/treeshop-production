// FIREBASE/FIRESTORE DISABLED - USING CONVEX
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ error: 'Firebase disabled' }, { status: 501 }) }
export async function POST() { return NextResponse.json({ error: 'Firebase disabled' }, { status: 501 }) }
export async function PUT() { return NextResponse.json({ error: 'Firebase disabled' }, { status: 501 }) }
export async function DELETE() { return NextResponse.json({ error: 'Firebase disabled' }, { status: 501 }) }
