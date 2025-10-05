
import Link from 'next/link';
import { TREESHOP_BUSINESS_DATA } from '@/lib/treeshop-business-data';

export default function Footer(){
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold text-green-500">TreeShop</div>
            </Link>
            <p className="text-white text-sm mb-4 leading-relaxed">
              Professional land clearing, forestry mulching, and stump grinding services in Central Florida.
            </p>
            <div className="space-y-2 text-sm">
              <div className="text-white">
                📞 <a href="tel:3868435266" className="text-green-400 hover:text-green-300">(386) 843-5266</a>
              </div>
              <div className="text-white">
                ✉️ <a href="mailto:office@fltreeshop.com" className="text-green-400 hover:text-green-300">office@fltreeshop.com</a>
              </div>
              <div className="text-white">📍 Central Florida</div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/land-clearing" className="text-gray-300 hover:text-green-400 transition-colors">Land Clearing</Link></li>
              <li><Link href="/services/forestry-mulching" className="text-gray-300 hover:text-green-400 transition-colors">Forestry Mulching</Link></li>
              <li><Link href="/services/stump-grinding" className="text-gray-300 hover:text-green-400 transition-colors">Stump Grinding</Link></li>
              <li><Link href="/estimate" className="text-gray-300 hover:text-green-400 transition-colors">Free Estimates</Link></li>
              <li><Link href="/landing/target1" className="text-gray-300 hover:text-green-400 transition-colors">Emergency Services</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/articles" className="text-gray-300 hover:text-green-400 transition-colors">Expert Articles</Link></li>
              <li><Link href="/reviews" className="text-gray-300 hover:text-green-400 transition-colors">Customer Reviews</Link></li>
              <li><Link href="/videos" className="text-gray-300 hover:text-green-400 transition-colors">Project Videos</Link></li>
              <li><Link href="/locations" className="text-gray-300 hover:text-green-400 transition-colors">Service Areas</Link></li>
              <li><Link href="/tools/mulching-production-rate" className="text-gray-300 hover:text-green-400 transition-colors">Production Calculator</Link></li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="text-white font-bold mb-4">Technology</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/tech" className="text-gray-300 hover:text-green-400 transition-colors">TreeAI Platform</Link></li>
              <li><Link href="/tech#waitlist" className="text-gray-300 hover:text-green-400 transition-colors">Join Waitlist</Link></li>
              <li><Link href="/admin" className="text-gray-300 hover:text-green-400 transition-colors">Business Tools</Link></li>
            </ul>
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3">
              <div className="text-green-400 text-xs font-bold mb-1">TreeAI Launch</div>
              <div className="text-white text-xs">Q2 2026</div>
              <Link href="/tech#waitlist" className="text-xs text-green-400 hover:text-green-300">Join Founding Members →</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} Tree Shop LLC. All rights reserved. Licensed & Insured Professional Tree Services.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Powered by</span>
                <Link href="/tech" className="inline-flex items-center gap-1 bg-green-500 text-black px-2 py-1 rounded text-xs font-bold hover:bg-green-400 transition-colors">
                  TreeAI
                </Link>
              </div>
              <div className="text-xs text-gray-400">
                <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy</Link> •
                <Link href="/terms" className="hover:text-green-400 transition-colors ml-1">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
