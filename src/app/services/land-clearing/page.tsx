import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AutoScrollList from '@/components/AutoScrollList';
// import ProjectGallery from '@/components/ProjectGallery'; // Temporarily removed to avoid confusion

export default function LandClearingPage(){
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 text-center">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Clearing Land, <span className="text-green-500">Exposing Potential</span>
          </h1>
          <p className="text-xl text-white max-w-4xl mx-auto mb-8 leading-relaxed">
            Your property holds possibilities you can't see yet. That perfect building site. The stunning view hiding behind overgrowth.
            The trails that could connect everything. <strong className="text-green-400">We reveal what's already there.</strong>
          </p>

          <div className="bg-gray-900/50 border border-green-800/50 rounded-lg p-8 max-w-3xl mx-auto mb-12">
            <p className="text-lg text-white mb-4 italic">
              "I didn't even know that's what I wanted until I experienced it."
            </p>
            <p className="text-green-400 font-medium">
              — Property owner after seeing their transformation
            </p>
            <p className="text-white text-sm mt-4">
              From cramped and confined to open and inspiring. That's what proper land clearing delivers.
            </p>
          </div>

          <Link
            href="/estimate"
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
          >
            Discover Your Property's Potential
          </Link>
        </div>


        {/* The ROI of Freedom */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-white">
              Land Clearing: An Investment with <span className="text-green-500">Unmatched ROI</span>
            </h2>
            <p className="text-xl text-center text-white mb-12 max-w-3xl mx-auto">
              Done correctly, clearing your land isn't an expense — it's the foundation for everything you want to achieve.
            </p>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Unlock Hidden Value */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-bold text-green-400 mb-6">Unlock Hidden Value</h3>
                <ul className="space-y-4 text-white">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Reveal stunning views</strong> you didn't know existed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Create usable space</strong> where there was only overgrowth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Open possibilities</strong> for trails, gardens, and outdoor living</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Transform cramped and confined</strong> into open and inspiring</span>
                  </li>
                </ul>
              </div>

              {/* Protect Your Investment */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-bold text-green-400 mb-6">Protect Your Investment</h3>
                <ul className="space-y-4 text-white">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Fire mitigation</strong> creates defensible space around your property</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Erosion control</strong> prevents costly damage and washouts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Storm preparation</strong> eliminates hazardous widow makers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Pest reduction</strong> removes habitat for unwanted wildlife</span>
                  </li>
                </ul>
              </div>

              {/* Enable Development */}
              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-bold text-green-400 mb-6">Enable Development</h3>
                <ul className="space-y-4 text-white">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Building pads</strong> exactly where you want them</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Access roads</strong> and driveways that make sense</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Utility corridors</strong> for power, water, and septic</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Recreation areas</strong> designed around natural features</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Pricing & Process */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Professional <span className="text-green-500">Day Rate System</span>
            </h2>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-green-400 mb-6">TreeShop Standard Package</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-black/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white mb-2">$4,500 per day</div>
                    <div className="text-green-400 font-medium">Complete land clearing operation</div>
                  </div>

                  <div className="space-y-3">
                    <div style={{color: '#ffffff'}}>
                      <strong className="text-green-400">CAT 315 Excavator</strong> — 15-ton precision clearing machine
                    </div>
                    <div style={{color: '#ffffff'}}>
                      <strong className="text-green-400">CAT 265 Skid Steer</strong> — Root rake, grapple, forestry mulcher attachments
                    </div>
                    <div style={{color: '#ffffff'}}>
                      <strong className="text-green-400">Professional Operation</strong> — Licensed, insured, systematic approach
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-green-400 font-bold mb-2">Timeline for Standard Lot:</h4>
                  <div style={{color: '#ffffff'}}>1-3 days depending on vegetation density, building plans, permits, and site conditions</div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Debris Management</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-black/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white mb-2">$700 per load</div>
                    <div style={{color: '#ffffff'}}>Self-loading grapple trucks</div>
                  </div>

                  <div style={{color: '#ffffff'}} className="text-sm">
                    <strong className="text-green-400">Average Florida property:</strong> 15-20 truck loads per acre
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-bold mb-2">Other Options Available:</h4>
                  <div style={{color: '#ffffff'}} className="text-sm">Project-specific debris management solutions for different needs and budgets</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Complete Project Management</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-green-500 font-bold text-lg mb-2">TreeAI Analysis</div>
                  <div style={{color: '#ffffff'}}>Our AI system provides detailed site assessment</div>
                </div>
                <div>
                  <div className="text-green-500 font-bold text-lg mb-2">Drawn Plans</div>
                  <div style={{color: '#ffffff'}}>Full plans on satellite maps showing clearing areas</div>
                </div>
                <div>
                  <div className="text-green-500 font-bold text-lg mb-2">Phased Billing</div>
                  <div style={{color: '#ffffff'}}>Deposit → Hauling → Finished (spreads costs)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Concierge Service */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Concierge <span className="text-green-500">"Done for You"</span> Service
              </h2>
              <p className="text-xl text-white mb-8">
                We scale our service up and down to fit your DIY level. From complete project management
                to fixing disasters when you get in over your head.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-black/50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-400 mb-3">Full Service</h3>
                  <div style={{color: '#ffffff'}}>Complete project management from permits to final cleanup</div>
                </div>
                <div className="bg-black/50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-400 mb-3">Partial Support</h3>
                  <div style={{color: '#ffffff'}}>Equipment and expertise for specific phases you need</div>
                </div>
                <div className="bg-black/50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-400 mb-3">Disaster Recovery</h3>
                  <div style={{color: '#ffffff'}}>Fix problems when DIY projects go wrong</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Control */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Why TreeShop Takes <span className="text-green-500">Complete Control</span>
            </h2>

            <div className="bg-gray-900 rounded-lg p-8 mb-8">
              <p className="text-xl text-white text-center mb-6">
                Most contractors show up and start cutting. We show up with a <strong className="text-green-400">systematic plan</strong>
                that maximizes your property's potential while protecting what matters.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-4">Our Professional Approach:</h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Site analysis first</strong> — we identify opportunities and constraints</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Strategic preservation</strong> — save valuable trees and natural features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Phased clearing</strong> — reveal views and adjust plans as we progress</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>Professional equipment</strong> — CAT machinery for precision work</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-green-400 mb-4">What This Means for You:</h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>No regrets</strong> — we preserve options and enhance value</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>No surprises</strong> — detailed planning prevents costly mistakes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>No delays</strong> — systematic approach keeps projects on track</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span><strong>No cleanup headaches</strong> — we handle everything</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6 text-center">
              <p className="text-lg text-white mb-4">
                <strong>"We don't just clear land — we unlock your property's full potential."</strong>
              </p>
              <p className="text-green-400">
                This is why property owners trust TreeShop with their most important projects.
              </p>
            </div>
          </div>
        </section>

        {/* Customer Results */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Real <span className="text-green-500">Customer Results</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
                <p className="text-white italic mb-4">
                  "They cleared 3 acres for our new home. Professional, fast, and left it perfect for construction."
                </p>
                <div className="text-green-400 font-bold">- Sarah M.</div>
                <div className="text-white text-sm">New Home Construction</div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
                <p className="text-white italic mb-4">
                  "Great company! They cleared my property quickly and did an excellent job."
                </p>
                <div className="text-green-400 font-bold">- Aixala</div>
                <div className="text-white text-sm">Property Development</div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
                <p className="text-white italic mb-4">
                  "Fair pricing, showed up on time, and did exactly what we discussed."
                </p>
                <div className="text-green-400 font-bold">- Rhodes</div>
                <div className="text-white text-sm">Commercial Project</div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional FAQ */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Professional <span className="text-green-500">Land Clearing</span> Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">"Will this damage my property?"</h3>
                <p style={{color: '#ffffff'}}>
                  Professional clearing actually <strong>protects</strong> your property. We preserve valuable trees,
                  prevent erosion, and create defensible space. You get the benefits without the damage.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">"How much does this cost?"</h3>
                <p style={{color: '#ffffff'}}>
                  Our day rate system is transparent: <strong>$4,500 per day</strong> for our CAT excavator and skid steer package.
                  Debris removal is <strong>$700 per truck load</strong>. Most standard lots take 1-3 days.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">"How do I know you'll do it right?"</h3>
                <p style={{color: '#ffffff'}}>
                  We've been doing this systematically for years. <strong>Licensed, insured, and equipped with professional
                  CAT machinery.</strong> TreeAI system provides detailed analysis. We show you drawn plans on satellite maps before we start.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">"What if my project goes wrong?"</h3>
                <p style={{color: '#ffffff'}}>
                  We can fix disasters when DIY projects get out of hand. Our concierge service scales up and down
                  to fit your needs — from complete project management to disaster recovery.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">"Do you handle custom projects?"</h3>
                <p style={{color: '#ffffff'}}>
                  Absolutely. For larger scale, smaller scale, or specialty clearing, we create custom plans.
                  TreeAI helps us understand your specific site conditions and requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-green-500 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Land?
          </h2>
          <p className="text-white text-lg mb-6">
            Get a free estimate and see how we can turn your raw land into exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/estimate"
              className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all"
            >
              Get Free Estimate
            </Link>
            <a
              href="tel:3868435266"
              className="border-2 border-black text-white hover:bg-black hover:text-white font-bold px-8 py-4 rounded-lg text-lg transition-all"
            >
              Call: (386) 843-5266
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}