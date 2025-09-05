import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TreeShop Maps - Professional Site Planning App | GPS-Guided Field Execution',
  description: 'TreeShop Maps transforms your iPhone into a professional site planning tool with GPS measurement capabilities and field execution guidance for tree care professionals.',
  openGraph: {
    title: 'TreeShop Maps | Professional Site Planning App',
    description: 'GPS-guided site planning and field execution for tree care professionals.',
    type: 'website',
  },
}

export default function TreeShopMapsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="mb-4">
            <span className="px-4 py-2 bg-yellow-600 text-black rounded-full text-sm font-medium">
              In App Store Review
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            TreeShop <span className="text-green-400">Maps</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Turn your iPhone into a professional site planning tool. Create precise work zones, 
            measure accurately, and execute with GPS-guided precision.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Professional Planning</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">GPS-accurate measurements</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Visual site planning</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Service tier mapping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Client presentation tools</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-400 mb-4">Field Execution</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">GPS-guided work zones</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Real-time location tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Scope verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Progress documentation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Problem/Solution */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">The Problem</h2>
            <div className="space-y-4 text-gray-300">
              <p>Tree care professionals lose money on miscommunication. Hand-drawn sketches create scope disputes. Rough estimates lead to pricing conflicts. Crews work without clear boundaries.</p>
              <p>Traditional measurement tools are slow, imprecise, and create interpretation gaps between planning and execution.</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">The Solution</h2>
            <div className="space-y-4 text-gray-300">
              <p>TreeShop Maps eliminates these communication gaps with GPS-accurate planning and field execution guidance.</p>
              <p>Create professional visual plans that clients understand, then execute precisely what was planned using GPS technology built into your iPhone.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">How TreeShop Maps Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">1</div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Plan</h3>
              <p className="text-gray-300 text-sm">Create accurate site plans with GPS measurements and color-coded service zones</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">2</div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Present</h3>
              <p className="text-gray-300 text-sm">Show clients precise visual plans with exact measurements and clear scope definitions</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold">3</div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Execute</h3>
              <p className="text-gray-300 text-sm">Follow GPS guidance in the field to deliver exactly what was planned</p>
            </div>
          </div>
        </div>

        {/* Early Access */}
        <div className="text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Get Early Access</h3>
            <p className="text-gray-300 mb-6">
              TreeShop Maps is currently in App Store review. Contact TreeShop for early access information.
            </p>
            <Link 
              href="/estimate"
              className="treeai-green-button px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Contact TreeShop for Access
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}