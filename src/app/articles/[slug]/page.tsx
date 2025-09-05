import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { getArticleBySlug, getAllArticles } from '@/lib/articles'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found | TreeShop Tribune',
    }
  }

  return {
    title: `${article.title} | TreeShop Tribune`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: article.coverImage ? [article.coverImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        {/* Article Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-gray-400 mb-4">
            <span className="px-3 py-1 treeai-green-button rounded-full font-medium">{article.category}</span>
            <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
            <span>{article.readingTime}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>By {article.author}</span>
            {article.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-green-400">#{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="mb-8 sm:mb-12">
            <img 
              src={article.coverImage} 
              alt={article.title}
              className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <ReactMarkdown
            className="text-gray-300 leading-relaxed"
            components={{
              h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 mt-8">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-3 mt-6">{children}</h3>,
              p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="text-gray-300 mb-4 space-y-2 pl-6">{children}</ul>,
              li: ({ children }) => <li className="list-disc text-gray-300">{children}</li>,
              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
              a: ({ href, children }) => (
                <Link href={href || '#'} className="text-green-400 hover:text-green-300 underline">
                  {children}
                </Link>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Article Footer */}
        <footer className="border-t border-gray-700 pt-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready for Professional Forestry Mulching?</h3>
            <p className="text-gray-300 mb-6">
              Get a professional forestry mulching estimate tailored to your property's specific needs.
            </p>
            <Link
              href="/estimate"
              className="treeai-green-button font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get Free Estimate
            </Link>
          </div>
        </footer>
      </main>
      
      <Footer />
    </div>
  );
}