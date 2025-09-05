import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Thank You - Estimate Request Submitted | TreeShop',
  description: 'Thank you for requesting a free estimate from TreeShop. We\'ll contact you within 24 hours to discuss your forestry mulching or land clearing project.',
}

export default function ThankYouPage() {
  return (
    <>
      {/* Google Ads Conversion Tracking */}
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=AW-11045992121" 
        strategy="afterInteractive"
      />
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-11045992121');
          
          gtag('event', 'conversion', {
            'send_to': 'AW-11045992121/MmSNCMqJ1ZAbELntkZMp',
            'value': 1.0,
            'currency': 'USD'
          });
        `}
      </Script>
      
      <div className="min-h-screen bg-black text-white">
        <NavBar />
        
        <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Thank You Message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Thank You!
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your estimate request has been submitted successfully. 
              We'll contact you within 24 hours to discuss your forestry mulching or land clearing project.
            </p>
            
            {/* Contact Info */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-white mb-4">What Happens Next?</h2>
              <div className="space-y-3 text-gray-300 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-0.5 text-black font-bold text-sm">1</div>
                  <div>
                    <div className="font-medium text-white">Review Your Request</div>
                    <div className="text-sm">Our team reviews your project details and requirements</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-0.5 text-black font-bold text-sm">2</div>
                  <div>
                    <div className="font-medium text-white">Personal Contact</div>
                    <div className="text-sm">We'll call or email you within 24 hours to discuss your project</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mt-0.5 text-black font-bold text-sm">3</div>
                  <div>
                    <div className="font-medium text-white">Professional Estimate</div>
                    <div className="text-sm">Receive detailed pricing and project timeline</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Immediate Contact Option */}
            <div className="mb-8">
              <p className="text-gray-300 mb-4">Need to speak with someone immediately?</p>
              <a 
                href="tel:13868435266" 
                className="inline-flex items-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                Call (386) 843-5266
              </a>
            </div>
            
            {/* Back to Site */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Back to Homepage
              </Link>
              <Link 
                href="/services/forestry-mulching"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Learn About Our Services
              </Link>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}