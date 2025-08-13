
import Link from 'next/link';

export default function CTASection(){
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
      <div className="gradient-brand-secondary rounded-2xl p-8 lg:p-12 text-center shadow-glow-green">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Ready to Reclaim Your Land?
        </h2>
        <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Get a free estimate. On-site review available if required for your property. 
          We respond to all requests within 4 hours during business hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/estimate" 
            className="glass-morphism hover:scale-105 hover:shadow-glow text-white font-bold px-10 py-5 rounded-xl text-lg transition-all duration-300 touch-manipulation"
          >
            🌲 Get Free Estimate
          </Link>
          <Link 
            href="/services/forestry-mulching" 
            className="border border-white/30 hover:bg-white/10 hover:scale-105 text-white font-bold px-10 py-5 rounded-xl text-lg transition-all duration-300 touch-manipulation"
          >
            See Our Work
          </Link>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-white/80 text-sm">
          <div className="flex items-center justify-center gap-2 glass-morphism px-4 py-2 rounded-full">
            <span>📞</span>
            <span>Same-day response guaranteed</span>
          </div>
          <div className="flex items-center justify-center gap-2 glass-morphism px-4 py-2 rounded-full">
            <span>📍</span>
            <span>Serving all of Central Florida</span>
          </div>
          <div className="flex items-center justify-center gap-2 glass-morphism px-4 py-2 rounded-full">
            <span>⭐</span>
            <span>150+ satisfied customers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
