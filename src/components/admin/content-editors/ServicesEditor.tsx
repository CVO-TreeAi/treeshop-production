'use client'

import { useState } from 'react'
import { ServicesContent, ServiceTile } from '@/types/cms'

interface ServicesEditorProps {
  content: ServicesContent
  onChange: (content: ServicesContent) => void
  validationErrors?: Record<string, string[]>
  previewMode?: boolean
}

export default function ServicesEditor({ 
  content, 
  onChange, 
  validationErrors = {}, 
  previewMode = false 
}: ServicesEditorProps) {
  const [editingService, setEditingService] = useState<string | null>(null)

  const updateSectionInfo = (field: keyof ServicesContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const addService = () => {
    const newService: ServiceTile = {
      id: Date.now().toString(),
      title: 'New Service',
      description: 'Enter service description here',
      href: '/services/new-service',
      order: content.services.length + 1,
      isActive: true
    }
    onChange({
      ...content,
      services: [...content.services, newService]
    })
    setEditingService(newService.id)
  }

  const updateService = (id: string, updates: Partial<ServiceTile>) => {
    const updatedServices = content.services.map(service =>
      service.id === id ? { ...service, ...updates } : service
    )
    onChange({ ...content, services: updatedServices })
  }

  const deleteService = (id: string) => {
    const updatedServices = content.services.filter(service => service.id !== id)
    onChange({ ...content, services: updatedServices })
  }

  const reorderService = (id: string, direction: 'up' | 'down') => {
    const services = [...content.services]
    const index = services.findIndex(s => s.id === id)
    
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= services.length) return
    
    // Swap positions
    [services[index], services[newIndex]] = [services[newIndex], services[index]]
    
    // Update order numbers
    services.forEach((service, idx) => {
      service.order = idx + 1
    })
    
    onChange({ ...content, services })
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Services Preview</h3>
        <div className="bg-gray-800 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{content.sectionTitle}</h2>
            {content.sectionSubtitle && (
              <p className="text-xl text-gray-300">{content.sectionSubtitle}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services
              .filter(service => service.isActive)
              .sort((a, b) => a.order - b.order)
              .map((service) => (
                <div key={service.id} className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors">
                  {service.imageUrl && (
                    <div className="aspect-video bg-gray-600">
                      <img 
                        src={service.imageUrl} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {service.iconUrl && (
                        <img src={service.iconUrl} alt="" className="w-8 h-8" />
                      )}
                      <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Services</h3>
        <button
          onClick={addService}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Service
        </button>
      </div>

      {/* Section Settings */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <h4 className="text-lg font-semibold text-white">Section Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
          <input
            type="text"
            value={content.sectionTitle}
            onChange={(e) => updateSectionInfo('sectionTitle', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="e.g., Our Professional Services"
          />
          {validationErrors.sectionTitle && (
            <p className="text-red-400 text-sm mt-1">{validationErrors.sectionTitle[0]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Section Subtitle (Optional)</label>
          <input
            type="text"
            value={content.sectionSubtitle || ''}
            onChange={(e) => updateSectionInfo('sectionSubtitle', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="Optional subtitle or description"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Services ({content.services.length})</h4>
        
        {content.services.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4">No services yet</p>
            <button
              onClick={addService}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {content.services
              .sort((a, b) => a.order - b.order)
              .map((service, index) => (
                <div
                  key={service.id}
                  className={`bg-gray-800 border rounded-lg transition-all ${
                    editingService === service.id 
                      ? 'border-green-500 ring-1 ring-green-500' 
                      : 'border-gray-700'
                  }`}
                >
                  {editingService === service.id ? (
                    // Edit Mode
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-white font-medium">Edit Service</h5>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingService(null)}
                            className="text-green-400 hover:text-green-300"
                          >
                            ✓ Done
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Service Title</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => updateService(service.id, { title: e.target.value })}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Service Page Link</label>
                          <input
                            type="text"
                            value={service.href}
                            onChange={(e) => updateService(service.id, { href: e.target.value })}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            placeholder="/services/service-name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, { description: e.target.value })}
                          rows={3}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Icon URL (Optional)</label>
                          <input
                            type="url"
                            value={service.iconUrl || ''}
                            onChange={(e) => updateService(service.id, { iconUrl: e.target.value })}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            placeholder="https://example.com/icon.png"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (Optional)</label>
                          <input
                            type="url"
                            value={service.imageUrl || ''}
                            onChange={(e) => updateService(service.id, { imageUrl: e.target.value })}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            placeholder="https://example.com/service-image.jpg"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={service.isActive}
                            onChange={(e) => updateService(service.id, { isActive: e.target.checked })}
                            className="mr-2"
                          />
                          <span className="text-gray-300">Active (visible on website)</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => reorderService(service.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => reorderService(service.id, 'down')}
                            disabled={index === content.services.length - 1}
                            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
                          >
                            ↓
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">#{service.order}</span>
                          {service.iconUrl && (
                            <img src={service.iconUrl} alt="" className="w-6 h-6" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{service.title}</h5>
                          <p className="text-gray-400 text-sm">{service.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-gray-500 text-xs">{service.href}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              service.isActive 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-gray-700 text-gray-400'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        {service.imageUrl && (
                          <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden">
                            <img 
                              src={service.imageUrl} 
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setEditingService(service.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}