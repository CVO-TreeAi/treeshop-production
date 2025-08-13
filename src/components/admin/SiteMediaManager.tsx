'use client'

import { useState, useEffect } from 'react'
import { SiteMedia } from '@/lib/firestore/collections'

const MEDIA_TYPES = [
  { value: 'hero-bg', label: 'Hero Background' },
  { value: 'service-tile', label: 'Service Tile' },
  { value: 'about-section', label: 'About Section' },
  { value: 'cta-bg', label: 'CTA Background' },
  { value: 'logo', label: 'Logo' },
  { value: 'icon', label: 'Icon' },
  { value: 'general', label: 'General' }
] as const

export default function SiteMediaManager() {
  const [media, setMedia] = useState<SiteMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMedia, setEditingMedia] = useState<SiteMedia | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [formData, setFormData] = useState({
    type: 'general' as const,
    url: '',
    alt: '',
    caption: '',
    title: '',
    description: '',
    category: '',
    featured: false,
    published: true
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        setMedia(data)
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const mediaData = {
      ...formData,
      id: editingMedia?.id || '',
      createdAt: editingMedia?.createdAt || new Date(),
      updatedAt: new Date(),
      dimensions: editingMedia?.dimensions,
      fileSize: editingMedia?.fileSize,
      mimeType: editingMedia?.mimeType || 'image/jpeg'
    }

    try {
      const url = editingMedia ? `/api/admin/media/${editingMedia.id}` : '/api/admin/media'
      const method = editingMedia ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaData)
      })

      if (response.ok) {
        await fetchMedia()
        resetForm()
        alert(editingMedia ? 'Media updated successfully!' : 'Media created successfully!')
      } else {
        alert('Error saving media')
      }
    } catch (error) {
      console.error('Error saving media:', error)
      alert('Error saving media')
    }
  }

  const handleEdit = (mediaItem: SiteMedia) => {
    setEditingMedia(mediaItem)
    setFormData({
      type: mediaItem.type,
      url: mediaItem.url,
      alt: mediaItem.alt,
      caption: mediaItem.caption || '',
      title: mediaItem.title,
      description: mediaItem.description || '',
      category: mediaItem.category || '',
      featured: mediaItem.featured,
      published: mediaItem.published
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchMedia()
        alert('Media deleted successfully!')
      } else {
        alert('Error deleting media')
      }
    } catch (error) {
      console.error('Error deleting media:', error)
      alert('Error deleting media')
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'general',
      url: '',
      alt: '',
      caption: '',
      title: '',
      description: '',
      category: '',
      featured: false,
      published: true
    })
    setEditingMedia(null)
    setShowForm(false)
  }

  const filteredMedia = selectedType === 'all' 
    ? media 
    : media.filter(item => item.type === selectedType)

  const getTypeLabel = (type: string) => {
    const mediaType = MEDIA_TYPES.find(t => t.value === type)
    return mediaType ? mediaType.label : type
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
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Site Media ({filteredMedia.length})</h2>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            {MEDIA_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Media'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingMedia ? 'Edit Media' : 'Add New Media'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Media Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                >
                  {MEDIA_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
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
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.url && (
                  <div className="mt-3">
                    <img 
                      src={formData.url}
                      alt="Preview"
                      className="max-w-xs max-h-40 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Alt Text *
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Descriptive text for accessibility"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Optional category grouping"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Optional caption"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  rows={3}
                  placeholder="Optional detailed description"
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
                {editingMedia ? 'Update' : 'Create'}
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

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No media items yet</h3>
            <p className="text-gray-400">Add your first media item to get started!</p>
          </div>
        ) : (
          filteredMedia.map((mediaItem) => (
            <div key={mediaItem.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-700 relative">
                <img
                  src={mediaItem.url}
                  alt={mediaItem.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {mediaItem.featured && (
                    <span className="bg-yellow-600/90 text-black px-2 py-1 rounded text-xs">
                      Featured
                    </span>
                  )}
                  {!mediaItem.published && (
                    <span className="bg-red-600/90 text-white px-2 py-1 rounded text-xs">
                      Draft
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {mediaItem.title}
                  </h3>
                </div>
                
                <div className="text-xs text-gray-400 mb-3">
                  <div className="px-2 py-1 bg-green-600/20 text-green-400 rounded inline-block">
                    {getTypeLabel(mediaItem.type)}
                  </div>
                  {mediaItem.category && (
                    <div className="mt-1">📂 {mediaItem.category}</div>
                  )}
                  {mediaItem.dimensions && (
                    <div className="mt-1">
                      📐 {mediaItem.dimensions.width}×{mediaItem.dimensions.height}
                    </div>
                  )}
                </div>

                {mediaItem.description && (
                  <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                    {mediaItem.description}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(mediaItem)}
                    className="text-green-400 hover:text-green-300 px-2 py-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mediaItem.id)}
                    className="text-red-400 hover:text-red-300 px-2 py-1 text-xs"
                  >
                    Delete
                  </button>
                  <a
                    href={mediaItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 px-2 py-1 text-xs"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}