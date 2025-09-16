'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface EquipmentImage {
  id: string
  filename: string
  title: string
  description: string
  alt: string
  category: 'mulching' | 'logging' | 'clearing' | 'equipment'
  equipment: string
  location?: string
  projectSize?: string
  featured: boolean
  seoTags: string[]
}

export interface EquipmentGalleryProps {
  images: EquipmentImage[]
  title?: string
  subtitle?: string
  className?: string
  showCategories?: boolean
}

const defaultImages: EquipmentImage[] = [
  {
    id: 'cat-265-forestry-mulcher-fueling',
    filename: '/treeshop/images/projects/cat-265-forestry-mulcher-fueling.jpg',
    title: '2024 CAT 265 with Professional Forestry Mulcher',
    description: 'Fueling up our 2024 CAT 265 with its professional forestry mulcher for another productive day of land clearing.',
    alt: '2024 CAT 265 tracked loader with professional forestry mulcher attachment during fueling',
    category: 'equipment',
    equipment: 'CAT 265 with Forestry Mulcher',
    featured: true,
    seoTags: ['CAT 265', 'forestry mulcher', 'land clearing equipment', 'professional forestry']
  },
  {
    id: 'cat-299d3-blackhawk-4-5-acres',
    filename: '/treeshop/images/projects/cat-299d3-blackhawk-4-5-acres.jpg',
    title: '2022 CAT 299D3 After 4.5 Acre Project',
    description: 'Sun-baked 2022 CAT 299D3 with forestry mulcher after completing an 8-inch mulching project covering 4.5 acres of dense vegetation.',
    alt: '2022 CAT 299D3 compact track loader with professional mulcher after completing 4.5 acre land clearing project',
    category: 'mulching',
    equipment: 'CAT 299D3 with Forestry Mulcher',
    projectSize: '4.5 acres',
    location: 'Central Florida',
    featured: true,
    seoTags: ['CAT 299D3', 'forestry mulcher', 'land clearing', '4.5 acres', 'forestry mulching', 'Florida']
  },
  {
    id: 'cat-309-selective-logging',
    filename: '/treeshop/images/projects/cat-309-selective-logging.jpg',
    title: 'Caterpillar 309 Selective Tree Removal',
    description: 'Caterpillar 309 excavator carrying logs during selective tree removal project, demonstrating precise logging capabilities.',
    alt: 'Caterpillar 309 excavator carrying large logs during selective tree removal and logging operations',
    category: 'logging',
    equipment: 'Caterpillar 309 Excavator',
    location: 'Florida',
    featured: true,
    seoTags: ['Caterpillar 309', 'selective logging', 'tree removal', 'excavator', 'log transport', 'forestry services']
  },
  {
    id: 'cat-299d3-fusion-blackhawk-testing',
    filename: '/treeshop/images/projects/cat-299d3-fusion-blackhawk-testing.jpg',
    title: 'First CAT with Advanced Mulching System',
    description: 'Tree Shop Caterpillar 299D3 running the advanced mulching system - allegedly the first company to test this innovative attachment on a CAT machine. We were honored to be directly involved with testing and development of next generation software and equipment.',
    alt: 'Tree Shop CAT 299D3 with advanced mulcher attachment during R&D testing phase',
    category: 'equipment',
    equipment: 'CAT 299D3 with Advanced Mulching System',
    featured: true,
    seoTags: ['CAT 299D3', 'advanced mulching', 'R&D testing', 'Tree Shop', 'innovation', 'forestry technology']
  },
  {
    id: 'cat-299d3-fusion-side-view',
    filename: '/treeshop/images/projects/cat-299d3-fusion-side-view.jpg',
    title: 'CAT 299D3 with Advanced Mulching System',
    description: 'Side profile shot of CAT 299D3 equipped with the innovative advanced mulching attachment.',
    alt: 'Side view of CAT 299D3 compact track loader with advanced forestry mulcher attachment',
    category: 'equipment',
    equipment: 'CAT 299D3 with Advanced Mulching System',
    featured: false,
    seoTags: ['CAT 299D3', 'advanced mulching', 'forestry mulcher', 'equipment profile']
  },
  {
    id: 'fae-forestry-mulcher-fine-mulch',
    filename: '/treeshop/images/projects/fae-forestry-mulcher-fine-mulch.jpg',
    title: 'FAE Forestry Mulcher Premium Quality',
    description: 'FAE forestry mulcher producing beautifully fine, premium quality mulch for optimal ground coverage and soil enhancement.',
    alt: 'FAE forestry mulcher attachment producing fine quality mulch for professional land clearing',
    category: 'mulching',
    equipment: 'FAE Forestry Mulcher',
    featured: true,
    seoTags: ['FAE forestry mulcher', 'premium mulch', 'fine mulch quality', 'ground coverage', 'land clearing']
  },
  {
    id: 'land-clearing-burn-pile',
    filename: '/treeshop/images/projects/land-clearing-burn-pile.jpg',
    title: 'Professional Land Clearing Debris Burning',
    description: 'Controlled burn pile clearing land clearing debris as part of our comprehensive site preparation and cleanup services.',
    alt: 'Professional controlled burn pile for land clearing debris disposal with safety protocols',
    category: 'clearing',
    equipment: 'Controlled Burn',
    location: 'Florida',
    featured: false,
    seoTags: ['burn pile', 'land clearing', 'debris removal', 'site preparation', 'controlled burning', 'Florida']
  },
  {
    id: 'specialized-mulching-equipment',
    filename: '/treeshop/images/projects/specialized-mulching-equipment.jpg',
    title: 'Tree Shop Specialized Mulcher Operations',
    description: 'Tree Shop running the specialized mulching equipment for precision forestry operations.',
    alt: 'Tree Shop operating specialized forestry mulching equipment for precision land clearing',
    category: 'equipment',
    equipment: 'Specialized Mulcher',
    featured: true,
    seoTags: ['specialized mulcher', 'Tree Shop', 'specialized equipment', 'precision forestry', 'professional operations']
  }
]

