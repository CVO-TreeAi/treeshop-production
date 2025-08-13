'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ProjectMedia } from '@/lib/firestore/collections'

export default function ProjectGalleryDynamic() {
  const [projects, setProjects] = useState<ProjectMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(0)
  const [viewMode, setViewMode] = useState<'before' | 'after' | 'split'>('split')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects?published=true&limit=5')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        // Fallback to hardcoded data if API fails
        setProjects([
          {
            id: '1',
            location: 'Cocoa Beach, FL',
            packageSize: 'Large Package (8" DBH)',
            description: 'Selective tree preservation with complete understory clearing. Maintained mature trees while opening up residential lot for development.',
            beforeImages: [{ url: '/treeshop/images/services/cocoa-beach-overgrown-vegetation-before.jpg', alt: 'Cocoa Beach before clearing' }],
            afterImages: [{ url: '/treeshop/images/services/cocoa-beach-selective-land-clearing-complete.jpg', alt: 'Cocoa Beach after clearing' }],
            acreage: '2.5 acres',
            timeframe: '1 day',
            featured: true,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 0
          },
          {
            id: '2',
            location: 'Avon Park, FL',
            packageSize: 'Medium Package (6" DBH)',
            description: 'Complete land clearing for agricultural use. Removed dense vegetation while preserving topsoil integrity.',
            beforeImages: [{ url: '/treeshop/images/projects/avon-park-land-clearing-before-dense-vegetation.jpg', alt: 'Avon Park before clearing' }],
            afterImages: [{ url: '/treeshop/images/projects/avon-park-land-clearing-after-forestry-mulching.jpg', alt: 'Avon Park after clearing' }],
            acreage: '5.2 acres',
            timeframe: '2 days',
            featured: true,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 1
          },
          {
            id: '3',
            location: 'Citrus Springs, FL',
            packageSize: 'Small Package (4" DBH)',
            description: 'Selective understory clearing for trail development. Preserved canopy trees while creating accessible pathways.',
            beforeImages: [{ url: '/treeshop/images/services/citrus-springs-land-clearing-before.jpg', alt: 'Citrus Springs before clearing' }],
            afterImages: [{ url: '/treeshop/images/services/citrus-springs-forestry-mulching-complete.jpg', alt: 'Citrus Springs after clearing' }],
            acreage: '3.8 acres',
            timeframe: '1.5 days',
            featured: true,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 2
          },
          {
            id: '4',
            location: 'LeHigh Acres, FL',
            packageSize: 'X-Large Package (10" DBH)',
            description: 'Comprehensive land preparation for residential development. Cleared overgrown vegetation while maintaining desired shade trees.',
            beforeImages: [{ url: '/treeshop/images/projects/lehigh-acres-land-clearing-before-thick-undergrowth.jpg', alt: 'LeHigh Acres before clearing' }],
            afterImages: [{ url: '/treeshop/images/projects/lehigh-acres-land-clearing-after-professional-mulching.jpg', alt: 'LeHigh Acres after clearing' }],
            acreage: '4.1 acres',
            timeframe: '2 days',
            featured: true,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 3
          },
          {
            id: '5',
            location: 'Okeechobee, FL',
            packageSize: 'Large Package (8" DBH)',
            description: 'Pasture restoration and fence line clearing. Enhanced property access while maintaining natural windbreaks.',
            beforeImages: [{ url: '/treeshop/images/projects/okeechobee-land-clearing-before-dense-forest-undergrowth.jpg', alt: 'Okeechobee before clearing' }],
            afterImages: [{ url: '/treeshop/images/projects/okeechobee-land-clearing-after-forestry-mulching-complete.jpg', alt: 'Okeechobee after clearing' }],
            acreage: '6.7 acres',
            timeframe: '3 days',
            featured: true,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 4
          }
        ] as ProjectMedia[])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading projects...</p>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Real Project <span className="text-green-500">Results</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Project gallery coming soon!
          </p>
        </div>
      </section>
    )
  }

  const currentProject = projects[selectedProject]

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Real Project <span className="text-green-500">Results</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
          See the dramatic transformation our DBH packages deliver across different property types and vegetation densities.
        </p>
      </div>

      {/* Project Selector */}
      <div className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(index)}
              className={`p-3 sm:p-4 rounded-lg text-left transition-all ${
                selectedProject === index
                  ? 'bg-green-600 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="font-semibold text-sm sm:text-base mb-1">{project.location}</div>
              <div className="text-xs opacity-90">{project.packageSize}</div>
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-gray-800 p-1 rounded-lg flex">
          {(['before', 'split', 'after'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors capitalize ${
                viewMode === mode
                  ? 'bg-green-600 text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {mode === 'split' ? 'Before/After' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Image Display */}
      <div className="mb-6 sm:mb-8">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white text-center">Before</h3>
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                {currentProject.beforeImages[0] && (
                  <Image
                    src={currentProject.beforeImages[0].url}
                    alt={currentProject.beforeImages[0].alt || `${currentProject.location} - Before`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white text-center">After</h3>
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                {currentProject.afterImages[0] && (
                  <Image
                    src={currentProject.afterImages[0].url}
                    alt={currentProject.afterImages[0].alt || `${currentProject.location} - After`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-white text-center capitalize">
              {viewMode} - {currentProject.location}
            </h3>
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden max-w-4xl mx-auto">
              {viewMode === 'before' && currentProject.beforeImages[0] && (
                <Image
                  src={currentProject.beforeImages[0].url}
                  alt={currentProject.beforeImages[0].alt || `${currentProject.location} - Before`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
              )}
              {viewMode === 'after' && currentProject.afterImages[0] && (
                <Image
                  src={currentProject.afterImages[0].url}
                  alt={currentProject.afterImages[0].alt || `${currentProject.location} - After`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              {currentProject.location}
            </h3>
            <div className="mb-4">
              <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                {currentProject.packageSize}
              </span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4">
              {currentProject.description}
            </p>
            
            {/* Additional Details */}
            {currentProject.additionalDetails && (
              <div className="space-y-3">
                {currentProject.additionalDetails.results && (
                  <div>
                    <h4 className="text-green-400 font-semibold mb-1">Results</h4>
                    <p className="text-gray-300 text-sm">{currentProject.additionalDetails.results}</p>
                  </div>
                )}
                {currentProject.additionalDetails.clientTestimonial && (
                  <div>
                    <h4 className="text-green-400 font-semibold mb-1">Client Feedback</h4>
                    <p className="text-gray-300 text-sm italic">"{currentProject.additionalDetails.clientTestimonial}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-green-400 font-semibold mb-1">Property Size</div>
              <div className="text-white text-lg">{currentProject.acreage}</div>
            </div>
            <div>
              <div className="text-green-400 font-semibold mb-1">Completion Time</div>
              <div className="text-white text-lg">{currentProject.timeframe}</div>
            </div>
            {currentProject.additionalDetails?.equipmentUsed && (
              <div>
                <div className="text-green-400 font-semibold mb-1">Equipment Used</div>
                <div className="text-white text-sm">
                  {currentProject.additionalDetails.equipmentUsed.join(', ')}
                </div>
              </div>
            )}
            <div className="pt-2">
              <button className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                Get Similar Estimate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}