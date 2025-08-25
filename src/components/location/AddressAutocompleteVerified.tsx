'use client';

// Enhanced Address Autocomplete with TreeAI Verification
// Domain Coordination: SaaS Platform + TreeAI Core + Security Intelligence

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PropertyLocation } from '@/lib/services/LocationService';
import { loadPlacesLibrary } from '@/lib/googlePlaces';

interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

interface AddressAutocompleteProps {
  onAddressSelect: (location: PropertyLocation) => void;
  onAddressChange?: (address: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  initialValue?: string;
  
  // TreeAI Intelligence options
  enableTreeAIVerification?: boolean;
  enableRealTimeValidation?: boolean;
  showServiceAreaStatus?: boolean;
  restrictToServiceArea?: boolean;
  
  // Styling options
  variant?: 'default' | 'compact' | 'enhanced';
}

export default function AddressAutocompleteVerified({
  onAddressSelect,
  onAddressChange,
  placeholder = 'Enter property address...',
  className = '',
  disabled = false,
  required = false,
  initialValue = '',
  
  // TreeAI options
  enableTreeAIVerification = true,
  enableRealTimeValidation = true,
  showServiceAreaStatus = true,
  restrictToServiceArea = false,
  
  // Styling
  variant = 'enhanced',
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'verifying' | 'verified' | 'error'>('none');
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // TreeAI Intelligence state
  const [treeAIInsights, setTreeAIInsights] = useState<string[]>([]);
  const [serviceAreaStatus, setServiceAreaStatus] = useState<'unknown' | 'inside' | 'outside'>('unknown');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  
  // Initialize Google Places services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await loadPlacesLibrary();
        
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        
        // Create a hidden div for PlacesService
        const hiddenDiv = document.createElement('div');
        placesServiceRef.current = new google.maps.places.PlacesService(hiddenDiv);
      } catch (error) {
        console.error('Failed to initialize Google Places:', error);
        setError('Address services unavailable');
      }
    };
    
