export type GbpReview = {
  author_name: string;
  rating: number;
  text: string;
};

export default function GbpReviewHighlights({ rating, total, reviews }: { rating: number; total: number; reviews: GbpReview[] }){
  return (
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="border border-gray-800 rounded-lg bg-gray-900/50 p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
            Trusted by <span className="text-green-500">Florida Landowners</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-base sm:text-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <span className="text-gray-200 font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-gray-300">{total} Google Reviews</span>
            <a className="text-green-400 hover:text-green-300 underline transition-colors text-sm sm:text-base" href="https://www.google.com/search?q=Tree+Shop+Florida+reviews" target="_blank" rel="noopener noreferrer">
              See all reviews →
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.slice(0,3).map((r,i)=> (
            <blockquote key={i} className="bg-gray-800/50 rounded-lg p-4 sm:p-5">
              <div className="text-yellow-400 mb-2 text-sm">★★★★★</div>
              <p className="text-gray-100 leading-relaxed text-sm sm:text-base mb-3">"{r.text}"</p>
              <cite className="text-gray-400 text-sm font-medium">— {r.author_name}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
