'use client'

import { useState } from 'react'
import { ProjectGalleryContent, ProjectGalleryItem } from '@/types/cms'

interface ProjectGalleryEditorProps {
  content: ProjectGalleryContent
  onChange: (content: ProjectGalleryContent) => void
  validationErrors: Record<string, string[]>
  previewMode: boolean
}

export default function ProjectGalleryEditor({
  content,
  onChange,
  validationErrors,
  previewMode
}: ProjectGalleryEditorProps) {
  const [editingProject, setEditingProject] = useState<ProjectGalleryItem | null>(null)

  if (previewMode) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Project Gallery Preview</h3>
        <div className="space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">{content.sectionTitle}</h2>
            {content.sectionSubtitle && (
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">{content.sectionSubtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.projects.filter(p => p.isActive).map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Image: {project.title}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                  {project.location && (
                    <p className="text-green-400 text-sm">📍 {project.location}</p>
                  )}
                  {project.equipment && (
                    <p className="text-blue-400 text-sm">🔧 {project.equipment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleAddProject = () => {
    const newProject: ProjectGalleryItem = {
      id: `project-${Date.now()}`,
      title: 'New Project',
      description: 'Project description',
      imageUrl: '/treeshop/images/placeholder.jpg',
      order: content.projects.length + 1,
      isActive: true
    }
    setEditingProject(newProject)
  }

  const handleSaveProject = (project: ProjectGalleryItem) => {
    const existingIndex = content.projects.findIndex(p => p.id === project.id)
    let updatedProjects
    
    if (existingIndex >= 0) {
      updatedProjects = [...content.projects]
      updatedProjects[existingIndex] = project
    } else {
      updatedProjects = [...content.projects, project]
    }

    onChange({
      ...content,
      projects: updatedProjects.sort((a, b) => a.order - b.order)
    })
    setEditingProject(null)
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      onChange({
        ...content,
        projects: content.projects.filter(p => p.id !== projectId)
      })
    }
  }

  const handleToggleActive = (projectId: string) => {
    onChange({
      ...content,
      projects: content.projects.map(p => 
        p.id === projectId ? { ...p, isActive: !p.isActive } : p
      )
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Project Gallery</h3>
      
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
              placeholder="e.g., Our Project Gallery"
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

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-white">Projects ({content.projects.length})</h4>
          <button
            onClick={handleAddProject}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            ➕ Add Project
          </button>
        </div>

        <div className="space-y-3">
          {content.projects.map((project) => (
            <div
              key={project.id}
              className={`bg-gray-800 rounded-lg p-4 border-l-4 ${
                project.isActive ? 'border-green-500' : 'border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="font-semibold text-white">{project.title}</h5>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                    {project.location && <span>📍 {project.location}</span>}
                    {project.equipment && <span>🔧 {project.equipment}</span>}
                    {project.projectSize && <span>📏 {project.projectSize}</span>}
                    <span>🔢 Order: {project.order}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(project.id)}
                    className={`px-3 py-1 text-sm rounded text-white ${
                      project.isActive ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {project.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {content.projects.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No projects added yet. Click "Add Project" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h4 className="text-xl font-bold text-white mb-4">
              {content.projects.find(p => p.id === editingProject.id) ? 'Edit Project' : 'Add New Project'}
            </h4>
            
            <ProjectEditForm
              project={editingProject}
              onChange={setEditingProject}
              onSave={handleSaveProject}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface ProjectEditFormProps {
  project: ProjectGalleryItem
  onChange: (project: ProjectGalleryItem) => void
  onSave: (project: ProjectGalleryItem) => void
  onCancel: () => void
}

function ProjectEditForm({ project, onChange, onSave, onCancel }: ProjectEditFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => onChange({ ...project, title: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., CAT 265 Forestry Mulcher"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
          <input
            type="text"
            value={project.imageUrl}
            onChange={(e) => onChange({ ...project, imageUrl: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="/treeshop/images/project-name.jpg"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          value={project.description}
          onChange={(e) => onChange({ ...project, description: e.target.value })}
          rows={3}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          placeholder="Describe the project or equipment shown"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <input
            type="text"
            value={project.location || ''}
            onChange={(e) => onChange({ ...project, location: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., Orlando, FL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Equipment</label>
          <input
            type="text"
            value={project.equipment || ''}
            onChange={(e) => onChange({ ...project, equipment: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., CAT 299D3 with Fecon BlackHawk"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Project Size</label>
          <input
            type="text"
            value={project.projectSize || ''}
            onChange={(e) => onChange({ ...project, projectSize: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., 4.5 acres"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <input
            type="text"
            value={project.category || ''}
            onChange={(e) => onChange({ ...project, category: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., Equipment, Project"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
          <input
            type="number"
            value={project.order}
            onChange={(e) => onChange({ ...project, order: parseInt(e.target.value) || 1 })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Completion Date</label>
          <input
            type="text"
            value={project.completionDate || ''}
            onChange={(e) => onChange({ ...project, completionDate: e.target.value })}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="e.g., 2024"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">SEO Alt Text</label>
        <input
          type="text"
          value={project.seoAltText || ''}
          onChange={(e) => onChange({ ...project, seoAltText: e.target.value })}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          placeholder="Descriptive alt text for accessibility and SEO"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={project.isActive}
            onChange={(e) => onChange({ ...project, isActive: e.target.checked })}
            className="rounded border-gray-700 bg-gray-800 text-green-600"
          />
          <span className="text-gray-300">Active (show in gallery)</span>
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
          onClick={() => onSave(project)}
          disabled={!project.title || !project.description || !project.imageUrl}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Project
        </button>
      </div>
    </div>
  )
}