export function EquipmentGallery({
  images = defaultImages,
  title = 'Professional Equipment in Action',
  subtitle = 'See our state-of-the-art forestry and land clearing equipment delivering exceptional results across Central Florida.',
  className = '',
  showCategories = true
}: EquipmentGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))]

  // Filter images by category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  // Get featured images for hero display
  const featuredImages = images.filter(img => img.featured)

  return (
    <section className={`max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          {title.split(' ').map((word, index) => 
            word.toLowerCase() === 'equipment' || word.toLowerCase() === 'action' ? (
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

      {/* Category Filters */}
      {showCategories && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-green-600 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All Equipment' : category}
            </button>
          ))}
        </div>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedImage(image.id)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image.filename}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {image.featured && (
                <div className="absolute top-3 right-3 bg-green-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                  FEATURED
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium capitalize">
                {image.category}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white mb-2 line-clamp-2">{image.title}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{image.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-400 font-medium">{image.equipment}</span>
                {image.projectSize && (
                  <span className="text-gray-500">{image.projectSize}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full bg-gray-900 rounded-lg overflow-hidden">
            {(() => {
              const image = images.find(img => img.id === selectedImage)!
              return (
                <>
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={image.filename}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="90vw"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm font-medium capitalize">
                        {image.category}
                      </span>
                      {image.featured && (
                        <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-sm font-medium">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{image.title}</h3>
                    <p className="text-gray-300 mb-4">{image.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Equipment:</span>
                        <span className="text-white ml-2">{image.equipment}</span>
                      </div>
                      {image.location && (
                        <div>
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white ml-2">{image.location}</span>
                        </div>
                      )}
                      {image.projectSize && (
                        <div>
                          <span className="text-gray-400">Project Size:</span>
                          <span className="text-white ml-2">{image.projectSize}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </section>
  )
}