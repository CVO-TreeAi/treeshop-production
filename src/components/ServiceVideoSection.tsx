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
}

interface ServiceVideoSectionProps {
  service: string
  videos: Video[]
  title?: string
  subtitle?: string
}

export default function ServiceVideoSection({ 
  service, 
  videos, 
  title,
  subtitle 
}: ServiceVideoSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const defaultTitle = `Watch ${service} in Action`
  const defaultSubtitle = `See real ${service.toLowerCase()} projects across Florida and learn about our professional techniques.`

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  return (
    <section className="mb-16 bg-gray-900/50 rounded-lg p-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          {title || defaultTitle}
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          {subtitle || defaultSubtitle}
        </p>
      </div>

      {/* Featured Video */}
      {videos.length > 0 && (
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            {selectedVideo === videos[0].id ? (
              // YouTube Embed
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${videos[0].id}?autoplay=1&rel=0&modestbranding=1`}
                  title={videos[0].title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              // Thumbnail with play button
              <div 
                className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handleVideoClick(videos[0].id)}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors">
                      <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{videos[0].title}</h3>
                    <p className="text-gray-300">{videos[0].description}</p>
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded text-sm font-medium">
                  {videos[0].duration}
                </div>
                
                {/* Views badge */}
                <div className="absolute top-4 right-4 bg-green-600/90 text-black px-3 py-2 rounded text-sm font-medium">
                  {videos[0].views} views
                </div>

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            )}

            {/* Video Info */}
            <div className="mt-6 text-center">
              <div className="flex justify-center items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full">
                  {videos[0].category}
                </span>
                <span>{videos[0].views} views</span>
                <span>{videos[0].duration}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleVideoClick(videos[0].id)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Now
                </button>
                
                <Link
                  href={`https://www.youtube.com/watch?v=${videos[0].id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-600 hover:border-red-500 hover:text-red-400 text-gray-300 font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  View on YouTube
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Videos Grid */}
      {videos.length > 1 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-6 text-center">More {service} Videos</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(1).map((video) => (
              <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group">
                <div 
                  className="relative aspect-video bg-gray-700 cursor-pointer"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500 transition-colors">
                        <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p className="text-white text-xs">Play Video</p>
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-white text-sm mb-2 leading-tight line-clamp-2 group-hover:text-green-400 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2">{video.views} views</p>
                  <p className="text-gray-300 text-xs line-clamp-2">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View More Videos CTA */}
      <div className="text-center mt-8">
        <Link
          href={`/videos/${service.toLowerCase().replace(' ', '-').replace('&', '')}`}
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium"
        >
          View All {service} Videos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}