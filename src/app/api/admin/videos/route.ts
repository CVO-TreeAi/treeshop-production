import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import { COLLECTIONS, YouTubeVideo } from '@/lib/firestore/collections'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    let q = query(
      collection(db, COLLECTIONS.YOUTUBE_VIDEOS),
      orderBy('sortOrder', 'asc'),
      orderBy('createdAt', 'desc')
    )

    // Apply filters if specified
    if (published !== null) {
      q = query(q, where('published', '==', published === 'true'))
    }
    if (featured !== null) {
      q = query(q, where('featured', '==', featured === 'true'))
    }
    if (category) {
      q = query(q, where('category', '==', category))
    }

    const snapshot = await getDocs(q)
    const videos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    })) as YouTubeVideo[]

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const videoData: Omit<YouTubeVideo, 'id'> = {
      youtubeId: body.youtubeId,
      title: body.title,
      description: body.description,
      category: body.category || 'forestry-mulching',
      location: body.location || '',
      acreage: body.acreage || '',
      packageSize: body.packageSize || 'Medium Package (6" DBH)',
      duration: body.duration || '',
      views: body.views || '',
      featured: body.featured || false,
      published: body.published !== undefined ? body.published : true,
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: body.sortOrder || 0
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.YOUTUBE_VIDEOS), videoData)
    
    return NextResponse.json(
      { id: docRef.id, message: 'Video created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}