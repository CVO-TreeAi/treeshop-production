'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import PDF generator to reduce initial bundle size
const PDFGenerator = dynamic(() => import('@/lib/proposal-generator').then(mod => ({ default: mod.ProposalGenerator })), {
  loading: () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      <span className="ml-2 text-gray-600">Loading PDF tools...</span>
    </div>
  ),
  ssr: false
});

interface DynamicPDFGeneratorProps {
  context: any; // ProposalGenerationContext type
  onGenerated?: (pdfBuffer: ArrayBuffer) => void;
  onError?: (error: Error) => void;
}

export default function DynamicPDFGenerator({
  context,
  onGenerated,
  onError
}: DynamicPDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      // This will only load the PDF generation code when actually needed
      const generator = new (await PDFGenerator)(context);
      const pdfBuffer = generator.generatePDF();
      
      if (onGenerated) {
        onGenerated(pdfBuffer);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      if (onError) {
        onError(error instanceof Error ? error : new Error('PDF generation failed'));
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Generating PDF...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate PDF
        </>
      )}
    </button>
  );
}