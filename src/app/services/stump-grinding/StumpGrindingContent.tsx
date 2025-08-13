'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export default function StumpGrindingContent() {
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    stumpDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setLeadFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return leadFormData.name.trim() && leadFormData.phone.trim() && leadFormData.email.trim() && leadFormData.address.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadFormData,
          service: 'stump-grinding',
          attribution: {
            source: 'website',
            page: 'stump-grinding',
          }
        })
      });

      if (response.ok) {
        setSubmitMessage('Thank you! We\'ll contact you within 24 hours with your transparent quote.');
        setLeadFormData({ name: '', phone: '', email: '', address: '', stumpDetails: '' });
      } else {
        setSubmitMessage('Something went wrong. Please call us at (352) 200-1112.');
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please call us at (352) 200-1112.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/treeshop/images/stump-grinding/8-inch-dbh-stump-measurement.jpg"
            alt="Professional stump grinding with Rayco equipment in Central Florida"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transparent <span className="text-green-500">Stump Grinding</span> Pricing
            <br />with <span className="text-amber-400">TreeAI Technology</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            No guesswork. No surprises. Just fair, mathematical pricing based on precision measurements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="#quote-form" 
              className="bg-green-600 hover:bg-green-500 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
            >
              Get Your Transparent Quote
            </Link>
            <div className="bg-amber-500/20 border border-amber-400 rounded-lg px-6 py-3">
              <span className="text-amber-300 font-medium">$75 estimate fee (credited when hired)</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Pricing Works */}
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              It's Just <span className="text-green-400">Math</span> - Here's How We Calculate Fair Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Unlike competitors who guess or use "ballpark" pricing, we use mathematical precision for transparent, fair quotes.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-green-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-black font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Precise Measurement</h3>
              </div>
              <p className="text-gray-300 text-center">
                LiDAR scanning or precision tape measurement determines exact stump dimensions - no guessing.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-amber-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-black font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mathematical Calculation</h3>
              </div>
              <p className="text-gray-300 text-center">
                TreeAI calculates exact grinding time, fuel costs, wear rates, and cleanup requirements.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-blue-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transparent Quote</h3>
              </div>
              <p className="text-gray-300 text-center">
                You receive a breakdown showing operational costs + fair profit margin. No hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TreeAI Technology */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                <span className="text-amber-400">TreeAI</span> Precision: Why Accurate Measurement Matters
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">LiDAR Scanning Technology</h3>
                    <p className="text-gray-300">Precise 3D measurement of stump dimensions and root system spread.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Time Calculation</h3>
                    <p className="text-gray-300">Machine learning algorithms calculate exact grinding time based on wood density and equipment specifications.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Real-Time Cost Analysis</h3>
                    <p className="text-gray-300">Fuel consumption, equipment wear, and cleanup requirements calculated in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-first">
              <div className="relative">
                <Image
                  src="/treeshop/images/stump-grinding/8-inch-dbh-stump-measurement.jpg"
                  alt="TreeAI measurement technology with Rayco stump grinder"
                  width={600}
                  height={400}
                  className="rounded-lg"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Examples */}
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Real Examples: See How We Calculate Your Quote
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transparent breakdown of actual projects. Your price depends on precise measurement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-green-400 mb-2">Small Stump</h3>
                <div className="text-3xl font-bold text-white">$185</div>
                <p className="text-gray-400 text-sm">12" diameter × 18" deep</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Grinding time:</span>
                  <span className="text-white">25 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fuel & wear:</span>
                  <span className="text-white">$45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Labor cost:</span>
                  <span className="text-white">$85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cleanup:</span>
                  <span className="text-white">$25</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-300">Fair profit margin:</span>
                    <span className="text-green-400">$30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-amber-500/20">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-amber-400 mb-2">Medium Stump</h3>
                <div className="text-3xl font-bold text-white">$385</div>
                <p className="text-gray-400 text-sm">24" diameter × 24" deep</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Grinding time:</span>
                  <span className="text-white">45 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fuel & wear:</span>
                  <span className="text-white">$85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Labor cost:</span>
                  <span className="text-white">$165</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cleanup:</span>
                  <span className="text-white">$45</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-300">Fair profit margin:</span>
                    <span className="text-amber-400">$90</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-red-500/20">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-red-400 mb-2">Large Stump</h3>
                <div className="text-3xl font-bold text-white">$795</div>
                <p className="text-gray-400 text-sm">36" diameter × 30" deep</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Grinding time:</span>
                  <span className="text-white">90 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fuel & wear:</span>
                  <span className="text-white">$185</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Labor cost:</span>
                  <span className="text-white">$315</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cleanup:</span>
                  <span className="text-white">$85</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-300">Fair profit margin:</span>
                    <span className="text-red-400">$210</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-blue-300 font-medium">
                "Your actual price depends on precise measurement and site conditions. These examples show our transparent calculation method."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="quote-form" className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready for Your <span className="text-green-400">Transparent Quote</span>?
            </h2>
            <p className="text-xl text-gray-300">
              No surprises, just fair math-based pricing. We'll contact you within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      value={leadFormData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={leadFormData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={leadFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 outline-none"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Property Address *</label>
                  <input
                    type="text"
                    value={leadFormData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 outline-none"
                    placeholder="Street address for onsite estimate"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">Stump Details</label>
                  <textarea
                    value={leadFormData.stumpDetails}
                    onChange={(e) => handleInputChange('stumpDetails', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-500 outline-none"
                    rows={4}
                    placeholder="Number of stumps, approximate sizes, tree types (if known), access details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !validateForm()}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isSubmitting || !validateForm()
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-500 text-black'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Get My TreeAI Quote'}
                </button>

                {submitMessage && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    submitMessage.includes('Thank you') 
                      ? 'bg-green-900/30 border border-green-600/30 text-green-300'
                      : 'bg-red-900/30 border border-red-600/30 text-red-300'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-6">
                <h3 className="text-green-400 font-semibold mb-3">Our Process</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="text-green-400 font-bold">1.</span>
                    <span className="text-gray-300">You submit your information</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-400 font-bold">2.</span>
                    <span className="text-gray-300">We call back within 24 hours</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-400 font-bold">3.</span>
                    <span className="text-gray-300">Schedule onsite estimate + grinding</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-400 font-bold">4.</span>
                    <span className="text-gray-300">$75 service fee (credited if hired)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-green-400 font-bold">5.</span>
                    <span className="text-gray-300">Same-day completion when possible</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-6">
                <h3 className="text-amber-400 font-semibold mb-3">Why $75 Estimate Fee?</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Professional measurement with TreeAI technology requires specialized equipment and certified operators.
                </p>
                <p className="text-amber-300 text-sm font-medium">
                  Fee is credited toward your project when you hire us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">How is your pricing different from other companies?</h3>
              <p className="text-gray-300">
                Most companies guess or use "ballpark" pricing. We use TreeAI technology to measure precise dimensions and calculate exact operational costs. You get mathematical precision instead of guesswork, ensuring fair pricing every time.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">What does the $75 estimate fee cover?</h3>
              <p className="text-gray-300">
                The fee covers professional TreeAI measurement, travel time, and certified operator assessment. Unlike free estimates that build costs into higher pricing, we keep estimates separate for transparency. The $75 is credited toward your project if you hire us.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Can you really grind the stump the same day as the estimate?</h3>
              <p className="text-gray-300">
                Yes, in most cases. We bring our Rayco equipment to every estimate. If you approve our transparent quote onsite, we can often complete the grinding immediately. Complex jobs or scheduling conflicts may require a return visit.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">What size stumps can you handle?</h3>
              <p className="text-gray-300">
                Our Rayco equipment handles stumps from 6 inches to 4+ feet in diameter. We can grind up to 18 inches below grade. Larger stumps may require multiple passes, but TreeAI calculates exact timing and pricing for any size.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">Do you clean up the wood chips?</h3>
              <p className="text-gray-300">
                Basic cleanup (raking and dispersing chips) is included in every quote. If you want chips removed completely, that's an additional service calculated separately. Most customers use the chips as natural mulch.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">What areas do you serve?</h3>
              <p className="text-gray-300">
                We serve Central Florida including Hernando, Citrus, Pasco, Sumter, Marion, and Lake counties. Travel time is factored into TreeAI calculations, so pricing remains transparent regardless of location within our service area.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-green-400 mb-3">How quickly can you schedule an estimate?</h3>
              <p className="text-gray-300">
                Most estimates are scheduled within 48-72 hours of your call. Emergency situations (storm damage, safety hazards) can often be accommodated within 24 hours. We'll give you an exact timeframe when we call back.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}