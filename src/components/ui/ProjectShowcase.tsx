'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface Project {
  id: string
  location: string
  packageSize: string
  description: string
  beforeImage: string
  afterImage: string
  acreage: string
  timeframe: string
  ctaText?: string
  onCtaClick?: () => void
}

export interface ProjectShowcaseProps {
  projects: Project[]
  title?: string
  subtitle?: string
  className?: string
  showCta?: boolean
  defaultProject?: number
}

export function ProjectShowcase({
  projects,
  title = 'Real Project Results',
  subtitle = 'See the dramatic transformation our services deliver across different property types and vegetation densities.',
  className = '',
  showCta = true,
  defaultProject = 0
}: ProjectShowcaseProps) {
  const [selectedProject, setSelectedProject] = useState(defaultProject)
  const [viewMode, setViewMode] = useState<'before' | 'after' | 'split'>('split')

  const currentProject = projects[selectedProject]

  if (!projects.length) {
    return null
  }

  return (
    <section className={`max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          {title.split(' ').map((word, index) => 
            word.toLowerCase() === 'results' || word.toLowerCase() === 'transformation' ? (
              <span key={index} className="text-green-500">{word}</span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Project Selector */}
      <div className="mb-6 sm:mb-8">
        <div className={`grid gap-3 sm:gap-4 ${
          projects.length === 1 ? 'grid-cols-1' :
          projects.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
          projects.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          projects.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
        }`}>
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
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={currentProject.beforeImage}
                  alt={`${currentProject.location} - Before`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-white text-center">After</h3>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={currentProject.afterImage}
                  alt={`${currentProject.location} - After`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-white text-center capitalize">
              {viewMode} - {currentProject.location}
            </h3>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden max-w-4xl mx-auto">
              <Image
                src={viewMode === 'before' ? currentProject.beforeImage : currentProject.afterImage}
                alt={`${currentProject.location} - ${viewMode}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>
          </div>
        )}
      </div>

      {/* Project Details Below Images */}
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
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {currentProject.description}
            </p>
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
            {showCta && (
              <div className="pt-2">
                <button 
                  className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                  onClick={currentProject.onCtaClick}
                >
                  {currentProject.ctaText || 'Get Similar Estimate'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}