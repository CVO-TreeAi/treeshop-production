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
            <Link href="/services/land-clearing" className="text-green-700 hover:text-green-800 bg-transparent hover:bg-green-50 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-green-600 hover:border-green-700">
              Land Clearing
            </Link>
            <Link href="/services/forestry-mulching" className="text-green-700 hover:text-green-800 bg-transparent hover:bg-green-50 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-green-600 hover:border-green-700">
              Forestry Mulching
            </Link>
            <Link href="/articles" className="text-black hover:text-green-700 bg-green-100 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-green-600">
              Tribune
            </Link>
            <Link href="/locations" className="text-green-700 hover:text-green-800 bg-transparent hover:bg-green-50 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-green-600 hover:border-green-700">
              Service Areas
            </Link>
            <Link href="/#reviews" className="text-green-700 hover:text-green-800 bg-transparent hover:bg-green-50 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-medium text-center border border-green-600 hover:border-green-700">
              Reviews
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Link href="tel:13868435266" className="text-green-700 hover:text-green-800 hover:bg-green-50 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 font-semibold border border-green-600 hover:border-green-700 flex items-center justify-center gap-2 text-sm xl:text-base">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="whitespace-nowrap">(386) 843-5266</span>
            </Link>
            <Link href="/estimate" className="bg-green-600 hover:bg-green-700 text-white px-4 xl:px-5 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl text-sm xl:text-base text-center whitespace-nowrap">
              Get Free Estimate
            </Link>
          </div>

          {/* Mobile CTA and Menu */}
          <div className="flex lg:hidden items-center gap-3">
            <Link href="tel:13868435266" className="text-white font-bold px-4 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Now
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-green-700 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-300"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-3">
              <Link href="/services/land-clearing" className="block text-black hover:text-green-700 py-2 font-medium">
                Land Clearing
              </Link>
              <Link href="/services/forestry-mulching" className="block text-black hover:text-green-700 py-2 font-medium">
                Forestry Mulching  
              </Link>
              <Link href="/articles" className="block text-green-700 py-2 font-medium bg-green-50 -mx-4 px-4 rounded">
                Tribune
              </Link>
              <Link href="/locations" className="block text-black hover:text-green-700 py-2 font-medium">
                Service Areas
              </Link>
              <Link href="/#reviews" className="block text-black hover:text-green-700 py-2 font-medium">
                Reviews
              </Link>
              <Link href="/estimate" className="block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-center mt-4">
                Get Free Estimate
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}