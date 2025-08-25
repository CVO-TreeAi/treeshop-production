'use client';

// Location-Based Quoting Component - TreeAI Hive Intelligence Integration
// Domain Coordination: TreeAI Core + Data Intelligence + Business Intelligence

import React, { useState, useEffect, useCallback } from 'react';
import { ConvexHttpClient } from "convex/browser";
import { api } from '../../../convex/_generated/api';
import { PropertyLocation, LocationCoordinates } from '@/lib/services/LocationService';
import InteractivePropertyMap from './InteractivePropertyMap';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface QuotingFormData {
  acreage: number;
  packageType: 'small' | 'medium' | 'large' | 'xlarge';
  obstacles: string[];
  urgency: 'standard' | 'priority' | 'emergency';
  accessConcerns: string[];
}

interface LocationQuote {
  basePrice: number;
  travelSurcharge: number;
  obstacleAdjustment: number;
  accessibilityAdjustment: number;
  urgencyAdjustment: number;
  totalPrice: number;
  estimatedDays: number;
  confidence: number;
  assumptions: string[];
  travelInfo: {
    distance: string;
    duration: string;
    zone: string;
  };
}

interface LocationBasedQuotingProps {
  initialLocation?: LocationCoordinates;
  onQuoteGenerated: (quote: LocationQuote & { location: PropertyLocation }) => void;
  onLeadCapture?: (formData: QuotingFormData & { location: PropertyLocation; quote: LocationQuote }) => void;
  showLeadCapture?: boolean;
  className?: string;
}

