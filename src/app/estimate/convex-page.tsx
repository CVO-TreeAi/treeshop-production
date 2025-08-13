'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import VegetationDensitySimulator from '@/components/VegetationDensitySimulator';

interface EstimateResult {
  package: string;
  pricePerAcre: number;
  baseTotal: number;
  travelSurcharge: number;
  finalTotal: number;
  travelTime: number;
  assumptions: string[];
  pricingMode: 'acre' | 'day';
  days?: number;
}

const DBH_PACKAGES = {
  small: { label: 'Small Package', dbh: '4" DBH & Under', pricePerAcre: 2150 },
  medium: { label: 'Medium Package', dbh: '6" DBH & Under', pricePerAcre: 2500 },
  large: { label: 'Large Package', dbh: '8" DBH & Under', pricePerAcre: 3140 },
  xlarge: { label: 'X-Large Package', dbh: '10" DBH & Under', pricePerAcre: Math.round(3140 * 1.326) }
};

export default function ConvexEstimatePage() {
  const createLead = useMutation(api.leads.createLead);
  const calculateEstimate = useMutation(api.estimates.calculateEstimate);
  
  const [formData, setFormData] = useState({
    projectAddress: '',
    parcelId: '',
    zipCode: '',
    acreage: '',
    selectedPackage: 'medium' as keyof typeof DBH_PACKAGES,
    obstacles: [] as string[],
    name: '',
    phone: '',
    email: '',
  });
  
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [leadCreated, setLeadCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const obstacleOptions = [
    'Large rocks/boulders', 
    'Fencing to remove/replace',
    'Power lines overhead',
    'Buildings/structures nearby', 
    'Septic system/utilities',
    'Wetlands/water features'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleObstacleChange = (obstacle: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      obstacles: checked 
        ? [...prev.obstacles, obstacle]
        : prev.obstacles.filter(o => o !== obstacle)
    }));
  };

  const handlePackageChange = (pkg: string) => {
    setFormData(prev => ({ ...prev, selectedPackage: pkg as keyof typeof DBH_PACKAGES }));
  };

  const validateLeadInfo = () => {
    return formData.name.trim().length > 0 && 
           formData.phone.trim().length > 0 && 
           formData.email.trim().length > 0 &&
           (formData.projectAddress.trim().length > 0 || formData.parcelId.trim().length > 0);
  };

  const handleCreateLead = async () => {
    if (!validateLeadInfo()) return;
    
    setIsLoading(true);
    try {
      // Extract ZIP code from address
      const address = formData.projectAddress || formData.parcelId;
      const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
      const zipCode = zipMatch ? zipMatch[0].slice(0, 5) : '34601';

      await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: address,
        zipCode: zipCode,
        acreage: parseFloat(formData.acreage || '0'),
        selectedPackage: formData.selectedPackage,
        obstacles: formData.obstacles,
        leadSource: 'website',
        leadPage: 'estimate',
        utmSource: new URLSearchParams(window.location.search).get('utm_source') || undefined,
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
        referrer: document.referrer || undefined,
      });

      setLeadCreated(true);
      setCurrentStep(2);
      
      // Set zipCode in formData for later use
      setFormData(prev => ({ ...prev, zipCode }));
    } catch (error) {
      console.error('Lead creation failed:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEstimate = async () => {
    if (!formData.acreage || parseFloat(formData.acreage) <= 0) return;
    
    setIsLoading(true);
    try {
      const calculation = await calculateEstimate({
        acreage: parseFloat(formData.acreage),
        packageType: formData.selectedPackage,
        obstacles: formData.obstacles,
        zipCode: formData.zipCode,
      });

      const packageInfo = DBH_PACKAGES[formData.selectedPackage];
      
      setResult({
        package: packageInfo.label,
        pricePerAcre: packageInfo.pricePerAcre,
        baseTotal: calculation.basePrice,
        travelSurcharge: calculation.travelSurcharge,
        finalTotal: calculation.totalPrice,
        travelTime: 45, // Default travel time
        assumptions: [
          `${formData.acreage} acres cleared to ${packageInfo.dbh} specification`,
          `Base rate: $${packageInfo.pricePerAcre.toLocaleString()}/acre`,
          'All vegetation under diameter limit will be mulched',
          'Material remains on site as natural mulch layer',
          'Pricing subject to site inspection confirmation'
        ],
        pricingMode: 'acre',
        days: calculation.estimatedDays,
      });

      setCurrentStep(4);
    } catch (error) {
      console.error('Estimate calculation failed:', error);
      alert('Failed to calculate estimate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateProjectInfo = () => {
    return formData.acreage.trim().length > 0 && parseFloat(formData.acreage) > 0;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Free <span className="text-green-500">Forestry Mulching</span> Estimate
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Get accurate DBH package pricing for your land clearing project
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 mb-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep >= 1 ? 'bg-green-600 text-black' : 'bg-gray-700'}`}>
                  {leadCreated ? '✓' : '1'}
                </div>
                <span className="ml-1 text-xs font-medium hidden xs:inline">Contact</span>
              </div>
              
              <div className={`w-4 h-0.5 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              
              <div className={`flex items-center ${currentStep >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep >= 2 ? 'bg-green-600 text-black' : 'bg-gray-700'}`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="ml-1 text-xs font-medium hidden xs:inline">Learn</span>
              </div>
              
              <div className={`w-4 h-0.5 ${currentStep >= 3 ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              
              <div className={`flex items-center ${currentStep >= 3 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep >= 3 ? 'bg-green-600 text-black' : 'bg-gray-700'}`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>
                <span className="ml-1 text-xs font-medium hidden xs:inline">Details</span>
              </div>
              
              <div className={`w-4 h-0.5 ${currentStep >= 4 ? 'bg-green-600' : 'bg-gray-700'}`}></div>
              
              <div className={`flex items-center ${currentStep >= 4 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${currentStep >= 4 ? 'bg-green-600 text-black' : 'bg-gray-700'}`}>
                  4
                </div>
                <span className="ml-1 text-xs font-medium hidden xs:inline">Quote</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Lead Capture */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  Get Your Free DBH Package Estimate
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Enter your contact information to unlock our professional pricing calculator.
                </p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-4 text-white text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="First and Last Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-4 text-white text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-4 text-white text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Project Address *
                  </label>
                  <input
                    type="text"
                    value={formData.projectAddress}
                    onChange={(e) => handleInputChange('projectAddress', e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-4 text-white text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="123 Oak Street, Brooksville, FL 34601"
                  />
                </div>
                
                <button
                  onClick={handleCreateLead}
                  disabled={!validateLeadInfo() || isLoading}
                  className={`w-full font-bold px-6 py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all touch-manipulation ${
                    validateLeadInfo() && !isLoading
                      ? 'bg-green-600 hover:bg-green-500 text-black' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Creating Lead...' : 'Unlock Pricing Calculator'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Sizing */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                <h3 className="text-xl font-bold text-white mb-4">Your Project Size</h3>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    How many acres do you want to clear? *
                  </label>
                  <input
                    type="number"
                    min="0.25"
                    step="0.25"
                    value={formData.acreage}
                    onChange={(e) => handleInputChange('acreage', e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-4 text-white text-base sm:text-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="e.g., 5.5"
                  />
                </div>

                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!validateProjectInfo()}
                  className={`w-full font-bold px-6 py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all touch-manipulation ${
                    validateProjectInfo()
                      ? 'bg-green-600 hover:bg-green-500 text-black' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Project Details
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                <h3 className="text-xl font-bold text-white mb-4">See Your Transformation</h3>
                <VegetationDensitySimulator
                  initialPackage={formData.selectedPackage}
                  onPackageChange={handlePackageChange}
                  showPricing={false}
                  acreage={0}
                  includeNoneStep
                  startAtNone
                  allowClearStage={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Site Challenges (Select all that apply)
                </label>
                <div className="space-y-2">
                  {obstacleOptions.map(obstacle => (
                    <label key={obstacle} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded">
                      <input
                        type="checkbox"
                        checked={formData.obstacles.includes(obstacle)}
                        onChange={(e) => handleObstacleChange(obstacle, e.target.checked)}
                        className="w-4 h-4 text-green-500 bg-black border-gray-700 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-300 text-sm">{obstacle}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateEstimate}
                disabled={!validateProjectInfo() || isLoading}
                className={`w-full font-bold px-6 py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all touch-manipulation ${
                  validateProjectInfo() && !isLoading
                    ? 'bg-green-600 hover:bg-green-500 text-black' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Generating...' : 'Generate My Proposal'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && result && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-400 mb-4">
                  🎉 Your Estimate is Ready!
                </h2>
                <p className="text-gray-300 text-lg">
                  <strong>{formData.name}</strong>, here's your professional forestry mulching proposal
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{result.package}</h3>
                    <p className="text-gray-400">{formData.acreage} acres • ${result.pricePerAcre.toLocaleString()}/acre</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-400">
                      ${result.finalTotal.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Total Project Cost</div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Base clearing cost:</span>
                    <span className="text-white">${result.baseTotal.toLocaleString()}</span>
                  </div>
                  
                  {result.travelSurcharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Travel surcharge:</span>
                      <span className="text-yellow-400">+${result.travelSurcharge.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-700" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-white">Final Total:</span>
                    <span className="text-green-400">${result.finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-white mb-4">Estimate Assumptions:</h3>
                <ul className="space-y-2">
                  {result.assumptions.map((assumption, index) => (
                    <li key={index} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
      </main>
      <Footer />
    </div>
  );
}