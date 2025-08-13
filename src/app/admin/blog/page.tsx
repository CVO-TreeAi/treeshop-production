'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
interface BlogPostPreview {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  tags: string[]
  coverImage?: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  published: boolean
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  
  // New post form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Forestry',
    tags: '',
    author: 'The Tree Shop Team',
    coverImage: '',
    published: true,
  })

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch from API instead of direct import
        const response = await fetch('/api/blog')
        if (response.ok) {
          const allPosts = await response.json()
          setPosts(allPosts)
        } else {
          console.error('Failed to fetch posts')
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create the MDX file content
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
    
    const frontmatter = `---
title: "${formData.title}"
excerpt: "${formData.excerpt}"
date: "${format(new Date(), 'yyyy-MM-dd')}"
author: "${formData.author}"
category: "${formData.category}"
tags: [${formData.tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')}]${formData.coverImage ? `\ncoverImage: "${formData.coverImage}"` : ''}
published: ${formData.published}
---

${formData.content}`

    try {
      // In a real implementation, you'd save this to your file system or database
      const response = await fetch('/api/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content: frontmatter,
        }),
      })

      if (response.ok) {
        alert('Blog post created successfully!')
        setShowNewPostForm(false)
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          category: 'Forestry',
          tags: '',
          author: 'The Tree Shop Team',
          coverImage: '',
          published: true,
        })
        // Refresh posts list
        const response2 = await fetch('/api/blog')
        if (response2.ok) {
          const allPosts = await response2.json()
          setPosts(allPosts)
        }
      } else {
        alert('Error creating blog post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating blog post')
    }
  }

  const categories = [
    'Forestry',
    'Land Clearing',
    'Property Management',
    'Equipment',
    'Safety',
    'Environmental',
    'Tips & Tricks',
    'Case Studies'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading blog admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Blog Admin</h1>
            <p className="text-gray-300">Manage your blog posts with ease</p>
          </div>
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {showNewPostForm ? 'Cancel' : 'New Post'}
          </button>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Brief description of the post..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Content * (Markdown/MDX)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono text-sm"
                  placeholder="Write your post content using Markdown or MDX..."
                  rows={20}
                  required
                />
                <div className="text-xs text-gray-400 mt-2">
                  💡 You can use Markdown syntax and custom components like &lt;CalloutBox&gt;, &lt;EstimateButton&gt;, etc.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-green-500 bg-black border-gray-700 rounded focus:ring-green-500"
                />
                <label htmlFor="published" className="text-gray-200">
                  Publish immediately
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Existing Posts ({posts.length})
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">Create your first blog post to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.slug} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded">{post.category}</span>
                        <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                        <span>By {post.author}</span>
                        <span>{post.readingTime.text}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="text-green-400 hover:text-green-300 px-3 py-1 text-sm">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 px-3 py-1 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-400">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}