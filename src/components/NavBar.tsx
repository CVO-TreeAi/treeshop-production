
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar(){
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/40 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/treeshop/images/branding/treeshop-logo-land-clearing-company.png"
                alt="Tree Shop - Florida Land Clearing & Forestry Services"
                width={40}
                height={40}
                className="w-10 h-10 hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/services/land-clearing" className="text-white hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800/50">
              Land Clearing
            </Link>
            <Link href="/services/forestry-mulching" className="text-white hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800/50">
              Forestry Mulching
            </Link>
            <Link href="/articles" className="text-white hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800/50">
              Articles
            </Link>
            <Link href="/locations" className="text-white hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800/50">
              Service Areas
            </Link>
            <Link href="/#reviews" className="text-white hover:text-blue-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800/50">
              Reviews
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:13868435266"
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span>(386) 843-5266</span>
            </a>
            <Link
              href="/estimate"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              Get Free Proposal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-3">
            <a
              href="tel:13868435266"
              className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              <span>Call</span>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-400 p-2 rounded-md transition-colors duration-200 hover:bg-gray-800/50"
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

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/services/land-clearing"
                  className="block text-white hover:text-blue-400 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  Land Clearing
                </Link>
                <Link
                  href="/services/forestry-mulching"
                  className="block text-white hover:text-blue-400 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  Forestry Mulching
                </Link>
                <Link
                  href="/articles"
                  className="block text-white hover:text-blue-400 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  href="/locations"
                  className="block text-white hover:text-blue-400 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  Service Areas
                </Link>
                <Link
                  href="/#reviews"
                  className="block text-white hover:text-blue-400 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 hover:bg-gray-800/50"
                  onClick={() => setIsOpen(false)}
                >
                  Reviews
                </Link>
              </div>

              {/* CTA Button */}
              <div className="pt-4 border-t border-gray-700">
                <Link
                  href="/estimate"
                  className="block w-full bg-green-600 hover:bg-green-500 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Get Free Proposal
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
