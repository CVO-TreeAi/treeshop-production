'use client';

import { useState, useEffect, useRef } from 'react';
import { LocationService, createLocationService } from '@/lib/services/LocationService';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';

// TreeShop Base Location - New Smyrna Beach, FL
const TREESHOP_BASE_COORDS = { lat: 29.0216, lng: -81.0770 };

// Streamlined Package Pricing Structure - Exactly as specified
const PACKAGE_PRICING = {
  'small': {
    label: 'Small Package',
    description: '4" DBH & Under',
    baseRate: 2125, // $2500 - 15%
    pricePerAcre: 2125
  },
  'medium': {
    label: 'Medium Package', 
    description: '6" DBH & Under',
    baseRate: 2500, // Base rate
    pricePerAcre: 2500
  },
  'large': {
    label: 'Large Package',
    description: '8" DBH & Under', 
    baseRate: 3375, // $2500 + 35%
    pricePerAcre: 3375
  },
  'xlarge': {
    label: 'X-Large Package',
    description: '10" DBH & Under',
    baseRate: 4250, // $2500 + 70%
    pricePerAcre: 4250
  }
} as const;

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
}

export default function EstimateCalculator({ onEstimateComplete, className = '' }: EstimateCalculatorProps) {
  const [address, setAddress] = useState('');
  const [acres, setAcres] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('large');
  // Contact form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

  // Address validation and transport calculation
  const validateAddressAndCalculateTransport = async (inputAddress: string) => {
    if (!inputAddress.trim()) {
      setAddressValidated(false);
      setTransportData(null);
      return;
    }

    setIsCalculating(true);
    try {
      // First try using the LocationService for precise calculation
      const locationService = createLocationService();
      if (locationService) {
        try {
          const propertyLocation = await locationService.verifyPropertyLocation(inputAddress);
          
          // Calculate transport time using Google Maps
          const travelTimeMinutes = propertyLocation.distanceFromBase.durationSeconds / 60;
          const distanceKm = propertyLocation.distanceFromBase.meters / 1000;
          
          // TreeShop $350/hour transportation model - round trip
          const roundTripMinutes = travelTimeMinutes * 2;
          const transportHours = Math.ceil(roundTripMinutes / 60);
          const transportCost = transportHours * 350;

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

      // Fallback: Simplified distance calculation using ZIP code extraction
      const zipMatch = inputAddress.match(/\b(\d{5})\b/);
      if (zipMatch) {
        const zip = zipMatch[1];
        
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
        
        // TreeShop $350/hour transportation model
        const roundTripMinutes = distanceData.minutes * 2;
        const transportHours = Math.ceil(roundTripMinutes / 60);
        const transportCost = transportHours * 350;

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

  // Submit handler for Convex - CRITICAL FIX
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !email || !phone) {
      alert('Please fill in all required contact information');
      return;
    }

    if (!address || !acres) {
      alert('Please complete the estimate form first');
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
          path: 'terminalSync:createLead', // UPDATED to terminalSync
          args: {
            name: name,
            email: email,
            phone: phone,
            address: address,
            acreage: acres,
            selectedPackage: PACKAGE_PRICING[selectedPackage].label,
            message: message || '',
            source: 'treeshop.app', // MUST BE treeshop.app
            status: 'complete',
            createdAt: Date.now()
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

  // Calculate estimate when inputs change
  useEffect(() => {
    if (addressValidated && acres && transportData) {
      const acreage = parseFloat(acres);
      if (acreage > 0) {
        const packageInfo = PACKAGE_PRICING[selectedPackage];
        
        // Core calculation: (base_rate * acres) + transport_cost + 10% cushion
        const baseTotal = packageInfo.pricePerAcre * acreage;
        const beforeCushion = baseTotal + transportData.cost;
        const cushion = beforeCushion * 0.10; // 10% cushion
        const finalProposal = beforeCushion + cushion;

        const estimateData: EstimateData = {
          address,
          acres: acreage,
          package: selectedPackage,
          transportTime: transportData.time,
          transportCost: transportData.cost,
          baseTotal,
          cushion,
          finalProposal
        };

        setEstimate(estimateData);
        onEstimateComplete?.(estimateData);
      }
    } else {
      setEstimate(null);
    }
  }, [address, acres, selectedPackage, addressValidated, transportData, onEstimateComplete]);

  // Note: Address validation is now triggered directly from GooglePlacesAutocomplete onChange

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <h3 className="text-2xl font-bold text-white mb-6">Get Your Estimate</h3>
      
      {/* Project Location */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Project Address *
          </label>
          <GooglePlacesAutocomplete
            value={address}
            onChange={(value) => {
              handleFieldChange('address', value, setAddress);
              // Trigger validation when address changes
              if (value.length > 10) {
                validateAddressAndCalculateTransport(value);
              }
            }}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="Start typing your address..."
          />
          {addressValidated && (
            <p className="text-green-400 text-sm mt-2">✓ Address validated and distance calculated</p>
          )}
          {isCalculating && (
            <p className="text-gray-400 text-sm mt-2">Calculating distance from service area...</p>
          )}
          {transportData && (
            <p className="text-gray-300 text-sm mt-2">
              Distance: {Math.round(transportData.distance)} miles | 
              Travel time: {Math.round(transportData.time)} mins
            </p>
          )}
        </div>

        {/* Project Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Project Size (Acres) *
          </label>
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={acres}
            onChange={(e) => handleFieldChange('acreage', e.target.value, setAcres)}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="e.g., 3.5"
          />
        </div>

        {/* Step 3: Package Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">
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
                    ? 'border-green-500 bg-green-500/10 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-white hover:border-gray-500'
                }`}
              >
                <div className="font-semibold text-lg">{packageInfo.label}</div>
                <div className="text-sm opacity-75 mb-2">{packageInfo.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information Section - CRITICAL FIX */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-semibold text-white">Contact Information</h4>
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value, setName)}
              className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
              className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={phone}
              onChange={(e) => handleFieldChange('phone', e.target.value, setPhone)}
              className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Additional Details (Optional)
            </label>
            <textarea
              name="message"
              value={message}
              onChange={(e) => handleFieldChange('message', e.target.value, setMessage)}
              className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
              placeholder="Tell us more about your project..."
              rows={3}
            />
          </div>
        </div>

        {/* Calculation Status and Price Display */}
        {estimate && (
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mt-6">
            <div className="space-y-3">
              <div className="text-green-400 font-semibold">✓ Estimate Calculated Successfully</div>
              
              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Base Service ({estimate.acres} acres):</span>
                  <span>${estimate.baseTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Transportation ({Math.round(estimate.transportTime)} mins):</span>
                  <span>${estimate.transportCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Buffer (10%):</span>
                  <span>${estimate.cushion.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex justify-between text-white font-semibold text-lg">
                  <span>Total Estimate:</span>
                  <span className="text-green-400">${estimate.finalProposal.toFixed(2)}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 text-center mt-3">
                This is your instant estimate. Contact us to schedule your service.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button - CRITICAL FIX */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !name || !email || !phone || !addressValidated || !acres}
          className="w-full mt-6 bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : estimate ? 'Submit Request for This Estimate' : 'Calculate Estimate'}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mt-4 bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded-lg">
            ✓ Thank you! Your estimate request has been submitted. We'll contact you within 24 hours.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            ✗ There was an error submitting your request. Please try again or call us at (407) 555-8733.
          </div>
        )}
      </div>
    </div>
  );
}