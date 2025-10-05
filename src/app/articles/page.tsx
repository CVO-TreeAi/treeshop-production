import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { getAllArticles, getFeaturedArticles, getAllCategories } from '@/lib/articles'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'TreeShop Knowledge Base | Professional Land Clearing Articles',
  description: 'Expert insights on land clearing, forestry mulching, stump grinding, and tree services. Professional guides for Central Florida property owners.',
  openGraph: {
    title: 'TreeShop Knowledge Base | Professional Land Clearing Articles',
    description: 'Expert insights on land clearing, forestry mulching, stump grinding, and tree services. Professional guides for Central Florida property owners.',
    type: 'website',
  },
}

export default async function ArticlesPage() {
  const [allArticles, featuredArticles, categories] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles(),
    getAllCategories()
  ])

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            TreeShop <span className="text-green-500">Knowledge Base</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Professional insights, industry expertise, and practical guides for land clearing, forestry mulching, and tree services in Central Florida.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://mrtreeshop.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
              </svg>
              Subscribe to Updates
            </a>
          </div>

          {/* Category Filter */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">All Categories</span>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/articles/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-800 hover:bg-green-500 hover:text-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-16 px-4 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Featured <span className="text-green-500">Articles</span>
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredArticles.slice(0, 3).map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group block bg-black/80 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 overflow-hidden shadow-xl"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-800">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-black/70 text-green-400 px-2 py-1 rounded text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-900">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-400 font-medium">{article.author}</span>
                      <span className="text-gray-400">{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              All Articles
            </h2>
            <p className="text-gray-300">
              Explore our complete library of {allArticles.length} professional insights and industry expertise.
            </p>
          </div>

          {allArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group block bg-gray-900/70 rounded-lg border border-gray-800 hover:border-green-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-800">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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

                  <div className="p-5 bg-gray-900">
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-green-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-3 text-sm leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-400">{format(new Date(article.date), 'MMM d, yyyy')}</span>
                      <span className="text-gray-400">{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold text-white mb-4">No articles found</h3>
              <p className="text-gray-300 mb-6">
                Check back soon for more professional insights from TreeShop.
              </p>
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