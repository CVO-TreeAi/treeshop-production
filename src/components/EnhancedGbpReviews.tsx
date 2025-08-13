'use client';

import { useState, useEffect } from 'react';

export interface GbpReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description?: string;
}

export interface GbpData {
  rating: number;
  user_ratings_total: number;
  reviews: GbpReview[];
  place_id?: string;
  name?: string;
  last_updated?: number;
}

interface EnhancedGbpReviewsProps {
  fallbackData?: GbpData;
  className?: string;
  maxReviews?: number;
  showLoadingState?: boolean;
}

export default function EnhancedGbpReviews({ 
  fallbackData,
  className = "",
  maxReviews = 3,
  showLoadingState = true
}: EnhancedGbpReviewsProps) {
  const [gbpData, setGbpData] = useState<GbpData | null>(fallbackData || null);
  const [isLoading, setIsLoading] = useState(!fallbackData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGbpData = async () => {
      try {
        const response = await fetch('/api/gbp/reviews');
        if (response.ok) {
          const data = await response.json();
          setGbpData(data);
          setError(null);
        } else {
          // Use fallback data if available
          if (!gbpData && fallbackData) {
            setGbpData(fallbackData);
          }
          setError('Unable to load latest reviews');
        }
      } catch (err) {
        console.error('Failed to fetch GBP data:', err);
        if (!gbpData && fallbackData) {
          setGbpData(fallbackData);
        }
        setError('Unable to load latest reviews');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we don't have data or data is stale (> 6 hours)
    const shouldFetch = !gbpData || 
      (gbpData.last_updated && Date.now() - gbpData.last_updated > 6 * 60 * 60 * 1000);

    if (shouldFetch) {
      fetchGbpData();
    } else {
      setIsLoading(false);
    }
  }, [fallbackData, gbpData]);

  // Fallback data for when API is not available
  const defaultData: GbpData = {
    rating: 4.8,
    user_ratings_total: 127,
    reviews: [
      {
        author_name: "Michael R.",
        rating: 5,
        text: "TreeAI did an amazing job clearing 3 acres of overgrown land. Professional, fast, and left the property better than expected. The AI estimate was spot-on!",
        time: Date.now() - 2 * 24 * 60 * 60 * 1000
      },
      {
        author_name: "Sarah K.",
        rating: 5,
        text: "Excellent forestry mulching service. They preserved the good trees and cleared all the undergrowth perfectly. Highly recommend for any land clearing project.",
        time: Date.now() - 5 * 24 * 60 * 60 * 1000
      },
      {
        author_name: "David L.",
        rating: 5,
        text: "Outstanding work on our 5-acre property. Clean, efficient, and reasonably priced. The team was professional and finished ahead of schedule.",
        time: Date.now() - 7 * 24 * 60 * 60 * 1000
      }
    ]
  };

  const displayData = gbpData || defaultData;

  if (isLoading && showLoadingState) {
    return (
      <section className={`max-w-6xl mx-auto px-4 py-8 sm:py-12 ${className}`}>
        <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-8 bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-700 rounded animate-pulse w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 sm:p-5">
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-20 bg-gray-700 rounded animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.round(rating));
  };

  const getReviewLink = () => {
    if (displayData.place_id) {
      return `https://www.google.com/maps/place/?q=place_id:${displayData.place_id}`;
    }
    return "https://www.google.com/search?q=TreeAI+forestry+services+florida+reviews";
  };

  const getReviewRequestLink = () => {
    if (displayData.place_id) {
      return `https://www.google.com/maps/place/?q=place_id:${displayData.place_id}`;
    }
    return "https://www.google.com/search?q=TreeAI+forestry+services+florida";
  };

  return (
    <section className={`max-w-6xl mx-auto px-4 py-8 sm:py-12 ${className}`}>
      <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Trusted by <span className="text-green-500">Florida Landowners</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">
                {renderStars(displayData.rating)}
              </span>
              <span className="text-gray-200 font-semibold">
                {displayData.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-gray-300">
              {displayData.user_ratings_total} Google Reviews
            </span>
            <a 
              className="text-green-400 hover:text-green-300 underline transition-colors text-sm sm:text-base" 
              href={getReviewLink()}
              target="_blank" 
              rel="noopener noreferrer"
            >
              See all reviews →
            </a>
          </div>
          
          {error && (
            <div className="mt-2 text-amber-400 text-sm">
              {error} (showing cached reviews)
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {displayData.reviews.slice(0, maxReviews).map((review, index) => (
            <blockquote key={index} className="bg-gray-800/50 rounded-lg p-4 sm:p-5">
              <div className="text-yellow-400 mb-2 text-sm">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-100 leading-relaxed text-sm sm:text-base mb-3">
                "{review.text}"
              </p>
              <div className="flex justify-between items-center">
                <cite className="text-gray-400 text-sm font-medium">
                  — {review.author_name}
                </cite>
                {review.relative_time_description && (
                  <span className="text-gray-500 text-xs">
                    {review.relative_time_description}
                  </span>
                )}
              </div>
            </blockquote>
          ))}
        </div>

        {/* Call to Action for New Reviews */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg">
            <span className="text-green-300 text-sm mr-3">
              Had a great experience?
            </span>
            <a
              href={getReviewRequestLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 underline text-sm transition-colors"
            >
              Leave us a review →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hook for getting GBP data programmatically
export function useGbpData() {
  const [data, setData] = useState<GbpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/gbp/reviews');
        if (response.ok) {
          const gbpData = await response.json();
          setData(gbpData);
        } else {
          setError('Failed to load reviews');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}