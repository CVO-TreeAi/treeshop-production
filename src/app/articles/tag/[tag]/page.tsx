import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getPostsByTag, getAllTags } from '@/lib/blog'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
  
  return {
    title: `#${formattedTag} Articles | The Tree Shop Blog`,
    description: `Articles tagged with ${formattedTag.toLowerCase()} from Florida's leading tree service professionals.`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const posts = getPostsByTag(tag)
  
  if (posts.length === 0) {
    notFound()
  }

  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1)

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-green-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-green-400">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white">#{formattedTag}</span>
          </nav>

          <h1 className="text-4xl font-bold text-white mb-4">
            Articles tagged <span className="text-green-500">#{formattedTag}</span>
          </h1>
          <p className="text-xl text-gray-300">
            {posts.length} article{posts.length !== 1 ? 's' : ''} tagged with {formattedTag.toLowerCase()}
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <Link 
                  href={`/articles/category/${post.category.toLowerCase()}`}
                  className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full hover:bg-green-600/30"
                >
                  {post.category}
                </Link>
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                <span>{post.readingTime.text}</span>
              </div>
              
              <h2 className="text-2xl font-semibold text-white mb-3 leading-tight">
                <Link href={`/articles/${post.slug}`} className="hover:text-green-400 transition-colors">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>By {post.author}</span>
                  {post.tags.length > 1 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-2">
                        {post.tags.filter(t => t.toLowerCase() !== tag.toLowerCase()).slice(0, 2).map((tagItem) => (
                          <Link
                            key={tagItem}
                            href={`/articles/tag/${tagItem.toLowerCase()}`}
                            className="text-green-400 hover:text-green-300"
                          >
                            #{tagItem}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <Link 
                  href={`/articles/${post.slug}`}
                  className="text-green-400 hover:text-green-300 font-medium text-sm flex items-center gap-1"
                >
                  Read article
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Back to Blog */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to All Articles
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}