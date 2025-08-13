'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { BlogPost, DEFAULT_CATEGORIES } from '@/lib/firestore/collections'

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Forestry' as const,
    tags: '',
    author: 'The Tree Shop Team',
    coverImage: '',
    published: true,
    featured: false,
    metaTitle: '',
    metaDescription: '',
    seoKeywords: ''
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blogs')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length
    const minutes = Math.ceil(words / 200) // Average reading speed
    const time = minutes * 60 * 1000 // Convert to milliseconds
    return {
      text: `${minutes} min read`,
      minutes,
      time,
      words
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const slug = editingPost?.slug || generateSlug(formData.title)
    const readingTime = calculateReadingTime(formData.content)
    
    const postData = {
      ...formData,
      id: editingPost?.id || '',
      slug,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      seoKeywords: formData.seoKeywords.split(',').map(kw => kw.trim()).filter(Boolean),
      readingTime,
      createdAt: editingPost?.createdAt || new Date(),
      updatedAt: new Date(),
      sortOrder: editingPost?.sortOrder || posts.length
    }

    try {
      const url = editingPost ? `/api/admin/blogs/${editingPost.id}` : '/api/admin/blogs'
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (response.ok) {
        await fetchPosts()
        resetForm()
        alert(editingPost ? 'Post updated successfully!' : 'Post created successfully!')
      } else {
        alert('Error saving post')
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      author: post.author,
      coverImage: post.coverImage || '',
      published: post.published,
      featured: post.featured,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      seoKeywords: post.seoKeywords?.join(', ') || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchPosts()
        alert('Post deleted successfully!')
      } else {
        alert('Error deleting post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Forestry',
      tags: '',
      author: 'The Tree Shop Team',
      coverImage: '',
      published: true,
      featured: false,
      metaTitle: '',
      metaDescription: '',
      seoKeywords: ''
    })
    setEditingPost(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Blog Posts ({posts.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingPost ? 'Edit Post' : 'Create New Post'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
                {formData.title && (
                  <div className="text-xs text-gray-400 mt-1">
                    Slug: {generateSlug(formData.title)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  rows={3}
                  placeholder="Brief description for search results and social media..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                >
                  {DEFAULT_CATEGORIES.BLOG.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Meta Title (SEO)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="Custom title for search engines (optional)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  rows={2}
                  placeholder="Custom description for search engines (optional)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Content * (MDX/Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none font-mono text-sm"
                rows={20}
                placeholder="Write your post content using Markdown or MDX..."
                required
              />
              <div className="text-xs text-gray-400 mt-2 space-y-1">
                <div>💡 Reading time: {calculateReadingTime(formData.content).text}</div>
                <div>📝 Word count: {calculateReadingTime(formData.content).words}</div>
                <div>🧩 You can use MDX components like &lt;CalloutBox&gt;, &lt;EstimateButton&gt;, etc.</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-200">Featured</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-gray-200">Published</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-500 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
            <p className="text-gray-400">Create your first blog post to get started!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex gap-4">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-32 h-18 object-cover rounded flex-shrink-0"
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {post.title}
                    </h3>
                    <div className="flex gap-2 ml-4">
                      {post.featured && (
                        <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}
                      {!post.published && (
                        <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-xs">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded">
                      {post.category}
                    </span>
                    <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    <span>By {post.author}</span>
                    <span>{post.readingTime.text}</span>
                    <span>{post.readingTime.words} words</span>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-green-400 hover:text-green-300 px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 text-sm"
                    >
                      Delete
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 px-3 py-1 text-sm"
                    >
                      Preview
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}