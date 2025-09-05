'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

// Static articles data - no file system dependencies
const TRIBUNE_ARTICLES = [
  {
    id: 'fort-mccoy-transformation',
    title: 'Transforming Land in Fort McCoy with Forestry Mulching',
    date: '2025-09-02',
    author: 'TreeShop Editorial',
    category: 'Field Reports',
    tags: ['Fort McCoy', 'property sale', '6 inch DBH', 'day rate'],
    readingTime: '3 min read',
    excerpt: 'How TreeShop helped a Fort McCoy property owner prepare her 8.06-acre land for sale using strategic forestry mulching, increasing marketability and showcasing true potential to buyers.',
    content: `# Fort McCoy Project: 8.06 Acres Transformed for Real Estate Success

We recently had the opportunity to work with a returning client in Fort McCoy who wanted to prepare her land for sale. When she first reached out, her 8.06-acre property was heavily overgrown and difficult to navigate. We mulched 3.57 acres, opening up the land and giving it a fresh, usable look. She was thrilled with the results and knew it would help showcase the property's true potential.

## Phase Two: Going Further

A few months later, she reached back out ready to take things even further. Her goal was to transform more of the property so that potential buyers could easily see the possibilities—not just raw, untouched land.

While the scope of work was larger than her budget at first, we worked with her to create a **day rate solution** that allowed us to:

- Re-mulch the original area
- Handle new growth  
- Clear trash and debris
- Open the rest of the land up to a **6" DBH package**

## The Transformation Results

The transformation was dramatic. Now, when you drive onto the property, you can clearly see the full layout and possibilities of the land. The client was incredibly appreciative that we helped her refresh the original mulched area and connect the newly cleared spaces into one cohesive, open property.

**She now has the land listed for sale with open houses scheduled.**

## Why Forestry Mulching Adds Real Value

This project is a great example of how forestry mulching can be a cost-effective solution when preparing property for sale. By clearing underbrush and opening space—without removing dominant trees unnecessarily—buyers can see the land's true potential.

**Key Benefits for Property Sales:**
- **Immediate visual impact**: Buyers see usable space, not jungle
- **Preserves mature trees**: Maintains property character and value  
- **Cost-effective**: Less expensive than full land clearing
- **Quick turnaround**: Ready for showings in days, not weeks

Ready to prepare your property for sale? [Get your Fort McCoy area estimate](/estimate)`
  }
];

export default function TreeShopTribune() {
  const [selectedArticle, setSelectedArticle] = useState(TRIBUNE_ARTICLES[0]);

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

      {/* Two Panel Layout */}
      <div className="grid lg:grid-cols-3 gap-8 min-h-[600px]">
        {/* Left Panel: Article List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-600 pl-4">
            Latest from the Field
          </h2>
          
          <div className="space-y-4">
            {TRIBUNE_ARTICLES.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedArticle.id === article.id
                    ? 'border-green-600 bg-gray-900 shadow-lg shadow-green-600/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-2">
                  <span className="px-2 py-1 treeai-green-button rounded text-xs font-medium">{article.category}</span>
                  <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
                  <span>{article.readingTime}</span>
                </div>
                
                <h3 className={`font-bold mb-2 leading-tight transition-colors ${
                  selectedArticle.id === article.id ? 'text-green-400' : 'text-white'
                }`} style={{ color: selectedArticle.id === article.id ? '#00FF41' : '#ffffff' }}>
                  {article.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Article Content */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 sm:p-8 min-h-[600px]">
            {/* Article Header */}
            <div className="border-b border-gray-700 pb-6 mb-6">
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mb-4">
                <span className="px-3 py-1 treeai-green-button rounded font-medium">{selectedArticle.category}</span>
                <span>{format(new Date(selectedArticle.date), 'MMMM d, yyyy')}</span>
                <span>{selectedArticle.readingTime}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight" style={{ color: '#00FF41' }}>
                {selectedArticle.title}
              </h1>
              
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
                  h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 mt-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg sm:text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-2 mt-4">{children}</h3>,
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
                className="treeai-green-button font-bold px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Get Free Estimate
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}