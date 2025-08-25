'use client'

import Image from 'next/image'

const projects = [
  {
    id: '1',
    location: 'Avon Park, FL',
    packageSize: 'Medium Package (6" DBH)',
    description: 'Complete land clearing for agricultural use. Dense vegetation removed while preserving topsoil.',
    beforeImage: '/project-images/avon-park-land-clearing-before-dense-vegetation.jpg',
    afterImage: '/project-images/avon-park-land-clearing-after-forestry-mulching.jpg',
    acreage: '5.2 acres',
    timeframe: '2 days'
  },
  {
    id: '2',
    location: 'Lehigh Acres, FL',
    packageSize: 'X-Large Package (10" DBH)',
    description: 'Comprehensive land preparation for residential development. Cleared overgrown vegetation while maintaining shade trees.',
    beforeImage: '/project-images/lehigh-acres-land-clearing-before-thick-undergrowth.jpg',
    afterImage: '/project-images/lehigh-acres-land-clearing-after-professional-mulching.jpg',
    acreage: '4.1 acres',
    timeframe: '2 days'
  },
  {
    id: '3',
    location: 'Okeechobee, FL',
    packageSize: 'Large Package (8" DBH)',
    description: 'Pasture restoration and fence line clearing. Enhanced access while maintaining natural windbreaks.',
    beforeImage: '/project-images/okeechobee-land-clearing-before-dense-forest-undergrowth.jpg',
    afterImage: '/project-images/okeechobee-land-clearing-after-forestry-mulching-complete.jpg',
    acreage: '6.7 acres',
    timeframe: '3 days'
  }
]

export default function ProjectGallery() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Real Project <span className="text-green-400">Results</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          See the dramatic transformation our DBH packages deliver across different property types and vegetation densities.
        </p>
      </div>

      <div className="space-y-12">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8">
            {/* Before/After Images - Always Side by Side */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 mb-6">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-white text-center mb-2">Before</h3>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={project.beforeImage}
                    alt={`${project.location} - Before`}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-white text-center mb-2">After</h3>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={project.afterImage}
                    alt={`${project.location} - After`}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {project.location}
                </h4>
                <div className="mb-3">
                  <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    {project.packageSize}
                  </span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-green-400 font-semibold text-sm">Property Size</div>
                  <div className="text-white text-base">{project.acreage}</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold text-sm">Completion Time</div>
                  <div className="text-white text-base">{project.timeframe}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}