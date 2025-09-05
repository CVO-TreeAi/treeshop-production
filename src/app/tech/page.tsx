import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'TreeShop Technology Solutions - TreeAI Ecosystem | Professional Tree Care Software',
  description: 'Discover TreeShop\'s cutting-edge technology solutions: TreeAI, TreeShop Maps, and TreeShopOps. Professional software tools built specifically for the tree care industry.',
  openGraph: {
    title: 'TreeShop Technology Solutions | TreeAI Ecosystem',
    description: 'Professional tree care software solutions built by industry experts.',
    type: 'website',
  },
}

export default function TechPage() {
  const solutions = [
    {
      name: 'TreeShop Maps',
      status: 'In App Store Review',
      description: 'Professional site planning and GPS-guided execution for precise forestry mulching and land clearing.',
      features: ['GPS measurement tools', 'Visual site planning', 'Service tier mapping', 'Field execution guidance'],
      cta: 'Coming Soon',
      href: '/tech/treeshop-maps'
    },
    {
      name: 'TreeShopOps',
      status: 'In Development',
      description: 'Complete business operations platform connecting customer websites directly to field operations.',
      features: ['Live project updates', 'Sales automation', 'Customer communication', 'Business intelligence'],
      cta: 'Contact TreeShop',
      href: '#treeshopops'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            TreeShop <span className="text-green-400">Technology</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional software solutions built specifically for the tree care industry. 
            GPS-guided planning and complete business operations.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {solutions.map((solution) => (
            <div key={solution.name} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{solution.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  solution.status === 'Available on iOS' ? 'bg-green-600 text-black' :
                  solution.status === 'In App Store Review' ? 'bg-yellow-600 text-black' :
                  'bg-blue-600 text-white'
                }`}>
                  {solution.status}
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {solution.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {solution.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                href={solution.href}
                className={`block text-center font-semibold px-6 py-3 rounded-lg transition-colors ${
                  solution.status === 'Available on iOS' ? 'treeai-green-button' :
                  solution.status === 'In App Store Review' ? 'bg-yellow-600 hover:bg-yellow-700 text-black' :
                  'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {solution.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Technology Philosophy */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
            Built by Tree Care Professionals
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Industry Expertise</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our software is built by people who actually run tree care operations. Every feature addresses real problems we've encountered in the field. No theoretical solutions - just tools that work.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-3">Professional Focus</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We build for working professionals who need reliable tools that enhance their expertise. Technology that supports better decisions, clearer communication, and more efficient operations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Modernize Your Operations?</h3>
            <p className="text-gray-300 mb-6">
              Experience professional tree care technology built by industry experts.
            </p>
            <Link 
              href="/estimate"
              className="treeai-green-button px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              See TreeShop Technology in Action
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}