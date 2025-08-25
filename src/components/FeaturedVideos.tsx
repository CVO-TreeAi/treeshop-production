'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  views: string
  uploadDate: string
  category: string
  location: string
  acreage?: string
}

// Sample video data - replace with actual YouTube API data or CMS
const featuredVideos: Video[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: '5-Acre Forestry Mulching Transformation in Ocklawaha, FL',
    description: 'Watch this complete transformation of an overgrown 5-acre property in Ocklawaha, Florida. Using selective forestry mulching techniques to preserve mature oaks while clearing undergrowth.',
    thumbnail: '/treeshop/images/videos/ocklawaha-mulching.jpg',
    duration: '12:34',
    views: '2.1K',
    uploadDate: '2025-01-05',
    category: 'Forestry Mulching',
    location: 'Ocklawaha, FL',
    acreage: '5 acres'
  },
  {
    id: 'dQw4w9WgXcQ2',
    title: 'Heavy Brush Clearing for Solar Farm Development',
    description: 'Complete land clearing for a solar farm development project. See our heavy equipment tackle dense vegetation and prepare the site for solar panel installation.',
    thumbnail: '/treeshop/images/videos/solar-farm-clearing.jpg',
    duration: '8:45',
    views: '1.8K',
    uploadDate: '2025-01-03',
    category: 'Land Clearing',
    location: 'Clermont, FL',
    acreage: '15 acres'
  },
  {
    id: 'dQw4w9WgXcQ3',
    title: 'TreeAI in Action: Precision Land Clearing Technology',
    description: 'See our revolutionary TreeAI technology guide precision land clearing. This project demonstrates how AI analysis results in perfect execution.',
    thumbnail: '/treeshop/images/videos/treeai-technology.jpg',
    duration: '15:22',
    views: '3.2K',
    uploadDate: '2025-01-01',
    category: 'Technology',
    location: 'DeLand, FL',
    acreage: '8 acres'
  }
]

export default function FeaturedVideos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateVideoStructuredData = (video: Video) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.title,
      description: video.description,
      thumbnailUrl: `https://www.fltreeshop.com${video.thumbnail}`,
      uploadDate: video.uploadDate,
      duration: `PT${video.duration.replace(':', 'M')}S`,
      contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
      embedUrl: `https://www.youtube.com/embed/${video.id}`,
      publisher: {
        '@type': 'Organization',
        name: 'The Tree Shop',
        logo: {
          '@type': 'ImageObject',
          url: '/images/TreeShopLogo.png'
        }
      },
      author: {
        '@type': 'Organization',
        name: 'The Tree Shop'
      },
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: parseInt(video.views.replace('K', '')) * 1000
      }
    }
  }

  return (
    <div className="space-y-8">
      {featuredVideos.map((video, index) => (
        <div key={video.id}>
          {/* Structured Data for each video */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateVideoStructuredData(video))
            }}
          />
          
          <article className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              {/* Video Thumbnail */}
              <div className="relative">
                {selectedVideo === video.id ? (
                  // YouTube Embed
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  // Thumbnail with play button
                  <div 
                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                          <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-white text-sm">Click to Play</p>
                      </div>
                    </div>
                    
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/0 group-hover:bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <svg className="w-10 h-10 text-white/0 group-hover:text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Content */}
              <div className="space-y-4">
                {/* Video metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full">
                    {video.category}
                  </span>
                  <span>📍 {video.location}</span>
                  {video.acreage && <span>📏 {video.acreage}</span>}
                  <span>👀 {video.views} views</span>
                  <span>📅 {formatDate(video.uploadDate)}</span>
                </div>

                {/* Video title */}
                <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight hover:text-green-400 transition-colors">
                  <Link 
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {video.title}
                  </Link>
                </h3>

                {/* Video description */}
                <p className="text-gray-300 leading-relaxed">
                  {video.description}
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => handleVideoClick(video.id)}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Now
                  </button>
                  
                  <Link
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-gray-600 hover:border-green-500 hover:text-green-400 text-gray-300 font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    View on YouTube
                  </Link>

                  <Link
                    href="/estimate"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors"
                  >
                    Get Similar Results
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Video tags/keywords for SEO */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">#{video.category.toLowerCase().replace(' ', '-')}</span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">#{video.location.toLowerCase().replace(', ', '-').replace(' ', '-')}</span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">#florida-land-clearing</span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">#forestry-mulching</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      ))}

      {/* Load More / View All Button */}
      <div className="text-center pt-8">
        <Link
          href="https://www.youtube.com/@TheTreeShop/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          View All Videos on YouTube
        </Link>
      </div>
    </div>
  )
}