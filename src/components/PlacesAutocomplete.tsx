'use client';

import { useState, useEffect, useRef } from 'react';
import { loadPlacesLibrary, PlacesCache } from '@/lib/googlePlaces';

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: {
    placeId: string;
    description: string;
    address?: string;
  }) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  restrictions?: {
    country?: string[];
    types?: string[];
    bounds?: google.maps.LatLngBoundsLiteral;
  };
}

export default function PlacesAutocomplete({
  onPlaceSelect,
  placeholder = "Enter property address...",
  className = "",
  value = "",
  restrictions = { country: ['US'], types: ['address'] }
}: PlacesAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const initializePlaces = async () => {
      try {
        const places = await loadPlacesLibrary();
        
        // Create services
        autocompleteService.current = new places.AutocompleteService();
        
        // Create a dummy map element for PlacesService (required by Google)
        const mapDiv = document.createElement('div');
        const map = new google.maps.Map(mapDiv, {
          center: { lat: 28.5383, lng: -81.3792 }, // Orlando, FL
          zoom: 13
        });
        placesService.current = new places.PlacesService(map);
        
        // Create session token for cost optimization
        sessionToken.current = new places.AutocompleteSessionToken();
      } catch (error) {
        console.error('Failed to initialize Places API:', error);
      }
    };

    initializePlaces();
  }, []);

  const getSuggestions = async (query: string) => {
    if (!autocompleteService.current || !query.trim()) {
      setSuggestions([]);
      return;
    }

    // Check cache first
    const cacheKey = `autocomplete_${query.toLowerCase().trim()}`;
    const cached = PlacesCache.get(cacheKey);
    if (cached) {
      setSuggestions(cached);
      return;
    }

    setIsLoading(true);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        sessionToken: sessionToken.current!,
        componentRestrictions: restrictions.country ? { country: restrictions.country } : undefined,
        types: restrictions.types as any,
        bounds: restrictions.bounds,
        // Bias towards Florida
        location: new google.maps.LatLng(28.5383, -81.3792),
        radius: 500000 // 500km radius from Orlando
      };

      autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
        setIsLoading(false);
        
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const formattedSuggestions = predictions.map(prediction => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting?.main_text || '',
            secondaryText: prediction.structured_formatting?.secondary_text || '',
            types: prediction.types
          }));
          
          setSuggestions(formattedSuggestions);
          
          // Cache results for 1 hour
          PlacesCache.set(cacheKey, formattedSuggestions);
        } else {
          setSuggestions([]);
        }
      });
    } catch (error) {
      console.error('Autocomplete error:', error);
      setIsLoading(false);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 2) {
      getSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: any) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Get detailed place information
    if (placesService.current) {
      const request = {
        placeId: suggestion.placeId,
        fields: ['formatted_address', 'geometry', 'address_components'],
        sessionToken: sessionToken.current!
      };

      placesService.current.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          onPlaceSelect({
            placeId: suggestion.placeId,
            description: suggestion.description,
            address: place.formatted_address
          });
          
          // Create new session token for next search
          sessionToken.current = new google.maps.places.AutocompleteSessionToken();
        }
      });
    } else {
      // Fallback without detailed info
      onPlaceSelect({
        placeId: suggestion.placeId,
        description: suggestion.description
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
        autoComplete="off"
      />
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-green-500"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {suggestion.mainText}
              </div>
              <div className="text-xs text-gray-500">
                {suggestion.secondaryText}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && !isLoading && inputValue.length > 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="text-sm text-gray-500">
            No addresses found. Try a different search term.
          </div>
        </div>
      )}
    </div>
  );
}