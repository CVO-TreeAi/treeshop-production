'use client'

import { useState } from 'react'
import Link from 'next/link'

interface VideoHeroProps {
  title?: string
  subtitle?: string
  featuredVideoId?: string
}

export default function VideoHero({ 
  title = "Watch Florida's Premier Tree Service in Action",
  subtitle = "See real forestry mulching and land clearing projects. Before & after transformations that showcase professional results.",
  featuredVideoId = "dQw4w9WgXcQ" // Replace with actual Tree Shop video ID
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const handlePlayVideo = () => {
    setShowVideo(true)
    setIsPlaying(true)
  }

  return (
    <section className="relative bg-black py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              {subtitle}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">50+</div>
                <div className="text-gray-400 text-sm">Videos Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">1000+</div>
                <div className="text-gray-400 text-sm">Acres Cleared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-1">100%</div>
                <div className="text-gray-400 text-sm">Real Projects</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePlayVideo}
                className="inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Featured Video
              </button>
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-3 border border-green-500 hover:bg-green-500 hover:text-black text-green-400 font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Get Your Project Featured
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative">
            {!showVideo ? (
              // Video Thumbnail
              <div 
                className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer group"
                onClick={handlePlayVideo}
              >
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                      <svg className="w-10 h-10 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Watch Latest Project</p>
                    <p className="text-gray-400 text-sm">5-acre forestry mulching in Ocklawaha, FL</p>
                  </div>
                </div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              // YouTube Embed
              <div className="relative bg-black rounded-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${featuredVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    title="Tree Shop Featured Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Video badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🔴 LIVE PROJECT
              </span>
              <span className="bg-green-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                NEW VIDEO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}