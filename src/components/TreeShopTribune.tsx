'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import SubstackEmbed from './SubstackEmbed';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  published: boolean;
}

export default function TreeShopTribune() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (response.ok) {
          const allArticles = await response.json();
          setArticles(allArticles);
          if (allArticles.length > 0) {
            setSelectedArticle(allArticles[0]);
          }
        } else {
          console.error('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-white">Loading articles...</div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="text-white">No articles found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-12">
      {/* Tribune Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight border-b-4 border-green-600 pb-4">
          The TreeShop <span style={{ color: '#00FF41' }}>Tribune</span>
        </h1>
        <div className="text-lg text-gray-400 mb-2 italic">Florida's Premier Tree Industry Newspaper</div>
        <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
          Real stories from the field. Industry insights you won't find anywhere else. 
          Written by the people who actually do the work.
        </p>
      </div>


      {/* Two Panel Layout - Better Mobile */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 min-h-[600px]">
        {/* Left Panel: Article List - Mobile Friendly */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-600 pl-4">
            Latest from the Field
          </h2>
          
          <div className="space-y-4">
            {articles.map((article) => (
              <button
                key={article.slug}
                onClick={() => setSelectedArticle(article)}
                className={`w-full text-left p-4 sm:p-5 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg touch-manipulation ${
                  selectedArticle?.slug === article.slug
                    ? 'border-green-600 bg-gray-900 shadow-green-600/30'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500 shadow-gray-900/50'
                }`}
              >
                {/* Category and Meta Info */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-green-600 text-black rounded-full text-xs font-bold">{article.category}</span>
                  <span className="text-xs text-gray-400">{format(new Date(article.date), 'MMM d')}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{article.readingTime.text}</span>
                </div>
                
                {/* Article Title */}
                <h3 className={`font-bold mb-3 text-base sm:text-lg leading-tight transition-colors ${
                  selectedArticle?.slug === article.slug ? 'text-green-400' : 'text-white'
                }`}>
                  {article.title}
                </h3>
                
                {/* Article Excerpt */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-3">
                  {article.excerpt}
                </p>

                {/* Read More Indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <span className={`text-xs font-medium transition-colors ${
                    selectedArticle?.slug === article.slug ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {selectedArticle?.slug === article.slug ? 'Reading...' : 'Click to read'}
                  </span>
                  <div className={`w-2 h-2 rounded-full transition-colors ${
                    selectedArticle?.slug === article.slug ? 'bg-green-400' : 'bg-gray-600'
                  }`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Article Content */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {selectedArticle && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 sm:p-8 min-h-[600px]">
              {/* Article Header - No Duplicate Title */}
              <div className="border-b border-gray-700 pb-4 mb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mb-3">
                  <span className="px-3 py-1 bg-green-600 text-black rounded font-medium">{selectedArticle.category}</span>
                  <span>{format(new Date(selectedArticle.date), 'MMMM d, yyyy')}</span>
                  <span>{selectedArticle.readingTime.text}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>By {selectedArticle.author}</span>
                  <div className="flex gap-2">
                    {selectedArticle.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-green-400">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl sm:text-3xl font-bold mb-4 mt-0 leading-tight" style={{ color: '#00FF41' }}>{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-2 mt-5">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="text-gray-300 mb-4 space-y-1 pl-6">{children}</ul>,
                    li: ({ children }) => <li className="list-disc text-gray-300">{children}</li>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-green-400 hover:text-green-300 underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {selectedArticle.content}
                </ReactMarkdown>
              </div>

              {/* Article Footer CTA */}
              <div className="border-t border-gray-700 pt-6 mt-8 text-center">
                <h3 className="text-lg font-bold text-white mb-3">Ready for Professional Forestry Mulching?</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Get a professional estimate tailored to your property's specific needs.
                </p>
                <a 
                  href="/estimate"
                  className="bg-green-600 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-green-500"
                >
                  Get Free Estimate
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}