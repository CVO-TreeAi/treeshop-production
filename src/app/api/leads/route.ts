import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const col = adminDb.collection('leads');
    const max = limit ? Math.min(parseInt(limit), 200) : 50;
    let q = col.orderBy('createdAt', 'desc');
    if (status) {
      q = col.where('status', '==', status).orderBy('createdAt', 'desc');
    } else if (category) {
      q = col.where('aiData.category', '==', category).orderBy('createdAt', 'desc');
    }
    const snap = await q.limit(max).get();
    const leads = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const leadData = await req.json();
    const payload = {
      contact: leadData.contact,
      property: leadData.property || {
        address: leadData.address,
        zipCode: leadData.zipCode || '34601'
      },
      projectDetails: leadData.projectDetails || {
        acreage: leadData.acreage || 0,
        services: leadData.services || ['forestry-mulching'],
        urgency: leadData.urgency || 'planning',
        budget: leadData.budget,
        description: leadData.description
      },
      source: leadData.source || 'website',
      status: 'New',
      assignedTo: leadData.assignedTo || null,
      notes: leadData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await adminDb.collection('leads').add(payload as FirebaseFirestore.DocumentData);
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}