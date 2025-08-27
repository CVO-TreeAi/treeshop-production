'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// FORESTRY MULCHING - ACCURATE FIXED PRICING
const FORESTRY_PACKAGES = {
  'small': { label: 'Small Package', description: '4" DBH & Under', pricePerAcre: 2125 },
  'medium': { label: 'Medium Package', description: '6" DBH & Under', pricePerAcre: 2500 },
  'large': { label: 'Large Package', description: '8" DBH & Under', pricePerAcre: 3375 },
  'xlarge': { label: 'X-Large Package', description: '10" DBH & Under', pricePerAcre: 4250 }
};

// LAND CLEARING - DAY RATE AGREEMENT (NOT FIXED PRICING)
const LAND_CLEARING_DAY_RATE = 4500; // $4,500 per day
const LAND_CLEARING_DEBRIS_RATE = 23; // $23 per yard hauled
const LAND_CLEARING_DAYS_ESTIMATE = { // Estimated days by project size
  'small': { minDays: 1, maxDays: 2, label: 'Small Project', description: 'Light vegetation (1-2 days)' },
  'medium': { minDays: 2, maxDays: 3, label: 'Medium Project', description: 'Moderate density (2-3 days)' },
  'large': { minDays: 3, maxDays: 5, label: 'Large Project', description: 'Dense vegetation (3-5 days)' },
  'xlarge': { minDays: 5, maxDays: 7, label: 'X-Large Project', description: 'Heavy clearing (5-7 days)' }
};

const TRANSPORT_RATE = 350; // $350/hour round trip
const DEBRIS_TRUCKS_PER_ACRE = 13.5; // Average 12-15 trucks per acre, using midpoint
const YARDS_PER_TRUCK = 10; // Standard dump truck capacity

type Step = 'contact' | 'service' | 'details' | 'price';
type ServiceType = 'forestry' | 'land-clearing';

