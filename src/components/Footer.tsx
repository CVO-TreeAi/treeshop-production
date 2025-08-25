
import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-green-500 font-bold text-lg sm:text-xl">
              Tree Shop
            </Link>
            <p className="text-white text-sm mt-3 leading-relaxed">
              Florida's premier forestry mulching service. Professional land clearing with fast response and transparent process.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Services</h3>
            <div className="space-y-2 text-white text-sm">
              <Link href="/services/forestry-mulching" className="block text-white hover:text-green-400 transition-colors">
                Forestry Mulching
              </Link>
              <Link href="/services/stump-grinding" className="block text-white hover:text-green-400 transition-colors">
                Stump Grinding
              </Link>
              <Link href="/estimate" className="block text-white hover:text-green-400 transition-colors">
                Free Estimates
              </Link>
            </div>
          </div>

          {/* Areas - Simplified for mobile */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Service Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 text-white text-sm">
              <div>
                <div className="text-white font-medium mb-1 sm:mb-2 text-sm">Central Florida</div>
                <ul className="space-y-1">
                  <li><Link href="/locations/brooksville" className="text-white hover:text-green-400 transition-colors">Brooksville</Link></li>
                  <li><Link href="/locations/clermont" className="text-white hover:text-green-400 transition-colors">Clermont</Link></li>
                  <li><Link href="/locations/daytona-beach" className="text-white hover:text-green-400 transition-colors">Daytona Beach</Link></li>
                  <li><Link href="/locations/lakeland" className="text-white hover:text-green-400 transition-colors">Lakeland</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Link href="/locations" className="text-green-400 hover:text-green-300 text-sm transition-colors">View all areas →</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Get Started</h3>
            <div className="space-y-3">
              <Link 
                href="/estimate" 
                className="block bg-green-600 hover:bg-green-500 text-black text-center font-semibold px-4 py-3 rounded-lg transition-colors touch-manipulation"
              >
                Get Free Estimate
              </Link>
              <div className="text-white text-xs sm:text-sm space-y-1">
                <div>📞 Call or text anytime</div>
                <div>📧 Email response &lt; 4 hours</div>
                <div>📍 Licensed & insured</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div className="text-white text-xs sm:text-sm">© {new Date().getFullYear()} Tree Shop. All rights reserved.</div>
          <div className="text-white text-xs sm:text-sm">Professional forestry mulching services in Florida</div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs sm:text-sm">Powered by</span>
            <img src="/treeai.png" alt="TreeAI" width={72} height={20} className="object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}
