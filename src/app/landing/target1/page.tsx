'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Script from 'next/script'

const heroImages = [
  {
    src: "/project-images/cat-265-forestry-mulcher-fueling.jpg",
    alt: "CAT 265 with Forestry Mulcher"
  },
  {
    src: "/project-images/avon-park-land-clearing-after-forestry-mulching.jpg",
    alt: "Professional Land Clearing Results"
  }
];

const showcaseImages = [
  {
    src: "/project-images/cat-265-forestry-mulcher-fueling.jpg",
    label: "Professional Equipment"
  },
  {
    src: "/project-images/firebreak-trail-clearing.jpg",
    label: "Firebreak Trail"
  },
  {
    src: "/project-images/avon-park-land-clearing-after-forestry-mulching.jpg",
    label: "Cleared Property"
  },
  {
    src: "/project-images/land-clearing-project-1.jpg",
    label: "Large Scale Clearing"
  },
  {
    src: "/project-images/land-clearing-project-3.jpg",
    label: "Commercial Project"
  },
  {
    src: "/project-images/land-clearing-project-4.jpg",
    label: "Residential Clearing"
  },
  {
    src: "/project-images/site-clearing-precision.jpg",
    label: "Precision Work"
  },
  {
    src: "/project-images/site-clearing-preparation.jpg",
    label: "Site Preparation"
  },
  {
    src: "/project-images/lehigh-acres-land-clearing-after-professional-mulching.jpg",
    label: "Mulched Land"
  },
  {
    src: "/project-images/okeechobee-land-clearing-after-forestry-mulching-complete.jpg",
    label: "Complete Transformation"
  },
  {
    src: "/project-images/cocoa-beach-final-clearing.jpg",
    label: "Beach Property"
  },
  {
    src: "/project-images/cocoa-beach-after-selective-clearing.jpg",
    label: "Selective Clearing"
  }
];

export default function TreeShopLanding() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const services = [
    'Forestry Mulching',
    'Land Clearing',
    'Stump Grinding',
    'Multiple Services'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const showcaseInterval = setInterval(() => {
      setCurrentShowcaseIndex((prevIndex) =>
        prevIndex === showcaseImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(showcaseInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Trigger Google Ads conversion tracking
        if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
          (window as any).gtag_report_conversion();
        }

        setSubmitMessage('Thank you! We\'ll contact you within 24 hours.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          service: ''
        })
      } else {
        setSubmitMessage('Something went wrong. Please try again or call us directly.')
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again or call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      {/* Google Analytics Tag */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-GC2Y1WH6N2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GC2Y1WH6N2');
          gtag('config', 'AW-11045992121');
        `}
      </Script>

      {/* Google Ads Conversion Tracking Event Snippet */}
      <Script id="google-ads-conversion-function" strategy="afterInteractive">
        {`
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
              'send_to': 'AW-11045992121/0yGLCJmlv5kYELntkZMp',
              'event_callback': callback
            });
            return false;
          }
        `}
      </Script>

    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-black overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Professional <span className="text-green-500">Land Clearing</span> Services
          </h1>

          <p className="text-xl sm:text-2xl text-white mb-8"
             style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            Forestry Mulching • Land Clearing • Stump Grinding
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#estimate-form"
              className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 rounded-lg text-lg transition-all duration-300"
            >
              Get Free Estimate
            </a>
            <a
              href="tel:3868435266"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-bold px-6 py-3 rounded-lg text-lg transition-all"
            >
              Call: (386) 843-5266
            </a>
          </div>
        </div>
      </section>

      {/* Services + Showcase Gallery */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Services Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-2 text-green-500">Forestry Mulching</h3>
              <p className="text-gray-400 text-sm">
                Grind everything above ground up to 10 inch diameter trees, into evenly spread layer of forestry mulch. Very eco friendly, cost effective solution.
              </p>
            </div>
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-2 text-green-500">Stump Grinding</h3>
              <p className="text-gray-400 text-sm">
                The stump is everything above and below, we can grind, grind and haul, grind and replace. Let us know what you need and lets get your tree project completed!
              </p>
            </div>
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <h3 className="text-xl font-bold mb-2 text-green-500">Land Clearing</h3>
              <p className="text-gray-400 text-sm">
                Removing the organic material above and below grade. Safe for building and compaction after. Requires debris disposal. From forested land to bare dirt.
              </p>
            </div>
          </div>

          {/* Cycling Showcase Gallery */}
          <h2 className="text-3xl font-bold text-center mb-8">
            Our <span className="text-green-500">Work</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Left image */}
            <div className="relative h-64 rounded-lg overflow-hidden bg-black">
              <Image
                src={showcaseImages[currentShowcaseIndex].src}
                alt={showcaseImages[currentShowcaseIndex].label}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-green-600/90 text-white px-3 py-1 font-bold">
                {showcaseImages[currentShowcaseIndex].label}
              </div>
            </div>

            {/* Right image - offset by half the array */}
            <div className="relative h-64 rounded-lg overflow-hidden bg-black">
              <Image
                src={showcaseImages[(currentShowcaseIndex + Math.floor(showcaseImages.length / 2)) % showcaseImages.length].src}
                alt={showcaseImages[(currentShowcaseIndex + Math.floor(showcaseImages.length / 2)) % showcaseImages.length].label}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-green-600/90 text-white px-3 py-1 font-bold">
                {showcaseImages[(currentShowcaseIndex + Math.floor(showcaseImages.length / 2)) % showcaseImages.length].label}
              </div>
            </div>
          </div>

          {/* Image dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {showcaseImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentShowcaseIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentShowcaseIndex
                    ? 'bg-green-500 w-6'
                    : 'bg-gray-600'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="estimate-form" className="py-12 px-4 bg-black">
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-bold text-center mb-6">
              Get Your <span className="text-green-500">Free Estimate</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder="Full Name *"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder="Email Address *"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder="Phone Number *"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder="Property Address *"
                />
              </div>

              <div>
                <select
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                >
                  <option value="">Service Needed *</option>
                  {services.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Get Free Estimate'}
              </button>

              {submitMessage && (
                <div className={`text-center p-3 rounded-lg text-sm ${
                  submitMessage.includes('Thank you')
                    ? 'bg-green-900/50 text-green-400 border border-green-700'
                    : 'bg-red-900/50 text-red-400 border border-red-700'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>

            <div className="mt-6 text-center border-t border-gray-800 pt-6">
              <p className="text-gray-400 text-sm mb-2">Or call us directly:</p>
              <a href="tel:3868435266" className="text-2xl font-bold text-green-500 hover:text-green-400">
                (386) 843-5266
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 px-4">
        <div className="text-center text-gray-400 text-sm">
          <p>Tree Shop • Licensed & Insured • Central Florida</p>
        </div>
      </footer>
    </div>
    </>
  )
}