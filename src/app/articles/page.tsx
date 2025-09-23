import { Metadata } from 'next'
import Link from 'next/link'
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

export default async function BlogPage() {
  // Fetch posts from Substack
  const posts = await fetchSubstackPosts()

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Simple Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Articles
          </h1>
          <p className="text-gray-400">
            Insights from the field. Stories from our Substack.
          </p>
          <a
            href="https://mrtreeshop.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm mt-4"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
            </svg>
            Subscribe on Substack
          </a>
        </div>

        {/* Simple Article List */}
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="border-b border-gray-800 pb-8 last:border-0">
                <Link href={`/articles/${post.slug}`} className="block group">
                  <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-green-400 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <time>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                    <span>•</span>
                    <span>{post.readingTime.text}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">
              Loading articles from Substack...
            </p>
            <a
              href="https://mrtreeshop.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300"
            >
              Visit our Substack →
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}