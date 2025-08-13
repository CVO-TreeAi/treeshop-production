
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
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/treeshop/images/branding/treeshop-logo-land-clearing-company.png" 
              alt="Tree Shop Logo" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
            <span className="text-white font-semibold text-lg">Tree Shop</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 text-base">
            <Link href="/services/forestry-mulching" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium whitespace-nowrap">Forestry Mulching</Link>
            <Link href="/services/land-clearing" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium whitespace-nowrap">Land Clearing</Link>
            <Link href="/services/stump-grinding" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium whitespace-nowrap">Stump Grinding</Link>
            <Link href="/videos" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium">Videos</Link>
            <Link href="/blog" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium">Blog</Link>
            <Link href="/locations" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium whitespace-nowrap">Service Areas</Link>
            <Link href="/#reviews" className="text-white hover:text-white bg-transparent hover:bg-[var(--color-treeshop-blue)] px-4 py-2.5 rounded-lg transition-all duration-200 font-medium">Reviews</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:13868435266" className="text-sm text-white hover:text-white hover:bg-[var(--color-treeshop-blue)] px-3 py-2 rounded-md transition-all duration-200 font-medium">
              386.843.5266
            </a>
            <Link href="/estimate" className="treeai-green-button px-5 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg">
              Get Estimate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <a href="tel:13868435266" className="text-black hover:text-black font-bold text-sm px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-md transition-all duration-200" style={{ color: '#000000 !important' }}>
              Call
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white p-2.5 rounded-lg hover:bg-[var(--color-treeshop-blue)] transition-all duration-200 border border-white/20"
              aria-label="Toggle menu"
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 absolute left-0 right-0 top-full shadow-2xl">
            <div className="px-6 py-8 space-y-6 max-w-sm mx-auto">
              {/* Primary CTA - Liquid Glass Design */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/60 to-green-500/70 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <Link 
                  href="/estimate" 
                  className="relative block w-full bg-green-600 hover:bg-green-500 text-black hover:text-black text-center font-bold py-5 px-6 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform backdrop-blur-sm border border-green-500/30"
                  onClick={() => setIsOpen(false)}
                  style={{ color: '#000000 !important' }}
                >
                  Get Free Estimate
                </Link>
              </div>
              
              {/* Navigation Links - Individual Glass Cards */}
              <div className="space-y-4 pt-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/services/forestry-mulching" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Forestry Mulching
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/services/land-clearing" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Land Clearing
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/services/stump-grinding" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Stump Grinding
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/videos" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Videos
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/blog" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Expert Tips
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/locations" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Service Areas
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-white/5 rounded-xl blur-sm group-hover:bg-white/10 transition-all duration-300"></div>
                  <Link 
                    href="/#reviews" 
                    className="relative block text-white hover:text-white bg-white/5 hover:bg-white/15 py-4 px-5 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:scale-105 transform"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      Reviews
                      <svg className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
              
              {/* Contact Info - Glass Design */}
              <div className="pt-6 text-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/60 to-green-500/70 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <a 
                    href="tel:13868435266" 
                    className="relative inline-block bg-green-600 hover:bg-green-500 text-black hover:text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform backdrop-blur-sm border border-green-500/30"
                    style={{ color: '#000000 !important' }}
                  >
                    (386) 843-5266
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-3 font-medium">Available 7 days a week</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
