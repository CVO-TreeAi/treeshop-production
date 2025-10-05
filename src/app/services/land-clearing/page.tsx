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
            Turn Your <span className="text-green-500">Raw Land</span> into a Clean Slate
          </h1>
          <p className="text-xl text-white max-w-4xl mx-auto mb-8 leading-relaxed">
            We transform overgrown, unusable land into <strong className="text-green-400">clean, buildable space</strong> ready for whatever you're planning.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl mb-3"></div>
              <h3 className="text-lg font-bold text-white mb-2">Ready to Build</h3>
              <p className="text-gray-300 text-sm">Clean, solid ground perfect for construction, foundations, and development</p>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl mb-3"></div>
              <h3 className="text-lg font-bold text-white mb-2">Fresh Start</h3>
              <p className="text-gray-300 text-sm">Remove all unwanted vegetation, stumps, and debris for a completely clean property</p>
            </div>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6">
              <div className="text-3xl mb-3"></div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Results</h3>
              <p className="text-gray-300 text-sm">Most projects completed in 1-3 days with professional CAT equipment</p>
            </div>
          </div>

          <Link
            href="/estimate"
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-lg text-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Your Free Estimate
          </Link>
        </div>


        {/* What You Get */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              What You Get with <span className="text-green-500">TreeShop Land Clearing</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                <h3 className="text-xl font-bold text-green-400 mb-4">Before We Start:</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Free site visit and honest assessment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Clear explanation of what we'll do</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Upfront pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Timeline you can count on</span>
                  </li>
                </ul>
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold text-green-400 mb-4">After We're Done:</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Clean, buildable land ready for construction</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>All debris removed and disposed of properly</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Solid ground you can build on with confidence</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span>
                    <span>Your project can move forward immediately</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Simple Process, Professional Results</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-2xl mb-2">1.</div>
                  <div className="text-white font-bold">Free Visit</div>
                  <div className="text-gray-300 text-sm">We come see your land</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">2.</div>
                  <div className="text-white font-bold">Clear Plan</div>
                  <div className="text-gray-300 text-sm">Honest estimate & timeline</div>
                </div>
                <div>
                  <div className="text-2xl mb-2">3.</div>
                  <div className="text-white font-bold">Clean Results</div>
                  <div className="text-gray-300 text-sm">Buildable land, ready to go</div>
                </div>
              </div>
              <Link
                href="/estimate"
                className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all"
              >
                Start with a Free Visit
              </Link>
            </div>
          </div>
        </section>

        {/* Simple Results */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Perfect for These <span className="text-green-500">Projects</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-3xl mb-3"></div>
                <h3 className="text-lg font-bold text-white mb-2">New Home Construction</h3>
                <p className="text-gray-300 text-sm">Clean foundation area for your dream home</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-3xl mb-3"></div>
                <h3 className="text-lg font-bold text-white mb-2">Commercial Development</h3>
                <p className="text-gray-300 text-sm">Large-scale site preparation for business projects</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-3xl mb-3"></div>
                <h3 className="text-lg font-bold text-white mb-2">Agricultural Land</h3>
                <p className="text-gray-300 text-sm">Convert forest to farmable, usable land</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-3xl mb-3"></div>
                <h3 className="text-lg font-bold text-white mb-2">Access Roads</h3>
                <p className="text-gray-300 text-sm">Create pathways and driveways through wooded areas</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                "From jungle to job site in days, not months"
              </h3>
              <p className="text-green-400 font-medium">
                - That's the TreeShop difference
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
                <div className="text-gray-400 text-sm">New Home Construction</div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
                <p className="text-white italic mb-4">
                  "Great company! They cleared my property quickly and did an excellent job."
                </p>
                <div className="text-green-400 font-bold">- Aixala</div>
                <div className="text-gray-400 text-sm">Property Development</div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <div className="text-yellow-500 mb-3">{'★'.repeat(5)}</div>
                <p className="text-white italic mb-4">
                  "Fair pricing, showed up on time, and did exactly what we discussed."
                </p>
                <div className="text-green-400 font-bold">- Rhodes</div>
                <div className="text-gray-400 text-sm">Commercial Project</div>
              </div>
            </div>
          </div>
        </section>

        {/* Simple FAQ */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Common <span className="text-green-500">Questions</span>
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">How much does land clearing cost?</h3>
                <p className="text-white">Every property is different. We provide free estimates after seeing your land in person. No surprises, no hidden fees.</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">How long does it take?</h3>
                <p className="text-white">Most projects take 1-3 days. Larger properties might take a week. We'll give you an exact timeline with your estimate.</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">What about permits?</h3>
                <p className="text-white">We help you understand what permits you need and can guide you through the process. We know the local requirements.</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-400 mb-3">What happens to all the debris?</h3>
                <p className="text-white">We haul everything away and dispose of it properly. You get clean land with nothing left behind.</p>
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