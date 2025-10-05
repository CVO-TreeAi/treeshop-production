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

      {/* Simple Header */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Articles
          </h1>
          <p className="text-white mb-8">
            Insights from the field. Professional writings on land clearing, forestry mulching, and tree services.
          </p>

          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap gap-2">
            <span className="bg-gray-800 text-white px-4 py-2 rounded text-sm">All Categories</span>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/articles/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-800 hover:bg-green-500 hover:text-black text-white px-4 py-2 rounded text-sm transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Articles List */}
          <div className="space-y-8">
            {allArticles.map((article) => (
              <article key={article.slug} className="border-b border-gray-800 pb-8">
                <Link href={`/articles/${article.slug}`} className="block group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors mb-2">
                        {article.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">
                          {article.category}
                        </span>
                        <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
                        <span>{article.readTime}</span>
                        {article.featured && (
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-white leading-relaxed">
                    {article.excerpt}
                  </p>
                </Link>
              </article>
            ))}

            {allArticles.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-bold text-white mb-4">No articles found</h3>
                <p className="text-white">
                  Articles are being processed from your Substack.
                </p>
              </div>
            )}
          </div>
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