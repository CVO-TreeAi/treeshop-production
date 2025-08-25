'use client';

import { useState } from 'react';
import Script from 'next/script';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import EstimateCalculator from '@/components/EstimateCalculator';
import LandClearingCalculator from '@/components/LandClearingCalculator';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';
import SimpleProposalPDF from '@/components/SimpleProposalPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

interface ForestryEstimateData {
  address: string;
  acres: number;
  package: 'small' | 'medium' | 'large' | 'xlarge';
  transportTime: number;
  transportCost: number;
  baseTotal: number;
  cushion: number;
  finalProposal: number;
}

interface LandClearingEstimateData {
  address: string;
  acres: number;
  package: 'light' | 'average' | 'thick' | 'heavy' | 'wet';
  transportTime: number;
  transportCost: number;
  baseTotal: number;
  debrisCost: number;
  cushion: number;
  finalProposal: number;
  debrisYards: number;
  debrisIncluded: boolean;
}

type ServiceType = 'forestry' | 'land-clearing' | 'both';
type EstimateData = ForestryEstimateData | LandClearingEstimateData;

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

// Forestry Package labels for display
const FORESTRY_PACKAGE_LABELS = {
  'small': 'Small Package (4" DBH & Under)',
  'medium': 'Medium Package (6" DBH & Under)', 
  'large': 'Large Package (8" DBH & Under)',
  'xlarge': 'X-Large Package (10" DBH & Under)'
};

// Land Clearing Package labels for display
const LAND_CLEARING_PACKAGE_LABELS = {
  'light': 'Light Clearing (Light vegetation & brush)',
  'average': 'Average Clearing (Moderate vegetation & trees)',
  'thick': 'Thick Clearing (Dense vegetation & trees)',
  'heavy': 'Heavy Clearing (Very dense forest & large trees)',
  'wet': 'Wet Conditions (Wetland or swampy areas)'
};

