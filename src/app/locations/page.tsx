import { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TreeAI Forestry Services - Florida Locations | Forestry Mulching & Land Clearing',
  description: 'Professional forestry mulching and land clearing services across Florida. Serving 50+ cities with AI-powered estimates, DBH selective clearing, and expert results.',
  alternates: {
    canonical: 'https://treeai.us/treeshop/locations'
  }
};

// Real Florida cities for SEO - organized by region
const regions = [
  {
    name: 'Central Florida',
    description: 'Metro Orlando and surrounding development areas',
    cities: [
      { name: 'Orlando', county: 'Orange County', slug: 'orlando' },
      { name: 'Winter Park', county: 'Orange County', slug: 'winter-park' },
      { name: 'Kissimmee', county: 'Osceola County', slug: 'kissimmee' },
      { name: 'Clermont', county: 'Lake County', slug: 'clermont' },
      { name: 'Apopka', county: 'Orange County', slug: 'apopka' },
      { name: 'Oviedo', county: 'Seminole County', slug: 'oviedo' },
      { name: 'Winter Garden', county: 'Orange County', slug: 'winter-garden' },
      { name: 'Sanford', county: 'Seminole County', slug: 'sanford' }
    ]
  },
  {
    name: 'North Central Florida',
    description: 'Horse country, rural properties, and agricultural land',
    cities: [
      { name: 'Ocala', county: 'Marion County', slug: 'ocala' },
      { name: 'Gainesville', county: 'Alachua County', slug: 'gainesville' },
      { name: 'Leesburg', county: 'Lake County', slug: 'leesburg' },
      { name: 'Mount Dora', county: 'Lake County', slug: 'mount-dora' },
      { name: 'Eustis', county: 'Lake County', slug: 'eustis' },
      { name: 'Tavares', county: 'Lake County', slug: 'tavares' },
      { name: 'The Villages', county: 'Sumter County', slug: 'the-villages' },
      { name: 'Brooksville', county: 'Hernando County', slug: 'brooksville' }
    ]
  },
  {
    name: 'East Coast Florida',
    description: 'Coastal properties and Space Coast development',
    cities: [
      { name: 'Melbourne', county: 'Brevard County', slug: 'melbourne' },
      { name: 'Titusville', county: 'Brevard County', slug: 'titusville' },
      { name: 'Cocoa Beach', county: 'Brevard County', slug: 'cocoa-beach' },
      { name: 'Palm Bay', county: 'Brevard County', slug: 'palm-bay' },
      { name: 'Daytona Beach', county: 'Volusia County', slug: 'daytona-beach' },
      { name: 'New Smyrna Beach', county: 'Volusia County', slug: 'new-smyrna-beach' },
      { name: 'DeLand', county: 'Volusia County', slug: 'deland' },
      { name: 'Port Orange', county: 'Volusia County', slug: 'port-orange' }
    ]
  },
  {
    name: 'West Central Florida',
    description: 'Tampa Bay area and Gulf Coast properties',
    cities: [
      { name: 'Tampa', county: 'Hillsborough County', slug: 'tampa' },
      { name: 'St. Petersburg', county: 'Pinellas County', slug: 'st-petersburg' },
      { name: 'Clearwater', county: 'Pinellas County', slug: 'clearwater' },
      { name: 'Lakeland', county: 'Polk County', slug: 'lakeland' },
      { name: 'Plant City', county: 'Hillsborough County', slug: 'plant-city' },
      { name: 'Brandon', county: 'Hillsborough County', slug: 'brandon' },
      { name: 'Valrico', county: 'Hillsborough County', slug: 'valrico' },
      { name: 'Wesley Chapel', county: 'Pasco County', slug: 'wesley-chapel' }
    ]
  }
];

export default function LocationsPage() {
  // Get total city count for display
  const totalCities = regions.reduce((sum, region) => sum + region.cities.length, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            TreeAI Forestry Services <span className="text-amber-500">Across Florida</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Professional forestry mulching and land clearing services in <strong>{totalCities}+ Florida cities</strong>. AI-powered estimates, DBH selective clearing, and expert results for your property.
          </p>
          <Link 
            href="/estimate" 
            className="bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg inline-block transition-colors touch-manipulation"
          >
            Get AI-Powered Estimate
          </Link>
        </div>

        {/* Service Coverage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{totalCities}+</div>
            <div className="text-sm text-gray-300">Cities Served</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">4</div>
            <div className="text-sm text-gray-300">Service Regions</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">AI</div>
            <div className="text-sm text-gray-300">Powered Estimates</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">DBH</div>
            <div className="text-sm text-gray-300">Selective Clearing</div>
          </div>
        </div>

        {/* Regions and Cities */}
        {regions.map((region, regionIndex) => (
          <section key={region.name} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">{region.name}</h2>
              <p className="text-gray-300 text-base sm:text-lg">{region.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {region.cities.map((city) => (
                <Link 
                  key={city.slug}
                  href={`/locations/${city.slug}`}
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-amber-500 rounded-lg p-4 transition-all duration-300 group"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors mb-1">
                    {city.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{city.county}</p>
                  <div className="text-xs text-amber-500 group-hover:text-amber-400">
                    Forestry Mulching • Land Clearing • Stump Grinding
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Services Offered */}
        <section className="mb-12 bg-gray-900 rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Services Available in All Locations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🌲</div>
              <h3 className="text-xl font-semibold text-amber-400 mb-2">Forestry Mulching</h3>
              <p className="text-gray-300 text-sm">AI-powered DBH selective clearing with 4", 6", 8" packages. Preserves desired trees, creates natural mulch ground cover.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚜</div>
              <h3 className="text-xl font-semibold text-amber-400 mb-2">Land Clearing</h3>
              <p className="text-gray-300 text-sm">Complete site preparation with grubbing and root raking. Solid, construction-ready ground for development projects.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🪵</div>
              <h3 className="text-xl font-semibold text-amber-400 mb-2">Stump Grinding</h3>
              <p className="text-gray-300 text-sm">Professional stump removal and grinding services. Clean finish for landscaping and property improvement projects.</p>
            </div>
          </div>
        </section>

        {/* Why Choose TreeAI */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Why Florida Property Owners Choose TreeAI</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-amber-400 mb-4">AI-Powered Precision</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Advanced acreage and density analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>DBH-based selective clearing packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Accurate project estimates and pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Optimized equipment and timeline planning</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-amber-400 mb-4">Florida Expertise</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Wetland and environmental compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Native species preservation strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Hurricane and storm damage experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Local permitting and regulatory knowledge</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-amber-600 rounded-lg p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 leading-tight">Ready to Get Started?</h2>
          <p className="text-black/80 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
            Get your AI-powered forestry estimate for any Florida location. Fast, accurate, and tailored to your property.
          </p>
          <Link 
            href="/estimate" 
            className="bg-black hover:bg-gray-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg inline-block transition-colors touch-manipulation"
          >
            Start Your Estimate Now
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}