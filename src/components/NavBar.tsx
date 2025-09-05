
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar(){
  const [isOpen, setIsOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 bg-black sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        {/* Main Navigation Bar */}
        <div className="flex items-center h-20 w-full">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <Image 
                src="/treeshop/images/branding/treeshop-logo-land-clearing-company.png" 
                alt="Tree Shop - Florida Land Clearing & Forestry Services" 
                width={44} 
                height={44}
                className="w-11 h-11"
              />
            </Link>
          </div>
          
          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-8">
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  className="flex items-center gap-2 font-medium transition-colors duration-200 py-2"
                  style={{ color: '#ffffff !important' }}
                >
                  <span style={{ color: '#ffffff !important' }}>Services</span>
                  <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {servicesOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <div className="p-2">
                      <Link 
                        href="/services/land-clearing" 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                      >
                        <div className="text-2xl">🏞️</div>
                        <div>
                          <div className="text-white font-semibold group-hover:text-green-400">Land Clearing</div>
                          <div className="text-gray-400 text-sm">Complete site preparation</div>
                        </div>
                      </Link>
                      <Link 
                        href="/services/forestry-mulching" 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                      >
                        <div className="text-2xl">🌲</div>
                        <div>
                          <div className="text-white font-semibold group-hover:text-green-400">Forestry Mulching</div>
                          <div className="text-gray-400 text-sm">Selective vegetation management</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/locations" className="font-medium transition-colors duration-200" style={{ color: '#ffffff !important' }}>Locations</Link>
              <Link href="/articles" className="font-medium transition-colors duration-200" style={{ color: '#ffffff !important' }}>About</Link>
            </div>
          </div>

          {/* Right: Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0 ml-auto">
            <a 
              href="tel:13868435266" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm"
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

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-400 p-2 transition-colors duration-200"
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {/* Services */}
              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wide">Services</h3>
                <div className="space-y-2">
                  <Link 
                    href="/services/land-clearing" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">🏞️</span>
                    <span className="text-white font-medium">Land Clearing</span>
                  </Link>
                  <Link 
                    href="/services/forestry-mulching" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-xl">🌲</span>
                    <span className="text-white font-medium">Forestry Mulching</span>
                  </Link>
                </div>
              </div>
              
              {/* Other Nav Items */}
              <div className="space-y-2">
                <Link 
                  href="/locations" 
                  className="block p-3 text-white font-medium hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Locations
                </Link>
                <Link 
                  href="/articles" 
                  className="block p-3 text-white font-medium hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </div>
              
              {/* Contact */}
              <div className="pt-4 border-t border-gray-800">
                <a 
                  href="tel:13868435266" 
                  className="flex items-center gap-3 p-3 text-green-400 font-semibold text-lg hover:bg-gray-800 rounded-lg transition-colors duration-200"
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
