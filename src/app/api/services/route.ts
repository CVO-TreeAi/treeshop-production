import { NextRequest, NextResponse } from 'next/server';
import { serviceService, adminDatabase } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    let services;
    
    if (activeOnly) {
      services = await serviceService.getAllActiveServices();
    } else {
      services = await serviceService.getAll('services', 'createdAt');
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const serviceData = await req.json();
    
    // Generate slug from name if not provided
    const slug = serviceData.slug || serviceData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    const id = await adminDatabase.create('services', {
      name: serviceData.name,
      slug,
      description: serviceData.description,
      shortDescription: serviceData.shortDescription,
      basePrice: serviceData.basePrice,
      priceUnit: serviceData.priceUnit || 'per_acre',
      category: serviceData.category,
      features: serviceData.features || [],
      faqs: serviceData.faqs || [],
      gallery: serviceData.gallery || [],
      isActive: serviceData.isActive !== false,
      seoTitle: serviceData.seoTitle,
      seoDescription: serviceData.seoDescription
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}