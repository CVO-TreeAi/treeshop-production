import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AutoScrollList from '@/components/AutoScrollList';
import ProjectGallery from '@/components/ProjectGallery';

export default function ForestryMulchingPage(){
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Professional <span className="text-[var(--color-treeai-green)]">Forestry Mulching</span> Services
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Revolutionize land management with advanced forestry mulching — a sustainable, efficient solution that transforms overgrown landscapes while preserving environmental integrity. Our precision techniques protect soil health, prevent erosion, and restore land&apos;s natural potential.
          </p>
          <Link 
            href="/estimate" 
            className="bg-[var(--color-treeai-green)] hover:bg-[var(--color-treeai-green-light)] text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg inline-block transition-colors touch-manipulation"
          >
            Get Free Estimate
          </Link>
        </div>

        {/* Featured Video & Image Gallery Section */}
        <section className="mb-8 sm:mb-16">
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Watch Professional Forestry Mulching in Action
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See real Florida forestry mulching projects showcasing our selective clearing techniques that preserve mature trees while removing unwanted vegetation.
            </p>
          </div>

          {/* Featured Video */}
          <div className="bg-gray-900 rounded-lg overflow-hidden mb-8">
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/ZoljG4dtPBw?autoplay=0&mute=0&loop=0&rel=0&modestbranding=1&color=white"
                title="Professional Forestry Mulching Demonstration"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Featured: Professional Forestry Mulching Project
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Watch our team transform overgrown Central Florida property using selective DBH clearing techniques that preserve mature trees while removing unwanted vegetation.
              </p>
            </div>
          </div>

          {/* Before & After Transformation Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Before/After Project Showcase */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2">
                  <div className="relative">
                    <img 
                      src="/treeshop/images/forestry-mulching/before-after-residential-lot.jpg" 
                      alt="Dense overgrown vegetation before forestry mulching in Central Florida" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded">BEFORE</div>
                  </div>
                  <div className="relative">
                    <img 
                      src="/treeshop/images/forestry-mulching/cat-299d3-fecon-blackhawk-residential-orlando.jpg" 
                      alt="Cleared land with natural mulch after professional forestry mulching Florida" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[var(--color-treeai-green)] text-black px-2 py-1 text-xs rounded font-semibold">AFTER</div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">6&quot; DBH Project Transformation</h3>
                <p className="text-gray-400 text-sm">Central Florida residential lot - selective clearing preserving mature trees while removing dense undergrowth</p>
              </div>
            </div>

            {/* Equipment in Action */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="/treeshop/images/forestry-mulching/fm-orlando-299-fecon-blackhawk.jpg" 
                  alt="FECON Blackhawk forestry mulcher on CAT 299D3 in Central Florida" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 bg-[var(--color-treeshop-blue)] text-white px-2 py-1 text-xs rounded font-semibold">EQUIPMENT</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">FECON Blackhawk in Action</h3>
                <p className="text-gray-400 text-sm">Our CAT 299D3 with FECON Blackhawk attachment delivering precision forestry mulching across Florida</p>
              </div>
            </div>

            {/* Completed Project Results */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src="/treeshop/images/forestry-mulching/fecon-fusion-blackhawk-cat-skidsteer.jpg" 
                  alt="Completed forestry mulching project results Volusia County Florida" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">RESULTS</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2">15-Acre Project Complete</h3>
                <p className="text-gray-400 text-sm">Large-scale forestry mulching in Volusia County - transforming overgrown land into usable, fire-safe property</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Forestry Mulching */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Understanding Forestry Mulching: A Comprehensive Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Forestry mulching is a revolutionary land management technique that transforms landscape restoration. Unlike traditional clearing methods involving multiple machines, burning, or hauling debris, our advanced mulching approach uses specialized equipment with rotating drums and precision steel teeth to simultaneously cut, grind, and clear vegetation in a single, environmentally conscious pass.

The key differentiator is our commitment to ecological preservation: instead of creating waste, we convert vegetation into a protective mulch layer that actively enhances soil health, prevents erosion, and supports natural ecosystem regeneration.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-treeai-green)]">Ideal Applications:</h3>
                <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--color-treeai-green)] mt-0.5">✓</span>
                    <span>Overgrown property reclamation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-treeai-green)]">✓</span>
                    <span>Trail and road creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-treeai-green)]">✓</span>
                    <span>Acreage preparation for development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-treeai-green)]">✓</span>
                    <span>Firebreak establishment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--color-treeai-green)]">✓</span>
                    <span>Selective vegetation management</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[var(--color-treeai-green)] mb-4">Our Equipment</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white">High-Flow Skid Steers</h4>
                  <p className="text-sm">100+ HP machines with advanced hydraulic flow for maximum mulching head performance</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Professional Mulching Heads</h4>
                  <p className="text-sm">72&quot; cutting width, carbide teeth, handles trees up to 12&quot; diameter</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Track Machines</h4>
                  <p className="text-sm">Low ground pressure for minimal site disturbance, works in wet conditions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lead capture CTA to access simulator in pricing tool */}
        <section className="mb-16">
          <div className="bg-gray-900 rounded-lg p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">See It For Your Property</h2>
            <p className="text-gray-300 mb-6">Try the interactive DBH simulator inside our estimate tool and get your proposal.</p>
            <Link href="/estimate" className="inline-block bg-[var(--color-treeai-green)] hover:bg-[var(--color-treeai-green-light)] text-black font-semibold px-8 py-3 rounded-lg transition-colors">Open Estimate Tool</Link>
          </div>
        </section>

        {/* Auto-scrolling Benefits List */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Benefits of Forestry Mulching</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <AutoScrollList
                className="h-80"
                speed={28}
                items={[
                  'Environmental Friendliness – low-impact, no burning or hauling',
                  'Erosion Control – mulch layer reduces runoff and stabilizes soil',
                  'Soil Health – organic mulch enriches and moderates temperature',
                  'Wildfire Mitigation – reduces fuel load and creates firebreaks',
                  'Invasive Species Control – targets Brazilian pepper, melaleuca, etc.',
                  'Cost-Effective – single-machine efficiency and fewer return visits',
                  'Time Efficient – clear more acres per day with minimal mobilization',
                  'Minimal Soil Disturbance – preserves desired roots and structure',
                  'Aesthetic Improvement – natural, uniform finish boosts property value',
                  'Habitat Restoration – promotes native grasses and pollinators',
                  'Versatile Terrain – effective on slopes, sandy soils, and wet areas',
                  'Weed Suppression – mulch barrier blocks sunlight for unwanted growth',
                  'No Hauling/Burning – all material recycled on site as mulch',
                  'Wetland Support – controls invasives while preserving native flora',
                  'Low Noise – suitable for residential projects',
                  'Development Ready – leaves site clean, usable immediately',
                  'Reactive Fire Breaks – can cut lines during active events',
                  'Biodiversity – encourages native species to thrive',
                  'Reduced Equipment – one machine, lower disturbance',
                  'Long-Term Management – keeps regrowth in check over time',
                  'Ag & Hunting – trails, plots, and fence lines cleared cleanly',
                  'Minimal Cleanup – no debris piles or stump fields',
                  'Adaptable – ROW, pipelines, highways, seismic, and more',
                  'Natural Fertilization – mulch enriches without chemicals',
                  'Selective Preservation – keep specific trees and features',
                ]}
              />
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <p className="text-gray-300 mb-4">These benefits showcase forestry mulching&apos;s comprehensive advantages. Every land management challenge is unique, and our approach ensures optimal ecological and economic outcomes.</p>
              <Link href="/estimate" className="inline-block bg-[var(--color-treeai-green)] hover:bg-[var(--color-treeai-green-light)] text-black font-semibold px-6 py-3 rounded-lg transition-colors">Get My Estimate</Link>
            </div>
          </div>
        </section>

        {/* Equipment Gallery Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-center">Professional Forestry Mulching Equipment</h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto">
            Our fleet of specialized forestry mulching equipment ensures efficient, precise clearing for every project size and terrain type across Florida.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* CAT 299D3 with FECON Blackhawk */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src="/treeshop/images/forestry-mulching/fecon-fusion-blackhawk-cat-skidsteer.jpg"
                  alt="CAT 299D3 forestry mulcher aerial view Florida"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">CAT 299D3</h3>
                  <p className="text-xs opacity-90">FECON Blackhawk</p>
                </div>
              </div>
            </div>

            {/* CAT 265 Skid Steer */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src="/treeshop/images/forestry-mulching/fm-orlando-299-fecon-blackhawk.jpg"
                  alt="CAT 265 forestry mulcher with FECON attachment Florida"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">CAT 265</h3>
                  <p className="text-xs opacity-90">Next Gen Skid Steer</p>
                </div>
              </div>
            </div>

            {/* FECON Mulcher Closeup */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src="/treeshop/images/forestry-mulching/before-after-residential-lot.jpg"
                  alt="FECON BK7618 forestry mulcher closeup professional attachment"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">FECON BK7618</h3>
                  <p className="text-xs opacity-90">Mulching Head</p>
                </div>
              </div>
            </div>

            {/* Project in Action */}
            <div className="bg-gray-900 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src="/treeshop/images/forestry-mulching/cat-299d3-fecon-blackhawk-residential-orlando.jpg"
                  alt="CAT 299D3 forestry mulching project in action Central Florida"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">In Action</h3>
                  <p className="text-xs opacity-90">Central Florida</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/estimate" 
              className="bg-[var(--color-treeai-green)] hover:bg-[var(--color-treeai-green-light)] text-black font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
            >
              See Equipment on Your Property
            </Link>
          </div>
        </section>

        {/* Environmental Impact & Soil Health Section */}
        <section className="mb-16 bg-gray-900 rounded-lg p-6 sm:p-8 lg:p-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--color-treeai-green)]">Ecological Restoration: Beyond Land Clearing</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold text-[var(--color-treeai-green)] mb-4">Environmental Benefits</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--color-treeai-green)] text-xl">🌱</span>
                            <div>
                                <strong>Minimal Ecosystem Disruption</strong>
                                <p className="text-sm">Preserves existing root systems and native plant communities while removing invasive species.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--color-treeai-green)] text-xl">💧</span>
                            <div>
                                <strong>Erosion Prevention</strong>
                                <p className="text-sm">Creates a protective mulch layer that stabilizes soil, reduces runoff, and prevents landscape degradation.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--color-treeai-green)] text-xl">🌿</span>
                            <div>
                                <strong>Native Habitat Restoration</strong>
                                <p className="text-sm">Encourages growth of native grasses and supports local biodiversity by removing competitive invasive vegetation.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-[var(--color-treeai-green)] mb-4">Soil Health Advantages</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--color-treeai-green)] text-xl">🌞</span>
                            <div>
                                <strong>Natural Fertilization</strong>
                                <p className="text-sm">Mulched organic matter acts as a slow-release fertilizer, enriching soil without chemical additives.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--color-treeai-green)] text-xl">🌈</span>
                            <div>
                                <strong>Microbiome Enhancement</strong>
                                <p className="text-sm">Promotes healthy soil microbial communities by maintaining organic material and reducing mechanical disturbance.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-[var(--color-treeai-green)] text-xl">🌱</span>
                            <div>
                                <strong>Temperature Moderation</strong>
                                <p className="text-sm">Mulch layer helps regulate soil temperature, protecting root systems and supporting plant growth.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Specs Section (No Pricing) */}
        <section className="mb-8 sm:mb-16 bg-gray-900 rounded-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">DBH Package Specifications</h2>
             <p className="text-center text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">Choose exactly what gets cleared based on tree diameter (DBH)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="border border-gray-700 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-treeai-green)] mb-2">Small Package</h3>
              <div className="text-xs sm:text-sm font-semibold text-[var(--color-treeai-green)] mb-3">4&quot; DBH &amp; Under</div>
              <p className="text-xs text-gray-300 leading-relaxed">Light clearing — preserves trees larger than 4 inches diameter</p>
            </div>
            <div className="border border-[var(--color-treeshop-blue)] rounded-lg p-6 text-center bg-[var(--color-treeshop-blue)]/10">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-2">Medium Package</h3>
              <div className="text-sm font-semibold text-amber-500 mb-3">6&quot; DBH &amp; Under</div>
              <p className="text-xs text-gray-300">Moderate clearing — preserves trees larger than 6 inches diameter</p>
            </div>
            <div className="border border-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-2">Large Package</h3>
              <div className="text-sm font-semibold text-red-500 mb-3">8&quot; DBH &amp; Under</div>
              <p className="text-xs text-gray-300">Heavy clearing — preserves trees larger than 8 inches diameter</p>
            </div>
            <div className="border border-violet-600 rounded-lg p-6 text-center bg-violet-600/10">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-2">X-Large Package</h3>
              <div className="text-sm font-semibold text-violet-500 mb-3">10&quot; DBH &amp; Under</div>
              <p className="text-xs text-gray-300">Maximum clearing — preserves trees larger than 10 inches diameter</p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-white mb-2">What You Get:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Defined finish points — exact diameter specifications</li>
              <li>• All cleared material stays as natural mulch</li>
              <li>• Optional site review when required; final quote provided</li>
            </ul>
          </div>
        </section>

        {/* Project Gallery with Before/After Examples */}
        <ProjectGallery />

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-3">How much area can you clear per day?</h3>
              <p className="text-gray-300">We mulch about 1–5 acres per day depending on vegetation density and your DBH package selection. Light underbrush clears fastest; thicker growth and larger-tree preservation take longer.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-3">What size trees can you mulch?</h3>
              <p className="text-gray-300">Our largest package is 10&quot; DBH &amp; Under. That means all vegetation up to 10 inches diameter at breast height is mulched; larger trees are preserved unless specifically addressed.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-3">Do you remove the mulch material?</h3>
              <p className="text-gray-300">No. Mulch stays on-site as natural ground cover to prevent erosion, suppress weeds, and enrich soil.</p>
            </div>
            <div className="border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[var(--color-treeai-green)] mb-3">How do you handle wet or soft ground?</h3>
              <p className="text-gray-300">Our track machines have low ground pressure (4-6 PSI) similar to a person walking. We can work in conditions where wheeled equipment would get stuck or cause damage.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 rounded-lg p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">Ready to Reclaim Your Land?</h2>
          <p className="text-white/90 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">Get a free estimate with detailed site assessment and pricing options</p>
          <Link 
            href="/estimate" 
            className="bg-[var(--color-treeai-green)] hover:bg-[var(--color-treeai-green-light)] text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg inline-block transition-colors touch-manipulation"
          >
            Get Free Estimate Now
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}