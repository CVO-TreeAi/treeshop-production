'use client'

import { useState } from 'react'
import { TestimonialsContent, FeaturedReview } from '@/types/cms'

interface TestimonialsEditorProps {
  content: TestimonialsContent
  onChange: (content: TestimonialsContent) => void
  validationErrors?: Record<string, string[]>
  previewMode?: boolean
}

export default function TestimonialsEditor({ 
  content, 
  onChange, 
  validationErrors = {}, 
  previewMode = false 
}: TestimonialsEditorProps) {
  const [editingReview, setEditingReview] = useState<string | null>(null)

  const updateSectionInfo = (field: keyof TestimonialsContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const addReview = () => {
    const newReview: FeaturedReview = {
      id: Date.now().toString(),
      customerName: 'Customer Name',
      customerLocation: 'City, FL',
      rating: 5,
      reviewText: 'Enter customer review here...',
      serviceType: 'Service Type',
      isActive: true
    }
    onChange({
      ...content,
      featuredReviews: [...content.featuredReviews, newReview]
    })
    setEditingReview(newReview.id)
  }

  const updateReview = (id: string, updates: Partial<FeaturedReview>) => {
    const updatedReviews = content.featuredReviews.map(review =>
      review.id === id ? { ...review, ...updates } : review
    )
    onChange({ ...content, featuredReviews: updatedReviews })
  }

  const deleteReview = (id: string) => {
    const updatedReviews = content.featuredReviews.filter(review => review.id !== id)
    onChange({ ...content, featuredReviews: updatedReviews })
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`text-lg ${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-600'
            } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-gray-400">({rating}.0)</span>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Testimonials Preview</h3>
        <div className="bg-gray-800 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">{content.sectionTitle}</h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              {renderStars(content.averageRating)}
              <span className="text-gray-300">
                Based on {content.totalReviews} reviews
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.featuredReviews
              .filter(review => review.isActive)
              .slice(0, 6) // Show max 6 in preview
              .map((review) => (
                <div key={review.id} className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    {renderStars(review.rating)}
                    {review.serviceType && (
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                        {review.serviceType}
                      </span>
                    )}
                  </div>
                  
                  <blockquote className="text-gray-200 mb-4 italic">
                    "{review.reviewText}"
                  </blockquote>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">{review.customerName}</p>
                    {review.customerLocation && (
                      <p className="text-gray-400 text-sm">{review.customerLocation}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
          
          {content.googleReviewsUrl && (
            <div className="text-center mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                View All Reviews on Google
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Testimonials</h3>
        <button
          onClick={addReview}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Review
        </button>
      </div>

      {/* Section Settings */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-4">
        <h4 className="text-lg font-semibold text-white">Section Settings</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Section Title</label>
          <input
            type="text"
            value={content.sectionTitle}
            onChange={(e) => updateSectionInfo('sectionTitle', e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            placeholder="e.g., What Our Customers Say"
          />
          {validationErrors.sectionTitle && (
            <p className="text-red-400 text-sm mt-1">{validationErrors.sectionTitle[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Average Rating</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={content.averageRating}
                onChange={(e) => updateSectionInfo('averageRating', parseFloat(e.target.value) || 5)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              {renderStars(Math.round(content.averageRating))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Total Reviews</label>
            <input
              type="number"
              min="0"
              value={content.totalReviews}
              onChange={(e) => updateSectionInfo('totalReviews', parseInt(e.target.value) || 0)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Google Reviews URL (Optional)</label>
            <input
              type="url"
              value={content.googleReviewsUrl || ''}
              onChange={(e) => updateSectionInfo('googleReviewsUrl', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="https://g.page/r/..."
            />
          </div>
        </div>
      </div>

      {/* Featured Reviews */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Featured Reviews ({content.featuredReviews.length})</h4>
        
        {content.featuredReviews.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-gray-400 mb-4">No featured reviews yet</p>
            <button
              onClick={addReview}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add Your First Review
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {content.featuredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-gray-800 border rounded-lg transition-all ${
                  editingReview === review.id 
                    ? 'border-green-500 ring-1 ring-green-500' 
                    : 'border-gray-700'
                }`}
              >
                {editingReview === review.id ? (
                  // Edit Mode
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-white font-medium">Edit Review</h5>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingReview(null)}
                          className="text-green-400 hover:text-green-300"
                        >
                          ✓ Done
                        </button>
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                        <input
                          type="text"
                          value={review.customerName}
                          onChange={(e) => updateReview(review.id, { customerName: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location (Optional)</label>
                        <input
                          type="text"
                          value={review.customerLocation || ''}
                          onChange={(e) => updateReview(review.id, { customerLocation: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          placeholder="City, FL"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        {renderStars(review.rating, true, (rating) => updateReview(review.id, { rating }))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Service Type (Optional)</label>
                        <input
                          type="text"
                          value={review.serviceType || ''}
                          onChange={(e) => updateReview(review.id, { serviceType: e.target.value })}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                          placeholder="e.g., Tree Removal"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Review Text</label>
                      <textarea
                        value={review.reviewText}
                        onChange={(e) => updateReview(review.id, { reviewText: e.target.value })}
                        rows={4}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        placeholder="Enter the customer's review..."
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={review.isActive}
                          onChange={(e) => updateReview(review.id, { isActive: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-gray-300">Active (visible on website)</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {renderStars(review.rating)}
                        {review.serviceType && (
                          <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                            {review.serviceType}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          review.isActive 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {review.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setEditingReview(review.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                    
                    <blockquote className="text-gray-200 mb-4 italic">
                      "{review.reviewText}"
                    </blockquote>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white font-medium">{review.customerName}</p>
                        {review.customerLocation && (
                          <p className="text-gray-400 text-sm">{review.customerLocation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}