    initializeServices();
  }, []);

  // Debounced search for address suggestions
  useEffect(() => {
    if (!inputValue.trim() || inputValue.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Search for address suggestions
  const searchAddresses = async (query: string) => {
    if (!autocompleteServiceRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['place_id', 'description', 'structured_formatting', 'types'],
      };

      // Add location bias if restricting to service area
      if (restrictToServiceArea) {
        request.locationBias = {
          center: { lat: 28.5383, lng: -81.3792 }, // Orlando, FL
          radius: 150000, // 150km
        } as google.maps.places.LocationBias;
      }

      autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const formattedSuggestions: AddressSuggestion[] = predictions.map(prediction => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting?.main_text || prediction.description,
            secondaryText: prediction.structured_formatting?.secondary_text || '',
            types: prediction.types || [],
          }));
          
          setSuggestions(formattedSuggestions);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
          if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setError('No addresses found. Please try a different search.');
          }
        }
      });
    } catch (error) {
      console.error('Address search failed:', error);
      setError('Address search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify address with TreeAI intelligence
  const verifyAddress = async (address: string) => {
    if (!enableTreeAIVerification) return;
    
    setVerificationStatus('verifying');
    setError(null);
    setTreeAIInsights([]);
    
    try {
      const response = await fetch('/api/location/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          includeTreeAIAnalysis: true,
          includeRiskAssessment: true,
          includeMarketAnalytics: showServiceAreaStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Address verification failed');
      }

      const location = data.data;
      setSelectedLocation(location);
      setVerificationStatus('verified');
      
      // Extract TreeAI insights
      if (location.treeAIAnalysis) {
        const insights = [
          `Property type: ${location.propertyType || 'Unknown'}`,
          `Distance: ${Math.round(location.distanceFromBase.meters / 1000)}km from service center`,
        ];
        
        if (location.treeAIAnalysis.estimatedCost) {
          insights.push(`Est. cost: $${location.treeAIAnalysis.estimatedCost.totalEstimate.toLocaleString()}`);
        }
        
        setTreeAIInsights(insights);
      }
      
      // Set service area status
      if (showServiceAreaStatus) {
        setServiceAreaStatus(location.isWithinServiceArea ? 'inside' : 'outside');
      }
      
      onAddressSelect(location);

    } catch (error) {
      console.error('Address verification failed:', error);
      setVerificationStatus('error');
      setError(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  // Handle address selection
  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    
    onAddressChange?.(suggestion.description);
    
    if (enableTreeAIVerification) {
      await verifyAddress(suggestion.description);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleAddressSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setVerificationStatus('none');
    setSelectedLocation(null);
    setError(null);
    setTreeAIInsights([]);
    setServiceAreaStatus('unknown');
    
    onAddressChange?.(value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderCompactVariant = () => (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${verificationStatus === 'verified' ? 'border-green-500' : ''} ${
          verificationStatus === 'error' ? 'border-red-500' : ''
        }`}
      />
      
      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleAddressSelect(suggestion)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                index === highlightedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium text-sm">{suggestion.mainText}</div>
              <div className="text-gray-500 text-xs">{suggestion.secondaryText}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderEnhancedVariant = () => (
    <div className={`relative ${className}`}>
      <div className="space-y-3">
        {/* Input with status indicators */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`w-full pl-4 pr-12 py-3 border-2 rounded-xl text-sm focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all ${
              disabled ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'border-gray-200'
            } ${verificationStatus === 'verified' ? 'border-green-500 bg-green-50' : ''} ${
              verificationStatus === 'error' ? 'border-red-500 bg-red-50' : ''
            }`}
          />
          
          {/* Status indicator */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading || verificationStatus === 'verifying' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-200 border-t-green-500"></div>
            ) : verificationStatus === 'verified' ? (
              <div className="text-green-500 text-lg">✅</div>
            ) : verificationStatus === 'error' ? (
              <div className="text-red-500 text-lg">❌</div>
            ) : null}
          </div>
        </div>
        
        {/* Enhanced suggestions dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div ref={dropdownRef} className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-1 max-h-80 overflow-y-auto">
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.placeId}
                  onClick={() => handleAddressSelect(suggestion)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === highlightedIndex ? 'bg-green-100 border-green-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-gray-400">📍</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {suggestion.mainText}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {suggestion.secondaryText}
                      </div>
                      {suggestion.types.includes('establishment') && (
                        <div className="text-blue-600 text-xs mt-1">🏢 Business Location</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Verification status and insights */}
        {enableTreeAIVerification && (
          <div className="space-y-2">
            {/* Verification status */}
            {verificationStatus === 'verified' && selectedLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-green-800 font-semibold text-sm">Address Verified</span>
                  {showServiceAreaStatus && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      serviceAreaStatus === 'inside' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {serviceAreaStatus === 'inside' ? 'In Service Area' : 'Outside Service Area'}
                    </span>
                  )}
                </div>
                
                {/* TreeAI Insights */}
                {treeAIInsights.length > 0 && (
                  <div className="space-y-1">
                    {treeAIInsights.map((insight, index) => (
                      <div key={index} className="text-green-700 text-xs">
                        • {insight}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Error state */}
            {verificationStatus === 'error' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">❌</span>
                  <span className="text-red-800 font-semibold text-sm">Verification Failed</span>
                </div>
                <div className="text-red-700 text-xs mt-1">{error}</div>
              </div>
            )}
            
            {/* Loading state */}
            {verificationStatus === 'verifying' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border border-blue-200 border-t-blue-500"></div>
                  <span className="text-blue-800 font-semibold text-sm">TreeAI Verifying Address...</span>
                </div>
                <div className="text-blue-700 text-xs mt-1">
                  Analyzing property characteristics and service area
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* General error */}
        {error && verificationStatus !== 'error' && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
      </div>
    </div>
  );

  // Render based on variant
  if (variant === 'compact') {
    return renderCompactVariant();
  }
  
  return renderEnhancedVariant();
}