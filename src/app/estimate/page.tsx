'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import VegetationDensitySimulator from '@/components/VegetationDensitySimulator';
import AutoScrollList from '@/components/AutoScrollList';
import SimpleProposalPDF from '@/components/SimpleProposalPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

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

// DBH Package definitions (matching the VegetationDensitySimulator)
const DBH_PACKAGES = {
  small: { label: 'Small Package', dbh: '4" DBH & Under', pricePerAcre: 2150 },
  medium: { label: 'Medium Package', dbh: '6" DBH & Under', pricePerAcre: 2500 },
  large: { label: 'Large Package', dbh: '8" DBH & Under', pricePerAcre: 3140 },
  xlarge: { label: 'X-Large Package', dbh: '10" DBH & Under', pricePerAcre: Math.round(3140 * 1.326) }
};

// Extract ZIP code from address or use parcel ID to estimate location
function extractZipFromAddress(address: string, parcelId: string): string {
  // Try to extract ZIP from address first
  const zipMatch = address.match(/\b\d{5}(-\d{4})?\b/);
  if (zipMatch) {
    return zipMatch[0].slice(0, 5);
  }
  
  // If no ZIP found in address and we have parcel ID, 
  // use default Central Florida ZIP (this could be enhanced with parcel lookup)
  if (parcelId) {
    return '34601'; // Default to Brooksville area
  }
  
  return '34601'; // Default fallback
}

// Travel time calculation (approximate from Brooksville, FL - your base)
function calculateTravelTime(zipCode: string): number {
  const zip = zipCode.slice(0, 5);
  
  // Central Florida zip codes and approximate travel times in minutes
  const travelTimes: Record<string, number> = {
    // Hernando County (close)
    '34601': 15, '34602': 10, '34604': 5, '34609': 20, '34613': 25,
    // Citrus County 
    '34428': 35, '34429': 40, '34433': 45, '34434': 50, '34446': 30,
    // Pasco County
    '34610': 30, '34637': 35, '34638': 40, '34639': 45, '34654': 50,
    // Lake County
    '34711': 60, '34712': 50, '34715': 45, '34729': 55, '34736': 40,
    // Polk County
    '33823': 70, '33844': 65, '33881': 75, '33896': 80,
    // Default for unknown zips
    'default': 45
  };
  
  return travelTimes[zip] || travelTimes['default'];
}

