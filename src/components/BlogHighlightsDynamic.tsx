'use client';

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export default function BlogHighlightsDynamic() {
  const blogs = useQuery(api.blog.getFeaturedPosts, { limit: 3 });

  if (!blogs) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Latest Insights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-800"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-3"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Latest Insights</h2>
          <p className="text-gray-400">Blog posts coming soon...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Latest Insights</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog.slug}`}
              className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform block"
            >
              {blog.featuredImage && (
                <div className="h-48 bg-gray-800 bg-cover bg-center" 
                     style={{ backgroundImage: `url(${blog.featuredImage})` }}>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-semibold mb-3 text-white text-lg">{blog.title}</h3>
                {blog.excerpt && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{blog.authorName}</span>
                  {blog.publishedAt && (
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
                {blog.category && (
                  <span className="inline-block mt-3 text-xs bg-green-600 text-white px-2 py-1 rounded">
                    {blog.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}
