import Link from 'next/link'
import Image from 'next/image'

export default function LightFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link href="/" className="text-green-600 font-bold text-xl">
              Tree Shop
            </Link>
            <div className="text-black text-sm">
              Florida&apos;s premier forestry mulching • Licensed &amp; insured
            </div>
          </div>
          <Link 
            href="/estimate" 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Get Free Estimate
          </Link>
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
          <div className="text-black text-xs">
            © 2025 Tree Shop. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black text-xs">Powered by</span>
            <Image 
              src="/treeai.png" 
              alt="TreeAI" 
              width={60} 
              height={16} 
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}