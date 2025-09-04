
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar(){
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/40 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/treeshop/images/branding/treeshop-logo-land-clearing-company.png" 
              alt="Tree Shop - Florida Land Clearing & Forestry Services" 
              width={40} 
              height={40}
              className="w-10 h-10 hover:scale-105 transition-transform duration-200"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 text-sm xl:text-base">
            <Link href="/services/land-clearing" className="text-blue-500 hover:text-blue-400 bg-transparent hover:bg-blue-500/10 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-blue-500 hover:border-blue-400">Land Clearing</Link>
            <Link href="/services/forestry-mulching" className="text-blue-500 hover:text-blue-400 bg-transparent hover:bg-blue-500/10 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-blue-500 hover:border-blue-400">Forestry Mulching</Link>
            <Link href="/articles" className="text-blue-500 hover:text-blue-400 bg-transparent hover:bg-blue-500/10 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-blue-500 hover:border-blue-400">Articles</Link>
            <Link href="/locations" className="text-blue-500 hover:text-blue-400 bg-transparent hover:bg-blue-500/10 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-blue-500 hover:border-blue-400">Service Areas</Link>
            <Link href="/#reviews" className="text-blue-500 hover:text-blue-400 bg-transparent hover:bg-blue-500/10 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-blue-500 hover:border-blue-400">Reviews</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <a href="tel:13868435266" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-semibold border border-blue-500 hover:border-blue-400 flex items-center justify-center gap-2 text-sm xl:text-base">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span className="whitespace-nowrap">(386) 843-5266</span>
            </a>
            <Link href="/estimate" className="bg-green-600 hover:bg-green-500 text-black hover:text-black px-4 xl:px-5 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform border border-green-500/50 text-sm xl:text-base text-center whitespace-nowrap">
              Get Free Proposal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <a href="tel:13868435266" className="text-black hover:text-black font-bold px-4 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 transform flex items-center gap-2" style={{ color: '#000000 !important' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              Call Now
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-200 border border-blue-500/50 hover:border-blue-400 hover:scale-105 transform shadow-md hover:shadow-lg"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay - Compact Right-Aligned */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image 
                  src="/treeshop/images/branding/treeshop-logo-land-clearing-company.png" 
                  alt="Tree Shop" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <div className="px-4 py-8">
              {/* Primary CTA */}
              <div className="mb-8 flex justify-end">
                <Link 
                  href="/estimate" 
                  className="flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg text-base transition-all duration-200 min-w-[120px]"
                  onClick={() => setIsOpen(false)}
                >
                  Get Free Proposal
                </Link>
              </div>
              
              {/* Navigation Pills - Right Aligned, 33% Width */}
              <nav className="space-y-3">
                <div className="flex justify-end">
                  <Link 
                    href="/services/land-clearing" 
                    className="flex items-center justify-center bg-green-600 hover:bg-blue-600 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 w-1/3 min-w-[120px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-2">🏞️</span>
                    Land Clearing
                  </Link>
                </div>

                <div className="flex justify-end">
                  <Link 
                    href="/services/forestry-mulching" 
                    className="flex items-center justify-center bg-green-600 hover:bg-blue-600 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 w-1/3 min-w-[120px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-2">🌲</span>
                    Forestry Mulching
                  </Link>
                </div>

                <div className="flex justify-end">
                  <Link 
                    href="/articles" 
                    className="flex items-center justify-center bg-green-600 hover:bg-blue-600 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 w-1/3 min-w-[120px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-2">📖</span>
                    Articles
                  </Link>
                </div>

                <div className="flex justify-end">
                  <Link 
                    href="/locations" 
                    className="flex items-center justify-center bg-green-600 hover:bg-blue-600 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 w-1/3 min-w-[120px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-2">📍</span>
                    Service Areas
                  </Link>
                </div>

                <div className="flex justify-end">
                  <Link 
                    href="/#reviews" 
                    className="flex items-center justify-center bg-green-600 hover:bg-blue-600 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 w-1/3 min-w-[120px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg mr-2">⭐</span>
                    Reviews
                  </Link>
                </div>
              </nav>

              {/* Contact Section */}
              <div className="mt-8 pt-6 border-t border-gray-600 flex justify-end">
                <a 
                  href="tel:13868435266" 
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 min-w-[120px]"
                >
                  <span className="text-lg mr-2">📞</span>
                  (386) 843-5266
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
