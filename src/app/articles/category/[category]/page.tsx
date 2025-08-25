import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getPostsByCategory, getAllCategories } from '@/lib/blog'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)
  
  return {
    title: `${formattedCategory} Articles | The Tree Shop Blog`,
    description: `Expert articles about ${formattedCategory.toLowerCase()} from Florida's leading tree service professionals. Tips, insights, and best practices.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const posts = getPostsByCategory(category)
  
  if (posts.length === 0) {
    notFound()
  }

  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)

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
            <Link href="/articles" className="hover:text-green-400">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{formattedCategory}</span>
          </nav>

          <h1 className="text-4xl font-bold text-white mb-4">
            {formattedCategory} <span className="text-green-500">Articles</span>
          </h1>
          <p className="text-xl text-gray-300">
            {posts.length} article{posts.length !== 1 ? 's' : ''} about {formattedCategory.toLowerCase()}
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full">{post.category}</span>
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
                  {post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Link
                            key={tag}
                            href={`/articles/tag/${tag.toLowerCase()}`}
                            className="text-green-400 hover:text-green-300"
                          >
                            #{tag}
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
            href="/articles"
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