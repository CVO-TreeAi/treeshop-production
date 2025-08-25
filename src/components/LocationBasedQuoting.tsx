'use client'

import { useState, useEffect, useCallback } from 'react'
import { LocationService, PropertyLocation, LocationQuote, TreeShopLocation } from '@/lib/services/LocationService'
import InteractivePropertyMap from './InteractivePropertyMap'

interface LocationBasedQuotingProps {
  onQuoteGenerated?: (quote: LocationQuote) => void
  onLocationSelected?: (location: PropertyLocation) => void
  className?: string
  initialAddress?: string
}

interface ServiceAreaTierInfo {
  name: string
  description: string
  transportNote: string
}

interface EstimateDetails {
  location: PropertyLocation
  quote: LocationQuote
  serviceAreaInfo: ServiceAreaTierInfo
}

export default function LocationBasedQuoting({
  onQuoteGenerated,
  onLocationSelected,
  className = '',
  initialAddress
}: LocationBasedQuotingProps) {
  const [locationService] = useState<LocationService>(() => 
    new LocationService(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!)
  )
  
  const [addressInput, setAddressInput] = useState(initialAddress || '')
  const [currentEstimate, setCurrentEstimate] = useState<EstimateDetails | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  
  // Advanced options
  const [projectAcres, setProjectAcres] = useState(1)
  const [vegetationDensity, setVegetationDensity] = useState<'light' | 'moderate' | 'heavy' | 'extreme'>('moderate')
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'agricultural' | 'industrial'>('residential')

  // Handle address input and verification
  const handleAddressSubmit = useCallback(async (address: string) => {
    if (!address.trim()) return

    setIsProcessing(true)
    setError(null)

    try {
      const location = await locationService.verifyPropertyLocation(address)
      const quote = await locationService.generateLocationQuote(address)
      
      if (!quote) {
        throw new Error('Unable to generate quote for this location')
      }

      const serviceAreaInfo = locationService.getServiceAreaInfo(quote.serviceAreaTier)
      
      const estimate: EstimateDetails = {
        location,
        quote,
        serviceAreaInfo
      }

      setCurrentEstimate(estimate)
      
      // Trigger callbacks
      if (onLocationSelected) {
        onLocationSelected(location)
      }
      if (onQuoteGenerated) {
        onQuoteGenerated(quote)
      }

    } catch (err) {
      console.error('Address processing failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to process address')
    } finally {
      setIsProcessing(false)
    }
  }, [locationService, onLocationSelected, onQuoteGenerated])

  // Handle map location selection
  const handleMapLocationSelected = useCallback((location: PropertyLocation) => {
    setAddressInput(location.address)
    if (onLocationSelected) {
      onLocationSelected(location)
    }
  }, [onLocationSelected])

  // Handle map quote generation
  const handleMapQuoteGenerated = useCallback((quote: LocationQuote) => {
    const serviceAreaInfo = locationService.getServiceAreaInfo(quote.serviceAreaTier)
    
    if (currentEstimate) {
      const estimate: EstimateDetails = {
        location: currentEstimate.location,
        quote,
        serviceAreaInfo
      }
      setCurrentEstimate(estimate)
    }
    
    if (onQuoteGenerated) {
      onQuoteGenerated(quote)
    }
  }, [locationService, currentEstimate, onQuoteGenerated])

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAddressSubmit(addressInput)
  }

  // Transportation cost formatting
  const formatTransportationCost = (cost: number) => {
    return cost > 0 ? `$${cost.toLocaleString()}` : 'Included'
  }

  // Service area color coding
  const getServiceAreaColor = (tier: string) => {
    switch (tier) {
      case 'primary': return 'text-green-600'
      case 'secondary': return 'text-blue-600'
      case 'extended': return 'text-orange-600'
      case 'outside': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Address Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Location</h3>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Property Address
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="address"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter property address (e.g., 123 Main St, Orlando, FL)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !addressInput.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? 'Processing...' : 'Get Quote'}
              </button>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
          </button>

          {/* Advanced Options Panel */}
          {showAdvancedOptions && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Size (Acres)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={projectAcres}
                  onChange={(e) => setProjectAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vegetation Density
                </label>
                <select
                  value={vegetationDensity}
                  onChange={(e) => setVegetationDensity(e.target.value as typeof vegetationDensity)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="light">Light Brush</option>
                  <option value="moderate">Moderate Vegetation</option>
                  <option value="heavy">Heavy Forest</option>
                  <option value="extreme">Extreme Dense</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as typeof propertyType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
            </div>
          )}
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="text-red-600 mr-2">⚠️</div>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactive Property Map</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click anywhere on the map to drop a pin and get an instant quote, or use the address form above.
        </p>
        
        <InteractivePropertyMap
          onLocationSelected={handleMapLocationSelected}
          onQuoteGenerated={handleMapQuoteGenerated}
          initialAddress={initialAddress}
          height="400px"
          className="rounded-lg overflow-hidden"
        />
      </div>

      {/* Quote Display */}
      {currentEstimate && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Location-Based Quote</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Information */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Property Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Address:</span> {currentEstimate.location.address}</div>
                  <div><span className="font-medium">Property Type:</span> {currentEstimate.location.propertyType || 'Residential'}</div>
                  <div><span className="font-medium">Coordinates:</span> {currentEstimate.location.coordinates.lat.toFixed(6)}, {currentEstimate.location.coordinates.lng.toFixed(6)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Service Area</h4>
                <div className="space-y-2 text-sm">
                  <div className={`font-medium ${getServiceAreaColor(currentEstimate.quote.serviceAreaTier)}`}>
                    {currentEstimate.serviceAreaInfo.name}
                  </div>
                  <div className="text-gray-600">{currentEstimate.serviceAreaInfo.description}</div>
                  <div className="text-gray-600">{currentEstimate.serviceAreaInfo.transportNote}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Travel Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Distance:</span> {(currentEstimate.quote.transportationCost.distance).toFixed(1)} miles</div>
                  <div><span className="font-medium">Travel Time:</span> {Math.round(currentEstimate.quote.transportationCost.duration)} minutes each way</div>
                  <div><span className="font-medium">Round Trip:</span> {Math.round(currentEstimate.quote.transportationCost.roundTripDuration)} minutes</div>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Estimated Cost Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Service Cost:</span>
                    <span className="font-medium">$2,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transportation Cost:</span>
                    <span className="font-medium">{formatTransportationCost(currentEstimate.quote.transportationCost.cost)}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2">
                    <div className="flex justify-between font-semibold text-green-800">
                      <span>Total Estimate:</span>
                      <span>${(2800 + currentEstimate.quote.transportationCost.cost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-green-100 rounded text-xs text-green-700">
                  <div className="font-medium mb-1">Transportation Details:</div>
                  <div>{Math.ceil(currentEstimate.quote.transportationCost.roundTripDuration / 60)}h total @ $350/hr = ${currentEstimate.quote.transportationCost.cost}</div>
                </div>
              </div>

              {/* Service Area Status */}
              <div className={`p-4 rounded-lg border ${
                currentEstimate.quote.isWithinServiceArea 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`font-medium mb-2 ${
                  currentEstimate.quote.isWithinServiceArea 
                    ? 'text-green-800' 
                    : 'text-red-800'
                }`}>
                  {currentEstimate.quote.isWithinServiceArea ? '✅ Within Service Area' : '⚠️ Outside Standard Service Area'}
                </div>
                <div className={`text-sm ${
                  currentEstimate.quote.isWithinServiceArea 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  {currentEstimate.quote.isWithinServiceArea 
                    ? 'We regularly service this area and can provide standard scheduling.'
                    : 'This location is outside our standard service area. Special arrangements may be required.'}
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-2">
                <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Request Detailed Estimate
                </button>
                <button className="w-full px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
                  Schedule Site Visit
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <div>* Prices are estimates only and may vary based on actual site conditions, accessibility, and project scope.</div>
              <div>* Transportation costs are calculated at $350/hour round-trip from our New Smyrna Beach location.</div>
              <div>* Final pricing will be determined after on-site evaluation.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}