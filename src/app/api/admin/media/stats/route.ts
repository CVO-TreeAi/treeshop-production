import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getCountFromServer, query, where } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/firestore/collections'

export async function GET() {
  try {
    // Get counts for each media type
    const [videosSnapshot, blogsSnapshot, projectsSnapshot, mediaSnapshot] = await Promise.all([
      getCountFromServer(collection(db, COLLECTIONS.YOUTUBE_VIDEOS)),
      getCountFromServer(collection(db, COLLECTIONS.BLOG_POSTS)),
      getCountFromServer(collection(db, COLLECTIONS.PROJECT_MEDIA)),
      getCountFromServer(collection(db, COLLECTIONS.SITE_MEDIA))
    ])

    const stats = {
      videos: videosSnapshot.data().count,
      blogs: blogsSnapshot.data().count,
      projects: projectsSnapshot.data().count,
      media: mediaSnapshot.data().count
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching media stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        videos: 0,
        blogs: 0,
        projects: 0,
        media: 0
      },
      { status: 500 }
    )
  }
}