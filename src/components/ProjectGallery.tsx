'use client'

import { ProjectShowcase, type Project } from './ui'

const projects: Project[] = [
  {
    id: '1',
    location: 'Cocoa Beach, FL',
    packageSize: 'Large Package (8" DBH)',
    description: 'Selective tree preservation with complete understory clearing. Maintained mature trees while opening up residential lot for development.',
    beforeImage: '/treeshop/images/services/cocoa-beach-overgrown-vegetation-before.jpg',
    afterImage: '/treeshop/images/services/cocoa-beach-selective-land-clearing-complete.jpg',
    acreage: '2.5 acres',
    timeframe: '1 day'
  },
  {
    id: '2',
    location: 'Avon Park, FL',
    packageSize: 'Medium Package (6" DBH)',
    description: 'Complete land clearing for agricultural use. Removed dense vegetation while preserving topsoil integrity.',
    beforeImage: '/treeshop/images/projects/avon-park-land-clearing-before-dense-vegetation.jpg',
    afterImage: '/treeshop/images/projects/avon-park-land-clearing-after-forestry-mulching.jpg',
    acreage: '5.2 acres',
    timeframe: '2 days'
  },
  {
    id: '3',
    location: 'Citrus Springs, FL',
    packageSize: 'Small Package (4" DBH)',
    description: 'Selective understory clearing for trail development. Preserved canopy trees while creating accessible pathways.',
    beforeImage: '/treeshop/images/services/citrus-springs-land-clearing-before.jpg',
    afterImage: '/treeshop/images/services/citrus-springs-forestry-mulching-complete.jpg',
    acreage: '3.8 acres',
    timeframe: '1.5 days'
  },
  {
    id: '4',
    location: 'LeHigh Acres, FL',
    packageSize: 'X-Large Package (10" DBH)',
    description: 'Comprehensive land preparation for residential development. Cleared overgrown vegetation while maintaining desired shade trees.',
    beforeImage: '/treeshop/images/projects/lehigh-acres-land-clearing-before-thick-undergrowth.jpg',
    afterImage: '/treeshop/images/projects/lehigh-acres-land-clearing-after-professional-mulching.jpg',
    acreage: '4.1 acres',
    timeframe: '2 days'
  },
  {
    id: '5',
    location: 'Okeechobee, FL',
    packageSize: 'Large Package (8" DBH)',
    description: 'Pasture restoration and fence line clearing. Enhanced property access while maintaining natural windbreaks.',
    beforeImage: '/treeshop/images/projects/okeechobee-land-clearing-before-dense-forest-undergrowth.jpg',
    afterImage: '/treeshop/images/projects/okeechobee-land-clearing-after-forestry-mulching-complete.jpg',
    acreage: '6.7 acres',
    timeframe: '3 days'
  },
  {
    id: '6',
    location: 'Professional Forestry Mulching',
    packageSize: 'Equipment Showcase',
    description: 'Our state-of-the-art FECON forestry mulchers provide precise, eco-friendly clearing with professional results.',
    beforeImage: '/treeshop/images/equipment/cat-forestry-mulcher-professional-land-clearing.jpg',
    afterImage: '/treeshop/images/services/forestry-mulching-active-site-florida.jpg',
    acreage: 'Various sizes',
    timeframe: 'Efficient completion'
  },
  {
    id: '7',
    location: 'Land Clearing Services',
    packageSize: 'Heavy Equipment',
    description: 'Professional land clearing with excavators for larger projects requiring complete site preparation.',
    beforeImage: '/treeshop/images/equipment/tree-removal-excavator-professional-service.jpg',
    afterImage: '/treeshop/images/services/cleared-land-result-professional-mulching.jpg',
    acreage: 'Large projects',
    timeframe: 'Professional timeline'
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