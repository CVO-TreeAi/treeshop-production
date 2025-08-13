'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative">
      {/* Page transition overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-sm transition-all duration-300 pointer-events-none ${
          isTransitioning 
            ? 'opacity-100' 
            : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-white font-medium">Loading...</span>
          </div>
        </div>
      </div>
      
      {/* Page content with fade transition */}
      <div 
        className={`transition-all duration-500 ${
          isTransitioning 
            ? 'opacity-0 transform translate-y-4' 
            : 'opacity-100 transform translate-y-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}