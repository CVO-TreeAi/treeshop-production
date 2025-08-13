'use client';

import { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface BlogPost {
  _id: Id<'blogPosts'>;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  category?: string;
  tags?: string[];
  authorName: string;
  status: string;
  viewCount?: number;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export default function BlogManagerPage() {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Convex queries and mutations
  const allPosts = useQuery(api.blog.getAllPosts, { limit: 100 });
  const createPost = useMutation(api.blog.createBlogPost);
  const updatePost = useMutation(api.blog.updateBlogPost);
  const deletePost = useMutation(api.blog.deleteBlogPost);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveMediaFile = useMutation(api.media.saveMediaFile);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    featuredImageAlt: '',
    category: '',
    tags: '',
    authorName: 'TreeAI Admin',
    status: 'draft' as 'draft' | 'review' | 'published',
  });
  
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title,
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return '';
    
    setIsUploading(true);
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        body: file,
      });
      
      if (!result.ok) throw new Error('Upload failed');
      
      const { storageId } = await result.json();
      
      // Save media metadata
      await saveMediaFile({
        filename: `blog-${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        storageId,
        folder: 'blog',
        uploadedBy: 'admin',
      });
      
      return storageId;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      let featuredImageId = featuredImageUrl;
      
      // Upload featured image if selected
      if (featuredImage) {
        featuredImageId = await handleImageUpload(featuredImage);
      }
      
      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : [],
        featuredImage: featuredImageId || undefined,
        featuredImageAlt: formData.featuredImageAlt || undefined,
        category: formData.category || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        authorName: formData.authorName,
        status: formData.status,
      };
      
      if (currentView === 'edit' && editingPost) {
        await updatePost({
          id: editingPost._id,
          ...postData,
        });
      } else {
        await createPost(postData);
      }
      
      // Reset form and go back to list
      resetForm();
      setCurrentView('list');
      
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      featuredImageAlt: '',
      category: '',
      tags: '',
      authorName: 'TreeAI Admin',
      status: 'draft',
    });
    setFeaturedImage(null);
    setFeaturedImageUrl('');
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      keywords: post.keywords?.join(', ') || '',
      featuredImageAlt: post.featuredImageAlt || '',
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      authorName: post.authorName,
      status: post.status as 'draft' | 'review' | 'published',
    });
    setFeaturedImageUrl(post.featuredImage || '');
    setEditingPost(post);
    setCurrentView('edit');
  };

  const handleDelete = async (id: Id<'blogPosts'>) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost({ id });
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete post');
    }
  };

  const filteredPosts = allPosts?.filter(post => 
    selectedStatus === 'all' || post.status === selectedStatus
  ) || [];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Blog Manager
              </h1>
              
              <div className="flex gap-3">
                {currentView !== 'list' && (
                  <button
                    onClick={() => {
                      resetForm();
                      setCurrentView('list');
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    ← Back to List
                  </button>
                )}
                
                {currentView === 'list' && (
                  <button
                    onClick={() => setCurrentView('create')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    + New Post
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* List View */}
            {currentView === 'list' && (
              <div>
                {/* Filter Controls */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                  >
                    <option value="all">All Posts</option>
                    <option value="draft">Drafts</option>
                    <option value="review">Under Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Posts Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-left">Title</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Category</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Views</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Created</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post) => (
                        <tr key={post._id} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2">
                            <div>
                              <div className="font-medium text-gray-900">{post.title}</div>
                              <div className="text-sm text-gray-500">/{post.slug}</div>
                            </div>
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              post.status === 'published' ? 'bg-green-100 text-green-800' :
                              post.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">
                            {post.category || '-'}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">
                            {post.viewCount || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-600">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(post)}
                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(post._id)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No posts found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Create/Edit Form */}
            {(currentView === 'create' || currentView === 'edit') && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Enter post title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="url-friendly-slug"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Excerpt
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={3}
                        placeholder="Brief description for previews"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., Forestry Mulching"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="land clearing, mulching, florida"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="draft">Draft</option>
                        <option value="review">Ready for Review</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                      {(featuredImageUrl || featuredImage) && (
                        <div className="mt-2">
                          <div className="text-sm text-green-600">
                            {featuredImage ? `Selected: ${featuredImage.name}` : 'Current image uploaded'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.featuredImageAlt}
                        onChange={(e) => setFormData(prev => ({ ...prev, featuredImageAlt: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Describe the image for accessibility"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Title for search engines"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Meta Description
                      </label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={3}
                        placeholder="Description for search results (150-160 chars)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SEO Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="forestry mulching, land clearing, florida"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={15}
                    placeholder="Write your blog post content here (Markdown supported)"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Supports Markdown formatting. Use ## for headings, **bold**, *italic*, etc.
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className={`px-6 py-2 rounded-md font-medium ${
                      isSaving || isUploading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isSaving ? 'Saving...' : currentView === 'edit' ? 'Update Post' : 'Create Post'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setCurrentView('list');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}