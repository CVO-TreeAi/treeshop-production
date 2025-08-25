import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import BlogContent from '@/components/articles/BlogContent'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found | The Tree Shop Blog',
    }
  }

  return {
    title: `${post.title} | The Tree Shop Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex(p => p.slug === slug)
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <header className="mb-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-green-400">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-green-400">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{post.title}</span>
          </nav>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
            <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full">{post.category}</span>
            <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
            <span>{post.readingTime.text}</span>
            <span>By {post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-lg"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/articles/tag/${tag.toLowerCase()}`}
                  className="px-3 py-1 bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-black rounded-full text-sm transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <BlogContent content={post.content} />
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          {/* Author Info */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-black font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{post.author}</h3>
                <p className="text-gray-300 text-sm">
                  Expert in land clearing, forestry mulching, and property management with years of hands-on experience helping Florida property owners maximize their land's potential.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {(previousPost || nextPost) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {previousPost && (
                <Link 
                  href={`/articles/${previousPost.slug}`}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
                >
                  <div className="text-sm text-gray-400 mb-2">← Previous Article</div>
                  <div className="font-semibold text-white">{previousPost.title}</div>
                </Link>
              )}
              {nextPost && (
                <Link 
                  href={`/articles/${nextPost.slug}`}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors md:text-right"
                >
                  <div className="text-sm text-gray-400 mb-2">Next Article →</div>
                  <div className="font-semibold text-white">{nextPost.title}</div>
                </Link>
              )}
            </div>
          )}

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/articles/${relatedPost.slug}`}
                    className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-sm text-gray-400 mb-2">{relatedPost.category}</div>
                    <h4 className="font-semibold text-white mb-2 leading-tight">{relatedPost.title}</h4>
                    <div className="text-sm text-gray-400">{relatedPost.readingTime.text}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Land?</h3>
            <p className="text-gray-300 mb-6">
              Get a professional forestry mulching estimate tailored to your property's specific needs.
            </p>
            <Link
              href="/estimate"
              className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Free Estimate
            </Link>
          </div>
        </footer>
      </main>

      <Footer />
    </div>
  )
}