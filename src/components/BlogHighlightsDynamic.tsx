'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { BlogPost } from '@/lib/firestore/collections'

export default function BlogHighlightsDynamic() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Temporary: Use mock data since blog API doesn't exist yet
        const mockPosts: BlogPost[] = [
          {
            id: '1',
            title: 'Essential Forestry Mulching Techniques for Florida Properties',
            excerpt: 'Learn the best practices for clearing land while preserving valuable trees and maintaining soil health.',
            slug: 'forestry-mulching-techniques-florida',
            content: '',
            category: 'Forestry',
            tags: ['mulching', 'techniques', 'florida'],
            author: 'TreeAI Expert',
            coverImage: '/images/forestry-mulching-1.jpg',
            published: true,
            featured: true,
            createdAt: new Date('2025-08-13T19:00:00.000Z'),
            updatedAt: new Date('2025-08-13T19:00:00.000Z'),
            readingTime: {
              text: '5 min read',
              minutes: 5,
              time: 300000,
              words: 1200
            },
            sortOrder: 1
          },
          {
            id: '2', 
            title: 'Understanding DBH Packages: Choosing the Right Clearing Level',
            excerpt: 'A comprehensive guide to selecting the appropriate diameter at breast height specification for your project.',
            slug: 'understanding-dbh-packages',
            content: '',
            category: 'Land Clearing',
            tags: ['dbh', 'packages', 'clearing'],
            author: 'TreeAI Expert',
            coverImage: '/images/forestry-mulching-2.jpg',
            published: true,
            featured: true,
            createdAt: new Date('2025-08-12T19:00:00.000Z'),
            updatedAt: new Date('2025-08-12T19:00:00.000Z'),
            readingTime: {
              text: '7 min read',
              minutes: 7,
              time: 420000,
              words: 1680
            },
            sortOrder: 2
          },
          {
            id: '3',
            title: 'Cost-Effective Land Management: Mulching vs Traditional Clearing',
            excerpt: 'Compare the benefits and costs of forestry mulching against traditional land clearing methods.',
            slug: 'mulching-vs-traditional-clearing',
            content: '',
            category: 'Property Management',
            tags: ['cost-effective', 'mulching', 'comparison'],
            author: 'TreeAI Expert',
            coverImage: '/images/forestry-mulching-3.jpg',
            published: true,
            featured: true,
            createdAt: new Date('2025-08-11T19:00:00.000Z'),
            updatedAt: new Date('2025-08-11T19:00:00.000Z'),
            readingTime: {
              text: '6 min read',
              minutes: 6,
              time: 360000,
              words: 1440
            },
            sortOrder: 3
          }
        ]
        
        setPosts(mockPosts)
      } catch (error) {
        console.error('Failed to load blog posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading latest insights...</p>
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-black">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Expert <span className="text-green-500">Insights</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Educational content and industry insights coming soon!
          </p>
          <Link
            href="/blog"
            className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Visit Our Blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Expert <span className="text-green-500">Insights</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay informed with professional forestry mulching techniques, property management tips, 
            and the latest industry developments from Florida's leading land clearing experts.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {Array.isArray(posts) && posts.map((post) => (
            <article key={post.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
              {/* Featured Image */}
              {post.coverImage && (
                <div className="aspect-[16/10] bg-gray-800 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                    {post.category}
                  </span>
                  <time dateTime={post.createdAt instanceof Date && !isNaN(post.createdAt.getTime()) ? post.createdAt.toISOString() : ''}>
                    {post.createdAt instanceof Date && !isNaN(post.createdAt.getTime()) 
                      ? format(post.createdAt, 'MMM d, yyyy')
                      : 'Invalid date'
                    }
                  </time>
                  <span>{post.readingTime?.text || 'Unknown reading time'}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-green-400 transition-colors">
                  <Link href={`/blog/${post.slug}`} className="hover:text-green-400">
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center gap-1"
                  >
                    Read Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <span className="text-gray-500 text-sm">
                    By {post.author || 'TreeAI Expert'}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Industry Insights
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get expert tips on land management, forestry mulching techniques, and property enhancement strategies. 
              Our blog covers everything from equipment selection to environmental best practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/blog"
                className="bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                View All Articles
              </Link>
              <Link
                href="/blog/category/Tips & Tricks"
                className="border border-green-600 hover:bg-green-600 hover:text-black text-green-400 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Tips & Tricks
              </Link>
            </div>
          </div>

          {/* Blog Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">50+</div>
              <div className="text-gray-400 text-sm">Expert Articles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">8</div>
              <div className="text-gray-400 text-sm">Topic Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">Weekly</div>
              <div className="text-gray-400 text-sm">New Content</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}