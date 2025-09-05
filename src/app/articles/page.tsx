import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About TreeShop - Professional Land Clearing & Forestry Services | Florida',
  description: 'Learn about TreeShop, Florida\'s premier forestry mulching and land clearing company. Professional equipment, expert operators, serving Central Florida since 2016.',
  openGraph: {
    title: 'About TreeShop | Professional Land Clearing Services',
    description: 'Learn about TreeShop, Florida\'s premier forestry mulching and land clearing company.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            About <span className="text-green-400">TreeShop</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Florida's premier forestry mulching and land clearing company. Professional equipment, expert operators, serving Central Florida since 2016.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>TreeShop has been transforming Florida landscapes since 2016, specializing in eco-friendly forestry mulching and precision land clearing services.</p>
              <p>Using purpose-built Fecon equipment and TreeAI technology, we deliver professional results that preserve what matters while clearing what doesn't.</p>
              <p>Trusted by homeowners, developers, and land managers across Central Florida for our commitment to quality, efficiency, and environmental responsibility.</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
            <div className="space-y-4">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2">🌲 Forestry Mulching</h3>
                <p className="text-gray-300 text-sm">Selective vegetation management with fixed pricing packages</p>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2">🏞️ Land Clearing</h3>
                <p className="text-gray-300 text-sm">Complete site preparation with day rate agreements</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Land?</h3>
            <p className="text-gray-300 mb-6">Get a professional estimate tailored to your property's specific needs.</p>
            <a 
              href="/estimate"
              className="treeai-green-button px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Get Free Estimate
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}