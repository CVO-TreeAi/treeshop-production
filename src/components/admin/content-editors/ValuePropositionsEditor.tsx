'use client'

import { useState } from 'react'
import { ValuePropositionsContent, ValueProposition } from '@/types/cms'

interface ValuePropositionsEditorProps {
  content: ValuePropositionsContent
  onChange: (content: ValuePropositionsContent) => void
  validationErrors?: Record<string, string[]>
  previewMode?: boolean
}

export default function ValuePropositionsEditor({ 
  content, 
  onChange, 
  validationErrors = {}, 
  previewMode = false 
}: ValuePropositionsEditorProps) {
  const [editingProposition, setEditingProposition] = useState<string | null>(null)

  const updateSectionInfo = (field: keyof ValuePropositionsContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const addProposition = () => {
    const newProposition: ValueProposition = {
      id: Date.now().toString(),
      title: 'New Value Proposition',
      description: 'Enter description here',
      slug: 'new-value-prop',
      order: content.propositions.length + 1,
      isActive: true
    }
    onChange({
      ...content,
      propositions: [...content.propositions, newProposition]
    })
    setEditingProposition(newProposition.id)
  }

  const updateProposition = (id: string, updates: Partial<ValueProposition>) => {
    const updatedPropositions = content.propositions.map(prop =>
      prop.id === id ? { ...prop, ...updates } : prop
    )
    onChange({ ...content, propositions: updatedPropositions })
  }

  const deleteProposition = (id: string) => {
    const updatedPropositions = content.propositions.filter(prop => prop.id !== id)
    onChange({ ...content, propositions: updatedPropositions })
  }

  const reorderProposition = (id: string, direction: 'up' | 'down') => {
    const propositions = [...content.propositions]
    const index = propositions.findIndex(p => p.id === id)
    
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= propositions.length) return
    
    // Swap positions
    [propositions[index], propositions[newIndex]] = [propositions[newIndex], propositions[index]]
    
    // Update order numbers
    propositions.forEach((prop, idx) => {
      prop.order = idx + 1
    })
    
    onChange({ ...content, propositions })
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Value Propositions Preview</h3>
        <div className="bg-gray-800 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{content.sectionTitle}</h2>
            {content.sectionSubtitle && (
              <p className="text-xl text-gray-300">{content.sectionSubtitle}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.propositions
              .filter(prop => prop.isActive)
              .sort((a, b) => a.order - b.order)
              .map((prop) => (
                <div key={prop.id} className="bg-gray-700 p-6 rounded-lg text-center">
                  {prop.iconUrl && (
                    <div className="mb-4">
                      <img src={prop.iconUrl} alt={prop.title} className="w-12 h-12 mx-auto" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-3">{prop.title}</h3>
                  <p className="text-gray-300">{prop.description}</p>
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
        <h3 className="text-xl font-bold text-white">Value Propositions</h3>
        <button
          onClick={addProposition}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Proposition
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
            placeholder="e.g., Why Choose Our Services"
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

      {/* Value Propositions List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Value Propositions ({content.propositions.length})</h4>
        
        {content.propositions.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4">No value propositions yet</p>
            <button
              onClick={addProposition}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Proposition
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {content.propositions
              .sort((a, b) => a.order - b.order)
              .map((proposition, index) => (
                <div
                  key={proposition.id}
                  className={`bg-gray-800 border rounded-lg transition-all ${
                    editingProposition === proposition.id 
                      ? 'border-green-500 ring-1 ring-green-500' 
                      : 'border-gray-700'
                  }`}
                >
                  {editingProposition === proposition.id ? (
                    // Edit Mode
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-white font-medium">Edit Proposition</h5>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProposition(null)}
                            className="text-green-400 hover:text-green-300"
                          >
                            ✓ Done
                          </button>
                          <button
                            onClick={() => deleteProposition(proposition.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                          <input
                            type="text"
                            value={proposition.title}
                            onChange={(e) => updateProposition(proposition.id, { title: e.target.value })}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                          <input
                            type="text"
                            value={proposition.slug}
                            onChange={(e) => updateProposition(proposition.id, { slug: e.target.value })}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={proposition.description}
                          onChange={(e) => updateProposition(proposition.id, { description: e.target.value })}
                          rows={3}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Icon URL (Optional)</label>
                        <input
                          type="url"
                          value={proposition.iconUrl || ''}
                          onChange={(e) => updateProposition(proposition.id, { iconUrl: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          placeholder="https://example.com/icon.png"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={proposition.isActive}
                            onChange={(e) => updateProposition(proposition.id, { isActive: e.target.checked })}
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
                            onClick={() => reorderProposition(proposition.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => reorderProposition(proposition.id, 'down')}
                            disabled={index === content.propositions.length - 1}
                            className="text-gray-400 hover:text-gray-200 disabled:opacity-50"
                          >
                            ↓
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">#{proposition.order}</span>
                          {proposition.iconUrl && (
                            <img src={proposition.iconUrl} alt="" className="w-6 h-6" />
                          )}
                        </div>
                        
                        <div>
                          <h5 className="text-white font-medium">{proposition.title}</h5>
                          <p className="text-gray-400 text-sm">{proposition.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-gray-500 text-xs">/{proposition.slug}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              proposition.isActive 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-gray-700 text-gray-400'
                            }`}>
                              {proposition.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setEditingProposition(proposition.id)}
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