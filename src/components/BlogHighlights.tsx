import Link from 'next/link'
import { format } from 'date-fns'
import { getFeaturedPosts } from '@/lib/blog'

export default function BlogHighlights() {
  const featuredPosts = getFeaturedPosts(3)
  
  if (featuredPosts.length === 0) {
    return null
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
          Expert <span className="text-green-500">Insights</span>
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Get the latest tips on land clearing, property management, and maximizing your land&apos;s potential
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {featuredPosts.map((post) => (
          <article key={post.slug} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400 mb-3">
                <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">{post.category}</span>
                <span className="hidden sm:inline">{format(new Date(post.date), 'MMM d, yyyy')}</span>
                <span className="sm:hidden">{format(new Date(post.date), 'MMM d')}</span>
                <span>{post.readingTime.text}</span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 leading-tight">
                <Link href={`/blog/${post.slug}`} className="hover:text-green-400 transition-colors">
                  {post.title}
                </Link>
              </h3>
              
              <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3 text-sm sm:text-base">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-400">By {post.author}</span>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-green-400 hover:text-green-300 font-medium text-xs sm:text-sm flex items-center gap-1"
                >
                  Read more
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-semibold px-4 sm:px-6 py-3 rounded-lg text-sm sm:text-base transition-colors touch-manipulation"
        >
          View All Articles
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}