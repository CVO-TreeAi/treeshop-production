'use client'

import { useState, useEffect } from 'react'
import { YouTubeVideo } from '@/lib/firestore/collections'
import Link from 'next/link'
import Image from 'next/image'

export default function VideoHighlightsDynamic() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    // Always show your videos directly (skip API for now)
    setVideos([
      {
        id: '1',
        youtubeId: 'ZoljG4dtPBw',
        title: 'Forestry Mulching Project #1',
        description: 'Professional forestry mulching and land clearing demonstration',
        duration: '8:45',
        views: '1.2K',
        category: 'forestry-mulching',
        location: 'Central Florida',
        acreage: '3.5 acres',
        packageSize: 'Large Package (8" DBH)',
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sortOrder: 0
      },
      {
        id: '2',
        youtubeId: '1nm_tXSwSvI',
        title: 'Forestry Mulching Project #2',
        description: 'Complete land transformation using selective DBH clearing',
        duration: '12:30',
        views: '2.3K',
        category: 'forestry-mulching',
        location: 'Central Florida',
        acreage: '5.2 acres',
        packageSize: 'Medium Package (6" DBH)',
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sortOrder: 1
      },
      {
        id: '3',
        youtubeId: 'AQjyRCERpQA',
        title: 'Forestry Mulching Project #3',
        description: 'Advanced forestry mulching techniques and equipment showcase',
        duration: '15:20',
        views: '3.1K',
        category: 'forestry-mulching',
        location: 'Central Florida',
        acreage: '8.7 acres',
        packageSize: 'X-Large Package (10" DBH)',
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        sortOrder: 2
      }
    ] as YouTubeVideo[])
    setLoading(false)
  }, [])

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading videos...</p>
          </div>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            See Our Work in <span className="text-green-500">Action</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">Videos coming soon!</p>
        </div>
      </section>
    )
  }

  return (
    <>
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
            {videos.map((video, index) => (
              <div key={video.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300 group">
                {/* YouTube Thumbnail */}
                <div className="relative">
                  <div 
                    className="relative aspect-video cursor-pointer overflow-hidden"
                    onClick={() => handleVideoClick(video.youtubeId)}
                  >
                    {/* YouTube Thumbnail Image */}
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                      {video.duration}
                    </div>
                    

                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                      {video.packageSize}
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
                      onClick={() => handleVideoClick(video.youtubeId)}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      ▶ Watch Now
                    </button>
                    <Link
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
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

          {/* YouTube Channel CTA */}
          <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Follow Our <span className="text-red-400">YouTube Channel</span>
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get weekly videos featuring Florida forestry mulching projects, 
              equipment tours, and property transformation time-lapses.
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
              Subscribe to Our Channel
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl mx-auto">
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Close video"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title="Video Player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            
            {/* Video Info */}
            {videos.find(v => v.youtubeId === selectedVideo) && (
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {videos.find(v => v.youtubeId === selectedVideo)?.title}
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  {videos.find(v => v.youtubeId === selectedVideo)?.description}
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
                  <span>📍 {videos.find(v => v.youtubeId === selectedVideo)?.location}</span>
                  <span>📏 {videos.find(v => v.youtubeId === selectedVideo)?.acreage}</span>
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full">
                    {videos.find(v => v.youtubeId === selectedVideo)?.packageSize}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}