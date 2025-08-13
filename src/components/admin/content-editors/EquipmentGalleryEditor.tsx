'use client'

import { useState } from 'react'
import { EquipmentGalleryContent, EquipmentGalleryItem } from '@/types/cms'

interface EquipmentGalleryEditorProps {
  content: EquipmentGalleryContent
  onChange: (content: EquipmentGalleryContent) => void
  validationErrors: Record<string, string[]>
  previewMode: boolean
}

export default function EquipmentGalleryEditor({
  content,
  onChange,
  validationErrors,
  previewMode
}: EquipmentGalleryEditorProps) {
  const [editingEquipment, setEditingEquipment] = useState<EquipmentGalleryItem | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Get unique categories from equipment
  const categories = ['all', ...new Set(content.equipment.map(e => e.category).filter(Boolean))]

  if (previewMode) {
    const filteredEquipment = content.equipment.filter(e => 
      e.isActive && (filterCategory === 'all' || e.category === filterCategory)
    )

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Equipment Gallery Preview</h3>
        <div className="space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">{content.sectionTitle}</h2>
            {content.sectionSubtitle && (
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">{content.sectionSubtitle}</p>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                    filterCategory === category
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {category === 'all' ? 'All Equipment' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Equipment */}
          {filteredEquipment.some(e => e.featured) && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Featured Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEquipment.filter(e => e.featured).map((equipment) => (
                  <div key={equipment.id} className="bg-gray-800 rounded-lg overflow-hidden border-2 border-yellow-500">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">Image: {equipment.title}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white">{equipment.title}</h4>
                        <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-medium">
                          FEATURED
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{equipment.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        {equipment.make && <span>🏭 {equipment.make}</span>}
                        {equipment.model && <span>🔧 {equipment.model}</span>}
                        {equipment.year && <span>📅 {equipment.year}</span>}
                        {equipment.category && <span>📂 {equipment.category}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.filter(e => !e.featured).map((equipment) => (
              <div key={equipment.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Image: {equipment.title}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white mb-2">{equipment.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{equipment.description}</p>
                  <div className="flex flex-wrap gap-1 text-xs text-gray-400">
                    {equipment.make && <span>🏭 {equipment.make}</span>}
                    {equipment.model && <span>🔧 {equipment.model}</span>}
                    {equipment.category && <span>📂 {equipment.category}</span>}
                  </div>
                  {equipment.tags && equipment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {equipment.tags.map((tag, index) => (
                        <span key={index} className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No equipment found for the selected category.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleAddEquipment = () => {
    const newEquipment: EquipmentGalleryItem = {
      id: `equipment-${Date.now()}`,
      title: 'New Equipment',
      description: 'Equipment description',
      imageUrl: '/treeshop/images/placeholder.jpg',
      featured: false,
      order: content.equipment.length + 1,
      isActive: true,
      tags: []
    }
    setEditingEquipment(newEquipment)
  }

  const handleSaveEquipment = (equipment: EquipmentGalleryItem) => {
    const existingIndex = content.equipment.findIndex(e => e.id === equipment.id)
    let updatedEquipment
    
    if (existingIndex >= 0) {
      updatedEquipment = [...content.equipment]
      updatedEquipment[existingIndex] = equipment
    } else {
      updatedEquipment = [...content.equipment, equipment]
    }

    onChange({
      ...content,
      equipment: updatedEquipment.sort((a, b) => a.order - b.order)
    })
    setEditingEquipment(null)
  }

  const handleDeleteEquipment = (equipmentId: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      onChange({
        ...content,
        equipment: content.equipment.filter(e => e.id !== equipmentId)
      })
    }
  }

  const handleToggleActive = (equipmentId: string) => {
    onChange({
      ...content,
      equipment: content.equipment.map(e => 
        e.id === equipmentId ? { ...e, isActive: !e.isActive } : e
      )
    })
  }

  const handleToggleFeatured = (equipmentId: string) => {
    onChange({
      ...content,
      equipment: content.equipment.map(e => 
        e.id === equipmentId ? { ...e, featured: !e.featured } : e
      )
    })
  }

  const filteredEquipment = content.equipment.filter(e => 
    filterCategory === 'all' || e.category === filterCategory
  )

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Equipment Gallery</h3>
      
      {/* Section Settings */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-white">Section Settings</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
            <input
              type="text"
              value={content.sectionTitle}
              onChange={(e) => onChange({ ...content, sectionTitle: e.target.value })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500"
              placeholder="e.g., Our Professional Equipment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Section Subtitle (Optional)</label>
            <textarea
              value={content.sectionSubtitle || ''}
              onChange={(e) => onChange({ ...content, sectionSubtitle: e.target.value })}
              rows={2}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500"
              placeholder="Optional subtitle or description"
            />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h4 className="font-semibold text-white">Equipment ({content.equipment.length})</h4>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="capitalize">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddEquipment}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ➕ Add Equipment
        </button>
      </div>

      {/* Equipment List */}
      <div className="space-y-3">
        {filteredEquipment.map((equipment) => (
          <div
            key={equipment.id}
            className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
              equipment.isActive ? 'border-green-500' : 'border-gray-600'
            } ${equipment.featured ? 'ring-2 ring-yellow-500' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h5 className="font-semibold text-white">{equipment.title}</h5>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      equipment.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {equipment.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {equipment.featured && (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500 text-black font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{equipment.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-2">
                  {equipment.make && <span>🏭 {equipment.make}</span>}
                  {equipment.model && <span>🔧 {equipment.model}</span>}
                  {equipment.year && <span>📅 {equipment.year}</span>}
                  {equipment.category && <span>📂 {equipment.category}</span>}
                  <span>🔢 Order: {equipment.order}</span>
                </div>
                {equipment.tags && equipment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {equipment.tags.map((tag, index) => (
                      <span key={index} className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingEquipment(equipment)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleFeatured(equipment.id)}
                  className={`px-3 py-1 text-sm rounded text-white ${
                    equipment.featured ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {equipment.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => handleToggleActive(equipment.id)}
                  className={`px-3 py-1 text-sm rounded text-white ${
                    equipment.isActive ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {equipment.isActive ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDeleteEquipment(equipment.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredEquipment.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>
              {filterCategory === 'all' 
                ? 'No equipment added yet. Click "Add Equipment" to get started.'
                : `No equipment found in the "${filterCategory}" category.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Equipment Edit Modal */}
      {editingEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-white mb-4">
              {content.equipment.find(e => e.id === editingEquipment.id) ? 'Edit Equipment' : 'Add New Equipment'}
            </h4>
            
            <EquipmentEditForm
              equipment={editingEquipment}
              onChange={setEditingEquipment}
              onSave={handleSaveEquipment}
              onCancel={() => setEditingEquipment(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface EquipmentEditFormProps {
  equipment: EquipmentGalleryItem
  onChange: (equipment: EquipmentGalleryItem) => void
  onSave: (equipment: EquipmentGalleryItem) => void
  onCancel: () => void
}

function EquipmentEditForm({ equipment, onChange, onSave, onCancel }: EquipmentEditFormProps) {
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    if (newTag.trim() && !equipment.tags?.includes(newTag.trim())) {
      onChange({
        ...equipment,
        tags: [...(equipment.tags || []), newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({
      ...equipment,
      tags: equipment.tags?.filter(tag => tag !== tagToRemove) || []
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Equipment Title *</label>
          <input
            type="text"
            value={equipment.title}
            onChange={(e) => onChange({ ...equipment, title: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., CAT 265 Forestry Mulcher"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
          <input
            type="text"
            value={equipment.imageUrl}
            onChange={(e) => onChange({ ...equipment, imageUrl: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="/treeshop/images/equipment-name.jpg"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          value={equipment.description}
          onChange={(e) => onChange({ ...equipment, description: e.target.value })}
          rows={3}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          placeholder="Describe the equipment and its capabilities"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Make</label>
          <input
            type="text"
            value={equipment.make || ''}
            onChange={(e) => onChange({ ...equipment, make: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., Caterpillar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
          <input
            type="text"
            value={equipment.model || ''}
            onChange={(e) => onChange({ ...equipment, model: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., 299D3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
          <input
            type="text"
            value={equipment.year || ''}
            onChange={(e) => onChange({ ...equipment, year: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., 2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <input
            type="text"
            value={equipment.category || ''}
            onChange={(e) => onChange({ ...equipment, category: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., Excavator, Mulcher"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Specifications</label>
        <textarea
          value={equipment.specifications || ''}
          onChange={(e) => onChange({ ...equipment, specifications: e.target.value })}
          rows={2}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          placeholder="Technical specifications, horsepower, weight, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
          <input
            type="number"
            value={equipment.order}
            onChange={(e) => onChange({ ...equipment, order: parseInt(e.target.value) || 1 })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">SEO Alt Text</label>
          <input
            type="text"
            value={equipment.seoAltText || ''}
            onChange={(e) => onChange({ ...equipment, seoAltText: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Descriptive alt text for accessibility and SEO"
          />
        </div>
      </div>

      {/* Tags Management */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="Add a tag (e.g., Forestry, Heavy Duty)"
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          {equipment.tags && equipment.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {equipment.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-green-600 text-white text-sm px-2 py-1 rounded"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-green-200 hover:text-white ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={equipment.isActive}
            onChange={(e) => onChange({ ...equipment, isActive: e.target.checked })}
            className="rounded border-gray-700 bg-gray-800 text-green-600"
          />
          <span className="text-gray-300">Active (show in gallery)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={equipment.featured}
            onChange={(e) => onChange({ ...equipment, featured: e.target.checked })}
            className="rounded border-gray-700 bg-gray-800 text-yellow-600"
          />
          <span className="text-gray-300">Featured (highlight prominently)</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(equipment)}
          disabled={!equipment.title || !equipment.description || !equipment.imageUrl}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Equipment
        </button>
      </div>
    </div>
  )
}