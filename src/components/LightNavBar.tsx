'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function LightNavBar(){
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
            <Image 
              src="/treeshop/images/branding/treeshop-logo-land-clearing-company.png" 
              alt="Tree Shop - Florida Land Clearing & Forestry Services" 
              width={44} 
              height={44}
              className="w-11 h-11"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/services/land-clearing" className="text-[#1c4c9c] hover:text-green-600 font-medium transition-colors duration-200">Land Clearing</Link>
            <Link href="/services/forestry-mulching" className="text-[#1c4c9c] hover:text-green-600 font-medium transition-colors duration-200">Forestry Mulching</Link>
            <Link href="/locations" className="text-[#1c4c9c] hover:text-green-600 font-medium transition-colors duration-200">Locations</Link>
            <Link href="/articles" className="text-[#1c4c9c] hover:text-green-600 font-medium transition-colors duration-200">About</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:13868435266" 
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span>(386) 843-5266</span>
            </a>
            <Link 
              href="/estimate" 
              className="treeai-green-button px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform text-base"
            >
              Get Free Estimate
            </Link>
          </div>

          {/* Mobile CTA and Menu */}
          <div className="flex lg:hidden items-center gap-3">
            <Link 
              href="/estimate" 
              className="treeai-green-button px-4 py-2 rounded-lg font-bold text-sm"
            >
              Get Estimate
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 p-2 transition-colors duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
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
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Services */}
              <div>
                <h3 className="text-gray-500 text-sm font-semibold mb-3 uppercase tracking-wide">Services</h3>
                <div className="space-y-2">
                  <Link 
                    href="/services/land-clearing" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">🏞️</span>
                    <span className="text-gray-700 font-medium">Land Clearing</span>
                  </Link>
                  <Link 
                    href="/services/forestry-mulching" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">🌲</span>
                    <span className="text-gray-700 font-medium">Forestry Mulching</span>
                  </Link>
                </div>
              </div>
              
              {/* Other Nav Items */}
              <div className="space-y-2">
                <Link 
                  href="/locations" 
                  className="block p-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Locations
                </Link>
                <Link 
                  href="/articles" 
                  className="block p-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </div>
              
              {/* Contact */}
              <div className="pt-4 border-t border-gray-200">
                <a 
                  href="tel:13868435266" 
                  className="flex items-center gap-3 p-3 text-green-600 font-semibold text-lg hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
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