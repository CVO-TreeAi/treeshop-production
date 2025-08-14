
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const heroImages = [
  {
    src: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/WebsitePics/CAT%20265%20sitting%20next%20to%20CAT%20299D3%20on%20land%20clearing%20project.HEIC.jpg",
    alt: "CAT 265 and CAT 299D3 Equipment - Heavy-Duty Land Clearing Project"
  },
  {
    src: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/WebsitePics/FM%20FAE%20CAT%20299D3%20Large%20Package%208%20inch.HEIC.jpg",
    alt: "Professional Forestry Mulching Equipment - CAT 299D3 in Action"
  },
  {
    src: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/WebsitePics/Rayco%20stump%20grinder%20grinding%20stumps%20via%20remote%20control%20for%20operator%20saftey%2C%20comfort%2C%20and%20accuracy.HEIC.jpg",
    alt: "Rayco Remote-Controlled Stump Grinder - Precision Stump Removal"
  },
  {
    src: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/WebsitePics/NEXT%20GEN%20CAT%20320%20Land%20clearing%202.5%20acre%20residential%20lot%20in%20Orlando%20Florida.HEIC.jpg",
    alt: "Professional Land Clearing Operation in Progress - Next Gen CAT 320"
  },
  {
    src: "https://raw.githubusercontent.com/CVO-TreeAi/treeshop-production/main/public/WebsitePics/First%20company%20to%20run%20the%20Fecon%20Fusion%20Blackhawk%20on%20a%20CAT%20Skid%20steer.%20Self%20tuning%20forestry%20mulcher.%20Best%20Forestry%20Mulcher%20in%20the%20Game%202025.jpg",
    alt: "Advanced Fecon Blackhawk Forestry Mulcher - Industry Leading Equipment"
  }
];

export default function Hero(){
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${
              index === currentImageIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
        
        {/* Slideshow Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-110 ${
                index === currentImageIndex 
                  ? 'bg-[var(--color-treeai-green)] scale-125 shadow-lg shadow-green-500/50' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" 
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          Professional <span style={{ color: '#22c55e', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Forestry Mulching</span>
          <br />
          & Land Clearing Services
        </h1>
        
        {/* TreeAI Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-sm sm:text-base font-medium backdrop-blur-sm" 
               style={{ 
                 backgroundColor: 'rgba(34, 197, 94, 0.15)', 
                 border: '1px solid rgba(34, 197, 94, 0.4)',
                 color: '#22c55e',
                 boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)'
               }}>
            <div className="w-6 h-6 bg-[var(--color-treeai-green)] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">AI</span>
            </div>
            Industry&apos;s first company powered by TreeAI
          </div>
        </div>

        <p className="text-xl sm:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed" 
           style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
          Trusted Florida team since 2016. Purpose-built{' '}
          <a 
            href="https://fecon.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-3 py-1.5 mx-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }}
          >
            Fecon
          </a>{' '}
          drum mulchers deliver eco-friendly, low-impact clearing that opens up your land while preserving what matters.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link 
            href="/estimate" 
            className="font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:transform hover:scale-105 treeai-green-button text-black hover:text-black"
            style={{ color: '#000000 !important' }}
          >
            Get Free Estimate
          </Link>
          <Link 
            href="#projects" 
            className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-white/5"
          >
            See Our Work
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-lg font-semibold text-white mb-2">Eco-Friendly Mulching</h3>
            <p className="text-gray-400">Selective clearing, acreage prep, trails</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">Selective DBH Clearing</h3>
            <p className="text-gray-400">Choose exactly what gets cleared - 4", 6", 8", or 10" diameter limits</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Modern Equipment</h3>
            <p className="text-gray-400">Clean finishes for build-ready sites</p>
          </div>
        </div>
      </div>
    </section>
  );
}
