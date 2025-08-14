'use client';

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function VideoHighlightsDynamic() {
  const videos = useQuery(api.videos.getFeaturedVideos, { limit: 3 });

  if (!videos) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Project Videos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Featured Project Videos</h2>
          <p className="text-gray-400">Project videos coming soon...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Project Videos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
              <div className="aspect-video bg-gray-700 relative group cursor-pointer">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-white">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-400 text-sm">{video.description}</p>
                )}
                {video.duration && (
                  <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                    {video.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="/videos"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View All Videos
          </a>
        </div>
      </div>
    </section>
  );
}
