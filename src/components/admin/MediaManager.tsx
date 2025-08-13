'use client'

import { useState, useEffect } from 'react'
import { mediaAgent, type MediaInventory } from '@/lib/media-agent'

interface MediaManagerProps {
  category?: string
  onMediaSelect?: (mediaFile: any) => void
  showUpload?: boolean
}

export default function MediaManager({ 
  category, 
  onMediaSelect, 
  showUpload = true 
}: MediaManagerProps) {
  const [inventory, setInventory] = useState<MediaInventory | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'all' | 'images' | 'videos' | 'missing'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetails, setShowDetails] = useState<string | null>(null)

  useEffect(() => {
    loadMediaInventory()
  }, [])

  const loadMediaInventory = async () => {
    try {
      setLoading(true)
      const inv = await mediaAgent.auditMedia()
      setInventory(inv)
    } catch (error) {
      console.error('Failed to load media inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFix = async () => {
    try {
      setLoading(true)
      await mediaAgent.fixMissingMedia()
      await loadMediaInventory()
      alert('Media issues fixed! Check your site.')
    } catch (error) {
      console.error('Quick fix failed:', error)
      alert('Quick fix failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleOptimizeAll = async () => {
    try {
      setLoading(true)
      const result = await mediaAgent.optimizeAllMedia()
      alert(`Optimization complete! ${result.optimized} files optimized, ${result.errors.length} errors.`)
      await loadMediaInventory()
    } catch (error) {
      console.error('Optimization failed:', error)
      alert('Optimization failed. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredMedia = () => {
    if (!inventory) return []
    
    let media = []
    
    switch (selectedTab) {
      case 'images':
        media = inventory.images
        break
      case 'videos':
        media = inventory.videos
        break
      case 'missing':
        return inventory.missing.map(path => ({ 
          id: path, 
          name: path.split('/').pop(), 
          path, 
          type: 'missing',
          publicPath: path
        }))
      default:
        media = [...inventory.images, ...inventory.videos, ...inventory.audio]
    }

    if (category) {
      media = media.filter(m => m.category === category)
    }

    if (searchTerm) {
      media = media.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return media
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-300">Loading media inventory...</span>
      </div>
    )
  }

  if (!inventory) {
    return (
      <div className="text-center p-12">
        <p className="text-red-400 mb-4">Failed to load media inventory</p>
        <button 
          onClick={loadMediaInventory}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  const filteredMedia = getFilteredMedia()

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Media Manager</h2>
        <div className="flex gap-3">
          <button
            onClick={handleQuickFix}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            🔧 Quick Fix
          </button>
          <button
            onClick={handleOptimizeAll}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            ⚡ Optimize All
          </button>
          <button
            onClick={loadMediaInventory}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold text-green-400">{inventory.totalFiles}</div>
          <div className="text-sm text-gray-400">Total Files</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold text-blue-400">{inventory.images.length}</div>
          <div className="text-sm text-gray-400">Images</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold text-purple-400">{inventory.videos.length}</div>
          <div className="text-sm text-gray-400">Videos</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold text-red-400">{inventory.missing.length}</div>
          <div className="text-sm text-gray-400">Missing</div>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <div className="text-2xl font-bold text-yellow-400">{formatFileSize(inventory.totalSize)}</div>
          <div className="text-sm text-gray-400">Total Size</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search media files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-64 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-green-500 outline-none"
        />
        
        <div className="flex rounded overflow-hidden border border-gray-700">
          {(['all', 'images', 'videos', 'missing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 capitalize ${
                selectedTab === tab 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((media, index) => (
          <div
            key={media.id || index}
            className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => {
              if (onMediaSelect && media.type !== 'missing') {
                onMediaSelect(media)
              } else {
                setShowDetails(showDetails === media.id ? null : media.id)
              }
            }}
          >
            <div className="aspect-square bg-gray-700 flex items-center justify-center">
              {media.type === 'missing' ? (
                <div className="text-center p-2">
                  <div className="text-red-400 text-2xl mb-2">❌</div>
                  <div className="text-xs text-red-300">Missing</div>
                </div>
              ) : media.type === 'image' ? (
                <img
                  src={media.publicPath}
                  alt={media.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMMTAgMTBMMTQgMTRMMjAgOCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K'
                  }}
                />
              ) : (
                <div className="text-center p-2">
                  <div className="text-blue-400 text-2xl mb-2">🎥</div>
                  <div className="text-xs text-gray-300">Video</div>
                </div>
              )}
            </div>
            
            <div className="p-2">
              <div className="text-sm text-white font-medium truncate">
                {media.name}
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{media.type}</span>
                {media.size && (
                  <span>{formatFileSize(media.size)}</span>
                )}
              </div>
              {media.category && (
                <div className="text-xs text-green-400 mt-1">
                  {media.category}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center p-12">
          <div className="text-6xl text-gray-600 mb-4">📁</div>
          <p className="text-gray-400">
            {searchTerm ? 'No media files match your search.' : 'No media files found.'}
          </p>
        </div>
      )}

      {/* Media Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Media Details</h3>
                <button
                  onClick={() => setShowDetails(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {(() => {
                const media = filteredMedia.find(m => m.id === showDetails)
                if (!media) return null
                
                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Name</label>
                      <div className="text-white">{media.name}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Path</label>
                      <div className="text-green-400 font-mono text-sm">{media.publicPath}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Type</label>
                      <div className="text-white capitalize">{media.type}</div>
                    </div>
                    {media.size && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Size</label>
                        <div className="text-white">{formatFileSize(media.size)}</div>
                      </div>
                    )}
                    {media.dimensions && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Dimensions</label>
                        <div className="text-white">{media.dimensions.width} × {media.dimensions.height}</div>
                      </div>
                    )}
                    {media.category && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <div className="text-white">{media.category}</div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}