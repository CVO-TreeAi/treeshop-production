import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import { COLLECTIONS, BlogPost } from '@/lib/firestore/collections'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  // Allow public access for published posts only
  const searchParams = request.nextUrl.searchParams
  const published = searchParams.get('published')
  const isPublicRequest = published === 'true'
  
  if (!isPublicRequest) {
    // Check authentication for admin endpoints accessing unpublished content
    const authCheck = await requireAuth()(request)
    if (authCheck) return authCheck
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')

    let q = query(
      collection(db, COLLECTIONS.BLOG_POSTS),
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
    let posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
    })) as BlogPost[]

    // Apply limit if specified
    if (limit) {
      posts = posts.slice(0, parseInt(limit))
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Check authentication for admin endpoints
  const authCheck = await requireAuth()(request)
  if (authCheck) return authCheck

  try {
    const body = await request.json()
    
    const postData: Omit<BlogPost, 'id'> = {
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category || 'Forestry',
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author || 'The Tree Shop Team',
      coverImage: body.coverImage,
      published: body.published !== undefined ? body.published : true,
      featured: body.featured || false,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      seoKeywords: Array.isArray(body.seoKeywords) ? body.seoKeywords : [],
      readingTime: body.readingTime || {
        text: '1 min read',
        minutes: 1,
        time: 60000,
        words: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      sortOrder: body.sortOrder || 0
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_POSTS), postData)
    
    return NextResponse.json(
      { id: docRef.id, message: 'Blog post created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}