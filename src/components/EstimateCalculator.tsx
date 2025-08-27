'use client';

import { useState, useEffect, useRef } from 'react';
import { LocationService, createLocationService } from '@/lib/services/LocationService';

// TreeShop Service Center - New Smyrna Beach, FL (INTERNAL)
const TREESHOP_BASE_COORDS = { lat: 29.0216, lng: -81.0770 };
// NEVER expose actual address: 3634 Watermelon Lane

// INTERNAL Pricing Structure (CONFIDENTIAL - NEVER EXPOSE)
const PACKAGE_PRICING = {
  'small': {
    label: 'Small Package',
    description: '4" DBH & Under',
    pricePerAcre: 2125 // Medium - 15%
  },
  'medium': {
    label: 'Medium Package', 
    description: '6" DBH & Under',
    pricePerAcre: 2500 // BASELINE
  },
  'large': {
    label: 'Large Package',
    description: '8" DBH & Under', 
    pricePerAcre: 3375 // Medium + 35%
  },
  'xlarge': {
    label: 'X-Large Package',
    description: '10" DBH & Under',
    pricePerAcre: 4250 // Medium + 70%
  }
} as const;

// Transport rate: $350/hour (INTERNAL - NEVER EXPOSE)
const TRANSPORT_RATE_PER_HOUR = 350;

type PackageType = keyof typeof PACKAGE_PRICING;

interface EstimateData {
  address: string;
  acres: number;
  package: PackageType;
  transportTime: number;
  transportCost: number;
  baseTotal: number;
  cushion: number;
  finalProposal: number;
}

interface EstimateCalculatorProps {
  onEstimateComplete?: (estimate: EstimateData) => void;
  className?: string;
  initialAddress?: string;
}

