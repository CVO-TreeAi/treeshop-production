// Google Places API utilities for TreeAI ProWebsite

export interface PlaceDetails {
  placeId: string;
  name?: string;
  formattedAddress?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  addressComponents?: {
    longName: string;
    shortName: string;
    types: string[];
  }[];
  types?: string[];
}

export interface PlaceAutocompleteResult {
  placeId: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
  types?: string[];
}

export interface GeocodeResult {
  placeId: string;
  lat: number;
  lng: number;
  formattedAddress: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
    country?: string;
  };
}

export interface DistanceMatrixResult {
  distanceMeters: number;
  durationSeconds: number;
  status: string;
}

export class GooglePlacesManager {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Geocode a place ID to get coordinates and address
  async geocodePlaceId(placeId: string): Promise<GeocodeResult> {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== 'OK' || !data.results?.length) {
      throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'No results'}`);
    }

    const result = data.results[0];
    const location = result.geometry.location;
    
    // Parse address components
    const components: GeocodeResult['components'] = {};
    for (const component of result.address_components || []) {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        if (!components.street) components.street = '';
        components.street += component.long_name + ' ';
      }
      if (types.includes('locality')) {
        components.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        components.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        components.zip = component.long_name;
      }
      if (types.includes('administrative_area_level_2')) {
        components.county = component.long_name;
      }
      if (types.includes('country')) {
        components.country = component.short_name;
      }
    }
    
    // Clean up street address
    if (components.street) {
      components.street = components.street.trim();
    }

    return {
      placeId: result.place_id,
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address,
      components
    };
  }

  // Get distance and time between origin and destination
  async getDistanceMatrix(
    originZip: string, 
    destinationPlaceId: string
  ): Promise<DistanceMatrixResult> {
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', originZip);
    url.searchParams.set('destinations', `place_id:${destinationPlaceId}`);
    url.searchParams.set('units', 'imperial');
    url.searchParams.set('key', this.apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Distance Matrix failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status !== 'OK') {
      throw new Error(`Distance Matrix failed: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      throw new Error(`Distance calculation failed: ${element?.status || 'No data'}`);
    }

    return {
      distanceMeters: element.distance.value,
      durationSeconds: element.duration.value,
      status: element.status
    };
  }

  // Generate a static map image URL
  generateStaticMapUrl(
    lat: number, 
    lng: number, 
    zoom: number = 15, 
    size: string = '600x400',
    maptype: 'roadmap' | 'satellite' | 'terrain' | 'hybrid' = 'satellite'
  ): string {
    const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
    url.searchParams.set('center', `${lat},${lng}`);
    url.searchParams.set('zoom', zoom.toString());
    url.searchParams.set('size', size);
    url.searchParams.set('maptype', maptype);
    url.searchParams.set('markers', `color:red|${lat},${lng}`);
    url.searchParams.set('key', this.apiKey);

    return url.toString();
  }

  // Generate Street View static image URL
  generateStreetViewUrl(
    lat: number, 
    lng: number, 
    size: string = '600x400',
    heading: number = 0,
    fov: number = 90,
    pitch: number = 0
  ): string {
    const url = new URL('https://maps.googleapis.com/maps/api/streetview');
    url.searchParams.set('location', `${lat},${lng}`);
    url.searchParams.set('size', size);
    url.searchParams.set('heading', heading.toString());
    url.searchParams.set('fov', fov.toString());
    url.searchParams.set('pitch', pitch.toString());
    url.searchParams.set('key', this.apiKey);

    return url.toString();
  }

  // Validate an address using Address Validation API
  async validateAddress(address: string): Promise<{
    verdict: 'VALID' | 'INVALID' | 'UNCONFIRMED';
    normalizedAddress?: string;
    components?: any;
  }> {
    const url = 'https://addressvalidation.googleapis.com/v1:validateAddress';
    
    const response = await fetch(`${url}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: {
          addressLines: [address],
          regionCode: 'US'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Address validation failed: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.result;
    
    return {
      verdict: result?.verdict?.addressComplete || 'UNCONFIRMED',
      normalizedAddress: result?.address?.formattedAddress,
      components: result?.address?.addressComponents
    };
  }
}

// Utility function to create GooglePlacesManager from environment
export function createGooglePlacesManager(): GooglePlacesManager | null {
  const apiKey = process.env.MAPS_SERVER_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return null;
  }

  return new GooglePlacesManager(apiKey);
}

// Client-side Places Autocomplete utilities
export function loadPlacesLibrary(): Promise<typeof google.maps.places> {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps?.places) {
      resolve(google.maps.places);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (google?.maps?.places) {
        resolve(google.maps.places);
      } else {
        reject(new Error('Google Places library failed to load'));
      }
    };
    
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    
    document.head.appendChild(script);
  });
}

// Cache utilities for rate limiting and cost control
export class PlacesCache {
  private static readonly CACHE_PREFIX = 'places_cache_';
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  static get(key: string): any | null {
    if (typeof localStorage === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(this.CACHE_PREFIX + key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_TTL) {
        localStorage.removeItem(this.CACHE_PREFIX + key);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }

  static set(key: string, data: any): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch {
      // Ignore cache errors
    }
  }

  static clear(): void {
    if (typeof localStorage === 'undefined') return;
    
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.CACHE_PREFIX)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
  }
}