import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AutoScrollList from '@/components/AutoScrollList';
import ProjectGallery from '@/components/ProjectGallery';

export default function LandClearingPage(){
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 text-center">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Complete <span className="text-amber-500">Land Clearing</span> for Solid Ground
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            When you need <strong>bare earth ready for construction</strong>, we remove all organic material to create solid, compactable ground. Complete grubbing and root raking ensures your foundation starts right.
          </p>
          <div className="bg-gray-900 border border-amber-500 rounded-lg p-4 max-w-2xl mx-auto mb-6">
            <p className="text-amber-400 font-semibold mb-2">🚧 TreeAI Technology in Development</p>
            <p className="text-gray-300 text-sm">Our AI land clearing system is still training. Until then, we charge reliable day rates based on project scope and provide custom quotes after site assessment.</p>
          </div>
          <Link 
            href="/estimate" 
            className="bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg inline-block transition-colors touch-manipulation"
          >
            Get Custom Land Clearing Quote
          </Link>
        </div>


        {/* Pricing Section */}
        <section className="mb-8 sm:mb-16">
          <div className="bg-gradient-to-r from-amber-600/20 to-amber-400/10 border border-amber-600/30 rounded-lg p-6 sm:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Florida Land Clearing Investment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-amber-400 mb-4">Typical Florida Range</h3>
                <div className="text-3xl font-bold text-white mb-2">$15,000 - $30,000</div>
                <div className="text-amber-300 mb-4">per acre</div>
                <p className="text-gray-300 text-sm">Pricing varies significantly based on vegetation density, terrain complexity, environmental restrictions, and project specifications.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-400 mb-4">Our Approach</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Day-rate pricing for transparency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Custom quotes after site assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>No surprises - detailed scope upfront</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>Project-specific equipment selection</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/estimate" className="bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
                Get Your Project Quote
              </Link>
            </div>
          </div>
        </section>

        {/* What Makes Land Clearing Different */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Land Clearing: Complete Site Preparation</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-amber-400 mb-4">What Land Clearing Accomplishes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span><strong>Complete organic material removal</strong> - trees, stumps, roots, brush</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span><strong>Grubbing and root raking</strong> - eliminates subsurface obstacles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span><strong>Solid, compactable ground</strong> - ready for construction foundations</span>
                  </li>
                </ul>
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span><strong>Debris removal and disposal</strong> - clean site delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span><strong>Grade preparation</strong> - ready for compaction and building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✓</span>
                    <span><strong>Construction-ready site</strong> - zero organic interference</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm italic">
                "Land clearing creates a blank canvas - solid earth ready for whatever you're building. No roots, no stumps, no organic material to compromise your foundation."
              </p>
            </div>
          </div>
        </section>

        {/* Land Clearing Photo Gallery - Cool Pattern */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Land Clearing Projects Across Florida</h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
            From dense forest to construction-ready ground - see our comprehensive land clearing projects in action.
          </p>
          
          {/* Hexagonal Pattern Gallery */}
          <div className="relative max-w-5xl mx-auto">
            {/* First Row - 3 images */}
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-48 h-48 relative overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/land-clearing/cat-320-excavator-land-clearing-project.heic"
                  alt="CAT 320 excavator complete land clearing project Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-xs font-semibold">Site Preparation</p>
                </div>
              </div>
              <div className="w-48 h-48 relative overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/land-clearing/fecon-blackhawk-cat-299d3-8-inch-large.jpg"
                  alt="Heavy land clearing equipment removing vegetation Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-xs font-semibold">Heavy Clearing</p>
                </div>
              </div>
              <div className="w-48 h-48 relative overflow-hidden rounded-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/land-clearing/cat-309-diamond-mowers-excavator.jpg"
                  alt="Precision land clearing with Diamond Mowers Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-xs font-semibold">Precision Work</p>
                </div>
              </div>
            </div>
            
            {/* Second Row - 2 images offset */}
            <div className="flex justify-center gap-4 mb-4 px-24">
              <div className="w-56 h-56 relative overflow-hidden rounded-3xl transform hover:scale-105 transition-transform duration-300 border-2 border-amber-500">
                <img 
                  src="/treeshop/images/land-clearing/cat-265-skidsteer-grapple-avon-park.jpg"
                  alt="Land clearing equipment working day and night Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold">24/7 Operations</p>
                  <p className="text-xs">Professional Results</p>
                </div>
              </div>
              <div className="w-56 h-56 relative overflow-hidden rounded-3xl transform hover:scale-105 transition-transform duration-300 border-2 border-amber-500">
                <img 
                  src="/treeshop/images/land-clearing/land-clearing-debris-pile-orlando.heic"
                  alt="Complete debris removal land clearing Orlando Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold">Complete Cleanup</p>
                  <p className="text-xs">Debris Removal</p>
                </div>
              </div>
            </div>
            
            {/* Third Row - 4 smaller images */}
            <div className="flex justify-center gap-3">
              <div className="w-36 h-36 relative overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/land-clearing/next-gen-cat-320-orlando-residential.heic"
                  alt="Residential land clearing Orlando Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-semibold">Residential</p>
                </div>
              </div>
              <div className="w-36 h-36 relative overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/equipment/land-clearing-cat-320-central-florida.jpg"
                  alt="Commercial land clearing Central Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-semibold">Commercial</p>
                </div>
              </div>
              <div className="w-36 h-36 relative overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/equipment/land-clearing-cat-299d3-central-florida.jpg"
                  alt="Infrastructure land clearing project Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-semibold">Infrastructure</p>
                </div>
              </div>
              <div className="w-36 h-36 relative overflow-hidden rounded-lg transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/treeshop/images/equipment/land-clearing-central-florida.jpg"
                  alt="Agricultural land clearing Central Florida"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="text-xs font-semibold">Agricultural</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-amber-400 mb-3">Ready for Solid Ground?</h3>
              <p className="text-gray-300 mb-4 text-sm">Every project is unique. Let us assess your site and provide a custom land clearing solution.</p>
              <Link href="/estimate" className="bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
                Schedule Site Assessment
              </Link>
            </div>
          </div>
        </section>

        {/* Lead capture CTA */}
        <section className="mb-16">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Your Land, Our Expertise</h2>
            <p className="text-gray-300 mb-6">Get a comprehensive site assessment and precise land clearing proposal.</p>
            <Link href="/estimate" className="inline-block bg-amber-600 hover:bg-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors">Start Assessment</Link>
          </div>
        </section>

        {/* Auto-scrolling Benefits List */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Benefits of Professional Land Clearing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <AutoScrollList
                className="h-80"
                speed={28}
                items={[
                  'Complete Site Preparation – total vegetation and obstacle removal',
                  'Enhanced Property Value – creates buildable, developable land',
                  'Regulatory Compliance – meets local and state development standards',
                  'Storm and Flood Mitigation – reduces vegetation-related risks',
                  'Infrastructure Protection – creates safe zones around utilities',
                  'Emergency Response Ready – rapid clearing for critical projects',
                  'Erosion Control – professional grading prevents future issues',
                  'Environmental Impact Assessment – detailed pre-clearing surveys',
                  'Native Species Protection – selective clearing strategies',
                  'Wetland Buffer Management – precise clearing near sensitive areas',
                  'Construction Efficiency – faster project initiation',
                  'Permit Assistance – support through local regulatory processes',
                  'Safety Enhancement – remove hazardous vegetation and debris',
                  'Comprehensive Debris Removal – total site clearance',
                  'Pre-Construction Planning – accurate site evaluation',
                  'Equipment Diversity – machines for every terrain and project',
                  'Urban and Rural Project Support',
                  'Insurance and Liability Management',
                  'Cost-Effective Total Site Preparation',
                  'Rapid Turnaround Times'
                ]}
              />
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-gray-300 mb-4">This list auto-scrolls with our comprehensive land clearing benefits. Hover to pause.</p>
              <Link href="/estimate" className="inline-block bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors">Get Project Quote</Link>
            </div>
          </div>
        </section>

        {/* Before & After Project Transformations */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-center">Land Clearing Project Transformations</h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
            See dramatic before and after results from our comprehensive land clearing projects across Florida.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Orlando Wetland Project */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="relative">
                    <img 
                      src="/treeshop/images/land-clearing/fecon-blackhawk-cat-299d3-8-inch-large.jpg"
                      alt="Dense vegetation before land clearing project Florida"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">BEFORE</div>
                  </div>
                  <div className="relative">
                    <img 
                      src="/treeshop/images/land-clearing/cat-265-skidsteer-grapple-avon-park.jpg"
                      alt="Cleared and prepared land after professional land clearing Florida"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs rounded">AFTER</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-white mb-2 text-lg">Complete Site Preparation - Orlando, FL</h3>
                <p className="text-gray-400 text-sm mb-3">6.2 acres | Commercial development preparation with wetland buffer compliance</p>
                <p className="text-gray-300 text-sm">Total vegetation removal and site preparation for construction. Preserved required wetland buffers while maximizing developable area.</p>
              </div>
            </div>

            {/* Wetland Management Project */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="/treeshop/images/land-clearing/cat-309-diamond-mowers-excavator.jpg"
                  alt="Professional wetland land clearing project Orlando Florida"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="bg-amber-600 text-white px-2 py-1 text-xs rounded">WETLAND COMPLIANT</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-white mb-2 text-lg">Wetland Buffer Management</h3>
                <p className="text-gray-400 text-sm mb-3">3.8 acres | Environmental compliance clearing</p>
                <p className="text-gray-300 text-sm">Precision clearing around protected wetland areas. Selective removal maintains ecological integrity while creating usable development space.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Florida-Specific Considerations */}
        <section className="mb-8 sm:mb-16 bg-gray-900 rounded-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Florida Land Clearing Expertise</h2>
          <p className="text-center text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">Specialized techniques for Florida's unique environmental landscape</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="border border-gray-700 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-2">Wetland Compliance</h3>
              <p className="text-xs text-gray-300 leading-relaxed">Expert navigation of Florida's strict wetland preservation regulations</p>
            </div>
            <div className="border border-amber-600 rounded-lg p-6 text-center bg-amber-600/10">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Hurricane Prep</h3>
              <p className="text-xs text-gray-300">Emergency clearing and storm damage recovery services</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Native Species</h3>
              <p className="text-xs text-gray-300">Preservation strategies for Florida's unique ecological zones</p>
            </div>
            <div className="border border-violet-600 rounded-lg p-6 text-center bg-violet-600/10">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">Environmental Impact</h3>
              <p className="text-xs text-gray-300">Comprehensive environmental assessment and mitigation</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-white mb-2">Our Florida Land Clearing Commitment:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Full regulatory compliance</li>
              <li>• Minimal environmental disruption</li>
              <li>• Preservation of native ecosystems</li>
            </ul>
          </div>
        </section>

        {/* Project Gallery with Before/After Examples */}
        <ProjectGallery />

        {/* Top 10 Land Clearing Questions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Top 10 Land Clearing Questions in Florida</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">What is the difference between land clearing and forestry mulching?</h3>
              <p className="text-gray-300">Land clearing involves complete site preparation, removing all vegetation, roots, and obstacles. Forestry mulching focuses on vegetation management, leaving mulch on the ground. Land clearing provides a blank slate for construction, while mulching preserves ground cover.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">How much does land clearing cost in Florida?</h3>
              <p className="text-gray-300">Land clearing in Florida typically ranges from $15,000 to $30,000 per acre depending on project specifics like vegetation density, terrain complexity, environmental restrictions, and accessibility. TreeAI uses day-rate pricing while our AI system is in development, providing transparent custom quotes after site assessment.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">Do I need permits for land clearing in Florida?</h3>
              <p className="text-gray-300">Yes, most land clearing projects require permits. Regulations vary by county and project type. Permits are crucial for wetland protection, environmental conservation, and ensuring compliance with local building codes.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">What equipment is used for land clearing?</h3>
              <p className="text-gray-300">Professional land clearing uses excavators, bulldozers, brush cutters, stump grinders, and specialized attachments. High-capacity machines with 180+ HP ensure efficient and comprehensive site preparation.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">How long does land clearing take?</h3>
              <p className="text-gray-300">Project duration depends on site size and complexity. Typically, 1-5 acres can be cleared in 1-3 days. Factors like terrain, vegetation density, and environmental considerations impact timeline.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">What is grubbing in land clearing?</h3>
              <p className="text-gray-300">Grubbing is the process of removing root systems and underground obstacles. It involves excavating and removing stumps, roots, and other below-ground vegetation to prepare the site for construction.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">Can I clear land myself or do I need professionals?</h3>
              <p className="text-gray-300">While small projects might be DIY, professional land clearing is recommended for complex sites. Professionals ensure regulatory compliance, environmental protection, and efficient site preparation.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">What happens to the debris after land clearing?</h3>
              <p className="text-gray-300">Debris is completely removed from the site. We handle disposal, recycling, or repurposing of vegetation, stumps, and surface materials according to local regulations and environmental best practices.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">When is the best time for land clearing in Florida?</h3>
              <p className="text-gray-300">Late fall to early spring (November-March) is ideal. Cooler temperatures and lower humidity reduce environmental impact and make clearing more efficient. Avoid rainy seasons and wildlife breeding periods.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">What environmental considerations are there for land clearing?</h3>
              <p className="text-gray-300">We prioritize environmental protection by conducting pre-clearing surveys, preserving native species, minimizing ecosystem disruption, and ensuring compliance with Florida's strict environmental regulations.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-amber-600 rounded-lg p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4 leading-tight">Need Solid Ground for Construction?</h2>
          <p className="text-black/80 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">Complete land clearing with grubbing and root raking. Day-rate pricing, custom quotes, professional results.</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <div className="bg-black/10 rounded-lg p-4">
              <p className="text-black font-semibold text-sm">✓ Complete organic material removal</p>
            </div>
            <div className="bg-black/10 rounded-lg p-4">
              <p className="text-black font-semibold text-sm">✓ Construction-ready solid ground</p>
            </div>
          </div>
          <Link 
            href="/estimate" 
            className="bg-black hover:bg-gray-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg inline-block transition-colors touch-manipulation"
          >
            Get Your Land Clearing Quote
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}