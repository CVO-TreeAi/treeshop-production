'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

// Mock articles data - replace with your actual content management
const featuredArticles = [
  {
    id: 1,
    title: "Complete Guide to Land Clearing in Central Florida",
    excerpt: "Everything property owners need to know about professional land clearing services, from permits to equipment selection.",
    image: "/project-images/land-clearing-project-1.jpg",
    category: "Land Clearing",
    readTime: "8 min read",
    date: "2024-10-01",
    featured: true,
    slug: "complete-guide-land-clearing-central-florida"
  },
  {
    id: 2,
    title: "Forestry Mulching vs Traditional Clearing: Cost Analysis",
    excerpt: "Compare the environmental and financial benefits of forestry mulching against conventional land clearing methods.",
    image: "/project-images/avon-park-land-clearing-after-forestry-mulching.jpg",
    category: "Forestry Mulching",
    readTime: "6 min read",
    date: "2024-09-28",
    featured: true,
    slug: "forestry-mulching-vs-traditional-clearing"
  },
  {
    id: 3,
    title: "Stump Grinding: When and How to Remove Tree Stumps",
    excerpt: "Professional insights on stump removal techniques, costs, and why grinding is often the best solution.",
    image: "/project-images/site-clearing-precision.jpg",
    category: "Stump Grinding",
    readTime: "5 min read",
    date: "2024-09-25",
    featured: true,
    slug: "stump-grinding-when-how-remove-stumps"
  }
]

const allArticles = [
  ...featuredArticles,
  {
    id: 4,
    title: "Hurricane Preparedness: Emergency Tree Services",
    excerpt: "How to prepare your property for hurricane season and what to do for emergency tree removal and land clearing.",
    image: "/project-images/firebreak-trail-clearing.jpg",
    category: "Emergency Services",
    readTime: "7 min read",
    date: "2024-09-20",
    featured: false,
    slug: "hurricane-preparedness-emergency-tree-services"
  },
  {
    id: 5,
    title: "CAT Equipment Guide: Professional Land Clearing Machinery",
    excerpt: "Why professional-grade CAT equipment makes all the difference in land clearing and forestry mulching projects.",
    image: "/project-images/cat-265-forestry-mulcher-fueling.jpg",
    category: "Equipment",
    readTime: "4 min read",
    date: "2024-09-15",
    featured: false,
    slug: "cat-equipment-guide-professional-land-clearing"
  },
  {
    id: 6,
    title: "Property Development: Land Clearing for Construction",
    excerpt: "Essential steps for preparing raw land for residential and commercial construction projects in Florida.",
    image: "/project-images/site-clearing-preparation.jpg",
    category: "Property Development",
    readTime: "9 min read",
    date: "2024-09-10",
    featured: false,
    slug: "property-development-land-clearing-construction"
  },
  {
    id: 7,
    title: "Wetlands and Environmental Considerations",
    excerpt: "Understanding Florida's wetlands regulations and how they affect your land clearing and development plans.",
    image: "/project-images/orlando-wetlands-mapping.jpg",
    category: "Environmental",
    readTime: "6 min read",
    date: "2024-09-05",
    featured: false,
    slug: "wetlands-environmental-considerations"
  },
  {
    id: 8,
    title: "Cost Factors in Professional Land Clearing",
    excerpt: "Breaking down the variables that affect land clearing costs and how to budget for your project.",
    image: "/project-images/cocoa-beach-final-clearing.jpg",
    category: "Pricing",
    readTime: "5 min read",
    date: "2024-09-01",
    featured: false,
    slug: "cost-factors-professional-land-clearing"
  }
]

const categories = ["All", "Land Clearing", "Forestry Mulching", "Stump Grinding", "Equipment", "Emergency Services", "Environmental", "Property Development", "Pricing"]

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredArticles, setFilteredArticles] = useState(allArticles)

  useEffect(() => {
    let filtered = allArticles

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredArticles(filtered)
  }, [searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            TreeShop <span className="text-green-500">Knowledge Base</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Professional insights, industry expertise, and practical guides for land clearing, forestry mulching, and tree services in Central Florida.
          </p>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured <span className="text-green-500">Articles</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group block bg-black rounded-lg border border-gray-800 hover:border-green-800/50 transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles Grid */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              All Articles
              {filteredArticles.length !== allArticles.length && (
                <span className="text-green-500 ml-2">({filteredArticles.length} results)</span>
              )}
            </h2>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group block bg-gray-900/50 rounded-lg border border-gray-800 hover:border-green-800/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">
                        {article.category}
                      </span>
                    </div>
                    {article.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          FEATURED
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 mb-3 text-sm leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{format(new Date(article.date), 'MMM d')}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold text-white mb-4">No articles found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900/30 to-green-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Stay Updated with <span className="text-green-400">Industry Insights</span>
          </h2>
          <p className="text-xl text-white mb-8">
            Get the latest articles and expert tips delivered to your inbox.
          </p>
          <a
            href="https://mrtreeshop.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
            </svg>
            Subscribe to TreeShop Insights
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}