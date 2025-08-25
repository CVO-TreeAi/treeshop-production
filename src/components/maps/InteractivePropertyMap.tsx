'use client';

// Enhanced Interactive Property Map with TreeAI Hive Intelligence
// Domain Coordination: SaaS Platform + TreeAI Core + Business Intelligence + Security Intelligence

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LocationServiceCoordinator, PropertyLocation, PreciseLocationRequest } from '@/lib/services/LocationService';
import { loadPlacesLibrary } from '@/lib/googlePlaces';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface PropertyMapProps {
  initialLocation?: { lat: number; lng: number };
  initialZoom?: number;
  onLocationSelect: (location: PropertyLocation) => void;
  onBoundsSelect?: (bounds: MapBounds) => void;
  showPropertyOutline?: boolean;
  showServiceArea?: boolean;
  showPricingZones?: boolean;
  showRiskAssessment?: boolean;
  readOnly?: boolean;
  height?: string;
  className?: string;
  
  // TreeAI Intelligence Options
  enableTreeAIAnalysis?: boolean;
  enableRealTimePricing?: boolean;
  enableRiskAnalysis?: boolean;
  showCompetitorData?: boolean;
}

interface MapMarker {
  position: google.maps.LatLng;
  type: 'pin' | 'service_center';
  title: string;
  draggable: boolean;
}

