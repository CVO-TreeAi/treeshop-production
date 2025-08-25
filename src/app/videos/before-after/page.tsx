import { Metadata } from 'next'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import VideoHero from '@/components/VideoHero'
import CategoryVideoGallery from '@/components/CategoryVideoGallery'

export const metadata: Metadata = {
  title: 'Before & After Land Clearing Videos | Amazing Transformations | The Tree Shop',
  description: 'Watch incredible before and after property transformations across Florida. See dramatic land clearing results, time-lapse videos, and amazing property makeovers by The Tree Shop.',
  keywords: [
    'before after land clearing',
    'property transformation videos',
    'land clearing before after Florida',
    'forestry mulching results',
    'property makeover videos',
    'time lapse land clearing',
    'dramatic property transformation',
    'Florida property clearing results',
    'land clearing transformation',
    'property improvement videos'
  ],
  openGraph: {
    title: 'Before & After Land Clearing Videos - Amazing Florida Transformations',
    description: 'Watch incredible before and after property transformations across Florida. See dramatic results and time-lapse videos.',
    type: 'website',
    url: 'https://www.fltreeshop.com/videos/before-after',
    images: [
      {
        url: '/images/hero/forestry-mulching-before-after-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Before and after land clearing transformation videos Florida'
      }
    ]
  },
  alternates: {
    canonical: 'https://www.fltreeshop.com/videos/before-after'
  }
}

const beforeAfterStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'VideoGallery',
  name: 'Before & After Property Transformation Videos',
  description: 'Dramatic before and after videos showcasing property transformations through professional land clearing across Florida',
  about: [
    {
      '@type': 'Thing',
      name: 'Property Transformation',
      description: 'Complete property makeovers through professional land clearing and forestry mulching'
    },
    {
      '@type': 'Thing', 
      name: 'Before and After Results',
      description: 'Visual documentation of property improvements and land clearing outcomes'
    }
  ],
  publisher: {
    '@type': 'Organization',
    name: 'The Tree Shop',
    url: 'https://www.fltreeshop.com'
  }
}

export default function BeforeAfterVideosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(beforeAfterStructuredData)
        }}
      />
      
      <NavBar />
      
      {/* Hero Section */}
      <VideoHero 
        title="Incredible Before & After Transformations"
        subtitle="See the dramatic results of professional land clearing. Watch overgrown properties become beautiful, functional landscapes across Florida."
      />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/videos" className="hover:text-green-400">Videos</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Before & After</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Before & After <span className="text-green-500">Transformation Videos</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Witness the incredible transformations possible through professional land clearing and forestry mulching. 
            From overgrown jungle to beautiful usable space - see the dramatic before and after results that speak for themselves.
          </p>
        </div>

        {/* Transformation Benefits */}
        <section className="mb-16 bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What Makes Our <span className="text-green-500">Transformations</span> Special?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-white mb-2">Dramatic Results</h3>
              <p className="text-gray-300 text-sm">Complete transformations that showcase the full potential of your property</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-semibold text-white mb-2">Time-lapse Magic</h3>
              <p className="text-gray-300 text-sm">Watch days of work condensed into minutes of amazing progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-white mb-2">Professional Quality</h3>
              <p className="text-gray-300 text-sm">See the difference professional techniques make in final results</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-white mb-2">Inspiration</h3>
              <p className="text-gray-300 text-sm">Get ideas for your own property transformation project</p>
            </div>
          </div>
        </section>

        {/* Video Gallery */}
        <CategoryVideoGallery category="Before & After" />

        {/* Property Value Impact */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            The <span className="text-green-500">Property Value</span> Impact
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Increased Usable Space</h3>
              <p className="text-gray-300 mb-4">
                Transform overgrown, unusable areas into functional outdoor spaces perfect for recreation, 
                gardening, or future development.
              </p>
              <div className="text-green-400 font-semibold">Average increase: 200-300% more usable space</div>
            </div>
            
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Property Value Boost</h3>
              <p className="text-gray-300 mb-4">
                Professional land clearing can significantly increase property values by improving accessibility, 
                reducing fire risk, and enhancing overall appeal.
              </p>
              <div className="text-green-400 font-semibold">Typical value increase: 15-25%</div>
            </div>
            
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Enhanced Safety</h3>
              <p className="text-gray-300 mb-4">
                Remove fire hazards, eliminate hiding spots for pests, and create clear sight lines 
                that improve property security and safety.
              </p>
              <div className="text-green-400 font-semibold">Risk reduction: Up to 80% lower fire risk</div>
            </div>
          </div>
        </section>

        {/* Project Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Common <span className="text-green-500">Transformation</span> Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Overgrown Residential Lots',
                description: 'Transform jungle-like backyards into beautiful outdoor living spaces',
                icon: '🏡'
              },
              {
                title: 'Commercial Property Prep',
                description: 'Prepare land for development, construction, or business use',
                icon: '🏢'
              },
              {
                title: 'Agricultural Land Recovery',
                description: 'Reclaim farmland that has been overtaken by unwanted vegetation',
                icon: '🚜'
              },
              {
                title: 'Fire Prevention Clearing',
                description: 'Create defensible space around homes and structures',
                icon: '🔥'
              },
              {
                title: 'Access Road Creation',
                description: 'Clear paths for driveways, trails, and utility access',
                icon: '🛤️'
              },
              {
                title: 'View Restoration',
                description: 'Open up scenic views blocked by overgrown vegetation',
                icon: '🌅'
              }
            ].map((project, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6 text-center hover:bg-gray-800 transition-colors">
                <div className="text-4xl mb-4">{project.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* YouTube Channel CTA */}
        <section className="text-center">
          <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              See Your Property's <span className="text-green-400">Transformation Potential</span>
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Every property has incredible potential. Our before & after videos show what's possible 
              when you work with Florida's most professional land clearing team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate"
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                Get Your Transformation Quote
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="https://www.youtube.com/@TheTreeShop?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe for More Videos
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}