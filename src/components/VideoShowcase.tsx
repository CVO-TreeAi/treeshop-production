'use client'

import { useState } from 'react'

interface Video {
  id: string
  title: string
  description: string
  duration: string
  views: string
}

interface VideoShowcaseProps {
  title?: string
  subtitle?: string
  videos: Video[]
}

export default function VideoShowcase({ 
  title = "Watch Professional Forestry Mulching in Action",
  subtitle = "See real Florida forestry mulching projects showcasing our selective clearing techniques that preserve mature trees while removing unwanted vegetation.",
  videos 
}: VideoShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const closeModal = () => {
    setSelectedVideo(null)
  }

  return (
    <section className="mb-8 sm:mb-16">
      {/* Title Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Video Grid with Machine Background */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/treeshop/images/equipment/cat-mulcher-background.jpg')`
        }}
      >
        <div className="p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((video, index) => (
              <div
                key={video.id}
                className="bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-black/70 transition-all duration-300 cursor-pointer group border border-gray-700 hover:border-green-500"
                onClick={() => handleVideoClick(video.id)}
              >
                {/* Video Thumbnail Area */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors shadow-lg">
                      <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="text-green-400 text-sm font-medium">{video.views} views</div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="max-w-6xl w-full bg-gray-900 rounded-lg overflow-hidden">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0&modestbranding=1`}
                title="Video Player"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}