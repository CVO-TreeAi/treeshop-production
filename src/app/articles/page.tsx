import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Tree Service Blog - Land Clearing & Forestry Mulching Tips | The Tree Shop',
  description: 'Expert insights on land clearing, forestry mulching, property management, and tree service industry news in Florida. Updated weekly with actionable tips.',
  openGraph: {
    title: 'Tree Service Blog | The Tree Shop',
    description: 'Expert insights on land clearing, forestry mulching, property management, and tree service industry news in Florida.',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const tags = getAllTags()
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 7)

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            The Tree Shop <span className="text-green-500">Articles</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Expert insights on land clearing, forestry mulching, property management, and maximizing your land&apos;s potential. 
            Updated weekly with actionable tips from Florida&apos;s leading tree service professionals.
          </p>
        </div>

        {/* Featured Article (if exists) */}
        {featuredPost && (
          <section className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Featured Article</h2>
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mb-4">
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full">{featuredPost.category}</span>
                    <span className="hidden sm:inline">{format(new Date(featuredPost.date), 'MMMM d, yyyy')}</span>
                    <span className="sm:hidden">{format(new Date(featuredPost.date), 'MMM d')}</span>
                    <span>{featuredPost.readingTime.text}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                    <Link href={`/articles/${featuredPost.slug}`} className="text-white hover:text-green-400 transition-colors">
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>By {featuredPost.author}</span>
                    </div>
                    <Link 
                      href={`/articles/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Read Article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg flex items-center justify-center p-4">
                  {featuredPost.coverImage ? (
                    <img 
                      src={featuredPost.coverImage} 
                      alt={featuredPost.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">🌲</div>
                      <div>Featured Article</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">Recent Articles</h2>
            
            {recentPosts.length > 0 ? (
              <div className="space-y-6 sm:space-y-8">
                {recentPosts.map((post) => (
                  <article key={post.slug} className="bg-gray-900 rounded-lg p-4 sm:p-6 hover:bg-gray-800 transition-colors">
                    <div className="flex gap-4">
                      {/* Small image */}
                      {post.coverImage && (
                        <div className="flex-shrink-0">
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mb-3">
                          <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">{post.category}</span>
                          <span className="hidden sm:inline">{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                          <span className="sm:hidden">{format(new Date(post.date), 'MMM d')}</span>
                          <span>{post.readingTime.text}</span>
                        </div>
                        
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight">
                          <Link href={`/articles/${post.slug}`} className="text-white hover:text-green-400 transition-colors">
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>By {post.author}</span>
                            {post.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex gap-2">
                                  {post.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="text-green-400">#{tag}</span>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          <Link 
                            href={`/articles/${post.slug}`}
                            className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center gap-1"
                          >
                            Read more
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">No articles yet</h3>
                <p className="text-gray-400 mb-6">
                  We&apos;re working on some great content for you. Check back soon!
                </p>
                <Link href="/estimate" className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors">
                  Get an Estimate Instead
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link 
                      key={category}
                      href={`/articles/category/${category.toLowerCase()}`}
                      className="block text-gray-300 hover:text-green-400 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Tags */}
            {tags.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag) => (
                    <Link 
                      key={tag}
                      href={`/articles/tag/${tag.toLowerCase()}`}
                      className="px-3 py-1 bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-black rounded-full text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Stay Updated</h3>
              <p className="text-gray-300 text-sm mb-4">
                Get weekly insights on land management, property value, and forestry best practices delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-black font-semibold py-2 rounded transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* CTA */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-3">Need Professional Help?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Get a free estimate for your land clearing or forestry mulching project.
              </p>
              <Link 
                href="/estimate"
                className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Get Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}