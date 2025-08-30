'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogContentProps {
  content: string
}

// MDX Components - clean newspaper style with high contrast
const components = {
  h1: (props: any) => <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight font-serif" {...props} />,
  h2: (props: any) => (
    <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-10 leading-tight font-serif border-b-2 border-gray-300 pb-2" {...props} />
  ),
  h3: (props: any) => <h3 className="text-2xl font-semibold text-green-700 mb-3 mt-8 leading-tight" {...props} />,
  h4: (props: any) => <h4 className="text-xl font-semibold text-gray-900 mb-2 mt-6 leading-tight" {...props} />,
  h5: (props: any) => <h5 className="text-lg font-semibold text-gray-800 mb-2 mt-4 leading-tight" {...props} />,
  h6: (props: any) => <h6 className="text-base font-semibold text-gray-800 mb-2 mt-4 leading-tight" {...props} />,
  p: (props: any) => <p className="text-black mb-6 leading-relaxed text-lg font-medium" {...props} />,
  ul: (props: any) => <ul className="list-none text-gray-800 mb-6 space-y-3 ml-0 pl-0" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-gray-800 mb-6 space-y-3 ml-4 pl-2" {...props} />,
  li: (props: any) => (
    <li className="text-black text-lg leading-relaxed flex items-start font-medium" {...props}>
      <span className="text-green-600 mr-3 mt-1 flex-shrink-0 font-bold">•</span>
      <span className="flex-1">{props.children}</span>
    </li>
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-green-600 bg-green-50 pl-6 py-4 mb-8 italic text-gray-800 text-lg rounded-r-lg" {...props} />
  ),
  code: (props: any) => (
    <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-base font-mono border border-gray-200" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-50 text-gray-900 p-6 rounded-lg mb-8 overflow-x-auto text-sm font-mono border border-gray-200" {...props} />
  ),
  a: (props: any) => (
    <a className="text-green-700 hover:text-green-800 underline decoration-2 underline-offset-2 transition-colors font-medium" {...props} />
  ),
  img: (props: any) => (
    <div className="flex justify-center mb-8">
      <img className="max-w-full w-auto rounded-lg shadow-lg" {...props} />
    </div>
  ),
  hr: (props: any) => <hr className="border-gray-300 my-12" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse border border-gray-300 rounded-lg bg-white shadow-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-gray-50" {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-gray-200 hover:bg-gray-50" {...props} />,
  th: (props: any) => <th className="border border-gray-200 px-6 py-4 text-gray-900 font-semibold text-left text-lg" {...props} />,
  td: (props: any) => <td className="border border-gray-200 px-6 py-4 text-gray-800 text-lg" {...props} />,
  
  // Enhanced text formatting
  strong: (props: any) => <strong className="font-bold text-gray-900" {...props} />,
  em: (props: any) => <em className="italic text-green-700 font-medium" {...props} />,
  
  // Custom components for enhanced content
  CalloutBox: ({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' | 'tip' }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-300 text-blue-900',
      warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
      success: 'bg-green-50 border-green-300 text-green-900',
      tip: 'bg-purple-50 border-purple-300 text-purple-900',
    }
    const icons = {
      info: '💡',
      warning: '⚠️',
      success: '✅',
      tip: '💭',
    }
    return (
      <div className={`border-2 rounded-lg p-6 mb-8 ${styles[type]}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icons[type]}</span>
          <div className="flex-1 text-lg leading-relaxed">{children}</div>
        </div>
      </div>
    )
  },
  
  EstimateButton: ({ text = 'Get Your Free Estimate' }: { text?: string }) => (
    <div className="text-center my-8">
      <Link
        href="/estimate"
        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
      >
        {text}
      </Link>
    </div>
  ),
  
  PriceTable: ({ data }: { data: { package: string; price: string; description: string }[] }) => (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Pricing Guide</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="font-semibold text-green-700 text-lg">{item.package}</div>
              <div className="text-base text-gray-700">{item.description}</div>
            </div>
            <div className="text-xl font-bold text-gray-900">{item.price}</div>
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
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <img src={beforeImage} alt={beforeAlt} className="w-full rounded-lg shadow-md" />
        <p className="text-center text-gray-700 text-base mt-3 font-medium">{beforeAlt}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <img src={afterImage} alt={afterAlt} className="w-full rounded-lg shadow-md" />
        <p className="text-center text-gray-700 text-base mt-3 font-medium">{afterAlt}</p>
      </div>
      {caption && (
        <div className="md:col-span-2 text-center text-gray-800 text-base mt-4 italic">
          {caption}
        </div>
      )}
    </div>
  ),
  
  HighlightBox: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8">
      {title && <h4 className="text-2xl font-semibold text-green-800 mb-4">{title}</h4>}
      <div className="text-gray-900 text-lg leading-relaxed">{children}</div>
    </div>
  ),
  
  // Technical specification box
  TechSpecs: ({ data }: { data: { spec: string; value: string }[] }) => (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8">
      <h4 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-green-600">⚙️</span>
        Technical Specifications
      </h4>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
            <span className="text-gray-800 font-medium text-lg">{item.spec}</span>
            <span className="text-green-700 font-semibold text-lg">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  
  // Field test instruction box
  FieldTest: ({ children, title = "Field Test" }: { children: React.ReactNode; title?: string }) => (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
      <h4 className="text-2xl font-semibold text-yellow-800 mb-4 flex items-center gap-2">
        <span>🔍</span>
        {title}
      </h4>
      <div className="text-gray-900 text-lg leading-relaxed">{children}</div>
    </div>
  ),
  
  // Reality check callout
  RealityCheck: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-8">
      <h4 className="text-2xl font-semibold text-red-800 mb-4 flex items-center gap-2">
        <span>💡</span>
        Reality Check
      </h4>
      <div className="text-gray-900 text-lg font-medium leading-relaxed">{children}</div>
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