export default function EstimatePage(){
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  const createLead = useMutation(api.leads.createLead);
  const [formData, setFormData] = useState({
    projectAddress: '',
    parcelId: '',
    zipCode: '', // Keep for travel calculation
    acreage: '',
    selectedPackage: 'medium' as keyof typeof DBH_PACKAGES,
    obstacles: [] as string[],
    name: '',
    phone: '',
    email: '',
  });
  // Removed day rate option - keeping only per-acre pricing

  const [result, setResult] = useState<EstimateResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1 = lead info, 2 = education/presale, 3 = project details, 4 = estimated proposal
  const [leadCreated, setLeadCreated] = useState(false);

  const obstacleOptions = [
    'Large rocks/boulders', 
    'Fencing to remove/replace',
    'Power lines overhead',
    'Buildings/structures nearby', 
    'Septic system/utilities',
    'Wetlands/water features'
  ];

  async function calculateEstimate(sendCustomerEmail = false) {
    const acres = parseFloat(formData.acreage || '0');
    if (!acres || acres <= 0 || (!formData.projectAddress && !formData.parcelId)) {
      setResult(null);
      return;
    }

    try {
      // Try AI-powered estimation first
      const response = await fetch(`${BASE_PATH}/api/ai/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acreage: acres,
          vegetationDensity: formData.selectedPackage === 'small' ? 'light' : 
                            formData.selectedPackage === 'medium' ? 'medium' : 
                            formData.selectedPackage === 'large' ? 'heavy' : 'very-heavy',
          terrain: 'flat', // Default - could be expanded with terrain input
          access: 'good', // Default - could be expanded with access input
          obstacles: formData.obstacles,
          stumpRemoval: false // Could be added as an option
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiEstimate = data.estimate;
        
        // Convert AI estimate to our expected format
        const extractedZip = extractZipFromAddress(formData.projectAddress, formData.parcelId);
        const travelMinutes = calculateTravelTime(extractedZip);
        
        // Calculate AI final total and apply project minimum
        let aiFinalTotal = Math.round(aiEstimate.priceRange.min + ((aiEstimate.priceRange.max - aiEstimate.priceRange.min) / 2));
        const PROJECT_MINIMUM = 1900;
        const wasMinimumApplied = aiFinalTotal < PROJECT_MINIMUM;
        if (wasMinimumApplied) {
          aiFinalTotal = PROJECT_MINIMUM;
        }
        
        const aiAssumptions = [
          ...aiEstimate.assumptions,
          'AI-powered pricing based on property analysis',
          `Confidence level: ${aiEstimate.confidence}%`,
          'Final pricing subject to site inspection'
        ];
        
        if (wasMinimumApplied) {
          aiAssumptions.push(`$${PROJECT_MINIMUM.toLocaleString()} project minimum applied`);
        }
        
        setResult({
          package: DBH_PACKAGES[formData.selectedPackage].label,
          pricePerAcre: Math.round(aiEstimate.basePrice / acres),
          baseTotal: aiEstimate.basePrice,
          travelSurcharge: 0, // AI pricing includes travel considerations
          finalTotal: aiFinalTotal,
          travelTime: travelMinutes,
          assumptions: aiAssumptions,
          pricingMode: 'acre',
          days: aiEstimate.timeEstimate.days,
        });
        return;
      }
    } catch (error) {
      console.warn('AI estimation failed, using fallback:', error);
    }

    // Fallback to original calculation method
    const packageInfo = DBH_PACKAGES[formData.selectedPackage] || DBH_PACKAGES['medium'];
    let baseTotal = acres * packageInfo.pricePerAcre;
    
    // Extract ZIP code from address for travel calculation
    const extractedZip = extractZipFromAddress(formData.projectAddress, formData.parcelId);
    const travelMinutes = calculateTravelTime(extractedZip);
    let travelSurcharge = baseTotal * 0.15 * Math.max(0, (travelMinutes - 30) / 60); // 15% per hour over 30 min base
    
    // Obstacle factor
    const obstacleFactor = 1 + (formData.obstacles.length * 0.05); // 5% per obstacle

    let adjustedTotal = (baseTotal + travelSurcharge) * obstacleFactor;
    
    // Apply project minimum of $1900
    const PROJECT_MINIMUM = 1900;
    const wasMinimumApplied = adjustedTotal < PROJECT_MINIMUM;
    if (wasMinimumApplied) {
      adjustedTotal = PROJECT_MINIMUM;
    }
    
    // Generate assumptions (simplified for PDF)
    const assumptions = [];
    
    if (travelMinutes > 30) {
      assumptions.push(`Travel surcharge applied for ${Math.round(travelMinutes)} min travel time`);
    }
    
    if (formData.obstacles.length > 0) {
      assumptions.push(`${formData.obstacles.length} site complications considered`);
    }
    
    if (wasMinimumApplied) {
      assumptions.push(`$${PROJECT_MINIMUM.toLocaleString()} project minimum applied`);
    }

    const estimateResult = {
      package: packageInfo.label,
      pricePerAcre: packageInfo.pricePerAcre,
      baseTotal: Math.round(baseTotal),
      travelSurcharge: Math.round(travelSurcharge),
      finalTotal: Math.round(adjustedTotal),
      travelTime: travelMinutes,
      assumptions,
      pricingMode: 'acre' as const,
      days: Math.ceil(acres * 0.5), // Estimated days based on acreage
    };

    setResult(estimateResult);

    // Send admin notification with actual pricing
    if (sendCustomerEmail && estimateResult.finalTotal) {
      setTimeout(async () => {
        try {
          console.log('🔍 DEBUG: Sending admin notification email');
          
          const adminEmailResponse = await fetch('/api/send-gmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              emailType: 'admin_new_lead',
              data: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.projectAddress || formData.parcelId,
                acreage: acres,
                selectedPackage: formData.selectedPackage,
                obstacles: formData.obstacles || [],
                estimatedTotal: estimateResult.finalTotal,
                leadScore: estimateResult.finalTotal >= 15000 || acres >= 10 ? 'hot' : 
                          acres >= 5 ? 'warm' : 'cold',
                leadSource: 'website',
                utmSource: '',
                utmMedium: '',
                utmCampaign: '',
              }
            })
          });
          
          const adminEmailResult = await adminEmailResponse.json();
          console.log('Admin notification email result:', adminEmailResult);
        } catch (error) {
          console.error('Error sending admin notification email:', error);
        }
      }, 500); // Small delay to ensure UI updates first
    }
  }

  useEffect(() => {
    if (formData.acreage && (formData.projectAddress || formData.parcelId) && currentStep === 2) {
      calculateEstimate();
    }
  }, [formData.acreage, formData.projectAddress, formData.parcelId, formData.selectedPackage, formData.obstacles, currentStep]);

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
    console.log('handleCreateLead called!');
    if (!validateLeadInfo()) {
      console.log('Validation failed');
      return;
    }
    
    console.log('Attempting to create lead with data:', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.projectAddress || formData.parcelId
    });

    // Move to step 2 immediately for better UX
    setLeadCreated(true);
    setCurrentStep(2);

    // Create lead in background (non-blocking)
    fetch('/api/leads/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.projectAddress || formData.parcelId,
        zipCode: extractZipFromAddress(formData.projectAddress, formData.parcelId),
        acreage: parseFloat(formData.acreage || '0'),
        selectedPackage: formData.selectedPackage,
        obstacles: formData.obstacles,
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        referrer: document.referrer || '',
      })
    }).then(response => response.json())
      .then(result => {
        console.log('Lead capture result (background):', result);
        if (!result.success) {
          console.error('Background lead capture failed:', result.error);
        }
      })
      .catch(e => {
        console.error('Background lead creation error:', e);
      });
  };

  const validateProjectInfo = () => {
    return formData.acreage.trim().length > 0 && parseFloat(formData.acreage) > 0;
  };

  const handleContinueToDetails = () => {
    if (validateProjectInfo()) {
      setCurrentStep(3);
    }
  };

  const handleGenerateProposal = () => {
    if (validateProjectInfo()) {
      calculateEstimate(true); // Send admin notification when generating final proposal
      setCurrentStep(4);
    }
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
          
          {/* Progress Indicator - Mobile Optimized */}
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
          
          {/* Mobile Step Indicator */}
          <div className="text-center mb-4">
            <span className="text-sm text-gray-400">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Contact Info' :
                currentStep === 2 ? 'Learn & Size' :
                currentStep === 3 ? 'Project Details' :
                'Your Estimate'
              }
            </span>
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
                  Enter your contact information to unlock our professional pricing calculator and receive your personalized estimate.
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
                  <p className="text-xs text-gray-400 mt-1">Full street address of the property to be cleared</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Parcel ID (Alternative)
                  </label>
                  <input
                    type="text"
                    value={formData.parcelId}
                    onChange={(e) => handleInputChange('parcelId', e.target.value)}
                    className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-4 text-white text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    placeholder="e.g., 12-34-567-89.000"
                  />
                  <p className="text-xs text-gray-400 mt-1">If no street address, provide county parcel ID number</p>
                </div>
                
                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-green-400 mt-1">🔒</div>
                    <div>
                      <h3 className="font-semibold text-green-400 mb-2">Why We Need Your Information</h3>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Provide accurate travel-time based pricing</li>
                        <li>• Send your detailed estimate via email</li>
                        <li>• Optional on-site consultation when required</li>
                        <li>• No spam - we only contact you about your project</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCreateLead}
                  disabled={!validateLeadInfo()}
                  className={`w-full font-bold px-6 py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all touch-manipulation ${
                    validateLeadInfo() 
                      ? 'bg-green-600 hover:bg-green-500 text-black' 
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Unlock Pricing Calculator
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Education/Presale */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                Transform Your Land with <span className="text-green-500">Precision Forestry Mulching</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300">
                Discover how selective clearing unlocks your property's potential while preserving what matters most
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-8 sm:mb-12">
              {/* Education Content */}
              <div className="space-y-6 lg:space-y-8">
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">What is Forestry Mulching?</h3>
                  <p className="text-gray-300 mb-4">
                    Unlike traditional land clearing that strips everything away, forestry mulching is a precision science. 
                    Our Fecon drum mulchers selectively target vegetation based on exact diameter measurements (DBH - Diameter at Breast Height).
                  </p>
                  <p className="text-gray-300">
                    <strong className="text-green-400">The result?</strong> A perfectly curated landscape that opens up your land while preserving 
                    mature trees that provide shade, beauty, and property value.
                  </p>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Hidden Benefits Most People Don't Know</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm">📶</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400">Dramatically Improved Cell Signal</h4>
                        <p className="text-gray-300 text-sm">Dense undergrowth blocks cell towers. After mulching, customers report 2-3 bar improvements in signal strength.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm">💨</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400">Cool, Fresh Airflow</h4>
                        <p className="text-gray-300 text-sm">Open understory creates natural air corridors. Cool breezes flow under the mature canopy, making your property 5-10° cooler.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm">🏡</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400">Instant Property Value Increase</h4>
                        <p className="text-gray-300 text-sm">Cleared land is usable land. Typical ROI: $3-5 back for every $1 invested in professional clearing.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm">🌿</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400">Natural Mulch = Soil Enrichment</h4>
                        <p className="text-gray-300 text-sm">All cleared vegetation becomes nutrient-rich mulch that prevents erosion and feeds remaining trees.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-black font-bold text-sm">🛡️</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400">Fire Safety & Wildlife Management</h4>
                        <p className="text-gray-300 text-sm">Reduces fire risk by removing ladder fuels while creating natural firebreaks and wildlife corridors.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-3">Why Hire Tree Shop for Mulching</h3>
                  <p className="text-sm text-gray-300 mb-3">Beyond our transparent, smooth experience, here’s what actually improves your land and protects its value in Florida.</p>
                  <AutoScrollList
                    className="h-48"
                    speed={28}
                    items={[
                      'Eco‑friendly: no burning or hauling — mulch stays on site',
                      'Erosion control during Florida downpours',
                      'Soil health: organic mulch enriches and cools roots',
                      'Wildfire risk reduction with natural firebreaks',
                      'Pro removal of invasive species (Brazilian pepper, melaleuca, etc.)',
                      'Minimal ground disturbance with low‑PSI track machines',
                      'Single‑machine efficiency keeps costs down',
                      'Faster completion — more acres per day',
                      'Better aesthetics and immediate usability',
                      'Habitat restoration and native plant comeback',
                      'Works on slopes, sandy soils, and wet areas',
                      'Weed suppression without herbicides',
                      'No debris piles or smoke — safer and cleaner',
                      'Supports wetlands/riparian conservation when applicable',
                      'Quiet enough for residential neighborhoods',
                      'Development‑ready finish with clear specs',
                    ]}
                  />
                </div>
              </div>

              {/* Simulator and Project Input */}
              <div className="space-y-6">
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
                    <p className="text-xs text-gray-400 mt-1">Most projects range from 1-20 acres</p>
                  </div>

                  {/* Removed day rate option - keeping only per-acre pricing */}
                </div>

                {/* 2D Ground-Level Simulator */}
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                  <h3 className="text-xl font-bold text-white mb-4">See Your Transformation</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    This shows what you'll see from ground level. Slide to compare how different DBH packages affect your view and openness.
                  </p>
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

                <button
                  onClick={handleContinueToDetails}
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
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {currentStep === 3 && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Final Project Details
              </h2>
              <p className="text-gray-300">
                Help us understand any site-specific challenges for the most accurate proposal.
              </p>
              <div className="mt-4 p-3 bg-green-600/10 rounded">
                <p className="text-sm text-green-400">
                  ✓ {formData.name} • {formData.acreage} acres • {DBH_PACKAGES[formData.selectedPackage].label}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">Project Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Property Location:</span>
                    <span className="text-white">{formData.zipCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Acres to Clear:</span>
                    <span className="text-white">{formData.acreage} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Selected Package:</span>
                    <span className="text-green-400">{DBH_PACKAGES[formData.selectedPackage].label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Clearing Spec:</span>
                    <span className="text-white">{DBH_PACKAGES[formData.selectedPackage].dbh}</span>
                  </div>
                </div>
              </div>

              <div>
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
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 mt-4">
                  <p className="text-blue-300 text-xs">
                    💡 <strong>Why we ask:</strong> These details help us avoid surprises like wetland restrictions, 
                    utility conflicts, or access challenges that could affect timeline and pricing.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">What Happens Next:</h4>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-black flex items-center justify-center text-xs font-bold">1</span>
                    <span>Instant proposal based on your specifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-black flex items-center justify-center text-xs font-bold">2</span>
                    <span>Office validation within 4 hours during business hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-600 text-black flex items-center justify-center text-xs font-bold">3</span>
                     <span>Optional on-site consultation when required</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleGenerateProposal}
                disabled={!validateProjectInfo()}
                className={`w-full font-bold px-6 py-4 sm:px-8 rounded-xl text-base sm:text-lg transition-all touch-manipulation ${
                  validateProjectInfo() 
                    ? 'bg-green-600 hover:bg-green-500 text-black' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Generate My Proposal
              </button>
            </div>
          </div>

          {/* Preview Section for Step 3 */}
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2h2v2H7V4zm0 4h2v2H7V8zm0 4h2v2H7v-2zm4-8h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Almost There!</h3>
              <p className="text-gray-400 mb-6">
                One more step to get your professional forestry mulching proposal.
              </p>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-green-400 mb-3">Your Proposal Will Include:</h4>
                <ul className="text-sm text-gray-300 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Detailed project breakdown with timeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Travel-adjusted pricing for {formData.zipCode}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Site challenge considerations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Professional equipment specifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Environmental impact assessment</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>Important:</strong> This proposal requires office validation to ensure accuracy and avoid surprises like wetland restrictions or permit requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Step 4: Estimated Proposal */}
        {currentStep === 4 && result && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                🎉 Your Estimated Proposal is Ready!
              </h2>
              <p className="text-gray-300 text-lg">
                <strong>{formData.name}</strong>, here's your professional forestry mulching proposal for {formData.zipCode}
              </p>
              <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4 mt-6">
                <p className="text-yellow-300">
                  <strong>Important:</strong> This proposal needs validation by our office at Tree Shop to ensure we avoid surprises like wetlands, permit requirements, or access challenges. Once validated, we'll reach out to start the next step with you.
                </p>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Estimate Details */}
              <div>
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{result.package}</h3>
                      <p className="text-gray-400">{parseFloat(formData.acreage)} acres</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">
                        ${result.finalTotal?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-400">Total Project Cost</div>
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
              
              {/* Next Steps */}
              <div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-4">Your VIP Process (Zero Surprises Guarantee):</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-xs">1</div>
                      <div>
                        <div className="font-semibold text-white">Download Your Proposal</div>
                        <div className="text-gray-400">Get your detailed estimate as a professional PDF document</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-xs">2</div>
                      <div>
                        <div className="font-semibold text-white">Office Validation</div>
                        <div className="text-gray-400">Tree Shop office validates pricing & checks for wetlands/permits (4hrs max)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-xs">3</div>
                      <div>
                        <div className="font-semibold text-white">Personal Outreach</div>
                    <div className="text-gray-400">We follow up to confirm details and next steps (on-site only if needed)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600 text-black flex items-center justify-center font-bold text-xs">4</div>
                      <div>
                        <div className="font-semibold text-white">Land Transformation</div>
                        <div className="text-gray-400">Professional mulching with guaranteed finish points & zero cleanup required</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-600/20 rounded-lg p-4 mt-6">
                    <p className="text-green-300 text-sm font-medium">
                      💰 <strong>Value Lock:</strong> This pricing is guaranteed for 30 days. Materials, labor, fuel - everything locked in at today's rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* PDF Download Section */}
          <div className="text-center mb-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">📄 Download Your Professional Proposal</h3>
              <p className="text-gray-300 mb-6">
                Get your detailed estimate as a professional PDF document that you can save, print, or share.
              </p>
              
              <PDFDownloadLink
                document={
                  <SimpleProposalPDF
                    data={{
                      customerName: formData.name,
                      customerEmail: formData.email,
                      projectAddress: formData.projectAddress || formData.parcelId,
                      acreage: parseFloat(formData.acreage || '0'),
                      packageType: formData.selectedPackage,
                      totalPrice: result.finalTotal,
                      basePrice: result.baseTotal,
                      travelSurcharge: result.travelSurcharge,
                      obstacleAdjustment: 0,
                      assumptions: result.assumptions,
                      estimatedDays: result.days || Math.ceil(parseFloat(formData.acreage || '0') * 0.5),
                    }}
                  />
                }
                fileName={`TreeShop-Estimate-${formData.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`}
                className="inline-block bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                {({ blob, url, loading, error }) =>
                  loading ? 'Preparing PDF...' : '📥 Download Your Proposal PDF'
                }
              </PDFDownloadLink>
              
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mt-6">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Pro Tip:</strong> Save this PDF to your phone or computer. It contains all the details you need when discussing the project with our team or other contractors.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => {
                setCurrentStep(1);
                setLeadCreated(false);
                setResult(null);
                setFormData({
                  projectAddress: '',
                  parcelId: '',
                  zipCode: '',
                  acreage: '',
                  selectedPackage: 'medium',
                  obstacles: [],
                  name: '',
                  phone: '',
                  email: '',
                });
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start New Estimate
            </button>
          </div>
        </div>
        )}
        
      </main>
      <Footer />
    </div>
  );
}