export default function LocationBasedQuoting({
  initialLocation,
  onQuoteGenerated,
  onLeadCapture,
  showLeadCapture = true,
  className = '',
}: LocationBasedQuotingProps) {
  const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);
  const [quotingData, setQuotingData] = useState<QuotingFormData>({
    acreage: 1,
    packageType: 'medium',
    obstacles: [],
    urgency: 'standard',
    accessConcerns: [],
  });
  const [currentQuote, setCurrentQuote] = useState<LocationQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate quote when location or form data changes
  useEffect(() => {
    if (selectedLocation && quotingData.acreage > 0) {
      calculateQuote();
    }
  }, [selectedLocation, quotingData]);

  // Package options
  const packageOptions = [
    { value: 'small', label: '4" DBH Small Package', description: 'Light brush and saplings', priceHint: '$2,150/acre' },
    { value: 'medium', label: '6" DBH Medium Package', description: 'Mixed vegetation and medium trees', priceHint: '$2,500/acre' },
    { value: 'large', label: '8" DBH Large Package', description: 'Dense forest and larger trees', priceHint: '$3,140/acre' },
    { value: 'xlarge', label: '10" DBH Extra Large Package', description: 'Heavy-duty clearing', priceHint: '$4,160/acre' },
  ];

  // Common obstacles
  const obstacleOptions = [
    'Power lines overhead',
    'Underground utilities',
    'Steep terrain',
    'Wet/marshy areas',
    'Property boundaries unclear',
    'Neighboring structures close',
    'Large rocks/boulders',
    'Mature specimen trees to save',
    'Wildlife habitat concerns',
    'Historical/cultural sites',
  ];

  // Access concerns
  const accessOptions = [
    'Narrow access (less than 10ft)',
    'Soft/muddy ground conditions',
    'Multiple elevation changes',
    'Gates or barriers to remove',
    'Limited parking for equipment',
    'Neighbor access required',
    'Long distance from road',
    'Bridge weight restrictions',
  ];

  // Urgency options
  const urgencyOptions = [
    { value: 'standard', label: 'Standard (2-4 weeks)', multiplier: 1.0 },
    { value: 'priority', label: 'Priority (1-2 weeks)', multiplier: 1.15 },
    { value: 'emergency', label: 'Emergency (ASAP)', multiplier: 1.35 },
  ];

  // Handle location selection from map
  const handleLocationSelect = useCallback((location: PropertyLocation) => {
    setSelectedLocation(location);
    setError(null);
  }, []);

  // Calculate quote using TreeAI algorithms
  const calculateQuote = async () => {
    if (!selectedLocation) return;

    setIsCalculating(true);
    setError(null);

    try {
      // Get base estimate from TreeAI
      const baseEstimate = await convex.mutation(api.estimates.calculateEstimate, {
        acreage: quotingData.acreage,
        packageType: quotingData.packageType,
        obstacles: quotingData.obstacles,
        zipCode: selectedLocation.components.zip,
      });

      // Apply location-specific adjustments
      const locationAdjustments = calculateLocationAdjustments();
      const urgencyAdjustment = calculateUrgencyAdjustment(baseEstimate.basePrice);
      const accessibilityAdjustment = calculateAccessibilityAdjustment(baseEstimate.basePrice);

      // Build comprehensive quote
      const quote: LocationQuote = {
        basePrice: baseEstimate.basePrice,
        travelSurcharge: baseEstimate.travelSurcharge,
        obstacleAdjustment: baseEstimate.obstacleAdjustment,
        accessibilityAdjustment,
        urgencyAdjustment,
        totalPrice: Math.round(
          baseEstimate.basePrice + 
          baseEstimate.travelSurcharge + 
          baseEstimate.obstacleAdjustment + 
          accessibilityAdjustment + 
          urgencyAdjustment
        ),
        estimatedDays: calculateAdjustedTimeline(baseEstimate.estimatedDays),
        confidence: calculateQuoteConfidence(),
        assumptions: generateLocationAssumptions(),
        travelInfo: {
          distance: `${Math.round(selectedLocation.distanceFromBase.meters / 1000)} km`,
          duration: formatDuration(selectedLocation.distanceFromBase.durationSeconds),
          zone: locationAdjustments.zone,
        },
      };

      setCurrentQuote(quote);
      onQuoteGenerated({ ...quote, location: selectedLocation });

    } catch (error) {
      console.error('Quote calculation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate quote');
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate location-specific adjustments
  const calculateLocationAdjustments = () => {
    if (!selectedLocation) return { zone: 'Unknown', adjustment: 0 };

    const locationService = require('@/lib/services/LocationService').createLocationService();
    if (!locationService) return { zone: 'Unknown', adjustment: 0 };

    return locationService.calculateTravelSurcharge(
      selectedLocation.distanceFromBase.meters,
      quotingData.acreage * 2500 // Base calculation
    );
  };

  // Calculate urgency adjustment
  const calculateUrgencyAdjustment = (basePrice: number) => {
    const urgencyOption = urgencyOptions.find(opt => opt.value === quotingData.urgency);
    return basePrice * (urgencyOption?.multiplier || 1.0) - basePrice;
  };

  // Calculate accessibility adjustment based on location and concerns
  const calculateAccessibilityAdjustment = (basePrice: number) => {
    let adjustmentPercent = 0;
    
    // Base accessibility score impact
    if (selectedLocation?.accessibilityScore) {
      if (selectedLocation.accessibilityScore < 5) {
        adjustmentPercent += 10; // Difficult access
      } else if (selectedLocation.accessibilityScore < 7) {
        adjustmentPercent += 5; // Moderate access challenges
      }
    }

    // Access concerns impact
    adjustmentPercent += quotingData.accessConcerns.length * 2.5;

    return basePrice * (adjustmentPercent / 100);
  };

  // Calculate adjusted timeline
  const calculateAdjustedTimeline = (baseDays: number) => {
    let adjustedDays = baseDays;

    // Urgency impact
    if (quotingData.urgency === 'priority') {
      adjustedDays = Math.max(1, adjustedDays - 1);
    } else if (quotingData.urgency === 'emergency') {
      adjustedDays = Math.max(0.5, adjustedDays - 2);
    }

    // Access concerns impact
    if (quotingData.accessConcerns.length > 2) {
      adjustedDays += 0.5;
    }

    // Location accessibility impact
    if (selectedLocation?.accessibilityScore && selectedLocation.accessibilityScore < 5) {
      adjustedDays += 1;
    }

    return adjustedDays;
  };

  // Calculate quote confidence based on data quality
  const calculateQuoteConfidence = () => {
    let confidence = 85; // Base confidence

    if (selectedLocation?.verified) confidence += 10;
    if (selectedLocation?.accessibilityScore && selectedLocation.accessibilityScore > 7) confidence += 5;
    if (quotingData.obstacles.length === 0) confidence -= 5; // Likely underestimated
    if (quotingData.accessConcerns.length > 0) confidence += 5; // More thorough assessment

    return Math.min(95, Math.max(60, confidence));
  };

  // Generate location-specific assumptions
  const generateLocationAssumptions = () => {
    const assumptions = [
      'Quote based on precise GPS coordinates',
      'Property boundaries estimated from satellite imagery',
      'Equipment access confirmed via street view and terrain analysis',
      'Weather permitting - no work during storms or heavy rain',
    ];

    if (selectedLocation?.verified) {
      assumptions.push('Address verified through Google Address Validation');
    } else {
      assumptions.push('Address approximated - on-site verification recommended');
    }

    if (quotingData.urgency !== 'standard') {
      assumptions.push(`${quotingData.urgency.charAt(0).toUpperCase() + quotingData.urgency.slice(1)} scheduling premium applied`);
    }

    if (quotingData.accessConcerns.length > 0) {
      assumptions.push('Access challenges identified - may require specialized equipment');
    }

    return assumptions;
  };

  // Format duration seconds to readable string
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof QuotingFormData, value: any) => {
    setQuotingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle array field toggles (obstacles, access concerns)
  const handleArrayToggle = (field: 'obstacles' | 'accessConcerns', value: string) => {
    setQuotingData(prev => {
      const currentArray = prev[field];
      const updatedArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: updatedArray,
      };
    });
  };

  // Handle lead capture
  const handleLeadCapture = () => {
    if (selectedLocation && currentQuote && onLeadCapture) {
      onLeadCapture({
        ...quotingData,
        location: selectedLocation,
        quote: currentQuote,
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Interactive Map */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Select Property Location</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click on the map to drop a pin at your exact property location. You can drag the pin to fine-tune the position.
        </p>
        
        <InteractivePropertyMap
          initialLocation={initialLocation}
          onLocationSelect={handleLocationSelect}
          showPropertyOutline={true}
          height="400px"
          className="rounded-lg border"
        />

        {selectedLocation && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-green-600 mt-0.5">✓</div>
              <div className="flex-1">
                <h4 className="font-medium text-green-900">Location Selected</h4>
                <p className="text-sm text-green-700 mt-1">{selectedLocation.address}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-xs text-green-600">
                  <div>Distance: {Math.round(selectedLocation.distanceFromBase.meters / 1000)} km from base</div>
                  <div>Access Score: {selectedLocation.accessibilityScore || 'N/A'}/10</div>
                  <div>Property Type: {selectedLocation.propertyType || 'Unknown'}</div>
                  <div>Verified: {selectedLocation.verified ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quoting Form */}
      {selectedLocation && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Project Details</h3>
          
          {/* Acreage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Size (acres) *
            </label>
            <input
              type="number"
              min="0.1"
              max="1000"
              step="0.1"
              value={quotingData.acreage}
              onChange={(e) => handleFieldChange('acreage', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter acres to clear"
            />
          </div>

          {/* Package Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Package *
            </label>
            <div className="space-y-3">
              {packageOptions.map(option => (
                <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value={option.value}
                    checked={quotingData.packageType === option.value}
                    onChange={(e) => handleFieldChange('packageType', e.target.value as any)}
                    className="mt-0.5 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                    <div className="text-sm text-green-600 font-medium">{option.priceHint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Timeline Urgency
            </label>
            <div className="space-y-2">
              {urgencyOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value={option.value}
                    checked={quotingData.urgency === option.value}
                    onChange={(e) => handleFieldChange('urgency', e.target.value as any)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    {option.multiplier > 1 && (
                      <div className="text-sm text-orange-600">+{Math.round((option.multiplier - 1) * 100)}% premium</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Obstacles */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Known Obstacles or Concerns
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {obstacleOptions.map(obstacle => (
                <label key={obstacle} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotingData.obstacles.includes(obstacle)}
                    onChange={() => handleArrayToggle('obstacles', obstacle)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{obstacle}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Access Concerns */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Equipment Access Concerns
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {accessOptions.map(concern => (
                <label key={concern} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotingData.accessConcerns.includes(concern)}
                    onChange={() => handleArrayToggle('accessConcerns', concern)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{concern}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quote Display */}
      {currentQuote && selectedLocation && (
        <div className="bg-white border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-800">TreeAI Instant Quote</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${currentQuote.totalPrice.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Confidence: {currentQuote.confidence}%</div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price ({quotingData.acreage} acres):</span>
                  <span>${currentQuote.basePrice.toLocaleString()}</span>
                </div>
                {currentQuote.travelSurcharge > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Travel Surcharge ({currentQuote.travelInfo.zone}):</span>
                    <span>+${currentQuote.travelSurcharge.toLocaleString()}</span>
                  </div>
                )}
                {currentQuote.obstacleAdjustment > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Obstacle Adjustment:</span>
                    <span>+${currentQuote.obstacleAdjustment.toLocaleString()}</span>
                  </div>
                )}
                {currentQuote.accessibilityAdjustment > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Access Difficulty:</span>
                    <span>+${currentQuote.accessibilityAdjustment.toLocaleString()}</span>
                  </div>
                )}
                {currentQuote.urgencyAdjustment > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Urgency Premium:</span>
                    <span>+${currentQuote.urgencyAdjustment.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 font-semibold flex justify-between">
                  <span>Total:</span>
                  <span>${currentQuote.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Project Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estimated Timeline:</span>
                  <span>{currentQuote.estimatedDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Distance:</span>
                  <span>{currentQuote.travelInfo.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Time:</span>
                  <span>{currentQuote.travelInfo.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Zone:</span>
                  <span>{currentQuote.travelInfo.zone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Quote Assumptions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {currentQuote.assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          {showLeadCapture && (
            <div className="flex space-x-4">
              <button
                onClick={handleLeadCapture}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Get Official Proposal
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Print Quote
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isCalculating && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-green-500"></div>
            <span className="text-gray-600">Calculating TreeAI quote...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-500">⚠️</div>
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}