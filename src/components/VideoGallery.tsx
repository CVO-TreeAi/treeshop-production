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
}

// Expanded video gallery - replace with actual YouTube API data
const allVideos: Video[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: '5-Acre Forestry Mulching in Ocklawaha, FL - Complete Transformation',
    description: 'Watch this complete transformation of an overgrown 5-acre property using selective forestry mulching.',
    thumbnail: '/treeshop/images/videos/ocklawaha-mulching.jpg',
    duration: '12:34',
    views: '2.1K',
    uploadDate: '2025-01-05',
    category: 'Forestry Mulching',
    location: 'Ocklawaha, FL',
    tags: ['forestry-mulching', 'ocklawaha', 'before-after', '5-acres']
  },
  {
    id: 'dQw4w9WgXcQ2',
    title: 'Solar Farm Land Clearing - 15 Acres in Clermont',
    description: 'Heavy brush clearing for solar farm development using professional mulching equipment.',
    thumbnail: '/treeshop/images/videos/solar-farm-clearing.jpg',
    duration: '8:45',
    views: '1.8K',
    uploadDate: '2025-01-03',
    category: 'Land Clearing',
    location: 'Clermont, FL',
    tags: ['land-clearing', 'solar-farm', 'clermont', 'commercial']
  },
  {
    id: 'dQw4w9WgXcQ3',
    title: 'TreeAI Technology Demo - Precision Land Clearing',
    description: 'See our revolutionary TreeAI technology guide precision land clearing operations.',
    thumbnail: '/treeshop/images/videos/treeai-technology.jpg',
    duration: '15:22',
    views: '3.2K',
    uploadDate: '2025-01-01',
    category: 'Technology',
    location: 'DeLand, FL',
    tags: ['treeai', 'technology', 'innovation', 'ai-powered']
  },
  {
    id: 'dQw4w9WgXcQ4',
    title: 'Residential Property Clearing - Tampa Bay Area',
    description: 'Complete residential lot preparation for new home construction in Tampa Bay.',
    thumbnail: '/treeshop/images/videos/residential-tampa.jpg',
    duration: '9:18',
    views: '1.2K',
    uploadDate: '2024-12-28',
    category: 'Residential',
    location: 'Tampa, FL',
    tags: ['residential', 'tampa', 'lot-preparation', 'construction']
  },
  {
    id: 'dQw4w9WgXcQ5',
    title: 'Equipment Tour: Our Forestry Mulching Fleet',
    description: 'Get an up-close look at our professional forestry mulching equipment and capabilities.',
    thumbnail: '/treeshop/images/videos/equipment-tour.jpg',
    duration: '6:42',
    views: '956',
    uploadDate: '2024-12-25',
    category: 'Equipment',
    location: 'DeLand, FL',
    tags: ['equipment', 'tour', 'mulching-fleet', 'professional']
  },
  {
    id: 'dQw4w9WgXcQ6',
    title: 'Hurricane Damage Cleanup - Post-Storm Recovery',
    description: 'Emergency tree removal and land clearing after hurricane damage in Central Florida.',
    thumbnail: '/treeshop/images/videos/hurricane-cleanup.jpg',
    duration: '11:55',
    views: '2.7K',
    uploadDate: '2024-12-20',
    category: 'Emergency',
    location: 'Sanford, FL',
    tags: ['hurricane', 'storm-damage', 'emergency', 'cleanup']
  },
  {
    id: 'dQw4w9WgXcQ7',
    title: 'Right-of-Way Clearing for Power Lines',
    description: 'Utility line clearing project maintaining safe distances from power infrastructure.',
    thumbnail: '/treeshop/images/videos/utility-clearing.jpg',
    duration: '7:33',
    views: '1.4K',
    uploadDate: '2024-12-18',
    category: 'Utility',
    location: 'Gainesville, FL',
    tags: ['utility', 'right-of-way', 'power-lines', 'safety']
  },
  {
    id: 'dQw4w9WgXcQ8',
    title: 'Wetland Edge Management - Environmental Compliance',
    description: 'Careful land clearing near wetland areas following environmental regulations.',
    thumbnail: '/treeshop/images/videos/wetland-management.jpg',
    duration: '10:07',
    views: '891',
    uploadDate: '2024-12-15',
    category: 'Environmental',
    location: 'Kissimmee, FL',
    tags: ['wetland', 'environmental', 'compliance', 'conservation']
  },
  {
    id: 'dQw4w9WgXcQ9',
    title: 'Time-Lapse: 3-Day Property Transformation',
    description: 'Watch 3 days of intensive land clearing condensed into an amazing time-lapse video.',
    thumbnail: '/treeshop/images/videos/timelapse-transformation.jpg',
    duration: '4:21',
    views: '4.1K',
    uploadDate: '2024-12-12',
    category: 'Time-lapse',
    location: 'Orlando, FL',
    tags: ['timelapse', 'transformation', 'before-after', 'orlando']
  }
]

const categories = ['All', 'Forestry Mulching', 'Land Clearing', 'Technology', 'Residential', 'Equipment', 'Emergency', 'Environmental', 'Time-lapse']

export default function VideoGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const filteredVideos = selectedCategory === 'All' 
    ? allVideos 
    : allVideos.filter(video => video.category === selectedCategory)

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

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-gray-400 text-sm">
        Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} 
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </div>

      {/* Video Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <article key={video.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
            {/* Video Thumbnail */}
            <div className="relative">
              {selectedVideo === video.id ? (
                // YouTube Embed
                <div className="aspect-video bg-black">
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
                  className="relative aspect-video bg-gray-800 cursor-pointer"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                        <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="text-white text-xs">Click to Play</p>
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-2 left-2 bg-green-600/90 text-black px-2 py-1 rounded text-xs font-medium">
                    {video.category}
                  </div>
                </div>
              )}
            </div>

            {/* Video Content */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <h3 className="font-bold text-white text-sm leading-tight group-hover:text-green-400 transition-colors line-clamp-2">
                <Link 
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {video.title}
                </Link>
              </h3>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>📍 {video.location}</span>
                <span>•</span>
                <span>{video.views} views</span>
                <span>•</span>
                <span>{formatDate(video.uploadDate)}</span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                {video.description}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleVideoClick(video.id)}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-black font-medium px-3 py-2 rounded text-sm transition-colors"
                >
                  Play
                </button>
                <Link
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-8 border border-gray-600 hover:border-green-500 hover:text-green-400 text-gray-300 rounded transition-colors"
                  title="View on YouTube"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {video.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* No results message */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No videos found</h3>
            <p className="text-gray-500">Try selecting a different category or check back soon for new content.</p>
          </div>
        </div>
      )}

      {/* YouTube Channel CTA */}
      <div className="text-center pt-8 border-t border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">Want to see more?</h3>
        <p className="text-gray-300 mb-6">
          Subscribe to our YouTube channel for weekly updates featuring new projects, 
          equipment tours, and behind-the-scenes content.
        </p>
        <Link
          href="https://www.youtube.com/@TheTreeShop?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Subscribe to The Tree Shop
        </Link>
      </div>
    </div>
  )
}