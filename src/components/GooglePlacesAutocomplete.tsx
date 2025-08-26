'use client';

import { useRef, useEffect, useState } from 'react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  className = '',
  placeholder = 'Enter address',
  disabled = false
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google?.maps?.places?.Autocomplete) {
        setIsLoaded(true);
      } else if (retryCount < 10) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 500);
      }
    };

    checkGoogleMaps();
  }, [retryCount]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) {
      return;
    }

    try {
      // Initialize autocomplete with the legacy API
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'address_components', 'geometry']
        }
      );

      // Handle place selection
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      return () => {
        if (listener) {
          window.google.maps.event.removeListener(listener);
        }
        if (autocompleteRef.current) {
          // Clear the autocomplete instance
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
          autocompleteRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [isLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      {!isLoaded && retryCount < 10 && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      )}
    </div>
  );
}