'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  description: string
  duration: string
  views: string
  category: string
  location: string
  acreage: string
}

const highlightVideos: Video[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: '5-Acre Forestry Mulching Transformation',
    description: 'Watch this complete property transformation in Ocklawaha, FL',
    duration: '12:34',
    views: '2.1K',
    category: 'Forestry Mulching',
    location: 'Ocklawaha, FL',
    acreage: '5 acres'
  },
  {
    id: 'dQw4w9WgXcQ2',
    title: 'TreeAI Technology in Action',
    description: 'See our AI-powered precision land clearing technology',
    duration: '8:45',
    views: '3.2K',
    category: 'Technology',
    location: 'DeLand, FL',
    acreage: '8 acres'
  },
  {
    id: 'dQw4w9WgXcQ3',
    title: 'Amazing Time-lapse Transformation',
    description: '3-day project condensed into 4 minutes of amazing results',
    duration: '4:21',
    views: '4.1K',
    category: 'Before & After',
    location: 'Orlando, FL',
    acreage: '6 acres'
  }
]

export default function VideoHighlights() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            See Our Work in <span className="text-green-500">Action</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Watch real forestry mulching and land clearing projects across Florida. 
            See the professional techniques and amazing transformations that make us 
            the premier choice for property owners statewide.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {highlightVideos.map((video, index) => (
            <div key={video.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
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
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                          <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-white text-sm font-medium">Watch Project</p>
                      </div>
                    </div>
                    
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                      {video.duration}
                    </div>
                    
                    {/* Views badge */}
                    <div className="absolute top-3 right-3 bg-green-600/90 text-black px-2 py-1 rounded text-sm font-medium">
                      {video.views} views
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                    {video.category}
                  </span>
                  <span>📍 {video.location}</span>
                  <span>📏 {video.acreage}</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-green-400 transition-colors">
                  {video.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {video.description}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleVideoClick(video.id)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Watch Now
                  </button>
                  <Link
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-9 border border-gray-600 hover:border-red-500 hover:text-red-400 text-gray-300 rounded-lg transition-colors"
                    title="View on YouTube"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Channel Stats and CTA */}
        <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Stats */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Follow Our <span className="text-red-400">YouTube Channel</span>
              </h3>
              <p className="text-gray-300 mb-6">
                Get weekly videos featuring Florida forestry mulching projects, 
                equipment tours, and property transformation time-lapses.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">50+</div>
                  <div className="text-gray-400 text-sm">Videos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">1.2K</div>
                  <div className="text-gray-400 text-sm">Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">25K+</div>
                  <div className="text-gray-400 text-sm">Views</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center lg:text-right">
              <Link
                href="https://www.youtube.com/@TheTreeShop?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg mb-4"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe to Our Channel
              </Link>
              
              <div className="block">
                <Link
                  href="/videos"
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  View All Videos →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}