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
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [userLocation, setUserLocation] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: '',
    areaSize: '',
    stumpCount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const services = [
    'Forestry Mulching',
    'Land Clearing',
    'Stump Grinding',
    'Multiple Services'
  ]

  // All testimonials for rotation
  const allTestimonials = [
    { quote: "In my 25 years in business, I have never experienced such a great service when dealing with a service provider", author: "Cajina", location: "Verified Customer" },
    { quote: "The Tree Shop is one of the best businesses I have ever dealt with", author: "Snowden", location: "Verified Customer" },
    { quote: "I would give 10 stars if I could, but I can only give 5. Excellent company, excellent staff", author: "Millos", location: "Verified Customer" },
    { quote: "Every piece of my work from the first phone call to post the work done was extraordinary!", author: "Dolcimascolo", location: "Verified Customer" },
    { quote: "The service was by far the most professional and helpful. Very cost efficient and fair. Forever customer!", author: "Brown", location: "Verified Customer" },
    { quote: "We look for local family owned businesses to work with and Lacey and Jeremiah are great to work with", author: "Scott-Poulin", location: "Verified Customer" },
    { quote: "The Tree Shop did an amazing job! They were fair priced and showed up on time", author: "Singley", location: "Verified Customer" },
    { quote: "This company is amazing and the people they employ are the nicest and most honest humans", author: "Symphorien-Saavedra", location: "Verified Customer" },
    { quote: "Lacey and Jeremiah are wonderful to work with... They deserve 10 Stars", author: "Nelson", location: "Verified Customer" },
    { quote: "The tree shop was exceptional!!! They explained the whole process clearly", author: "Heiman", location: "Verified Customer" },
    { quote: "I saw their work on YouTube and thought why not... I'm so glad I did", author: "Thomas", location: "Verified Customer" },
    { quote: "You couldn't go wrong with this company? very reliable on time communicated with us the whole time", author: "Mendez", location: "Verified Customer" }
  ]

  // Central Florida cities for location detection
  const centralFloridaCities = ['Orlando', 'Tampa', 'Lakeland', 'Clermont', 'Winter Garden', 'Leesburg', 'Mount Dora', 'Apopka', 'Sanford', 'Kissimmee', 'St. Cloud', 'Haines City', 'Bartow', 'Plant City', 'Brandon', 'Riverview', 'Valrico', 'Seffner', 'Dover', 'Thonotosassa']

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

  // Progressive Enhancement: Location Detection
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        // Try IP-based geolocation first
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.city && centralFloridaCities.includes(data.city)) {
          setUserLocation(data.city);
        } else if (data.region === 'Florida') {
          setUserLocation('Central Florida');
        } else {
          setUserLocation('Central Florida');
        }
      } catch (error) {
        // Fallback to Central Florida if geolocation fails
        setUserLocation('Central Florida');
      }
    };

    detectUserLocation();
  }, []);

  // Progressive Enhancement: Testimonial Rotation
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === allTestimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(testimonialInterval);
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
          service: '',
          areaSize: '',
          stumpCount: ''
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
    let value = e.target.value;

    // Smart phone formatting
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, ''); // Remove non-digits
      if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }
    }

    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  // Smart city auto-complete for address field
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      address: value
    });

    // Auto-suggest cities if user location is detected
    if (userLocation && !value.toLowerCase().includes(userLocation.toLowerCase()) && value.length > 10) {
      const addressParts = value.split(',');
      if (addressParts.length === 1) {
        setFormData({
          ...formData,
          address: `${value}, ${userLocation}, FL`
        });
      }
    }
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
            {userLocation ? `Serving ${userLocation}` : 'Serving Central Florida'} • Forestry Mulching • Land Clearing • Stump Grinding
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

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why <span className="text-green-500">Central Florida</span> Trusts Us
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Licensed, insured, and equipped with the latest CAT machinery serving Central Florida.
          </p>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <div className="text-green-500 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-green-500">Fast Turnaround</h3>
              <p className="text-gray-400 text-sm">
                Most projects completed in 1-3 days. Emergency response available 24/7 for storm damage.
              </p>
            </div>
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <div className="text-green-500 text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-green-500">Licensed & Insured</h3>
              <p className="text-gray-400 text-sm">
                Fully licensed, bonded, and insured up to $2M. Worker's comp covered. Your property is protected.
              </p>
            </div>
            <div className="bg-black/50 p-6 rounded-lg border border-gray-800 text-center">
              <div className="text-green-500 text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-green-500">Best Value</h3>
              <p className="text-gray-400 text-sm">
                No hidden fees. Free estimates. Competitive pricing with superior results you can count on.
              </p>
            </div>
          </div>

          {/* Services Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-black/70 p-6 rounded-lg border border-green-800/50 text-center">
              <h3 className="text-xl font-bold mb-2 text-green-500">Forestry Mulching</h3>
              <p className="text-gray-300 text-sm mb-3">
                Grind everything above ground up to 10 inch diameter trees, into evenly spread layer of forestry mulch.
              </p>
              <div className="text-green-400 text-xs font-bold">ECO-FRIENDLY • COST-EFFECTIVE</div>
            </div>
            <div className="bg-black/70 p-6 rounded-lg border border-green-800/50 text-center">
              <h3 className="text-xl font-bold mb-2 text-green-500">Stump Grinding</h3>
              <p className="text-gray-300 text-sm mb-3">
                Complete stump removal - grind, grind & haul, or grind & replace with topsoil. Your choice.
              </p>
              <div className="text-green-400 text-xs font-bold">SAME DAY SERVICE • NO MESS LEFT</div>
            </div>
            <div className="bg-black/70 p-6 rounded-lg border border-green-800/50 text-center">
              <h3 className="text-xl font-bold mb-2 text-green-500">Land Clearing</h3>
              <p className="text-gray-300 text-sm mb-3">
                Complete organic material removal above and below grade. Building-ready bare dirt.
              </p>
              <div className="text-green-400 text-xs font-bold">BUILDING READY • DEBRIS REMOVED</div>
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

      {/* Customer Reviews & Social Proof */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            What Our <span className="text-green-500">Customers Say</span>
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Real reviews from Central Florida property owners
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Dynamic Rotating Testimonials */}
            {[0, 1, 2].map((offset) => {
              const testimonialIndex = (currentTestimonialIndex + offset) % allTestimonials.length;
              const testimonial = allTestimonials[testimonialIndex];

              return (
                <div key={offset} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 transition-all duration-500">
                  <div className="flex text-yellow-500 mb-3">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-green-500 font-bold">- {testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              );
            })}
          </div>

          {/* Additional Reviews Carousel */}
          <div className="bg-black/30 border border-gray-800 rounded-lg p-6 mb-12">
            <h3 className="text-xl font-bold text-center mb-6 text-green-500">
              More Real Reviews from Our Customers
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300 italic mb-1">
                    "Every piece of my work from the first phone call to post the work done was extraordinary!"
                  </p>
                  <div className="text-green-500 font-bold">- Dolcimascolo</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300 italic mb-1">
                    "The service was by far the most professional and helpful. Very cost efficient and fair. Forever customer!"
                  </p>
                  <div className="text-green-500 font-bold">- Brown</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300 italic mb-1">
                    "We look for local family owned businesses to work with and Lacey and Jeremiah are great to work with"
                  </p>
                  <div className="text-green-500 font-bold">- Scott-Poulin</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300 italic mb-1">
                    "The Tree Shop did an amazing job! They were fair priced and showed up on time"
                  </p>
                  <div className="text-green-500 font-bold">- Singley</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300 italic mb-1">
                    "This company is amazing and the people they employ are the nicest and most honest humans"
                  </p>
                  <div className="text-green-500 font-bold">- Symphorien-Saavedra</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-300 italic mb-1">
                    "Lacey and Jeremiah are wonderful to work with... They deserve 10 Stars"
                  </p>
                  <div className="text-green-500 font-bold">- Nelson</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">$2M</div>
                <div className="text-gray-400">Insurance Coverage</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                <div className="text-gray-400">Emergency Response</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">CAT</div>
                <div className="text-gray-400">Professional Equipment</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">FL</div>
                <div className="text-gray-400">Licensed & Bonded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Offer */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-900/50 to-green-800/50 border-y border-green-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <span className="text-green-400">Free</span> Site Visit & Detailed Estimate
          </h2>
          <p className="text-gray-300 mb-6">
            Professional assessment of your land clearing project. No obligation, no pressure - just honest advice and fair pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#estimate-form"
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
            >
              Claim Free Estimate
            </a>
            <a
              href="tel:3868435266"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
            >
              Call Now: (386) 843-5266
            </a>
          </div>
          <div className="mt-4 text-green-400 text-sm font-bold">
            ✓ No hidden fees • ✓ Licensed & insured • ✓ Same day response
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="estimate-form" className="py-12 px-4 bg-black">
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8 border border-green-800/50 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Get Your <span className="text-green-500">Free Estimate</span>
              </h2>
              <div className="flex justify-center items-center gap-4 text-sm text-green-400 mb-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  No obligation
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Same day response
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Licensed & insured
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                📱 We'll call or text you within 4 hours (usually much faster)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder="Name *"
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
                  placeholder="Email *"
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
                  placeholder="Phone *"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  placeholder={userLocation ? `Work Site Address in ${userLocation} *` : "Work Site Address *"}
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

              {/* Conditional Fields Based on Service Selection */}
              {(formData.service === 'Forestry Mulching' || formData.service === 'Land Clearing') && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-green-800/30">
                  <label className="block text-green-400 text-sm font-bold mb-2">
                    {formData.service === 'Forestry Mulching' ? 'Area to be mulched' : 'Area to be cleared'}
                  </label>
                  <select
                    name="areaSize"
                    required
                    value={formData.areaSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  >
                    <option value="">Select area size *</option>
                    <option value="Less than 1 acre">Less than 1 acre</option>
                    <option value="1-2 acres">1-2 acres</option>
                    <option value="3-5 acres">3-5 acres</option>
                    <option value="6-10 acres">6-10 acres</option>
                    <option value="More than 10 acres">More than 10 acres</option>
                    <option value="Not sure - need estimate">Not sure - need estimate</option>
                  </select>
                </div>
              )}

              {formData.service === 'Stump Grinding' && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-green-800/30">
                  <label className="block text-green-400 text-sm font-bold mb-2">
                    Number of stumps to grind
                  </label>
                  <select
                    name="stumpCount"
                    required
                    value={formData.stumpCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  >
                    <option value="">Select stump count *</option>
                    <option value="1-2 stumps">1-2 stumps</option>
                    <option value="3-5 stumps">3-5 stumps</option>
                    <option value="6-10 stumps">6-10 stumps</option>
                    <option value="11-20 stumps">11-20 stumps</option>
                    <option value="More than 20 stumps">More than 20 stumps</option>
                    <option value="Not sure - need estimate">Not sure - need estimate</option>
                  </select>
                </div>
              )}

              {formData.service === 'Multiple Services' && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-green-800/30">
                  <label className="block text-green-400 text-sm font-bold mb-2">
                    Project details
                  </label>
                  <textarea
                    name="areaSize"
                    value={formData.areaSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    placeholder="Describe your project needs (area size, stumps, clearing requirements)"
                    rows={3}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Sending Your Request...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    📋 Get My Free Estimate Now
                  </span>
                )}
              </button>

              <div className="text-center text-xs text-gray-500 mt-2">
                By submitting, you agree to receive calls/texts about your project. Standard rates may apply.
              </div>

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

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-green-500 mb-2">Tree Shop</h3>
            <p className="text-gray-400 text-sm mb-4">
              Central Florida's Premier Land Clearing & Forestry Mulching Specialists
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6 text-sm">
            <div>
              <div className="text-green-500 font-bold mb-2">📍 Service Areas</div>
              <div className="text-gray-400">
                Clermont • Lakeland • Fort Myers<br/>
                Orlando • Tampa • Ocala<br/>
                <span className="text-green-400">All of Central Florida</span>
              </div>
            </div>
            <div>
              <div className="text-green-500 font-bold mb-2">📞 Contact</div>
              <div className="text-gray-400">
                <a href="tel:3868435266" className="text-green-400 hover:text-green-300">
                  (386) 843-5266
                </a><br/>
                office@fltreeshop.com<br/>
                <span className="text-green-400">24/7 Emergency Service</span>
              </div>
            </div>
            <div>
              <div className="text-green-500 font-bold mb-2">🛡️ Credentials</div>
              <div className="text-gray-400">
                Licensed & Bonded<br/>
                $2M Insurance Coverage<br/>
                <span className="text-green-400">500+ Properties Cleared</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 text-xs text-gray-500">
            © 2024 Tree Shop. All rights reserved. Licensed and insured professional land clearing services.
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}