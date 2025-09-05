'use client';

import { useState, useEffect } from 'react';

export default function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide banner after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm animate-pulse">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-lg shadow-xl border border-blue-400">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping mt-1"></div>
          <div>
            <div className="font-bold text-sm mb-1">TreeAI Development</div>
            <div className="text-xs opacity-90 leading-tight">
              Industry-First Technology
            </div>
            <div className="text-xs mt-2 leading-tight">
              This platform is built entirely in-house using cutting-edge technology. 
              As we continue developing the industry's most advanced forestry service platform, 
              you may encounter minor improvements in progress. Thank you for your patience as we deliver innovation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}