export default function InteractivePropertyMap({
  initialLocation = { lat: 28.5383, lng: -81.3792 }, // Orlando, FL default
  initialZoom = 15,
  onLocationSelect,
  onBoundsSelect,
  showPropertyOutline = true,
  showServiceArea = true,
  showPricingZones = false,
  showRiskAssessment = false,
  readOnly = false,
  height = '400px',
  className = '',
  
  // TreeAI Intelligence Options
  enableTreeAIAnalysis = true,
  enableRealTimePricing = false,
  enableRiskAnalysis = true,
  showCompetitorData = false,
}: PropertyMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [realTimePricing, setRealTimePricing] = useState<any>(null);
  
  // TreeAI Intelligence state
  const [treeAIInsights, setTreeAIInsights] = useState<string[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [serviceAreaData, setServiceAreaData] = useState<any>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const serviceCenterMarkerRef = useRef<google.maps.Marker | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const propertyPolygonRef = useRef<google.maps.Polygon | null>(null);
  const serviceAreaCircleRef = useRef<google.maps.Circle | null>(null);
  const pricingZoneCirclesRef = useRef<google.maps.Circle[]>([]);
  const riskHeatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Initialize TreeAI Hive Intelligence
  useEffect(() => {
    const initializeHiveIntelligence = async () => {
      try {
        await LocationServiceCoordinator.initializeWithHiveIntelligence();
        console.log('🔄 TreeAI Hive Intelligence initialized for InteractivePropertyMap');
      } catch (error) {
        console.error('❌ Failed to initialize Hive Intelligence:', error);
        setError('Failed to initialize TreeAI services');
      }
    };
    
    initializeHiveIntelligence();
  }, []);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        
        // Load Google Maps libraries
        await loadPlacesLibrary();
        
        if (!mapRef.current) {
          throw new Error('Map container not found');
        }

        // Create map instance with enhanced styling
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: initialZoom,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [
              google.maps.MapTypeId.SATELLITE,
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.HYBRID,
              google.maps.MapTypeId.TERRAIN,
            ],
          },
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }], // Hide points of interest for cleaner view
            },
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        setMap(mapInstance);

        // Add enhanced service center marker (TreeShop base)
        const serviceCenterMarker = new google.maps.Marker({
          position: { lat: 29.0216, lng: -81.0770 },
          map: mapInstance,
          title: 'TreeShop Service Center - 3634 Watermelon Lane, New Smyrna Beach, FL 32168',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#16a34a" stroke="#ffffff" stroke-width="4"/>
                <path d="M15 20l5 5 10-10" stroke="#ffffff" stroke-width="3" fill="none"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
          },
          draggable: false,
        });
        serviceCenterMarkerRef.current = serviceCenterMarker;
        
        // Show service area if enabled
        if (showServiceArea) {
          await initializeServiceAreaOverlay(mapInstance);
        }
        
        // Show pricing zones if enabled
        if (showPricingZones) {
          await initializePricingZones(mapInstance);
        }

        // Add click listener for pin dropping (if not read-only)
        if (!readOnly) {
          mapInstance.addListener('click', handleMapClick);
        }

        // Initialize drawing manager for property outline
        if (showPropertyOutline && !readOnly) {
          await initializeDrawingManager(mapInstance);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Map initialization failed:', error);
        setError(error instanceof Error ? error.message : 'Map initialization failed');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [initialLocation, initialZoom, readOnly, showPropertyOutline, showServiceArea, showPricingZones]);

  // Initialize drawing manager for property boundaries
  const initializeDrawingManager = async (mapInstance: google.maps.Map) => {
    try {
      // Load drawing library
      const { DrawingManager } = await google.maps.importLibrary('drawing') as google.maps.DrawingLibrary;
      
      const drawingManager = new DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: '#4ade80',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#16a34a',
          clickable: false,
          editable: true,
        },
      });

      drawingManager.setMap(mapInstance);
      drawingManagerRef.current = drawingManager;

      // Listen for polygon completion
      drawingManager.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
        handlePropertyOutlineComplete(polygon);
      });

    } catch (error) {
      console.error('Failed to initialize drawing manager:', error);
    }
  };

  // Initialize service area overlay
  const initializeServiceAreaOverlay = async (mapInstance: google.maps.Map) => {
    const serviceCenter = { lat: 29.0216, lng: -81.0770 };
    
    // Service area circle (150km radius)
    const serviceAreaCircle = new google.maps.Circle({
      strokeColor: '#16a34a',
      strokeOpacity: 0.4,
      strokeWeight: 2,
      fillColor: '#16a34a',
      fillOpacity: 0.05,
      map: mapInstance,
      center: serviceCenter,
      radius: 150000, // 150km in meters
      clickable: false,
    });
    
    serviceAreaCircleRef.current = serviceAreaCircle;
  };
  
  // Initialize pricing zones
  const initializePricingZones = async (mapInstance: google.maps.Map) => {
    const serviceCenter = { lat: 29.0216, lng: -81.0770 };
    const zones = [
      { radius: 30000, color: '#22c55e', label: 'Core (0% surcharge)' },
      { radius: 60000, color: '#eab308', label: 'Primary (5% surcharge)' },
      { radius: 100000, color: '#f97316', label: 'Extended (15% surcharge)' },
      { radius: 150000, color: '#ef4444', label: 'Maximum (25% surcharge)' },
    ];
    
    pricingZoneCirclesRef.current = zones.map(zone => new google.maps.Circle({
      strokeColor: zone.color,
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: zone.color,
      fillOpacity: 0.1,
      map: mapInstance,
      center: serviceCenter,
      radius: zone.radius,
      clickable: false,
    }));
  };

  // Enhanced map click handler with TreeAI Intelligence
  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    setTreeAIInsights([]);

    try {
      const coordinates = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add enhanced marker with TreeAI styling
      const marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        title: 'TreeAI Property Analysis Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C11.58 2 8 5.58 8 10c0 7.5 8 20 8 20s8-12.5 8-20c0-4.42-3.58-8-8-8z" 
                    fill="#059669" stroke="#ffffff" stroke-width="2"/>
              <circle cx="16" cy="10" r="4" fill="#ffffff"/>
              <circle cx="16" cy="10" r="2" fill="#059669"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32),
        },
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      markerRef.current = marker;

      // Add drag listener
      marker.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
        if (dragEvent.latLng) {
          handlePinDrop({
            lat: dragEvent.latLng.lat(),
            lng: dragEvent.latLng.lng(),
          });
        }
      });

      // Process with TreeAI Intelligence
      await handlePinDrop(coordinates);

    } catch (error) {
      console.error('TreeAI pin drop failed:', error);
      setError(error instanceof Error ? error.message : 'TreeAI analysis failed');
    } finally {
      setIsProcessing(false);
    }
  }, [map, isProcessing]);

  // Enhanced pin drop processing with TreeAI Hive Intelligence
  const handlePinDrop = async (coordinates: { lat: number; lng: number }) => {
    try {
      // Call location validation API with TreeAI analysis
      const response = await fetch('/api/location/validate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates,
          analysisOptions: {
            includeTreeAIPricing: enableTreeAIAnalysis,
            includeRiskProfile: enableRiskAnalysis,
            includeMarketAnalytics: true,
            includePropertyInsights: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Location validation failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Location processing failed');
      }

      const propertyLocation = data.data;
      setSelectedLocation(propertyLocation);
      onLocationSelect(propertyLocation);
      
      // Extract TreeAI insights
      if (propertyLocation.treeAIAnalysis) {
        const insights = [
          `Property type: ${propertyLocation.propertyType || 'Unknown'}`,
          `Accessibility score: ${propertyLocation.accessibilityScore || 'N/A'}/10`,
          `Distance: ${Math.round(propertyLocation.distanceFromBase.meters / 1000)}km from base`,
          `Service zone: ${propertyLocation.serviceZone}`,
        ];
        
        if (propertyLocation.treeAIAnalysis.estimatedCost) {
          insights.push(`Estimated cost: $${propertyLocation.treeAIAnalysis.estimatedCost.totalEstimate.toLocaleString()}`);
          insights.push(`Confidence: ${Math.round(propertyLocation.treeAIAnalysis.estimatedCost.confidence * 100)}%`);
        }
        
        setTreeAIInsights(insights);
      }
      
      // Set risk assessment
      if (propertyLocation.riskProfile) {
        setRiskAssessment(propertyLocation.riskProfile);
      }
      
      // Get real-time pricing if enabled
      if (enableRealTimePricing) {
        await fetchRealTimePricing(coordinates);
      }

      // Show enhanced info window
      showEnhancedLocationInfo(propertyLocation);

    } catch (error) {
      console.error('TreeAI location processing failed:', error);
      setError(error instanceof Error ? error.message : 'TreeAI analysis failed');
    }
  };

  // Handle property outline completion
  const handlePropertyOutlineComplete = (polygon: google.maps.Polygon) => {
    // Clear previous polygon
    if (propertyPolygonRef.current) {
      propertyPolygonRef.current.setMap(null);
    }

    propertyPolygonRef.current = polygon;

    // Calculate bounds
    const bounds = new google.maps.LatLngBounds();
    const path = polygon.getPath();
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      bounds.extend(point);
    }

    const mapBounds: MapBounds = {
      north: bounds.getNorthEast().lat(),
      south: bounds.getSouthWest().lat(),
      east: bounds.getNorthEast().lng(),
      west: bounds.getSouthWest().lng(),
    };

    onBoundsSelect?.(mapBounds);

    // Disable drawing mode
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  // Enhanced info window with TreeAI Intelligence
  const showEnhancedLocationInfo = (location: PropertyLocation) => {
    if (!map || !markerRef.current) return;

    // Close existing info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const treeAIData = location.treeAIAnalysis;
    const riskData = location.riskProfile;
    const analyticsData = location.analytics;

    const content = `
      <div class="p-4 max-w-md bg-white rounded-lg shadow-lg">
        <div class="flex items-center mb-3">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <h3 class="font-bold text-green-800">TreeAI Property Analysis</h3>
        </div>
        
        <p class="text-sm text-gray-700 mb-3 font-medium">${location.address}</p>
        
        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
          <div class="bg-gray-50 p-2 rounded">
            <span class="text-gray-500">Type:</span>
            <div class="font-medium">${location.propertyType || 'Unknown'}</div>
          </div>
          <div class="bg-gray-50 p-2 rounded">
            <span class="text-gray-500">Verified:</span>
            <div class="font-medium ${location.verified ? 'text-green-600' : 'text-red-600'}">
              ${location.verified ? '✓ Yes' : '✗ No'}
            </div>
          </div>
        </div>
        
        ${treeAIData ? `
          <div class="bg-green-50 p-3 rounded mb-3">
            <h4 class="font-semibold text-green-800 mb-2">🌲 TreeAI Analysis</h4>
            <div class="space-y-1 text-xs">
              <div>Estimated Cost: <span class="font-bold text-green-700">$${treeAIData.estimatedCost.totalEstimate.toLocaleString()}</span></div>
              <div>Confidence: <span class="font-medium">${Math.round(treeAIData.estimatedCost.confidence * 100)}%</span></div>
              <div>Vegetation: <span class="capitalize">${treeAIData.pricingFactors.vegetationDensity}</span></div>
              <div>Terrain Difficulty: <span class="font-medium">${treeAIData.pricingFactors.terrainDifficulty}/10</span></div>
            </div>
          </div>
        ` : ''}
        
        ${riskData ? `
          <div class="bg-amber-50 p-3 rounded mb-3">
            <h4 class="font-semibold text-amber-800 mb-2">⚠️ Risk Assessment</h4>
            <div class="space-y-1 text-xs">
              <div>Access Risk: <span class="font-medium capitalize">${riskData.accessRisk}</span></div>
              <div>Weather Risk: <span class="font-medium">${riskData.weatherVulnerability}/10</span></div>
              <div>Equipment Security: <span class="font-medium capitalize">${riskData.equipmentSecurityRisk}</span></div>
            </div>
          </div>
        ` : ''}
        
        <div class="bg-blue-50 p-3 rounded">
          <h4 class="font-semibold text-blue-800 mb-2">📍 Location Details</h4>
          <div class="space-y-1 text-xs">
            <div>Distance: <span class="font-medium">${Math.round(location.distanceFromBase.meters / 1000)} km</span></div>
            <div>Access Score: <span class="font-medium">${location.accessibilityScore || 'N/A'}/10</span></div>
            <div>Service Area: <span class="font-medium ${location.isWithinServiceArea ? 'text-green-600' : 'text-red-600'}">
              ${location.isWithinServiceArea ? '✓ Yes' : '✗ No'}
            </span></div>
          </div>
        </div>
        
        ${analyticsData ? `
          <div class="mt-2 text-xs text-gray-500">
            Market: ${analyticsData.marketSegment} • Competition: ${Math.round(analyticsData.competitorDensity * 100)}%
          </div>
        ` : ''}
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({ content });
    infoWindowRef.current = infoWindow;
    infoWindow.open(map, markerRef.current);
  };

  // Fetch real-time pricing
  const fetchRealTimePricing = async (coordinates: { lat: number; lng: number }) => {
    try {
      const response = await fetch(`/api/location/pricing?lat=${coordinates.lat}&lng=${coordinates.lng}&acreage=1&propertyType=residential`);
      if (response.ok) {
        const data = await response.json();
        setRealTimePricing(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch real-time pricing:', error);
    }
  };
  
  // Clear all selections and overlays
  const clearSelections = () => {
    // Clear markers
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    if (propertyPolygonRef.current) {
      propertyPolygonRef.current.setMap(null);
      propertyPolygonRef.current = null;
    }
    
    // Clear info window
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // Reset state
    setSelectedLocation(null);
    setTreeAIInsights([]);
    setRiskAssessment(null);
    setRealTimePricing(null);
  };
  
  // Toggle service area visibility
  const toggleServiceArea = () => {
    if (serviceAreaCircleRef.current) {
      const currentVisibility = serviceAreaCircleRef.current.getVisible();
      serviceAreaCircleRef.current.setVisible(!currentVisibility);
    }
  };
  
  // Toggle pricing zones visibility
  const togglePricingZones = () => {
    pricingZoneCirclesRef.current.forEach(circle => {
      const currentVisibility = circle.getVisible();
      circle.setVisible(!currentVisibility);
    });
  };

  // Enhanced loading state with TreeAI branding
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg ${className}`} style={{ height }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-green-200 border-t-green-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-green-600">🌲</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Initializing TreeAI Hive Intelligence</p>
            <p className="text-xs text-gray-500 mt-1">Loading interactive property analysis tools...</p>
          </div>
          <div className="flex space-x-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center p-6">
          <div className="text-red-500 mb-3 text-2xl">🚫</div>
          <div className="text-red-600 font-semibold mb-2">TreeAI Service Error</div>
          <p className="text-sm text-red-700 mb-4 max-w-md">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
            >
              🔄 Retry TreeAI Services
            </button>
            <div className="text-xs text-red-500">If the problem persists, please contact support</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-lg shadow-md"
      />
      
      {/* Enhanced map controls with TreeAI Intelligence */}
      <div className="absolute top-3 left-3 bg-white rounded-lg shadow-lg p-3 space-y-3 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700">TreeAI Hive Intelligence</span>
        </div>
        
        {!readOnly && (
          <>
            <div className="text-xs text-gray-600 font-medium">🎯 Click anywhere to analyze property</div>
            {showPropertyOutline && (
              <div className="text-xs text-gray-600">📐 Use polygon tool to outline property</div>
            )}
          </>
        )}
        
        {/* Intelligence Controls */}
        <div className="space-y-2">
          {showServiceArea && (
            <button
              onClick={toggleServiceArea}
              className="w-full text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            >
              🗺️ Toggle Service Area
            </button>
          )}
          
          {showPricingZones && (
            <button
              onClick={togglePricingZones}
              className="w-full text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              💰 Toggle Pricing Zones
            </button>
          )}
          
          {selectedLocation && (
            <>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="w-full text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
              >
                📊 {showAnalytics ? 'Hide' : 'Show'} Analytics
              </button>
              
              <button
                onClick={clearSelections}
                className="w-full text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
              >
                🗑️ Clear Selection
              </button>
            </>
          )}
        </div>
        
        {/* TreeAI Insights Panel */}
        {treeAIInsights.length > 0 && (
          <div className="bg-green-50 p-2 rounded text-xs">
            <div className="font-semibold text-green-800 mb-1">🌲 TreeAI Insights:</div>
            <ul className="space-y-1">
              {treeAIInsights.slice(0, 3).map((insight, index) => (
                <li key={index} className="text-green-700">• {insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Analytics Panel */}
      {showAnalytics && selectedLocation && (
        <div className="absolute top-3 right-3 bg-white rounded-lg shadow-lg p-3 max-w-sm">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">📈</span>
            Property Analytics
          </h4>
          
          {selectedLocation.analytics && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Market Segment:</span>
                <span className="font-medium capitalize">{selectedLocation.analytics.marketSegment}</span>
              </div>
              <div className="flex justify-between">
                <span>Competition:</span>
                <span className="font-medium">{Math.round(selectedLocation.analytics.competitorDensity * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Retention Probability:</span>
                <span className="font-medium">{Math.round(selectedLocation.analytics.customerRetentionProbability * 100)}%</span>
              </div>
            </div>
          )}
          
          {realTimePricing && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">💰 Quick Pricing</h5>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-medium">${realTimePricing.pricing.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Surcharge:</span>
                  <span className="font-medium">${realTimePricing.pricing.travelSurcharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${realTimePricing.pricing.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced processing overlay with TreeAI branding */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-green-200 border-t-green-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-green-600 font-bold">AI</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-800">TreeAI Analyzing Property...</div>
              <div className="text-xs text-gray-600 mt-1">
                Hive Intelligence Processing Location Data
              </div>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}