import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { getSubstackPostBySlug, fetchSubstackPosts } from '@/lib/substack'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import BlogContent from '@/components/blog/BlogContent'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Get both local and Substack posts
  const localPosts = getAllPosts()
  const substackPosts = await fetchSubstackPosts()

  const allSlugs = [
    ...localPosts.map((post) => ({ slug: post.slug })),
    ...substackPosts.map((post) => ({ slug: post.slug }))
  ]

  return allSlugs
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params

  // Try Substack first
  let post = await getSubstackPostBySlug(slug)

  // Fall back to local posts
  if (!post) {
    const localPost = getPostBySlug(slug)
    if (localPost) {
      post = {
        ...localPost,
        link: '',
        id: localPost.slug
      } as any
    }
  }

  if (!post) {
    return {
      title: 'Article Not Found | The Tree Shop',
    }
  }

  return {
    title: `${post.title} | The Tree Shop`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

// Revalidate every 10 minutes for Substack content
export const revalidate = 600

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  // Try Substack first
  let post = await getSubstackPostBySlug(slug)
  let isSubstack = true

  // Fall back to local posts
  if (!post) {
    const localPost = getPostBySlug(slug)
    if (localPost) {
      post = {
        ...localPost,
        link: '',
        id: localPost.slug
      } as any
      isSubstack = false
    }
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 mb-8 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to articles
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <time>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
            <span>•</span>
            <span>{post.readingTime.text}</span>
            {isSubstack && (
              <>
                <span>•</span>
                <a
                  href={(post as any).link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400"
                >
                  View on Substack
                </a>
              </>
            )}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-green-400 prose-a:no-underline hover:prose-a:text-green-300
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-gray-300 prose-ul:my-6 prose-li:my-2
          prose-ol:text-gray-300 prose-ol:my-6
          prose-blockquote:border-l-4 prose-blockquote:border-gray-700 prose-blockquote:pl-4
          prose-blockquote:text-gray-400 prose-blockquote:italic prose-blockquote:my-8
          prose-img:rounded-lg prose-img:my-8
          prose-hr:border-gray-800 prose-hr:my-12">
          {isSubstack ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <BlogContent content={post.content} />
          )}
        </article>

        {/* Simple Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          {isSubstack && (
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Enjoyed this article?
              </p>
              <a
                href="https://mrtreeshop.substack.com/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
                Subscribe on Substack
              </a>
            </div>
          )}
        </footer>
      </main>

      <Footer />
    </div>
  )
}