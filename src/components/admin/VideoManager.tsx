'use client'

import { useState, useEffect } from 'react'
import { YouTubeVideo, DEFAULT_CATEGORIES } from '@/lib/firestore/collections'

export default function VideoManager() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null)
  const [formData, setFormData] = useState({
    youtubeId: '',
    title: '',
    description: '',
    category: 'forestry-mulching' as const,
    location: '',
    acreage: '',
    packageSize: 'Medium Package (6" DBH)' as const,
    duration: '',
    views: '',
    featured: false,
    published: true
  })

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const videoData = {
      ...formData,
      id: editingVideo?.id || '',
      createdAt: editingVideo?.createdAt || new Date(),
      updatedAt: new Date(),
      sortOrder: editingVideo?.sortOrder || videos.length
    }

    try {
      const url = editingVideo ? `/api/admin/videos/${editingVideo.id}` : '/api/admin/videos'
      const method = editingVideo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData)
      })

      if (response.ok) {
        await fetchVideos()
        resetForm()
        alert(editingVideo ? 'Video updated successfully!' : 'Video created successfully!')
      } else {
        alert('Error saving video')
      }
    } catch (error) {
      console.error('Error saving video:', error)
      alert('Error saving video')
    }
  }

  const handleEdit = (video: YouTubeVideo) => {
    setEditingVideo(video)
    setFormData({
      youtubeId: video.youtubeId,
      title: video.title,
      description: video.description,
      category: video.category,
      location: video.location,
      acreage: video.acreage,
      packageSize: video.packageSize,
      duration: video.duration,
      views: video.views,
      featured: video.featured,
      published: video.published
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchVideos()
        alert('Video deleted successfully!')
      } else {
        alert('Error deleting video')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Error deleting video')
    }
  }

  const resetForm = () => {
    setFormData({
      youtubeId: '',
      title: '',
      description: '',
      category: 'forestry-mulching',
      location: '',
      acreage: '',
      packageSize: 'Medium Package (6" DBH)',
      duration: '',
      views: '',
      featured: false,
      published: true
    })
    setEditingVideo(null)
    setShowForm(false)
  }

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : url
  }

  const handleYouTubeUrlChange = (value: string) => {
    const id = extractYouTubeId(value)
    setFormData({ ...formData, youtubeId: id })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">YouTube Videos ({videos.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Video'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  YouTube URL/ID *
                </label>
                <input
                  type="text"
                  value={formData.youtubeId}
                  onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="https://youtube.com/watch?v=... or video ID"
                  required
                />
                {formData.youtubeId && (
                  <div className="mt-2">
                    <img 
                      src={`https://img.youtube.com/vi/${formData.youtubeId}/mqdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-32 h-18 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                >
                  {DEFAULT_CATEGORIES.VIDEO.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="City, FL"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Acreage
                </label>
                <input
                  type="text"
                  value={formData.acreage}
                  onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="5 acres"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Package Size
                </label>
                <select
                  value={formData.packageSize}
                  onChange={(e) => setFormData({ ...formData, packageSize: e.target.value as any })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                >
                  {DEFAULT_CATEGORIES.PACKAGE_SIZES.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="12:34"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Views
                </label>
                <input
                  type="text"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="2.1K"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-200">Featured</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-200">Published</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {editingVideo ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
            <p className="text-gray-400">Add your first YouTube video to get started!</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex gap-4">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-32 h-18 object-cover rounded flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {video.title}
                    </h3>
                    <div className="flex gap-2 ml-4">
                      {video.featured && (
                        <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}
                      {!video.published && (
                        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded">
                      {video.category.replace('-', ' ')}
                    </span>
                    <span>📍 {video.location}</span>
                    <span>📏 {video.acreage}</span>
                    <span>⏱️ {video.duration}</span>
                    <span>👁️ {video.views}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="text-green-400 hover:text-green-300 px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 text-sm"
                    >
                      Delete
                    </button>
                    <a
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 px-3 py-1 text-sm"
                    >
                      View on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}