'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { LocationService, PropertyLocation, TreeShopLocation, LocationQuote } from '@/lib/services/LocationService'

interface InteractivePropertyMapProps {
  onLocationSelected?: (location: PropertyLocation) => void
  onQuoteGenerated?: (quote: LocationQuote) => void
  initialAddress?: string
  className?: string
  height?: string
}

interface MapPin {
  id: string
  location: TreeShopLocation
  marker: google.maps.Marker
  isUserPin: boolean
}

export default function InteractivePropertyMap({
  onLocationSelected,
  onQuoteGenerated,
  initialAddress,
  className = '',
  height = '500px'
}: InteractivePropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const locationServiceRef = useRef<LocationService | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pins, setPins] = useState<MapPin[]>([])
  const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null)
  const [isCalculatingQuote, setIsCalculatingQuote] = useState(false)

  // Initialize Google Maps and LocationService
  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!mapRef.current) return

        // Create LocationService instance
        locationServiceRef.current = new LocationService(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!)
        
        // Initialize map
        const map = await locationServiceRef.current.initializeMap(mapRef.current)
        mapInstanceRef.current = map

        // Set up map click handler for pin dropping
        map.addListener('click', handleMapClick)

        // If initial address provided, add it as a pin
        if (initialAddress) {
          await addLocationByAddress(initialAddress)
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Map initialization failed:', err)
        setError('Failed to load map. Please check your internet connection and try again.')
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      // Cleanup map instance
      mapInstanceRef.current = null
      locationServiceRef.current = null
    }
  }, [initialAddress])

  // Handle map clicks for pin dropping
  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || !locationServiceRef.current || !mapInstanceRef.current) return

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    try {
      setIsCalculatingQuote(true)

      // Process pin drop location
      const location = await locationServiceRef.current.processPinDropLocation({
        coordinates: { lat, lng }
      })

      // Add map pin
      const marker = await locationServiceRef.current.addLocationPin(
        location.location,
        mapInstanceRef.current,
        handlePinClick
      )

      // Create new pin
      const newPin: MapPin = {
        id: `pin_${Date.now()}`,
        location: location.location,
        marker,
        isUserPin: true
      }

      setPins(prev => [...prev, newPin])
      setSelectedLocation(location)
      
      // Generate quote
      const quote = await locationServiceRef.current.generateLocationQuote(location.address)
      
      // Trigger callbacks
      if (onLocationSelected) {
        onLocationSelected(location)
      }
      
      if (quote && onQuoteGenerated) {
        onQuoteGenerated(quote)
      }

    } catch (err) {
      console.error('Pin drop failed:', err)
      setError('Failed to process location. Please try again.')
    } finally {
      setIsCalculatingQuote(false)
    }
  }, [onLocationSelected, onQuoteGenerated])

  // Handle pin clicks
  const handlePinClick = useCallback((location: TreeShopLocation) => {
    if (!locationServiceRef.current) return

    // Find the pin
    const pin = pins.find(p => p.location.lat === location.lat && p.location.lng === location.lng)
    if (!pin) return

    // Generate quote for this location
    setIsCalculatingQuote(true)
    locationServiceRef.current.generateLocationQuote(location.address)
      .then(quote => {
        if (quote && onQuoteGenerated) {
          onQuoteGenerated(quote)
        }
      })
      .catch(err => {
        console.error('Quote generation failed:', err)
        setError('Failed to generate quote for this location.')
      })
      .finally(() => {
        setIsCalculatingQuote(false)
      })
  }, [pins, onQuoteGenerated])

  // Add location by address
  const addLocationByAddress = async (address: string) => {
    if (!locationServiceRef.current || !mapInstanceRef.current) return

    try {
      setIsCalculatingQuote(true)

      const location = await locationServiceRef.current.verifyPropertyLocation(address)
      
      // Add map pin
      const marker = await locationServiceRef.current.addLocationPin(
        location.location,
        mapInstanceRef.current,
        handlePinClick
      )

      // Create new pin
      const newPin: MapPin = {
        id: `address_${Date.now()}`,
        location: location.location,
        marker,
        isUserPin: false
      }

      setPins(prev => [...prev, newPin])
      setSelectedLocation(location)

      // Center map on new location
      mapInstanceRef.current.setCenter(location.coordinates)
      mapInstanceRef.current.setZoom(15)

      // Generate quote
      const quote = await locationServiceRef.current.generateLocationQuote(address)
      
      // Trigger callbacks
      if (onLocationSelected) {
        onLocationSelected(location)
      }
      
      if (quote && onQuoteGenerated) {
        onQuoteGenerated(quote)
      }

    } catch (err) {
      console.error('Address location failed:', err)
      setError('Failed to find location. Please check the address and try again.')
    } finally {
      setIsCalculatingQuote(false)
    }
  }

  // Remove a specific pin
  const removePin = useCallback((pinId: string) => {
    setPins(prev => {
      const pin = prev.find(p => p.id === pinId)
      if (pin) {
        // Remove marker from map
        pin.marker.setMap(null)
      }
      return prev.filter(p => p.id !== pinId)
    })
  }, [])

  // Clear all user pins
  const clearAllPins = useCallback(() => {
    setPins(prev => {
      // Remove all user pins from map
      prev.forEach(pin => {
        if (pin.isUserPin) {
          pin.marker.setMap(null)
        }
      })
      return prev.filter(p => !p.isUserPin)
    })
    setSelectedLocation(null)
  }, [])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Map Error</div>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full rounded-lg shadow-lg border border-gray-300"
        style={{ height }}
      />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="text-sm font-medium text-gray-700">Map Controls</div>
        <button
          onClick={clearAllPins}
          disabled={pins.filter(p => p.isUserPin).length === 0}
          className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Clear Pins
        </button>
        <div className="text-xs text-gray-500">
          Click anywhere on map to drop a pin
        </div>
      </div>

      {/* Quote Calculation Overlay */}
      {isCalculatingQuote && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span className="text-sm text-gray-700">Calculating quote...</span>
          </div>
        </div>
      )}

      {/* Pin Counter */}
      {pins.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2">
          <div className="text-sm text-gray-600">
            {pins.filter(p => p.isUserPin).length} location pins
            {pins.some(p => !p.isUserPin) && ' + TreeShop base'}
          </div>
        </div>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="text-sm font-medium text-gray-800 mb-2">Selected Location</div>
          <div className="text-xs text-gray-600 mb-2">{selectedLocation.address}</div>
          {selectedLocation.treeAIAnalysis?.estimatedCost && (
            <div className="text-sm">
              <span className="font-medium text-green-600">
                Est. Cost: ${selectedLocation.treeAIAnalysis.estimatedCost.totalEstimate.toLocaleString()}
              </span>
              <div className="text-xs text-gray-500 mt-1">
                Distance: {(selectedLocation.distanceFromBase.meters * 0.000621371).toFixed(1)} miles
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}