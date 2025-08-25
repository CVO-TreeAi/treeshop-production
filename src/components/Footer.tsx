
import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="border-t border-gray-800 bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand & Contact */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link href="/" className="text-green-400 font-bold text-xl">
              Tree Shop
            </Link>
            <div className="text-white text-sm">
              Florida's premier forestry mulching • Licensed & insured
            </div>
          </div>
          
          {/* CTA */}
          <Link 
            href="/estimate" 
            className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Get Free Estimate
          </Link>
        </div>
        
        {/* Copyright & TreeAI */}
        <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
          <div className="text-white text-xs">
            © {new Date().getFullYear()} Tree Shop. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs">Powered by</span>
            <img src="/treeai.png" alt="TreeAI" width={60} height={16} className="object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
}