export default function MultiStepEstimator() {
  const router = useRouter();
  
  // Current step
  const [currentStep, setCurrentStep] = useState<Step>('contact');
  
  // Step 1: Contact Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('FL');
  const [zipCode, setZipCode] = useState('');
  
  // Step 2: Service Selection
  const [serviceType, setServiceType] = useState<ServiceType>('forestry');
  const [acres, setAcres] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  
  // Step 3: Project Details
  const [message, setMessage] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [debrisHandling, setDebrisHandling] = useState<'haul' | 'leave'>('leave');
  
  // Lead tracking
  const [leadId, setLeadId] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<{min: number, max: number} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate transport based on ZIP
  const calculateTransport = (zip: string) => {
    const zipDistances: Record<string, { miles: number; minutes: number }> = {
      '32168': { miles: 5, minutes: 10 },
      '32724': { miles: 15, minutes: 20 },
      '32114': { miles: 10, minutes: 15 },
      '32757': { miles: 45, minutes: 55 },
      '34711': { miles: 60, minutes: 70 },
      '32789': { miles: 50, minutes: 60 },
      '32792': { miles: 55, minutes: 65 },
      '32746': { miles: 40, minutes: 50 },
      '32779': { miles: 45, minutes: 55 },
      '34601': { miles: 85, minutes: 100 },
      '34602': { miles: 80, minutes: 95 },
      'default': { miles: 50, minutes: 60 }
    };

    const distanceData = zipDistances[zip] || zipDistances['default'];
    const roundTripMinutes = distanceData.minutes * 2;
    const transportHours = Math.max(1, Math.ceil(roundTripMinutes / 60));
    return transportHours * TRANSPORT_RATE;
  };

  // Calculate price based on service type
  const calculatePrice = () => {
    const acreage = parseFloat(acres) || 0;
    if (!acreage || !selectedPackage || !zipCode) return { fixed: 0, min: 0, max: 0 };

    const transportCost = calculateTransport(zipCode);

    if (serviceType === 'forestry') {
      // FORESTRY MULCHING - ACCURATE FIXED PRICING
      const pkg = FORESTRY_PACKAGES[selectedPackage as keyof typeof FORESTRY_PACKAGES];
      const lineItemCost = pkg.pricePerAcre * acreage;
      const subtotal = lineItemCost + transportCost;
      const cushion = subtotal * 0.10;
      const total = subtotal + cushion;
      
      return { fixed: total, min: total, max: total };
    } else {
      // LAND CLEARING - DAY RATE AGREEMENT (ESTIMATE ONLY)
      const project = LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE];
      
      // Calculate day rate range
      const minDayCost = project.minDays * LAND_CLEARING_DAY_RATE;
      const maxDayCost = project.maxDays * LAND_CLEARING_DAY_RATE;
      
      // Calculate debris cost if hauling
      let debrisCost = 0;
      if (debrisHandling === 'haul') {
        const estimatedYards = DEBRIS_TRUCKS_PER_ACRE * YARDS_PER_TRUCK * acreage;
        debrisCost = estimatedYards * LAND_CLEARING_DEBRIS_RATE;
      }
      
      // Add transport and cushion
      const minSubtotal = minDayCost + debrisCost + transportCost;
      const maxSubtotal = maxDayCost + debrisCost + transportCost;
      
      const minTotal = minSubtotal + (minSubtotal * 0.10);
      const maxTotal = maxSubtotal + (maxSubtotal * 0.10);
      
      return { 
        fixed: 0, 
        min: minTotal, 
        max: maxTotal
      };
    }
  };

  // Create lead when moving from contact to service
  const createLead = async () => {
    console.log('📝 Creating new lead with Step 1 data...');
    try {
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'leads:create',
          args: {
            name,
            email,
            phone,
            address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
            zipCode: zipCode,
            acreage: 0,
            selectedPackage: 'Not Selected',
            obstacles: [],
            leadScore: 'warm',
            leadSource: 'website_estimate_v3',
            leadPage: 'estimate',
            siteSource: 'treeshop.app',
            status: 'new',
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Lead created response from Convex:', data);
        
        // Extract the actual ID from the response
        const actualId = data?.value?.id || data?.id;
        if (actualId) {
          setLeadId(actualId);
          console.log('✅ Lead ID stored:', actualId);
          return true;
        } else {
          console.error('❌ No ID returned from Convex');
          return false;
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Lead creation failed:', response.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('❌ Lead creation error:', error);
      return false;
    }
  };

  // Update lead with full details
  const updateLead = async () => {
    const pricing = calculatePrice();
    
    console.log('📝 Final update...', 'Lead ID:', leadId);
    if (!leadId) {
      console.error('No lead ID for final update');
      return false;
    }
    
    try {
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'leads:update',
          args: {
            id: leadId,
            estimatedTotal: serviceType === 'forestry' ? pricing.fixed : pricing.min,
            notes: `${message || ''}${
              serviceType === 'land-clearing' ? 
              ` | Day Rate Agreement | Est. ${LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.minDays}-${
                LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.maxDays} days | ${
                debrisHandling === 'haul' ? 'Debris haul-away requested' : 'No debris hauling'
              }` : ''
            }`,
            status: 'contacted',
            updatedAt: Date.now()
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📤 Lead update response from Convex:', data);
      } else {
        console.error('❌ Lead update failed:', response.status, response.statusText);
      }
      
      return response.ok;
    } catch (error) {
      console.error('Lead update error:', error);
      return false;
    }
  };

  // Navigation handlers
  const handleStep1Submit = async () => {
    if (!name || !email || !phone || !city || !state || !zipCode) {
      alert('Please fill in all required fields');
      return;
    }
    
    const success = await createLead();
    if (success) {
      setCurrentStep('service');
    } else {
      alert('There was an error saving your information. Please try again.');
    }
  };

  const handleStep2Submit = async () => {
    if (!acres || !selectedPackage) {
      alert('Please select a package and enter acreage');
      return;
    }
    
    // Update lead with Step 2 data
    console.log('📝 Saving Step 2 data...', 'Lead ID:', leadId);
    if (!leadId) {
      console.error('No lead ID to update');
      return;
    }
    
    try {
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'leads:update',
          args: {
            id: leadId,
            acreage: parseFloat(acres) || 0,
            selectedPackage: serviceType === 'forestry' 
              ? FORESTRY_PACKAGES[selectedPackage as keyof typeof FORESTRY_PACKAGES]?.label 
              : LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.label,
            status: 'qualified',
            updatedAt: Date.now()
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Step 2 data saved:', data);
      }
    } catch (error) {
      console.error('Error saving Step 2:', error);
    }
    
    setCurrentStep('details');
  };

  const handleStep3Submit = async () => {
    // Update lead with Step 3 data
    console.log('📝 Saving Step 3 data...', 'Lead ID:', leadId);
    if (!leadId) {
      console.error('No lead ID to update');
      setCurrentStep('price');
      return;
    }
    
    try {
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'leads:update',
          args: {
            id: leadId,
            notes: message || '',
            status: 'quoted',
            updatedAt: Date.now()
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Step 3 data saved:', data);
      }
    } catch (error) {
      console.error('Error saving Step 3:', error);
    }
    
    setCurrentStep('price');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    // Update the lead with final details
    const success = await updateLead();
    
    if (success) {
      // Log success for verification
      console.log('✅ Lead successfully submitted to Convex:', {
        leadId,
        name,
        email,
        phone,
        serviceType,
        acres,
        price: serviceType === 'forestry' ? finalPrice : priceRange,
        timestamp: new Date().toISOString()
      });
      
      // Show success message
      alert('Your estimate request has been submitted! We\'ll contact you within 24 hours.');
      
      // Redirect to home page after short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      // Log error for debugging
      console.error('❌ Failed to submit lead');
      alert('There was an error submitting your request. Please try again or call us directly.');
    }
    
    setIsSubmitting(false);
  };

  // Update price when relevant fields change
  useEffect(() => {
    if (currentStep === 'price') {
      const pricing = calculatePrice();
      if (serviceType === 'forestry') {
        setFinalPrice(pricing.fixed);
        setPriceRange(null);
      } else {
        setFinalPrice(0);
        setPriceRange({ min: pricing.min, max: pricing.max });
      }
    }
  }, [currentStep, acres, selectedPackage, zipCode, debrisHandling]);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Contact', 'Service', 'Details', 'Proposal'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${index === 0 && currentStep !== 'contact' ? 'bg-green-600 text-black' :
                  index === 1 && ['details', 'price'].includes(currentStep) ? 'bg-green-600 text-black' :
                  index === 2 && currentStep === 'price' ? 'bg-green-600 text-black' :
                  currentStep === ['contact', 'service', 'details', 'price'][index] ? 'bg-green-600 text-black' :
                  'bg-gray-700 text-gray-400'}
              `}>
                {index < ['contact', 'service', 'details', 'price'].indexOf(currentStep) ? '✓' : index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= ['contact', 'service', 'details', 'price'].indexOf(currentStep) ? 'text-green-400' : 'text-gray-400'
              }`}>
                {step}
              </span>
              {index < 3 && <div className={`w-8 h-1 mx-2 ${
                index < ['contact', 'service', 'details', 'price'].indexOf(currentStep) ? 'bg-green-600' : 'bg-gray-700'
              }`} />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Contact Information */}
      {currentStep === 'contact' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Step 1: Contact Information</h2>
          
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Street Address</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="Orlando"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">State *</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
              >
                <option value="FL">Florida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">ZIP Code *</label>
              <input
                type="text"
                maxLength={5}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                placeholder="32801"
              />
            </div>
          </div>

          <button
            onClick={handleStep1Submit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Continue to Service Selection →
          </button>
        </div>
      )}

      {/* STEP 2: Service & Package Selection */}
      {currentStep === 'service' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Step 2: Service & Package Selection</h2>
          
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 mb-4">
            <p className="text-white font-semibold">✓ Contact information saved for {name}</p>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">Choose Your Service *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setServiceType('forestry');
                  setSelectedPackage('');
                  setDebrisHandling('leave');
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  serviceType === 'forestry'
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className="font-semibold text-lg text-white">🌲 Forestry Mulching</div>
                <div className="text-sm text-gray-300">Fixed pricing by package</div>
                <div className="text-xs text-green-400 mt-1">Accurate proposal provided</div>
              </button>

              <button
                onClick={() => {
                  setServiceType('land-clearing');
                  setSelectedPackage('');
                  setDebrisHandling('haul');
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  serviceType === 'land-clearing'
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className="font-semibold text-lg text-white">🏞️ Land Clearing</div>
                <div className="text-sm text-gray-300">Day rate: $4,500/day</div>
                <div className="text-xs text-blue-400 mt-1">Rate agreement - final price TBD</div>
              </button>
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              {serviceType === 'forestry' ? 'Select Package *' : 'Select Project Size *'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceType === 'forestry' ? (
                Object.entries(FORESTRY_PACKAGES).map(([key, pkg]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPackage(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPackage === key
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-semibold text-white">{pkg.label}</div>
                    <div className="text-sm text-gray-300">{pkg.description}</div>
                  </button>
                ))
              ) : (
                Object.entries(LAND_CLEARING_DAYS_ESTIMATE).map(([key, project]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPackage(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPackage === key
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-semibold text-white">{project.label}</div>
                    <div className="text-sm text-gray-300">{project.description}</div>
                    <div className="text-xs text-blue-400 mt-1">Est. {project.minDays}-{project.maxDays} days</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Acreage */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Project Size (Acres) *</label>
            <input
              type="number"
              min="0.25"
              step="0.25"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
              placeholder="e.g., 3.5"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('contact')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleStep2Submit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
            >
              Continue to Details →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Project Details */}
      {currentStep === 'details' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-2">Step 3: Project Details</h2>
            <p className="text-gray-400">Review your selections and provide additional details</p>
          </div>
          
          {/* Enhanced Project Summary Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600/30 via-green-500/20 to-emerald-500/30 border-2 border-green-400/50 rounded-xl p-6 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-green-400/5 backdrop-blur-sm"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">{serviceType === 'forestry' ? '🌲' : '🏞️'}</span>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {serviceType === 'forestry' ? 'Forestry Mulching' : 'Land Clearing'}
                  </h3>
                  <p className="text-green-300 font-semibold">Project Configuration Confirmed</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">📏</span>
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">Project Size</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{acres} acres</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">📦</span>
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">Package</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {serviceType === 'forestry' 
                      ? FORESTRY_PACKAGES[selectedPackage as keyof typeof FORESTRY_PACKAGES]?.label
                      : LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.label}
                  </p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">📍</span>
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">Location</span>
                  </div>
                  <p className="text-lg font-bold text-white">{city}, {state} {zipCode}</p>
                </div>
              </div>
              
              {serviceType === 'forestry' && (
                <div className="mt-4 bg-green-900/40 backdrop-blur-sm rounded-lg p-3 border border-green-400/40">
                  <div className="flex items-center justify-center">
                    <span className="text-lg mr-2">⚡</span>
                    <p className="text-green-200 font-semibold">
                      {FORESTRY_PACKAGES[selectedPackage as keyof typeof FORESTRY_PACKAGES]?.description} • Fixed Pricing Available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Land Clearing specific options with enhanced styling */}
          {serviceType === 'land-clearing' && (
            <>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-lg">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🚛</span>
                  <h4 className="text-xl font-bold text-white">Debris Handling Options</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setDebrisHandling('leave')}
                    className={`group relative overflow-hidden p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                      debrisHandling === 'leave'
                        ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-green-600/10 shadow-lg shadow-green-500/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="relative">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🏠</span>
                        <div className="font-bold text-xl text-white">Leave On-Site</div>
                      </div>
                      <div className="text-gray-300 mb-2">Debris remains on your property</div>
                      <div className="text-green-400 font-semibold">💰 No additional hauling cost</div>
                      {debrisHandling === 'leave' && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setDebrisHandling('haul')}
                    className={`group relative overflow-hidden p-6 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                      debrisHandling === 'haul'
                        ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-green-600/10 shadow-lg shadow-green-500/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="relative">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🚛</span>
                        <div className="font-bold text-xl text-white">Haul Away</div>
                      </div>
                      <div className="text-gray-300 mb-2">Complete debris removal service</div>
                      <div className="text-blue-400 font-semibold">$23 per yard hauled</div>
                      <div className="text-gray-400 text-sm mt-1">
                        Est. ~{Math.round(DEBRIS_TRUCKS_PER_ACRE * parseFloat(acres || '0'))} truck loads
                      </div>
                      {debrisHandling === 'haul' && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 via-blue-500/15 to-indigo-600/20 border-2 border-blue-400/50 rounded-xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl">📋</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">Land Clearing Rate Agreement</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">⏱️</span>
                        <span className="text-white font-semibold">Daily Rate:</span>
                      </div>
                      <span className="text-blue-400 font-bold text-lg">$4,500/day</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">📅</span>
                        <span className="text-white font-semibold">Est. Duration:</span>
                      </div>
                      <span className="text-blue-400 font-bold text-lg">
                        {LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.minDays}-{LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.maxDays} days
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {debrisHandling === 'haul' && (
                      <>
                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">🚛</span>
                            <span className="text-white font-semibold">Debris Rate:</span>
                          </div>
                          <span className="text-blue-400 font-bold text-lg">$23/yard</span>
                        </div>
                        
                        <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">📊</span>
                            <span className="text-white font-semibold">Est. Volume:</span>
                          </div>
                          <span className="text-blue-400 font-bold text-lg">
                            {Math.round(DEBRIS_TRUCKS_PER_ACRE * YARDS_PER_TRUCK * parseFloat(acres || '0'))} yards
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">⚠️</span>
                        <span className="text-yellow-300 font-semibold text-sm">
                          Final pricing determined post-completion
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Enhanced Additional Message Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-lg">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">💬</span>
              <h4 className="text-xl font-bold text-white">Additional Project Details</h4>
              <span className="ml-2 text-sm text-gray-400 font-semibold">(Optional)</span>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/60 border-2 border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-green-500/70 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 backdrop-blur-sm"
              placeholder="Tell us about special requirements, access concerns, timeline preferences, or any questions you have about your project..."
              rows={4}
            />
            
            <div className="mt-3 flex items-center text-sm text-gray-400">
              <span className="mr-2">💡</span>
              <span>The more details you provide, the more accurate our assessment will be</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setCurrentStep('service')}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              ← Back to Service Selection
            </button>
            <button
              onClick={handleStep3Submit}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-green-500/25 text-lg"
            >
              {serviceType === 'forestry' ? '🎯 Get My Proposal →' : '📋 Get Rate Agreement →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Proposal/Rate Agreement */}
      {currentStep === 'price' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Step 4: Your {serviceType === 'forestry' ? 'Proposal' : 'Rate Agreement'}
          </h2>
          
          {serviceType === 'forestry' ? (
            // FORESTRY MULCHING - FIXED PROPOSAL
            <div className="bg-gray-800 border-2 border-blue-500 rounded-lg p-6">
              <div className="text-center mb-6">
                <p className="text-green-400 font-bold text-xl mb-3">✓ Your Fixed Proposal</p>
                <div className="text-6xl font-bold text-white mb-2">
                  ${finalPrice.toFixed(0)}
                </div>
                <p className="text-blue-400 font-semibold">Total Project Cost</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-400 font-semibold">Service:</span>
                    <span className="text-white font-bold">Forestry Mulching</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400 font-semibold">Package:</span>
                    <span className="text-white font-bold">{FORESTRY_PACKAGES[selectedPackage as keyof typeof FORESTRY_PACKAGES]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400 font-semibold">Acreage:</span>
                    <span className="text-white font-bold">{acres} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400 font-semibold">Location:</span>
                    <span className="text-white font-bold">{city}, {state} {zipCode}</span>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-bold mb-2">What's Included:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Professional Equipment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Expert Operators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Site Cleanup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">Transportation</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // LAND CLEARING - RATE AGREEMENT
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-6">
              <div className="text-center">
                <p className="text-blue-400 font-semibold text-lg mb-2">Land Clearing Rate Agreement</p>
                <div className="text-3xl font-bold text-white mb-2">
                  ${priceRange?.min.toFixed(0)} - ${priceRange?.max.toFixed(0)}
                </div>
                <p className="text-gray-300">Estimated Range</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-white font-bold mb-2">Rate Structure:</p>
                  <ul className="text-sm text-white space-y-1">
                    <li>• Daily Rate: $4,500 per day</li>
                    <li>• Estimated Days: {
                      LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.minDays
                    }-{
                      LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.maxDays
                    }</li>
                    {debrisHandling === 'haul' && (
                      <>
                        <li>• Debris Hauling: $23 per yard</li>
                        <li>• Estimated: {Math.round(DEBRIS_TRUCKS_PER_ACRE * YARDS_PER_TRUCK * parseFloat(acres || '0'))} yards ({Math.round(DEBRIS_TRUCKS_PER_ACRE * parseFloat(acres || '0'))} trucks)</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white">
                    <span className="text-gray-400">Project Size:</span>
                    <span className="font-semibold">{acres} acres</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-gray-400">Project Type:</span>
                    <span className="font-semibold">{LAND_CLEARING_DAYS_ESTIMATE[selectedPackage as keyof typeof LAND_CLEARING_DAYS_ESTIMATE]?.label}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span className="text-gray-400">Debris:</span>
                    <span className="font-semibold">{debrisHandling === 'haul' ? 'Haul Away' : 'Leave On-Site'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Notice */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-xl"></div>
            <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl">⚡</span>
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">
                    Pending TreeShop Validation
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {serviceType === 'forestry' 
                      ? 'This proposal is subject to office validation. We\'ll contact you within 24 hours to confirm details and schedule your project.'
                      : 'This rate agreement requires validation. Final project price will be provided with project records. We\'ll contact you within 24 hours to discuss your project.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep('details')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : serviceType === 'forestry' ? 'Submit Proposal Request' : 'Submit Rate Agreement'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}