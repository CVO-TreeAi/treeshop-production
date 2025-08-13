import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import { COLLECTIONS, ProjectMedia } from '@/lib/firestore/collections'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const packageSize = searchParams.get('packageSize')
    const limit = searchParams.get('limit')

    let q = query(
      collection(db, COLLECTIONS.PROJECT_MEDIA),
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
    if (packageSize) {
      q = query(q, where('packageSize', '==', packageSize))
    }

    const snapshot = await getDocs(q)
    let projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    })) as ProjectMedia[]

    // Apply limit if specified
    if (limit) {
      projects = projects.slice(0, parseInt(limit))
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const projectData: Omit<ProjectMedia, 'id'> = {
      location: body.location,
      packageSize: body.packageSize || 'Medium Package (6" DBH)',
      description: body.description,
      beforeImages: body.beforeImages || [],
      afterImages: body.afterImages || [],
      acreage: body.acreage || '',
      timeframe: body.timeframe || '',
      featured: body.featured || false,
      published: body.published !== undefined ? body.published : true,
      additionalDetails: body.additionalDetails,
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: body.sortOrder || 0
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECT_MEDIA), projectData)
    
    return NextResponse.json(
      { id: docRef.id, message: 'Project created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}