'use client'

import { ProjectShowcase, type Project } from './ui'

const projects: Project[] = [
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
    <div id="projects">
      <ProjectShowcase 
        projects={projects}
        title="Real Project Results"
        subtitle="See the dramatic transformation our DBH packages deliver across different property types and vegetation densities."
      />
    </div>
  )
}