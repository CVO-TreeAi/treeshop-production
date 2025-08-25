'use client';

import { useState, useEffect } from 'react';
import { LocationService, createLocationService } from '@/lib/services/LocationService';

// TreeShop Base Location - New Smyrna Beach, FL
const TREESHOP_BASE_COORDS = { lat: 29.0216, lng: -81.0770 };

// Land Clearing Package Pricing Structure
const LAND_CLEARING_PACKAGES = {
  'light': {
    label: 'Light Clearing',
    description: 'Light vegetation & brush',
    baseRate: 12000, // $12,000 per acre
    pricePerAcre: 12000,
    debrisYards: 150,
    debrisIncluded: true
  },
  'average': {
    label: 'Average Clearing',
    description: 'Moderate vegetation & trees',
    baseRate: 16200, // $16,200 per acre
    pricePerAcre: 16200,
    debrisYards: 250,
    debrisIncluded: true
  },
  'thick': {
    label: 'Thick Clearing',
    description: 'Dense vegetation & trees',
    baseRate: 21870, // $16,200 + 35%
    pricePerAcre: 21870,
    debrisYards: 350,
    debrisIncluded: true
  },
  'heavy': {
    label: 'Heavy Clearing',
    description: 'Very dense forest & large trees',
    baseRate: 21870, // Same as thick
    pricePerAcre: 21870,
    debrisYards: 350,
    debrisIncluded: true
  },
  'wet': {
    label: 'Wet Conditions',
    description: 'Wetland or swampy areas',
    baseRate: 24300, // $16,200 + 50%
    pricePerAcre: 24300,
    debrisYards: 0,
    debrisIncluded: false
  }
} as const;

type LandClearingPackageType = keyof typeof LAND_CLEARING_PACKAGES;

interface LandClearingEstimateData {
  address: string;
  acres: number;
  package: LandClearingPackageType;
  transportTime: number;
  transportCost: number;
  baseTotal: number;
  debrisCost: number;
  cushion: number;
  finalProposal: number;
  debrisYards: number;
  debrisIncluded: boolean;
}

interface LandClearingCalculatorProps {
  onEstimateComplete?: (estimate: LandClearingEstimateData) => void;
  className?: string;
  initialAddress?: string;
}

export default function LandClearingCalculator({ 
  onEstimateComplete, 
  className = '',
  initialAddress = ''
}: LandClearingCalculatorProps) {
  const [address, setAddress] = useState(initialAddress);
  const [acres, setAcres] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<LandClearingPackageType>('average');
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState<LandClearingEstimateData | null>(null);
  const [addressValidated, setAddressValidated] = useState(false);
  const [transportData, setTransportData] = useState<{
    time: number;
    distance: number;
    cost: number;
  } | null>(null);

  // Update address when initialAddress changes
  useEffect(() => {
    if (initialAddress && initialAddress !== address) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

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

  // Calculate estimate when inputs change
  useEffect(() => {
    if (addressValidated && acres && transportData) {
      const acreage = parseFloat(acres);
      if (acreage > 0) {
        const packageInfo = LAND_CLEARING_PACKAGES[selectedPackage];
        
        // Core calculation: (base_rate * acres) + debris_cost + transport_cost + 10% cushion
        const baseTotal = packageInfo.pricePerAcre * acreage;
        
        // Calculate debris haul-away cost (if included in package)
        const totalDebrisYards = packageInfo.debrisIncluded ? packageInfo.debrisYards * acreage : 0;
        const debrisCost = packageInfo.debrisIncluded ? totalDebrisYards * 15 : 0; // $15 per yard debris haul
        
        const beforeCushion = baseTotal + debrisCost + transportData.cost;
        const cushion = beforeCushion * 0.10; // 10% cushion
        const finalProposal = beforeCushion + cushion;

        const estimateData: LandClearingEstimateData = {
          address,
          acres: acreage,
          package: selectedPackage,
          transportTime: transportData.time,
          transportCost: transportData.cost,
          baseTotal,
          debrisCost,
          cushion,
          finalProposal,
          debrisYards: totalDebrisYards,
          debrisIncluded: packageInfo.debrisIncluded
        };

        setEstimate(estimateData);
        onEstimateComplete?.(estimateData);
      }
    } else {
      setEstimate(null);
    }
  }, [address, acres, selectedPackage, addressValidated, transportData, onEstimateComplete]);

  // Debounced address validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (address.length > 10) {
        validateAddressAndCalculateTransport(address);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [address]);

  return (
    <div className={`bg-gray-900 rounded-lg p-6 ${className}`}>
      <h3 className="text-2xl font-bold text-white mb-6">Land Clearing Estimate</h3>
      
      {/* Project Size */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Project Size (Acres) *
          </label>
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={acres}
            onChange={(e) => setAcres(e.target.value)}
            className="w-full bg-black border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-all"
            placeholder="e.g., 3.5"
          />
        </div>

        {/* Step 3: Package Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-3">
            Choose Your Land Clearing Package *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(LAND_CLEARING_PACKAGES).map(([key, packageInfo]) => (
              <button
                key={key}
                onClick={() => setSelectedPackage(key as LandClearingPackageType)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPackage === key
                    ? 'border-green-500 bg-green-500/10 text-white'
                    : 'border-gray-600 bg-gray-800/50 text-white hover:border-gray-500'
                }`}
              >
                <div className="font-semibold text-lg">{packageInfo.label}</div>
                <div className="text-sm opacity-75 mb-2">{packageInfo.description}</div>
                <div className="text-xs text-white">
                  {packageInfo.debrisIncluded 
                    ? `Includes ${packageInfo.debrisYards} yards debris haul-away per acre`
                    : 'No debris haul-away (wet conditions)'
                  }
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Status */}
        {estimate && (
          <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 mt-6">
            <div className="text-center">
              <div className="text-green-400 mb-2">✓ Project Calculated Successfully</div>
              <div className="text-white text-sm">
                {estimate.acres} acres • {LAND_CLEARING_PACKAGES[estimate.package].label}
              </div>
              {estimate.debrisIncluded && (
                <div className="text-white text-xs mt-1">
                  Includes {estimate.debrisYards} yards debris haul-away
                </div>
              )}
              <p className="text-white text-xs mt-2">
                Pricing will be shown on the next step
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}