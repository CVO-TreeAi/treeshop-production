import { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import CategoryVideoGallery from '@/components/CategoryVideoGallery'

export const metadata: Metadata = {
  title: 'Forestry Mulching Videos | Watch Real Florida Projects | The Tree Shop',
  description: 'Watch real forestry mulching projects across Florida. See selective clearing techniques, equipment in action, and amazing before/after transformations from The Tree Shop professionals.',
  keywords: [
    'forestry mulching videos',
    'Florida forestry mulching',
    'selective land clearing videos',
    'mulching equipment videos',
    'tree mulching techniques',
    'selective clearing Florida',
    'forestry mulcher videos',
    'land clearing videos',
    'DBH clearing videos',
    'environmental land clearing'
  ],
  openGraph: {
    title: 'Forestry Mulching Videos - Watch Real Florida Projects',
    description: 'Watch professional forestry mulching projects across Florida. See selective clearing techniques and amazing transformations.',
    type: 'website',
    url: 'https://www.fltreeshop.com/videos/forestry-mulching',
    images: [
      {
        url: '/images/hero/land-clearing-equipment-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Forestry mulching videos from Florida projects'
      }
    ]
  },
  alternates: {
    canonical: 'https://www.fltreeshop.com/videos/forestry-mulching'
  }
}

const forestryMulchingStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGallery',
  name: 'Forestry Mulching Videos',
  description: 'Professional forestry mulching videos showcasing selective land clearing techniques across Florida',
  about: {
    '@type': 'Thing',
    name: 'Forestry Mulching',
    description: 'Selective land clearing technique that preserves desirable trees while removing undergrowth'
  },
  publisher: {
    '@type': 'Organization',
    name: 'The Tree Shop',
    url: 'https://www.fltreeshop.com',
    logo: {
      '@type': 'ImageObject',
      url: '/images/TreeShopLogo.png'
    }
  },
  locationCreated: {
    '@type': 'State',
    name: 'Florida',
    containsPlace: [
      { '@type': 'City', name: 'Orlando' },
      { '@type': 'City', name: 'Tampa' },
      { '@type': 'City', name: 'DeLand' },
      { '@type': 'City', name: 'Ocklawaha' }
    ]
  }
}

export default function ForestryMulchingVideosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(forestryMulchingStructuredData)
        }}
      />
      
      <NavBar />
      
      {/* Hero Section */}
      <VideoHero 
        title="Watch Forestry Mulching in Action"
        subtitle="See professional selective clearing techniques preserve mature trees while transforming overgrown properties across Florida."
      />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/videos" className="hover:text-green-400">Videos</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Forestry Mulching</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Forestry Mulching <span className="text-green-500">Video Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Watch our selective forestry mulching techniques in action across Florida. See how we preserve 
            mature trees while clearing undergrowth, creating beautiful, functional landscapes with minimal 
            environmental impact.
          </p>
        </div>

        {/* Forestry Mulching Benefits */}
        <section className="mb-16 bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Why Choose <span className="text-green-500">Forestry Mulching?</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🌳</div>
              <h3 className="font-semibold text-white mb-2">Selective Clearing</h3>
              <p className="text-gray-300 text-sm">Preserve mature, desirable trees while removing unwanted vegetation</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-semibold text-white mb-2">Eco-Friendly</h3>
              <p className="text-gray-300 text-sm">Natural mulch enriches soil and prevents erosion</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-white mb-2">Efficient Process</h3>
              <p className="text-gray-300 text-sm">Single-pass operation cuts, grinds, and spreads in one step</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-white mb-2">Cost-Effective</h3>
              <p className="text-gray-300 text-sm">No hauling, burning, or disposal fees required</p>
            </div>
          </div>
        </section>

        {/* Video Gallery */}
        <CategoryVideoGallery category="Forestry Mulching" />

        {/* Featured Techniques Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Forestry Mulching <span className="text-green-500">Techniques</span>
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">DBH Selective Clearing</h3>
              <p className="text-gray-300 mb-4">
                Watch how we use diameter-at-breast-height (DBH) measurements to selectively clear 
                vegetation while preserving mature canopy trees.
              </p>
              <Link 
                href="/services/forestry-mulching#dbh-packages" 
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Learn about DBH packages →
              </Link>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Wetland Edge Management</h3>
              <p className="text-gray-300 mb-4">
                See our careful approach to clearing near wetland areas, maintaining compliance 
                while achieving your land management goals.
              </p>
              <Link 
                href="/videos/environmental" 
                className="text-green-400 hover:text-green-300 font-medium"
              >
                View environmental videos →
              </Link>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Invasive Species Removal</h3>
              <p className="text-gray-300 mb-4">
                Watch targeted removal of invasive species like Brazilian Pepper and Melaleuca 
                while protecting native Florida ecosystems.
              </p>
              <Link 
                href="/estimate" 
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Get invasive removal quote →
              </Link>
            </div>
          </div>
        </section>

        {/* Florida Locations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Featured <span className="text-green-500">Florida Locations</span>
          </h2>
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-8">
            <p className="text-gray-300 text-center mb-6">
              Our forestry mulching videos feature projects from across Florida, showcasing different 
              terrain types, vegetation, and property sizes.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">Central Florida</div>
                <div className="text-sm">Ocklawaha, DeLand, Orlando, Sanford</div>
              </div>
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">Tampa Bay Area</div>
                <div className="text-sm">Tampa, Clearwater, St. Petersburg</div>
              </div>
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">North Florida</div>
                <div className="text-sm">Gainesville, Jacksonville, Palatka</div>
              </div>
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">Space Coast</div>
                <div className="text-sm">Melbourne, Titusville, Cocoa</div>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Channel Link */}
        <section className="text-center">
          <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Subscribe for More <span className="text-red-400">Forestry Mulching Videos</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Get notified when we upload new forestry mulching videos featuring Florida projects, 
              equipment tours, and professional techniques.
            </p>
            <Link
              href="https://www.youtube.com/@TheTreeShop?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe to The Tree Shop
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}