import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import { COLLECTIONS, SiteMedia } from '@/lib/firestore/collections'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const type = searchParams.get('type')
    const category = searchParams.get('category')

    let q = query(
      collection(db, COLLECTIONS.SITE_MEDIA),
      orderBy('type', 'asc'),
      orderBy('createdAt', 'desc')
    )

    // Apply filters if specified
    if (published !== null) {
      q = query(q, where('published', '==', published === 'true'))
    }
    if (featured !== null) {
      q = query(q, where('featured', '==', featured === 'true'))
    }
    if (type) {
      q = query(q, where('type', '==', type))
    }
    if (category) {
      q = query(q, where('category', '==', category))
    }

    const snapshot = await getDocs(q)
    const media = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    })) as SiteMedia[]

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const mediaData: Omit<SiteMedia, 'id'> = {
      type: body.type || 'general',
      url: body.url,
      alt: body.alt,
      caption: body.caption,
      title: body.title,
      description: body.description,
      category: body.category,
      featured: body.featured || false,
      published: body.published !== undefined ? body.published : true,
      dimensions: body.dimensions,
      fileSize: body.fileSize,
      mimeType: body.mimeType || 'image/jpeg',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.SITE_MEDIA), mediaData)
    
    return NextResponse.json(
      { id: docRef.id, message: 'Media created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}