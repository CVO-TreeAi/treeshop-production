'use client'

import { useState, useEffect } from 'react'
import { ProjectMedia, DEFAULT_CATEGORIES } from '@/lib/firestore/collections'

interface ImageData {
  url: string
  alt: string
  caption?: string
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<ProjectMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectMedia | null>(null)
  const [formData, setFormData] = useState({
    location: '',
    packageSize: 'Medium Package (6" DBH)' as const,
    description: '',
    acreage: '',
    timeframe: '',
    featured: false,
    published: true,
    beforeImages: [{ url: '', alt: '', caption: '' }] as ImageData[],
    afterImages: [{ url: '', alt: '', caption: '' }] as ImageData[],
    equipmentUsed: '',
    challenges: '',
    results: '',
    clientTestimonial: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      id: editingProject?.id || '',
      beforeImages: formData.beforeImages.filter(img => img.url.trim() !== ''),
      afterImages: formData.afterImages.filter(img => img.url.trim() !== ''),
      additionalDetails: {
        equipmentUsed: formData.equipmentUsed ? formData.equipmentUsed.split(',').map(e => e.trim()) : [],
        challenges: formData.challenges || undefined,
        results: formData.results || undefined,
        clientTestimonial: formData.clientTestimonial || undefined
      },
      createdAt: editingProject?.createdAt || new Date(),
      updatedAt: new Date(),
      sortOrder: editingProject?.sortOrder || projects.length
    }

    try {
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects'
      const method = editingProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        await fetchProjects()
        resetForm()
        alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
      } else {
        alert('Error saving project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project')
    }
  }

  const handleEdit = (project: ProjectMedia) => {
    setEditingProject(project)
    setFormData({
      location: project.location,
      packageSize: project.packageSize,
      description: project.description,
      acreage: project.acreage,
      timeframe: project.timeframe,
      featured: project.featured,
      published: project.published,
      beforeImages: project.beforeImages.length > 0 ? project.beforeImages : [{ url: '', alt: '', caption: '' }],
      afterImages: project.afterImages.length > 0 ? project.afterImages : [{ url: '', alt: '', caption: '' }],
      equipmentUsed: project.additionalDetails?.equipmentUsed?.join(', ') || '',
      challenges: project.additionalDetails?.challenges || '',
      results: project.additionalDetails?.results || '',
      clientTestimonial: project.additionalDetails?.clientTestimonial || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchProjects()
        alert('Project deleted successfully!')
      } else {
        alert('Error deleting project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  const resetForm = () => {
    setFormData({
      location: '',
      packageSize: 'Medium Package (6" DBH)',
      description: '',
      acreage: '',
      timeframe: '',
      featured: false,
      published: true,
      beforeImages: [{ url: '', alt: '', caption: '' }],
      afterImages: [{ url: '', alt: '', caption: '' }],
      equipmentUsed: '',
      challenges: '',
      results: '',
      clientTestimonial: ''
    })
    setEditingProject(null)
    setShowForm(false)
  }

  const addImageField = (type: 'beforeImages' | 'afterImages') => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { url: '', alt: '', caption: '' }]
    })
  }

  const removeImageField = (type: 'beforeImages' | 'afterImages', index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    })
  }

  const updateImageField = (type: 'beforeImages' | 'afterImages', index: number, field: keyof ImageData, value: string) => {
    const newImages = [...formData[type]]
    newImages[index] = { ...newImages[index], [field]: value }
    setFormData({ ...formData, [type]: newImages })
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
        <h2 className="text-2xl font-bold text-white">Project Gallery ({projects.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="City, FL"
                  required
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
                  Timeframe
                </label>
                <input
                  type="text"
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="2 days"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                rows={3}
                placeholder="Describe the project and what was accomplished..."
                required
              />
            </div>

            {/* Before Images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-200">
                  Before Images *
                </label>
                <button
                  type="button"
                  onClick={() => addImageField('beforeImages')}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-3">
                {formData.beforeImages.map((image, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) => updateImageField('beforeImages', index, 'url', e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                          placeholder="Image URL"
                          required={index === 0}
                        />
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateImageField('beforeImages', index, 'alt', e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                          placeholder="Alt text (for accessibility)"
                        />
                        <input
                          type="text"
                          value={image.caption || ''}
                          onChange={(e) => updateImageField('beforeImages', index, 'caption', e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                          placeholder="Caption (optional)"
                        />
                      </div>
                      {image.url && (
                        <img
                          src={image.url}
                          alt="Preview"
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                      {formData.beforeImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField('beforeImages', index)}
                          className="text-red-400 hover:text-red-300 px-2 py-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* After Images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-200">
                  After Images *
                </label>
                <button
                  type="button"
                  onClick={() => addImageField('afterImages')}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  + Add Image
                </button>
              </div>
              <div className="space-y-3">
                {formData.afterImages.map((image, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) => updateImageField('afterImages', index, 'url', e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                          placeholder="Image URL"
                          required={index === 0}
                        />
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateImageField('afterImages', index, 'alt', e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                          placeholder="Alt text (for accessibility)"
                        />
                        <input
                          type="text"
                          value={image.caption || ''}
                          onChange={(e) => updateImageField('afterImages', index, 'caption', e.target.value)}
                          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                          placeholder="Caption (optional)"
                        />
                      </div>
                      {image.url && (
                        <img
                          src={image.url}
                          alt="Preview"
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                      {formData.afterImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField('afterImages', index)}
                          className="text-red-400 hover:text-red-300 px-2 py-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-white mb-4">Additional Details (Optional)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Equipment Used
                  </label>
                  <input
                    type="text"
                    value={formData.equipmentUsed}
                    onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Forestry mulcher, excavator, chipper (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Challenges
                  </label>
                  <textarea
                    value={formData.challenges}
                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    rows={2}
                    placeholder="Any challenges encountered during the project..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Results & Outcomes
                  </label>
                  <textarea
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    rows={2}
                    placeholder="Key results and benefits achieved..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Client Testimonial
                  </label>
                  <textarea
                    value={formData.clientTestimonial}
                    onChange={(e) => setFormData({ ...formData, clientTestimonial: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                    rows={3}
                    placeholder="Client feedback or testimonial..."
                  />
                </div>
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
                {editingProject ? 'Update Project' : 'Create Project'}
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

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏗️</div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400">Add your first project to get started!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="flex gap-2">
                  {project.beforeImages[0] && (
                    <img
                      src={project.beforeImages[0].url}
                      alt="Before"
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                  {project.afterImages[0] && (
                    <img
                      src={project.afterImages[0].url}
                      alt="After"
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {project.location}
                    </h3>
                    <div className="flex gap-2 ml-4">
                      {project.featured && (
                        <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}
                      {!project.published && (
                        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded">
                      {project.packageSize}
                    </span>
                    <span>📏 {project.acreage}</span>
                    <span>⏱️ {project.timeframe}</span>
                    <span>🖼️ {project.beforeImages.length + project.afterImages.length} images</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-green-400 hover:text-green-300 px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 text-sm"
                    >
                      Delete
                    </button>
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