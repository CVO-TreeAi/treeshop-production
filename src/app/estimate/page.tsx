'use client';

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MultiStepEstimator from '@/components/MultiStepEstimator';

export default function EstimatePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Get Your <span className="text-green-500">Land Management</span> Estimate
          </h1>
          <p className="text-white text-base sm:text-lg">
            Professional pricing for forestry mulching and land clearing services
          </p>
        </div>

        {/* Multi-Step Estimator with proper flow */}
        <MultiStepEstimator />
      </main>
      
      <Footer />
    </div>
  );
}