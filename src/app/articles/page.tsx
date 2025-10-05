import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fetchSubstackPosts } from '@/lib/substack'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Articles | The Tree Shop',
  description: 'Expert insights on land clearing, forestry mulching, and tree service industry news.',
  openGraph: {
    title: 'Articles | The Tree Shop',
    description: 'Expert insights on land clearing, forestry mulching, and tree service industry news.',
    type: 'website',
  },
}

// Revalidate every 10 minutes to fetch new Substack content
export const revalidate = 600

export default async function ArticlesPage() {
  // Fetch posts from Substack
  const posts = await fetchSubstackPosts()

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            TreeShop <span className="text-green-500">Articles</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Professional insights from the field. Expert knowledge on land clearing, forestry mulching, and tree services.
          </p>
          <a
            href="https://mrtreeshop.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
            </svg>
            Subscribe to TreeShop Insights
          </a>
        </div>
      </section>

      {/* Articles from Substack */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="group block bg-gray-900/50 rounded-lg border border-gray-800 hover:border-green-800/50 transition-all duration-300 overflow-hidden"
                >
                  {post.coverImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-white mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-white">
                      <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                      <span>{post.readingTime.text}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold text-white mb-4">Loading articles from Substack...</h3>
              <p className="text-white mb-6">
                Getting the latest insights from TreeShop experts.
              </p>
              <a
                href="https://mrtreeshop.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 font-medium"
              >
                Visit TreeShop Substack →
              </a>
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