export default function EstimateCalculator({ onEstimateComplete, className = '', initialAddress = '' }: EstimateCalculatorProps) {
  // Contact form fields - CAPTURE FIRST
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Address fields - SEPARATE
  const [streetAddress, setStreetAddress] = useState(initialAddress);
  const [city, setCity] = useState('');
  const [state, setState] = useState('FL'); // Default to Florida
  const [zipCode, setZipCode] = useState('');
  // Lead capture tracking
  const [leadCreated, setLeadCreated] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  // Pricing fields - UNLOCKED AFTER LEAD
  const [acres, setAcres] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('large');
  const [message, setMessage] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [addressValidated, setAddressValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [transportData, setTransportData] = useState<{
    time: number;
    distance: number;
    cost: number;
  } | null>(null);
  
  // Build full address from components
  const address = `${streetAddress}, ${city}, ${state} ${zipCode}`.trim();
  
  // Progressive tracking refs
  const trackingDebounce = useRef<NodeJS.Timeout>();
  const sessionId = useRef<string>();

  // Get or create session ID for tracking
  const getOrCreateSession = () => {
    if (!sessionId.current) {
      if (typeof window !== 'undefined') {
        let storedSession = sessionStorage.getItem('lead_session');
        if (!storedSession) {
          storedSession = `treeshop.app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('lead_session', storedSession);
        }
        sessionId.current = storedSession;
      }
    }
    return sessionId.current || 'no-session';
  };

  // Track field updates - simplified
  const trackFieldUpdate = async (fieldName: string, value: string) => {
    // Just log for now - remove broken tracking
    console.log(`Field updated: ${fieldName}`);
  };

  // Debounced field tracking
  const handleFieldChange = (fieldName: string, value: string, setter: (val: string) => void) => {
    setter(value);
    
    // Clear previous debounce
    if (trackingDebounce.current) {
      clearTimeout(trackingDebounce.current);
    }
    
    // Track after 500ms of no typing
    trackingDebounce.current = setTimeout(() => {
      trackFieldUpdate(fieldName, value);
    }, 500);
  };

  // Address validation and transport calculation using ZIP code
  const validateAddressAndCalculateTransport = async () => {
    const fullAddress = `${streetAddress}, ${city}, ${state} ${zipCode}`.trim();
    
    if (!zipCode || zipCode.length !== 5) {
      setAddressValidated(false);
      setTransportData(null);
      return;
    }

    setIsCalculating(true);
    try {
      // First try using the LocationService for precise calculation
      const locationService = createLocationService();
      if (locationService && streetAddress) {
        try {
          const propertyLocation = await locationService.verifyPropertyLocation(fullAddress);
          
          // Calculate transport time using Google Maps
          const travelTimeMinutes = propertyLocation.distanceFromBase.durationSeconds / 60;
          const distanceKm = propertyLocation.distanceFromBase.meters / 1000;
          
          // Transport: $350/hour for round trip (INTERNAL RATE)
          const roundTripMinutes = travelTimeMinutes * 2;
          const transportHours = Math.max(1, Math.ceil(roundTripMinutes / 60)); // Minimum 1 hour
          const transportCost = transportHours * TRANSPORT_RATE_PER_HOUR;

          setTransportData({
            time: Math.round(travelTimeMinutes),
            distance: Math.round(distanceKm * 0.621371), // Convert to miles
            cost: transportCost
          });
          
          setAddressValidated(true);
          setIsCalculating(false);
          return;
        } catch (serviceError) {
          console.warn('LocationService failed, trying fallback:', serviceError);
        }
      }

      // Fallback: Simplified distance calculation using ZIP code
      if (zipCode && zipCode.length === 5) {
        const zip = zipCode;
        
        // Simplified Florida ZIP code distance estimation from TreeShop base (29.0216, -81.0770)
        const zipDistances: Record<string, { miles: number; minutes: number }> = {
          // Volusia County (close to base)
          '32168': { miles: 5, minutes: 10 },   // New Smyrna Beach
          '32724': { miles: 15, minutes: 20 },  // DeLand
          '32114': { miles: 10, minutes: 15 },  // Daytona Beach
          
          // Lake County
          '32757': { miles: 45, minutes: 55 },  // Mount Dora
          '34711': { miles: 60, minutes: 70 },  // Clermont
          
          // Orange County  
          '32789': { miles: 50, minutes: 60 },  // Winter Springs
          '32792': { miles: 55, minutes: 65 },  // Winter Park
          
          // Seminole County
          '32746': { miles: 40, minutes: 50 },  // Lake Mary
          '32779': { miles: 45, minutes: 55 },  // Winter Springs
          
          // Hernando County
          '34601': { miles: 85, minutes: 100 }, // Brooksville
          '34602': { miles: 80, minutes: 95 },  // Brooksville
          
          // Default fallback
          'default': { miles: 50, minutes: 60 }
        };

        const distanceData = zipDistances[zip] || zipDistances['default'];
        
        // Transport calculation (INTERNAL)
        const roundTripMinutes = distanceData.minutes * 2;
        const transportHours = Math.max(1, Math.ceil(roundTripMinutes / 60));
        const transportCost = transportHours * TRANSPORT_RATE_PER_HOUR;

        setTransportData({
          time: distanceData.minutes,
          distance: distanceData.miles,
          cost: transportCost
        });
        
        setAddressValidated(true);
      } else {
        throw new Error('Could not extract ZIP code for distance calculation');
      }
      
    } catch (error) {
      console.error('Address validation failed:', error);
      setAddressValidated(false);
      setTransportData(null);
    }
    setIsCalculating(false);
  };

  // Create lead immediately when contact info is complete
  const createLead = async () => {
    if (!name || !email || !phone || !city || !state || !zipCode) {
      return;
    }

    const session = getOrCreateSession();
    const fullAddress = `${streetAddress}, ${city}, ${state} ${zipCode}`.trim();

    try {
      // Send to Convex Terminal Sync - CREATE LEAD IMMEDIATELY
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'terminalSync:createLead',
          args: {
            name: name,
            email: email,
            phone: phone,
            address: fullAddress,
            acreage: acres || '0', // May not have this yet
            selectedPackage: selectedPackage ? PACKAGE_PRICING[selectedPackage].label : 'Not Selected',
            message: message || '',
            source: 'treeshop.app',
            status: 'partial', // Lead captured but not complete
            createdAt: Date.now()
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeadCreated(true);
        setLeadId(data.id || session);
        
        // Track with Terminal
        if (typeof window !== 'undefined' && (window as any).terminalTrack) {
          (window as any).terminalTrack('lead_captured', {
            source: 'treeshop.app',
            stage: 'contact_info'
          });
        }
      }
    } catch (error) {
      console.error('Lead creation error:', error);
    }
  };

  // Check if we should create lead when fields change
  useEffect(() => {
    if (!leadCreated && name && email && phone && city && state && zipCode) {
      createLead();
    }
  }, [name, email, phone, city, state, zipCode, leadCreated]);

  // Submit handler for full estimate request
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!leadCreated) {
      alert('Please fill in your contact information first');
      return;
    }

    if (!acres || !estimate) {
      alert('Please enter acreage to see your estimate');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    const session = getOrCreateSession();

    try {
      // Send to Convex Terminal Sync - SIMPLE PATH
      const response = await fetch('https://earnest-lemming-634.convex.cloud/api/mutation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'terminalSync:updateLead', // UPDATE existing lead with pricing
          args: {
            leadId: leadId || session,
            name: name,
            email: email,
            phone: phone,
            address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
            acreage: acres,
            selectedPackage: PACKAGE_PRICING[selectedPackage].label,
            estimatedPrice: estimate?.finalProposal || 0,
            message: message || '',
            source: 'treeshop.app',
            status: 'complete', // Now complete with pricing
            updatedAt: Date.now()
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      // Track with Terminal if available
      if (typeof window !== 'undefined' && (window as any).terminalTrack) {
        (window as any).terminalTrack('lead_submission', {
          source: 'treeshop.app',
          package: selectedPackage
        });
      }

      // Track with GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          value: estimate?.finalProposal || 0,
          currency: 'USD'
        });
      }
      
      setSubmitStatus('success');
      // Clear session after successful submission
      sessionStorage.removeItem('lead_session');
      sessionId.current = undefined;
      
      // Reset form after success
      setTimeout(() => {
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setAddress('');
        setAcres('');
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Track form view on mount
  useEffect(() => {
    console.log('Estimate calculator loaded');
  }, []);

  // Auto-validate address when ZIP is complete
  useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      validateAddressAndCalculateTransport();
    }
  }, [zipCode, streetAddress, city, state]);

  // Calculate estimate using EXACT formula
  useEffect(() => {
    if (leadCreated && addressValidated && acres && transportData) {
      const acreage = parseFloat(acres);
      if (acreage > 0) {
        const packageInfo = PACKAGE_PRICING[selectedPackage];
        
        // EXACT FORMULA (INTERNAL):
        // 1. Line Item Cost = Package Price × Acreage
        const lineItemCost = packageInfo.pricePerAcre * acreage;
        // 2. Transport Cost = Round Trip Hours × $350 (already calculated)
        const transportCost = transportData.cost;
        // 3. Subtotal = Line Items + Transport
        const subtotal = lineItemCost + transportCost;
        // 4. Cushion = Subtotal × 10%
        const cushion = subtotal * 0.10;
        // 5. TOTAL = Subtotal + Cushion (only this shown to customer)
        const finalTotal = subtotal + cushion;

        const estimateData: EstimateData = {
          address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
          acres: acreage,
          package: selectedPackage,
          transportTime: transportData.time,
          transportCost: transportCost,
          baseTotal: lineItemCost,
          cushion: cushion,
          finalProposal: finalTotal
        };

        setEstimate(estimateData);
        onEstimateComplete?.(estimateData);
      }
    } else {
      setEstimate(null);
    }
  }, [leadCreated, streetAddress, city, state, zipCode, acres, selectedPackage, addressValidated, transportData, onEstimateComplete]);

  // Note: Address validation is now triggered directly from GooglePlacesAutocomplete onChange

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <h3 className="text-2xl font-bold text-white mb-6">Get Your Free Estimate - Lead First</h3>
      
      <div className="space-y-6">
        {/* STEP 1: Contact Information - GET THIS FIRST */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-green-400 mb-4">Step 1: Your Information</h4>
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value, setName)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={phone}
              onChange={(e) => handleFieldChange('phone', e.target.value, setPhone)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* STEP 2: Address - SEPARATE FIELDS */}
          <h4 className="text-xl font-bold text-green-400 mt-6 mb-4">Step 2: Project Location</h4>
          
          {/* Street Address */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => handleFieldChange('streetAddress', e.target.value, setStreetAddress)}
              className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
              placeholder="123 Main Street"
            />
          </div>

          {/* City, State, Zip in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => handleFieldChange('city', e.target.value, setCity)}
                className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
                placeholder="Orlando"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                State *
              </label>
              <select
                value={state}
                onChange={(e) => handleFieldChange('state', e.target.value, setState)}
                className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
              >
                <option value="FL">Florida</option>
              </select>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                maxLength={5}
                value={zipCode}
                onChange={(e) => handleFieldChange('zipCode', e.target.value.replace(/\D/g, ''), setZipCode)}
                className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
                placeholder="32801"
              />
            </div>
          </div>

          {addressValidated && (
            <p className="text-green-400 text-sm mt-2">✓ Location validated - distance calculated</p>
          )}
          {isCalculating && (
            <p className="text-gray-300 text-sm mt-2">Calculating distance...</p>
          )}
        </div>

        {/* Lead Created Success Message */}
        {leadCreated && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 font-semibold">✓ Information saved! Now let's calculate your estimate.</p>
          </div>
        )}

        {/* STEP 3: Pricing Calculator - ONLY SHOWN AFTER LEAD CREATED */}
        {leadCreated && (
          <>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-green-400 mb-4">Step 3: Calculate Your Price</h4>
              
              {/* Package Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Choose Your Package *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(PACKAGE_PRICING).map(([key, packageInfo]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPackage(key as PackageType);
                        trackFieldUpdate('selectedPackage', packageInfo.label);
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedPackage === key
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-semibold text-lg text-white">{packageInfo.label}</div>
                      <div className="text-sm text-gray-300 mb-2">{packageInfo.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Size */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Project Size (Acres) *
                </label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={acres}
                  onChange={(e) => handleFieldChange('acreage', e.target.value, setAcres)}
                  className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
                  placeholder="e.g., 3.5"
                />
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Additional Details (Optional)
                </label>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) => handleFieldChange('message', e.target.value, setMessage)}
                  className="w-full bg-black border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all"
                  placeholder="Tell us more about your project..."
                  rows={3}
                />
              </div>
            </div>
          </>
        )}

        {/* CUSTOMER SEES ONLY FINAL PRICE - NO BREAKDOWN */}
        {leadCreated && estimate && (
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mt-6">
            <div className="space-y-3">
              <div className="text-green-400 font-semibold text-center text-lg">✓ Your Estimate is Ready</div>
              
              {/* ONLY SHOW FINAL TOTAL - NO BREAKDOWN */}
              <div className="text-center">
                <div className="text-4xl font-bold text-white">
                  ${estimate.finalProposal.toFixed(0)}
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  Total Project Cost
                </p>
              </div>
              
              <p className="text-xs text-gray-300 text-center mt-3">
                This estimate includes all services and transportation.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button - SHOWS DIFFERENT TEXT BASED ON STATE */}
        {leadCreated && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !acres || !estimate}
            className="w-full mt-6 bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? 'Submitting...' : estimate ? 'Request This Service' : 'Enter Acreage to See Price'}
          </button>
        )}

        {/* Show message if they haven't filled out contact info yet */}
        {!leadCreated && name.length + email.length + phone.length > 0 && (
          <div className="mt-4 text-gray-300 text-sm">
            Please complete all required fields above to unlock pricing calculator.
          </div>
        )}

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 bg-green-900/30 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
            <div className="font-semibold">✓ Success! Your estimate request has been submitted.</div>
            <div className="text-sm mt-1">We'll contact you within 24 hours to schedule your service.</div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            <div className="font-semibold">✗ There was an error submitting your request.</div>
            <div className="text-sm mt-1">Please try again or call us at (407) 555-8733.</div>
          </div>
        )}
      </div>
    </div>
  );
}