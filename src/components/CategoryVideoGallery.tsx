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
  tags: string[]
  acreage?: string
}

// Video data organized by category
const videosByCategory: Record<string, Video[]> = {
  'Forestry Mulching': [
    {
      id: 'forestry1',
      title: '5-Acre Selective Forestry Mulching in Ocklawaha, FL',
      description: 'Watch selective DBH clearing preserve mature oaks while removing understory vegetation on this 5-acre Central Florida property.',
      thumbnail: '/treeshop/images/videos/ocklawaha-mulching.jpg',
      duration: '12:34',
      views: '2.1K',
      uploadDate: '2025-01-05',
      category: 'Forestry Mulching',
      location: 'Ocklawaha, FL',
      acreage: '5 acres',
      tags: ['forestry-mulching', 'selective-clearing', 'dbh', 'oak-preservation']
    },
    {
      id: 'forestry2',
      title: 'Wetland Edge Forestry Mulching - Environmental Compliance',
      description: 'Professional forestry mulching near wetland boundaries maintaining compliance while achieving land management goals.',
      thumbnail: '/treeshop/images/videos/wetland-forestry-mulching.jpg',
      duration: '9:47',
      views: '1.3K',
      uploadDate: '2024-12-28',
      category: 'Forestry Mulching',
      location: 'Kissimmee, FL',
      acreage: '3 acres',
      tags: ['wetland', 'environmental', 'compliance', 'selective']
    },
    {
      id: 'forestry3',
      title: 'Invasive Species Removal Through Forestry Mulching',
      description: 'Targeted removal of Brazilian Pepper and other invasive species while preserving native Florida vegetation.',
      thumbnail: '/treeshop/images/videos/invasive-removal.jpg',
      duration: '8:21',
      views: '967',
      uploadDate: '2024-12-15',
      category: 'Forestry Mulching',
      location: 'DeLand, FL',
      acreage: '2.5 acres',
      tags: ['invasive-species', 'brazilian-pepper', 'native-preservation']
    }
  ],
  'Land Clearing': [
    {
      id: 'clearing1',
      title: 'Complete Land Clearing for Solar Farm Development',
      description: 'Total site preparation for 15-acre solar farm installation requiring complete vegetation removal.',
      thumbnail: '/treeshop/images/videos/solar-farm-clearing.jpg',
      duration: '8:45',
      views: '1.8K',
      uploadDate: '2025-01-03',
      category: 'Land Clearing',
      location: 'Clermont, FL',
      acreage: '15 acres',
      tags: ['solar-farm', 'commercial', 'complete-clearing']
    },
    {
      id: 'clearing2',
      title: 'Residential Lot Preparation - New Home Construction',
      description: 'Complete lot clearing and preparation for new residential construction in Tampa Bay area.',
      thumbnail: '/treeshop/images/videos/residential-clearing.jpg',
      duration: '6:33',
      views: '1.1K',
      uploadDate: '2024-12-20',
      category: 'Land Clearing',
      location: 'Tampa, FL',
      acreage: '1 acre',
      tags: ['residential', 'construction', 'lot-prep']
    }
  ],
  'Before & After': [
    {
      id: 'beforeafter1',
      title: 'Amazing Property Transformation Time-Lapse',
      description: '3-day property transformation condensed into dramatic time-lapse showcasing complete land clearing results.',
      thumbnail: '/treeshop/images/videos/timelapse-transformation.jpg',
      duration: '4:21',
      views: '4.1K',
      uploadDate: '2024-12-12',
      category: 'Before & After',
      location: 'Orlando, FL',
      acreage: '8 acres',
      tags: ['timelapse', 'transformation', 'dramatic']
    },
    {
      id: 'beforeafter2',
      title: 'From Jungle to Paradise - Residential Property Makeover',
      description: 'Incredible before and after transformation of an overgrown residential property into a beautiful, usable landscape.',
      thumbnail: '/treeshop/images/videos/residential-transformation.jpg',
      duration: '7:18',
      views: '2.9K',
      uploadDate: '2024-11-30',
      category: 'Before & After',
      location: 'Sanford, FL',
      acreage: '2.5 acres',
      tags: ['residential', 'makeover', 'overgrown']
    }
  ],
  'Equipment': [
    {
      id: 'equipment1',
      title: 'Forestry Mulching Equipment Tour - Professional Fleet',
      description: 'Get an up-close look at our professional forestry mulching equipment including mulching heads, attachments, and capabilities.',
      thumbnail: '/treeshop/images/videos/equipment-tour.jpg',
      duration: '11:55',
      views: '1.7K',
      uploadDate: '2024-12-25',
      category: 'Equipment',
      location: 'DeLand, FL',
      tags: ['equipment', 'mulching-head', 'professional']
    },
    {
      id: 'equipment2',
      title: 'TreeAI Technology Demo - AI-Powered Land Clearing',
      description: 'See our revolutionary TreeAI technology in action, demonstrating precision analysis and optimized clearing patterns.',
      thumbnail: '/treeshop/images/videos/treeai-demo.jpg',
      duration: '13:42',
      views: '3.8K',
      uploadDate: '2025-01-01',
      category: 'Equipment',
      location: 'DeLand, FL',
      tags: ['treeai', 'technology', 'innovation', 'precision']
    }
  ]
}

interface CategoryVideoGalleryProps {
  category: string
  limit?: number
  showHeader?: boolean
}

export default function CategoryVideoGallery({ 
  category, 
  limit,
  showHeader = true 
}: CategoryVideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  
  const videos = videosByCategory[category] || []
  const displayVideos = limit ? videos.slice(0, limit) : videos

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
      locationCreated: {
        '@type': 'Place',
        name: video.location
      },
      about: {
        '@type': 'Thing',
        name: video.category
      }
    }
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Videos Coming Soon</h3>
          <p className="text-gray-500">We're working on adding more {category.toLowerCase()} videos. Check back soon!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {category} <span className="text-green-500">Videos</span>
          </h2>
          <p className="text-gray-300">
            {displayVideos.length} video{displayVideos.length !== 1 ? 's' : ''} available
          </p>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {displayVideos.map((video) => (
          <article key={video.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
            {/* Structured Data for each video */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateVideoStructuredData(video))
              }}
            />
            
            <div className="lg:flex gap-6 p-6">
              {/* Video Thumbnail */}
              <div className="lg:w-1/2 mb-4 lg:mb-0">
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
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-green-600/90 text-black px-3 py-1 rounded text-sm font-medium">
                      {video.category}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Content */}
              <div className="lg:w-1/2 space-y-3">
                {/* Video metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <span>📍 {video.location}</span>
                  {video.acreage && <span>📏 {video.acreage}</span>}
                  <span>👀 {video.views} views</span>
                  <span>📅 {formatDate(video.uploadDate)}</span>
                </div>

                {/* Video title */}
                <h3 className="text-lg lg:text-xl font-bold text-white leading-tight hover:text-green-400 transition-colors">
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
                <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                  {video.description}
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleVideoClick(video.id)}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
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
                    className="inline-flex items-center gap-2 border border-gray-600 hover:border-green-500 hover:text-green-400 text-gray-300 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </Link>

                  <Link
                    href="/estimate"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors text-sm"
                  >
                    Get Similar Results
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {video.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Show more button if limited */}
      {limit && videos.length > limit && (
        <div className="text-center pt-4">
          <Link
            href={`/videos/${category.toLowerCase().replace(' ', '-').replace('&', '')}`}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View All {category} Videos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}