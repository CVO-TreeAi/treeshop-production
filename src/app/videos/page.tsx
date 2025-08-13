import { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import FeaturedVideos from '@/components/FeaturedVideos'
import VideoGallery from '@/components/VideoGallery'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Tree Service Videos | Watch Florida Land Clearing & Forestry Mulching | The Tree Shop',
  description: 'Watch real forestry mulching and land clearing projects across Florida. See before/after transformations, equipment in action, and expert techniques from The Tree Shop professionals.',
  keywords: [
    'forestry mulching videos',
    'land clearing videos Florida',
    'tree service videos',
    'mulching equipment videos',
    'property transformation videos',
    'Florida forestry mulching',
    'land clearing before after',
    'tree removal videos',
    'brush clearing videos',
    'heavy equipment videos'
  ],
  openGraph: {
    title: 'Tree Service Videos - Watch Florida Land Clearing & Forestry Mulching',
    description: 'Watch real forestry mulching and land clearing projects across Florida. See equipment in action and amazing property transformations.',
    type: 'website',
    url: 'https://www.fltreeshop.com/videos',
    images: [
      {
        url: '/treeshop/images/video-gallery-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Tree Shop forestry mulching videos from Florida'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tree Service Videos - Watch Florida Land Clearing',
    description: 'Watch real forestry mulching and land clearing projects across Florida.',
    images: ['/treeshop/images/video-gallery-hero.jpg']
  },
  alternates: {
    canonical: 'https://www.fltreeshop.com/videos'
  }
}

// Structured data for VideoGallery
const videoGalleryStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGallery',
  name: 'Tree Shop Forestry Mulching Videos',
  description: 'Professional forestry mulching and land clearing videos from Florida projects',
  publisher: {
    '@type': 'Organization',
    name: 'The Tree Shop',
    url: 'https://www.fltreeshop.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.fltreeshop.com/images/TreeShopLogo.png'
    }
  },
  author: {
    '@type': 'Organization',
    name: 'The Tree Shop',
    url: 'https://www.fltreeshop.com'
  }
}

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoGalleryStructuredData)
        }}
      />
      
      <NavBar />
      
      {/* Hero Section */}
      <VideoHero />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Videos Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured <span className="text-green-500">Project Videos</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch our latest forestry mulching and land clearing projects. See the incredible transformations 
              and professional techniques that make The Tree Shop Florida's premier choice.
            </p>
          </div>
          <FeaturedVideos />
        </section>

        {/* Video Categories */}
        <section className="mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">
            Browse by <span className="text-green-500">Category</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/videos/forestry-mulching" 
              className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌲</div>
              <h3 className="text-xl font-semibold text-white mb-2">Forestry Mulching</h3>
              <p className="text-gray-400 text-sm">Watch selective clearing and mulching in action</p>
            </Link>
            
            <Link 
              href="/videos/land-clearing" 
              className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🚜</div>
              <h3 className="text-xl font-semibold text-white mb-2">Land Clearing</h3>
              <p className="text-gray-400 text-sm">Complete property transformations from start to finish</p>
            </Link>
            
            <Link 
              href="/videos/before-after" 
              className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</div>
              <h3 className="text-xl font-semibold text-white mb-2">Before & After</h3>
              <p className="text-gray-400 text-sm">Amazing property transformations that speak for themselves</p>
            </Link>
            
            <Link 
              href="/videos/equipment" 
              className="bg-gray-900 hover:bg-gray-800 rounded-lg p-6 text-center transition-colors group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Equipment Tours</h3>
              <p className="text-gray-400 text-sm">Get up close with our professional mulching equipment</p>
            </Link>
          </div>
        </section>

        {/* All Videos Gallery */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              All <span className="text-green-500">Videos</span>
            </h2>
            <Link 
              href="https://www.youtube.com/@TheTreeShop" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe on YouTube
            </Link>
          </div>
          <VideoGallery />
        </section>

        {/* YouTube Channel Info */}
        <section className="mb-16 bg-gray-900 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Follow Our <span className="text-red-500">YouTube Channel</span>
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Subscribe to The Tree Shop YouTube channel for weekly videos featuring Florida forestry mulching projects, 
              equipment tours, and property transformation time-lapses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="https://www.youtube.com/@TheTreeShop" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe to The Tree Shop
              </Link>
              <div className="text-gray-400">
                <span className="text-green-400 font-semibold">Latest Videos:</span> Weekly uploads featuring Florida projects
              </div>
            </div>
          </div>
        </section>

        {/* Local SEO Section */}
        <section className="mb-16">
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              See Your Florida Location Featured
            </h2>
            <p className="text-gray-300 text-center mb-6">
              We serve all of Florida and regularly feature projects from across the state. 
              Your property could be next!
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">Central Florida</div>
                <div className="text-sm">Orlando, DeLand, Sanford</div>
              </div>
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">North Florida</div>
                <div className="text-sm">Jacksonville, Gainesville</div>
              </div>
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">Southwest Florida</div>
                <div className="text-sm">Tampa, Clearwater, Sarasota</div>
              </div>
              <div className="text-gray-300">
                <div className="text-green-400 font-semibold">Southeast Florida</div>
                <div className="text-sm">Miami, Fort Lauderdale</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <CTASection 
        title="Ready to Transform Your Property?"
        subtitle="Get a free estimate and see how your land clearing project could be featured in our next video!"
      />
      
      <Footer />
    </div>
  )
}