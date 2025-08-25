'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogContentProps {
  content: string
}

// MDX Components - customize how MDX renders
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold text-white mb-6 mt-8" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold text-white mb-4 mt-8" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold text-white mb-3 mt-6" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-semibold text-white mb-2 mt-4" {...props} />,
  p: (props: any) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4" {...props} />,
  li: (props: any) => <li className="text-gray-300" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-green-500 bg-green-600/10 pl-4 py-2 mb-4 italic text-gray-200" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg mb-4 overflow-x-auto" {...props} />
  ),
  a: (props: any) => (
    <a className="text-green-400 hover:text-green-300 underline transition-colors" {...props} />
  ),
  img: (props: any) => (
    <div className="flex justify-center mb-4">
      <img className="max-w-md w-auto rounded-lg shadow-lg" {...props} />
    </div>
  ),
  hr: (props: any) => <hr className="border-gray-700 my-8" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse border border-gray-700 rounded-lg" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-800" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-gray-700" {...props} />,
  th: (props: any) => <th className="border border-gray-700 px-4 py-2 text-white font-semibold text-left" {...props} />,
  td: (props: any) => <td className="border border-gray-700 px-4 py-2 text-gray-300" {...props} />,
  
  // Custom components for enhanced content
  CalloutBox: ({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' | 'tip' }) => {
    const styles = {
      info: 'bg-blue-600/10 border-blue-600/30 text-blue-300',
      warning: 'bg-yellow-600/10 border-yellow-600/30 text-yellow-300',
      success: 'bg-green-600/10 border-green-600/30 text-green-300',
      tip: 'bg-purple-600/10 border-purple-600/30 text-purple-300',
    }
    const icons = {
      info: '💡',
      warning: '⚠️',
      success: '✅',
      tip: '💭',
    }
    return (
      <div className={`border rounded-lg p-4 mb-4 ${styles[type]}`}>
        <div className="flex items-start gap-3">
          <span className="text-lg">{icons[type]}</span>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    )
  },
  
  EstimateButton: ({ text = 'Get Your Free Estimate' }: { text?: string }) => (
    <div className="text-center my-8">
      <Link
        href="/estimate"
        className="inline-block bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        {text}
      </Link>
    </div>
  ),
  
  PriceTable: ({ data }: { data: { package: string; price: string; description: string }[] }) => (
    <div className="bg-gray-900 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Pricing Guide</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
            <div>
              <div className="font-semibold text-green-400">{item.package}</div>
              <div className="text-sm text-gray-400">{item.description}</div>
            </div>
            <div className="text-lg font-bold text-white">{item.price}</div>
          </div>
        ))}
      </div>
    </div>
  ),
  
  BeforeAfter: ({ 
    beforeImage, 
    afterImage, 
    beforeAlt = 'Before', 
    afterAlt = 'After',
    caption 
  }: { 
    beforeImage: string; 
    afterImage: string; 
    beforeAlt?: string; 
    afterAlt?: string;
    caption?: string;
  }) => (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div>
        <img src={beforeImage} alt={beforeAlt} className="w-full rounded-lg" />
        <p className="text-center text-gray-400 text-sm mt-2">{beforeAlt}</p>
      </div>
      <div>
        <img src={afterImage} alt={afterAlt} className="w-full rounded-lg" />
        <p className="text-center text-gray-400 text-sm mt-2">{afterAlt}</p>
      </div>
      {caption && (
        <div className="md:col-span-2 text-center text-gray-300 text-sm mt-2">
          {caption}
        </div>
      )}
    </div>
  ),
  
  HighlightBox: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6 mb-6">
      {title && <h4 className="text-lg font-semibold text-green-400 mb-3">{title}</h4>}
      <div className="text-gray-200">{children}</div>
    </div>
  ),
}

export default function BlogContent({ content }: BlogContentProps) {
  const renderedContent = useMemo(() => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    )
  }, [content])

  return (
    <div className="blog-content">
      {renderedContent}
    </div>
  )
}