export default function EstimatePage() {
  const [currentStep, setCurrentStep] = useState<'contact' | 'service' | 'project' | 'proposal'>('contact');
  const [selectedService, setSelectedService] = useState<ServiceType>('forestry');
  const [forestryEstimate, setForestryEstimate] = useState<ForestryEstimateData | null>(null);
  const [landClearingEstimate, setLandClearingEstimate] = useState<LandClearingEstimateData | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });
  const [projectAddress, setProjectAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForestryEstimateComplete = (estimateData: ForestryEstimateData) => {
    setForestryEstimate(estimateData);
  };

  const handleLandClearingEstimateComplete = (estimateData: LandClearingEstimateData) => {
    setLandClearingEstimate(estimateData);
  };

  const getCurrentEstimate = () => {
    if (selectedService === 'forestry') return forestryEstimate;
    if (selectedService === 'land-clearing') return landClearingEstimate;
    if (selectedService === 'both') return forestryEstimate || landClearingEstimate;
    return null;
  };

  const handleContactSubmit = () => {
    if (customerInfo.name && customerInfo.phone && customerInfo.email && projectAddress) {
      setCurrentStep('service');
    }
  };

  const handleServiceSelection = () => {
    setCurrentStep('project');
  };

  const handleProjectComplete = () => {
    const currentEstimate = getCurrentEstimate();
    if (currentEstimate) {
      setCurrentStep('proposal');
      submitLeadData();
    }
  };

  const submitLeadData = async () => {
    const currentEstimate = getCurrentEstimate();
    if (!currentEstimate) return;

    setIsSubmitting(true);
    try {
      // Submit lead information to backend
      const leadResponse = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: projectAddress,
          acreage: currentEstimate.acres,
          selectedPackage: currentEstimate.package,
          selectedService: selectedService,
          estimatedTotal: Math.round(currentEstimate.finalProposal),
          leadSource: 'website_estimate_v3',
          utmSource: '',
          utmMedium: '',
          utmCampaign: '',
          referrer: document.referrer || '',
        })
      });

      const leadResult = await leadResponse.json();
      
      if (leadResult.success) {
        // Send admin notification email
        await fetch('/api/send-gmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            emailType: 'admin_new_lead',
            data: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
              address: projectAddress,
              acreage: currentEstimate.acres,
              selectedPackage: currentEstimate.package,
              selectedService: selectedService,
              estimatedTotal: Math.round(currentEstimate.finalProposal),
              leadScore: currentEstimate.finalProposal >= 15000 || currentEstimate.acres >= 10 ? 'hot' : 
                        currentEstimate.acres >= 5 ? 'warm' : 'cold',
              leadSource: 'website_estimate_v3',
              utmSource: '',
              utmMedium: '',
              utmCampaign: '',
            }
          })
        });
      }
    } catch (error) {
      console.error('Lead submission error:', error);
    }
    setIsSubmitting(false);
  };

  const resetEstimate = () => {
    setCurrentStep('contact');
    setForestryEstimate(null);
    setLandClearingEstimate(null);
    setSelectedService('forestry');
    setCustomerInfo({ name: '', phone: '', email: '' });
    setProjectAddress('');
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      
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

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full">
              {/* Step 1: Contact */}
              <div className={`flex items-center ${currentStep !== 'contact' ? 'text-green-400' : 'text-green-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep !== 'contact' ? 'bg-green-600 text-black' : 'bg-green-600 text-black'
                }`}>
                  {currentStep !== 'contact' ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Contact</span>
              </div>
              
              <div className={`w-4 h-0.5 ${currentStep !== 'contact' ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              
              {/* Step 2: Service */}
              <div className={`flex items-center ${['service', 'project', 'proposal'].includes(currentStep) ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  ['project', 'proposal'].includes(currentStep) ? 'bg-green-600 text-black' : currentStep === 'service' ? 'bg-green-600 text-black' : 'bg-gray-700'
                }`}>
                  {['project', 'proposal'].includes(currentStep) ? '✓' : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Service</span>
              </div>
              
              <div className={`w-4 h-0.5 ${['project', 'proposal'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              
              {/* Step 3: Project */}
              <div className={`flex items-center ${['project', 'proposal'].includes(currentStep) ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep === 'proposal' ? 'bg-green-600 text-black' : currentStep === 'project' ? 'bg-green-600 text-black' : 'bg-gray-700'
                }`}>
                  {currentStep === 'proposal' ? '✓' : '3'}
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
              </div>
              
              <div className={`w-4 h-0.5 ${currentStep === 'proposal' ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              
              {/* Step 4: Proposal */}
              <div className={`flex items-center ${currentStep === 'proposal' ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep === 'proposal' ? 'bg-green-600 text-black' : 'bg-gray-700'
                }`}>
                  4
                </div>
                <span className="ml-2 text-sm font-medium">Proposal</span>
              </div>
            </div>
          </div>

          {/* Step 1: Contact Information & Address */}
          {currentStep === 'contact' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Get Started with Your Free Estimate
                  </h2>
                  <p className="text-white">
                    We'll use your contact information and project address to provide accurate pricing
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
                      placeholder="First and Last Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      Project Address *
                    </label>
                    <GooglePlacesAutocomplete
                      value={projectAddress}
                      onChange={setProjectAddress}
                      className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
                      placeholder="123 Oak Street, Brooksville, FL 34601"
                    />
                    <p className="text-xs text-white mt-1">Full address of the property to be cleared</p>
                  </div>
                  
                  <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 mt-1">🔒</div>
                      <div>
                        <h3 className="font-semibold text-green-400 mb-2">Your Information is Secure</h3>
                        <ul className="text-sm text-white space-y-1">
                          <li>• Used only for providing your estimate and project communication</li>
                          <li>• We'll validate your proposal and follow up within 4 hours</li>
                          <li>• No spam or unwanted calls - only project-related contact</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleContactSubmit}
                    disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.email || !projectAddress}
                    className={`w-full font-bold px-6 py-4 rounded-lg text-lg transition-all ${
                      customerInfo.name && customerInfo.phone && customerInfo.email && projectAddress
                        ? 'bg-green-600 hover:bg-green-500 text-black' 
                        : 'bg-gray-700 text-white cursor-not-allowed'
                    }`}
                  >
                    Continue to Service Selection →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 'service' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Choose Your Service
                </h2>
                <p className="text-white">
                  Select the type of land management service you need
                </p>
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3 mt-4 text-sm">
                  <span className="text-green-400">✓ {customerInfo.name} • {projectAddress}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Forestry Mulching */}
                <div 
                  onClick={() => setSelectedService('forestry')}
                  className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                    selectedService === 'forestry'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">🌲</div>
                    <h3 className="text-xl font-bold text-white mb-3">Forestry Mulching</h3>
                    <p className="text-white text-sm mb-4">
                      Cut and mulch vegetation in place. Environmentally friendly - no debris removal needed.
                    </p>
                    <div className="bg-blue-600/10 rounded p-3 text-xs text-white">
                      <div className="font-semibold mb-1">Package Options:</div>
                      <div>Small (4"), Medium (6"), Large (8"), X-Large (10")</div>
                      <div className="mt-2 text-white opacity-75">Professional forestry mulching service</div>
                    </div>
                  </div>
                </div>

                {/* Land Clearing */}
                <div 
                  onClick={() => setSelectedService('land-clearing')}
                  className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                    selectedService === 'land-clearing'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">🏞️</div>
                    <h3 className="text-xl font-bold text-white mb-3">Land Clearing</h3>
                    <p className="text-white text-sm mb-4">
                      Complete vegetation removal with debris haul-away. Perfect for development preparation.
                    </p>
                    <div className="bg-blue-600/10 rounded p-3 text-xs text-white">
                      <div className="font-semibold mb-1">Package Options:</div>
                      <div>Light, Average, Thick, Heavy, Wet Conditions</div>
                      <div className="mt-2 text-white opacity-75">Complete vegetation removal service</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Both Services Option */}
              <div className="mb-8">
                <div 
                  onClick={() => setSelectedService('both')}
                  className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
                    selectedService === 'both'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">🌲🏞️</div>
                    <h3 className="text-xl font-bold text-white mb-3">Compare Both Services</h3>
                    <p className="text-white text-sm">
                      Get pricing for both forestry mulching and land clearing to compare your options
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep('contact')}
                  className="text-white hover:text-white transition-colors"
                >
                  ← Back to Contact Info
                </button>
                
                <button
                  onClick={handleServiceSelection}
                  className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg"
                >
                  Continue to Project Details →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Project Details */}
          {currentStep === 'project' && (
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Project Details
                </h2>
                <p className="text-white">
                  {selectedService === 'both' 
                    ? 'Get pricing for both services to compare your options'
                    : `Tell us about your ${selectedService === 'forestry' ? 'forestry mulching' : 'land clearing'} project`
                  }
                </p>
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3 mt-4 text-sm">
                  <span className="text-green-400">
                    ✓ {customerInfo.name} • {projectAddress} • 
                    {selectedService === 'forestry' && ' Forestry Mulching'}
                    {selectedService === 'land-clearing' && ' Land Clearing'}
                    {selectedService === 'both' && ' Both Services'}
                  </span>
                </div>
              </div>
              
              {selectedService === 'both' ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  <EstimateCalculator 
                    onEstimateComplete={handleForestryEstimateComplete}
                    initialAddress={projectAddress}
                  />
                  <LandClearingCalculator 
                    onEstimateComplete={handleLandClearingEstimateComplete}
                    initialAddress={projectAddress}
                  />
                </div>
              ) : selectedService === 'forestry' ? (
                <EstimateCalculator 
                  onEstimateComplete={handleForestryEstimateComplete}
                  initialAddress={projectAddress}
                />
              ) : (
                <LandClearingCalculator 
                  onEstimateComplete={handleLandClearingEstimateComplete}
                  initialAddress={projectAddress}
                />
              )}
              
              {getCurrentEstimate() && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleProjectComplete}
                    className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg"
                  >
                    {selectedService === 'both' 
                      ? 'Compare Services →' 
                      : 'Get My Proposal →'
                    }
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentStep('service')}
                  className="text-white hover:text-white transition-colors"
                >
                  ← Back to Service Selection
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Proposal */}
          {currentStep === 'proposal' && getCurrentEstimate() && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-green-400 mb-4">
                    🎉 Your Proposal is Ready!
                  </h2>
                  <p className="text-white text-lg">
                    <strong>{customerInfo.name}</strong>, here's your 
                    {selectedService === 'both' ? ' service comparison' :
                     selectedService === 'forestry' ? ' forestry mulching proposal' :
                     ' land clearing proposal'}
                  </p>
                </div>

                {selectedService === 'both' && forestryEstimate && landClearingEstimate ? (
                  // Both services comparison
                  <div className="space-y-8 mb-8">
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Forestry Mulching Option */}
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">🌲 Forestry Mulching</h3>
                          <div className="text-3xl font-bold text-green-400">
                            ${Math.round(forestryEstimate.finalProposal).toLocaleString()}
                          </div>
                          <div className="text-sm text-white mt-2">
                            {forestryEstimate.acres} acres • {FORESTRY_PACKAGE_LABELS[forestryEstimate.package]}
                          </div>
                        </div>
                        <div className="text-xs text-white space-y-1">
                          <div>• Mulch vegetation in place</div>
                          <div>• Environmentally friendly</div>
                          <div>• No debris removal needed</div>
                        </div>
                      </div>

                      {/* Land Clearing Option */}
                      <div className="bg-gray-800 rounded-lg p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">🏞️ Land Clearing</h3>
                          <div className="text-3xl font-bold text-green-400">
                            ${Math.round(landClearingEstimate.finalProposal).toLocaleString()}
                          </div>
                          <div className="text-sm text-white mt-2">
                            {landClearingEstimate.acres} acres • {LAND_CLEARING_PACKAGE_LABELS[landClearingEstimate.package]}
                          </div>
                        </div>
                        <div className="text-xs text-white space-y-1">
                          <div>• Complete vegetation removal</div>
                          {landClearingEstimate.debrisIncluded && <div>• {landClearingEstimate.debrisYards} yards debris haul</div>}
                          <div>• Ready for development</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-2">📊 Cost Comparison</h3>
                        <div className="text-sm text-white">
                          <strong>Forestry Mulching:</strong> ${Math.round(forestryEstimate.finalProposal).toLocaleString()} 
                          {landClearingEstimate.finalProposal < forestryEstimate.finalProposal && <span className="text-green-400"> (Higher Cost)</span>}
                          {landClearingEstimate.finalProposal > forestryEstimate.finalProposal && <span className="text-blue-400"> (Lower Cost)</span>}
                        </div>
                        <div className="text-sm text-white mt-1">
                          <strong>Land Clearing:</strong> ${Math.round(landClearingEstimate.finalProposal).toLocaleString()}
                          {landClearingEstimate.finalProposal > forestryEstimate.finalProposal && <span className="text-green-400"> (Higher Cost)</span>}
                          {landClearingEstimate.finalProposal < forestryEstimate.finalProposal && <span className="text-blue-400"> (Lower Cost)</span>}
                        </div>
                        <div className="text-xs text-white mt-3">
                          <strong>Savings:</strong> Choose forestry mulching to save ${Math.abs(Math.round(landClearingEstimate.finalProposal - forestryEstimate.finalProposal)).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Single service display
                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Project Summary */}
                    <div>
                      <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Project Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-white">Property Address:</span>
                            <span className="text-white text-right text-sm">{projectAddress}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Project Size:</span>
                            <span className="text-white">{getCurrentEstimate()?.acres} acres</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Service Type:</span>
                            <span className="text-white">{selectedService === 'forestry' ? 'Forestry Mulching' : 'Land Clearing'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white">Package:</span>
                            <span className="text-white text-right text-sm">
                              {selectedService === 'forestry' && forestryEstimate 
                                ? FORESTRY_PACKAGE_LABELS[forestryEstimate.package]
                                : landClearingEstimate 
                                ? LAND_CLEARING_PACKAGE_LABELS[landClearingEstimate.package]
                                : 'N/A'
                              }
                            </span>
                          </div>
                          {selectedService === 'land-clearing' && landClearingEstimate?.debrisIncluded && (
                            <div className="flex justify-between">
                              <span className="text-white">Debris Haul:</span>
                              <span className="text-white">{landClearingEstimate.debrisYards} yards</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6 mt-4">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-green-400 mb-2">Your Project Total</h3>
                          <div className="text-4xl font-bold text-green-400 mb-2">
                            ${Math.round(getCurrentEstimate()!.finalProposal).toLocaleString()}
                          </div>
                          <p className="text-white text-sm">
                            This price is based on the information you provided.<br/>
                            We'll validate this proposal at our office and follow up to confirm all details with you.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Unified Next Steps Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">What Happens Next</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <div className="font-semibold text-white">Office Validation</div>
                        <div className="text-white text-sm">Our team validates your proposal within 4 hours during business hours</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <div className="font-semibold text-white">Personal Follow-Up</div>
                        <div className="text-white text-sm">We'll contact you to confirm details and answer any questions</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <div className="font-semibold text-white">Project Scheduling</div>
                        <div className="text-white text-sm">Schedule your land transformation at a convenient time</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-600/20 rounded-lg p-4 mt-6">
                    <p className="text-green-300 text-sm font-medium">
                      💰 <strong>Price Lock:</strong> This pricing is guaranteed for 30 days from today.
                    </p>
                  </div>
                </div>
                
                {/* PDF Download */}
                {getCurrentEstimate() && (
                  <div className="text-center mb-6">
                    <PDFDownloadLink
                      document={
                        <SimpleProposalPDF
                          data={{
                            customerName: customerInfo.name,
                            customerEmail: customerInfo.email,
                            projectAddress: projectAddress,
                            acreage: getCurrentEstimate()!.acres,
                            packageType: getCurrentEstimate()!.package,
                            totalPrice: Math.round(getCurrentEstimate()!.finalProposal),
                            basePrice: getCurrentEstimate()!.baseTotal,
                            travelSurcharge: getCurrentEstimate()!.transportCost,
                            obstacleAdjustment: 0,
                            assumptions: [
                              `${getCurrentEstimate()!.acres} acres ${
                                selectedService === 'forestry' && forestryEstimate 
                                  ? FORESTRY_PACKAGE_LABELS[forestryEstimate.package]
                                  : selectedService === 'land-clearing' && landClearingEstimate
                                  ? LAND_CLEARING_PACKAGE_LABELS[landClearingEstimate.package]
                                  : 'Package'
                              }`, 
                              'Price includes 10% project cushion', 
                              'Subject to office validation and site confirmation'
                            ],
                            estimatedDays: Math.ceil(getCurrentEstimate()!.acres * 0.5),
                          }}
                        />
                      }
                      fileName={`TreeShop-${selectedService === 'forestry' ? 'Forestry' : selectedService === 'land-clearing' ? 'LandClearing' : 'Estimate'}-${customerInfo.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`}
                      className="inline-block bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg mb-4"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? 'Preparing PDF...' : '📥 Download Your Proposal PDF'
                      }
                    </PDFDownloadLink>
                  </div>
                )}
                
                <div className="text-center">
                  <button
                    onClick={resetEstimate}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    Start New Estimate
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}