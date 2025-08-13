import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/firestore/collections'

const SEED_VIDEOS = [
  {
    youtubeId: 'ZoljG4dtPBw',
    title: 'Professional Forestry Mulching - Complete Property Transformation',
    description: 'Watch our professional team transform overgrown property using advanced forestry mulching techniques. See the complete process from dense vegetation to clean, usable land.',
    category: 'forestry-mulching',
    location: 'Central Florida',
    acreage: '8 acres',
    packageSize: 'Large Package (8" DBH)',
    duration: '15:42',
    views: '1.2K',
    featured: true,
    published: true,
    sortOrder: 1
  },
  {
    youtubeId: '1nm_tXSwSvI',
    title: 'TreeAI Technology in Action - Precision Land Clearing',
    description: 'Experience our revolutionary TreeAI technology that ensures precise, efficient land clearing while preserving valuable trees and minimizing environmental impact.',
    category: 'technology',
    location: 'Orlando Area, FL',
    acreage: '12 acres',
    packageSize: 'Custom',
    duration: '12:18',
    views: '2.8K',
    featured: true,
    published: true,
    sortOrder: 2
  },
  {
    youtubeId: 'AQjyRCERpQA',
    title: 'Amazing Before & After - Land Clearing Time-lapse',
    description: 'Incredible time-lapse footage showing the dramatic transformation of overgrown Florida property into beautiful, usable land. See months of work in just minutes.',
    category: 'before-after',
    location: 'Tampa Bay, FL',
    acreage: '6 acres',
    packageSize: 'Medium Package (6" DBH)',
    duration: '8:34',
    views: '4.1K',
    featured: true,
    published: true,
    sortOrder: 3
  }
]

export async function POST() {
  try {
    // Check if videos already exist to avoid duplicates
    const existingVideosQuery = query(
      collection(db, COLLECTIONS.YOUTUBE_VIDEOS)
    )
    const existingSnapshot = await getDocs(existingVideosQuery)
    const existingVideoIds = existingSnapshot.docs.map(doc => doc.data().youtubeId)

    const videosToAdd = SEED_VIDEOS.filter(video => !existingVideoIds.includes(video.youtubeId))
    
    if (videosToAdd.length === 0) {
      return NextResponse.json({ 
        message: 'All seed videos already exist',
        existing: existingVideoIds.length,
        added: 0 
      })
    }

    // Add new videos
    const results = []
    for (const video of videosToAdd) {
      const videoData = {
        ...video,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, COLLECTIONS.YOUTUBE_VIDEOS), videoData)
      results.push({ id: docRef.id, youtubeId: video.youtubeId, title: video.title })
    }

    return NextResponse.json({
      message: `Successfully added ${results.length} videos`,
      existing: existingVideoIds.length,
      added: results.length,
      videos: results
    })
  } catch (error) {
    console.error('Error seeding videos:', error)
    return NextResponse.json(
      { error: 'Failed to seed videos', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to seed the YouTube videos',
    videos: SEED_VIDEOS.map(v => ({ youtubeId: v.youtubeId, title: v.title }))
  })
}