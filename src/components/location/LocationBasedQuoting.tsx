'use client';

// LocationBasedQuoting - TreeAI Hive Intelligence Pricing System
// Domain Coordination: TreeAI Core + Business Intelligence + SaaS Platform

import React, { useState, useEffect, useCallback } from 'react';
import { PropertyLocation } from '@/lib/services/LocationService';
import InteractivePropertyMap from '@/components/maps/InteractivePropertyMap';

interface ProjectDetails {
  acreage: number;
  propertyType: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  obstacles: string[];
  urgency: 'standard' | 'priority' | 'emergency';
  accessConcerns: string[];
  timeline: 'immediate' | 'weeks' | 'months' | 'flexible';
}

interface PricingBreakdown {
  basePrice: number;
  acreage: number;
  pricePerAcre: number;
  adjustments: {
    difficulty: number;
    environmental: number;
    seasonal: number;
    obstacles: number;
    urgency: number;
    travel: number;
  };
  subtotal: number;
  totalPrice: number;
  confidence: number;
  pricingSource: string;
}

interface LocationBasedQuotingProps {
  onQuoteGenerated?: (quote: any) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}

export default function LocationBasedQuoting({
  onQuoteGenerated,
  initialLocation,
  className = '',
}: LocationBasedQuotingProps) {
  const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    acreage: 1,
    propertyType: 'residential',
    obstacles: [],
    urgency: 'standard',
    accessConcerns: [],
    timeline: 'flexible',
  });
  
  const [pricingData, setPricingData] = useState<PricingBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'location' | 'details' | 'pricing' | 'quote'>('location');
  
  // TreeAI Intelligence state
  const [treeAIRecommendations, setTreeAIRecommendations] = useState<string[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [marketInsights, setMarketInsights] = useState<any>(null);

  // Available obstacles options
  const obstacleOptions = [
    'Dense undergrowth',
    'Large trees (24"+ diameter)',
    'Rocky terrain',
    'Wet/marshy areas',
    'Steep slopes',
    'Power lines nearby',
    'Structures/buildings',
    'Buried utilities',
    'Fence lines',
    'Water features',
    'Protected species habitat',
    'Historical preservation area',
  ];

  const accessConcernOptions = [
    'Narrow access roads',
    'Soft/unstable ground',
    'Overhead clearance issues',
    'Property gates/restrictions',
    'Neighbor considerations',
    'Seasonal access limitations',
    'HOA requirements',
    'City permit requirements',
  ];

  // Handle location selection from map
  const handleLocationSelect = useCallback((location: PropertyLocation) => {
    setSelectedLocation(location);
    setError(null);
    
    // Auto-detect property type if available
    if (location.propertyType) {
      setProjectDetails(prev => ({
        ...prev,
        propertyType: location.propertyType as any,
      }));
    }
    
    // Extract TreeAI insights
    if (location.treeAIAnalysis) {
      const recommendations = [
        `Vegetation density: ${location.treeAIAnalysis.pricingFactors.vegetationDensity}`,
        `Equipment accessibility: ${location.treeAIAnalysis.pricingFactors.equipmentAccessibility}/10`,
      ];
      
      if (location.treeAIAnalysis.pricingFactors.environmentalRestrictions.length > 0) {
        recommendations.push(`Environmental considerations: ${location.treeAIAnalysis.pricingFactors.environmentalRestrictions.join(', ')}`);
      }
      
      setTreeAIRecommendations(recommendations);
    }
    
    // Set risk assessment
    if (location.riskProfile) {
      setRiskAssessment(location.riskProfile);
    }
    
    // Set market insights
    if (location.analytics) {
      setMarketInsights(location.analytics);
    }
    
    // Auto-advance to details step
    if (step === 'location') {
      setStep('details');
    }
  }, [step]);

  // Calculate pricing with TreeAI intelligence
  const calculatePricing = async () => {
    if (!selectedLocation) return;
    
    setIsCalculating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/location/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: selectedLocation.coordinates,
          address: selectedLocation.address,
          acreage: projectDetails.acreage,
          propertyType: projectDetails.propertyType,
          obstacles: projectDetails.obstacles,
          urgency: projectDetails.urgency,
          propertyBounds: selectedLocation.propertyBounds,
          includeDetailedAnalysis: true,
          includeRiskFactors: true,
          includeCompetitorAnalysis: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Pricing calculation failed: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Pricing calculation failed');
      }

      setPricingData(data.data.pricing);
      setStep('pricing');
      
      // Generate comprehensive quote
      const quote = {
        location: selectedLocation,
        project: projectDetails,
        pricing: data.data.pricing,
        treeAIAnalysis: data.data.treeAIAnalysis,
        riskAssessment: data.data.riskAssessment,
        marketAnalysis: data.data.marketAnalysis,
        recommendations: data.data.recommendations,
        timestamp: new Date().toISOString(),
      };
      
      onQuoteGenerated?.(quote);

    } catch (error) {
      console.error('Pricing calculation failed:', error);
      setError(error instanceof Error ? error.message : 'Pricing calculation failed');
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle obstacle selection
  const toggleObstacle = (obstacle: string) => {
    setProjectDetails(prev => ({
      ...prev,
      obstacles: prev.obstacles.includes(obstacle)
        ? prev.obstacles.filter(o => o !== obstacle)
        : [...prev.obstacles, obstacle],
    }));
  };

  // Handle access concern selection
  const toggleAccessConcern = (concern: string) => {
    setProjectDetails(prev => ({
      ...prev,
      accessConcerns: prev.accessConcerns.includes(concern)
        ? prev.accessConcerns.filter(c => c !== concern)
        : [...prev.accessConcerns, concern],
    }));
  };

  // Navigate between steps
  const goToStep = (newStep: typeof step) => {
    if (newStep === 'details' && !selectedLocation) {
      setError('Please select a location first');
      return;
    }
    if (newStep === 'pricing' && projectDetails.acreage <= 0) {
      setError('Please enter valid project details');
      return;
    }
    setStep(newStep);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header with progress */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-2">🌲</span>
            TreeAI Smart Quoting
          </h2>
          <div className="text-sm bg-green-400 bg-opacity-30 px-2 py-1 rounded-full">
            Hive Intelligence Active
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex space-x-4">
          {[
            { key: 'location', label: 'Location', icon: '📍' },
            { key: 'details', label: 'Details', icon: '📋' },
            { key: 'pricing', label: 'Pricing', icon: '💰' },
          ].map((s, index) => (
            <button
              key={s.key}
              onClick={() => goToStep(s.key as typeof step)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                step === s.key 
                  ? 'bg-white text-green-600' 
                  : 'text-green-100 hover:text-white hover:bg-green-400 bg-opacity-20'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {index < 2 && <span className="text-green-200">→</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700 font-medium">Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Step 1: Location Selection */}
        {step === 'location' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Select Property Location
              </h3>
              <p className="text-gray-600 text-sm">
                Click anywhere on the map to analyze the property and get intelligent pricing
              </p>
            </div>
            
            <InteractivePropertyMap
              height="400px"
              onLocationSelect={handleLocationSelect}
              initialLocation={initialLocation}
              showServiceArea={true}
              showPricingZones={true}
              enableTreeAIAnalysis={true}
              enableRealTimePricing={false}
              enableRiskAnalysis={true}
              className="rounded-lg border"
            />
            
            {selectedLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">
                      ✅ Location Selected
                    </h4>
                    <p className="text-green-700 text-sm">{selectedLocation.address}</p>
                    <p className="text-green-600 text-xs">
                      {Math.round(selectedLocation.distanceFromBase.meters / 1000)}km from service center
                    </p>
                  </div>
                  <button
                    onClick={() => goToStep('details')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Project Details */}
        {step === 'details' && selectedLocation && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h3>
              
              {/* TreeAI Insights */}
              {treeAIRecommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">🧠</span>
                    TreeAI Recommendations
                  </h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    {treeAIRecommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Size (acres) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="500"
                      value={projectDetails.acreage}
                      onChange={(e) => setProjectDetails(prev => ({ 
                        ...prev, 
                        acreage: parseFloat(e.target.value) || 0 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      value={projectDetails.propertyType}
                      onChange={(e) => setProjectDetails(prev => ({ 
                        ...prev, 
                        propertyType: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Urgency
                    </label>
                    <select
                      value={projectDetails.urgency}
                      onChange={(e) => setProjectDetails(prev => ({ 
                        ...prev, 
                        urgency: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="standard">Standard (Normal pricing)</option>
                      <option value="priority">Priority (+25% surcharge)</option>
                      <option value="emergency">Emergency (+50% surcharge)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline Preference
                    </label>
                    <select
                      value={projectDetails.timeline}
                      onChange={(e) => setProjectDetails(prev => ({ 
                        ...prev, 
                        timeline: e.target.value as any 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="immediate">ASAP</option>
                      <option value="weeks">Within 2-4 weeks</option>
                      <option value="months">Within 1-3 months</option>
                      <option value="flexible">Flexible scheduling</option>
                    </select>
                  </div>
                </div>
                
                {/* Obstacles and Concerns */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Obstacles (select all that apply)
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                      {obstacleOptions.map((obstacle) => (
                        <label key={obstacle} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={projectDetails.obstacles.includes(obstacle)}
                            onChange={() => toggleObstacle(obstacle)}
                            className="rounded text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{obstacle}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Concerns (select all that apply)
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                      {accessConcernOptions.map((concern) => (
                        <label key={concern} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={projectDetails.accessConcerns.includes(concern)}
                            onChange={() => toggleAccessConcern(concern)}
                            className="rounded text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{concern}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => goToStep('location')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Location
              </button>
              <button
                onClick={calculatePricing}
                disabled={projectDetails.acreage <= 0 || isCalculating}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {isCalculating ? 'Calculating...' : 'Get TreeAI Quote →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing Display */}
        {step === 'pricing' && pricingData && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                TreeAI Intelligent Quote
              </h3>
              <p className="text-gray-600 text-sm">
                Pricing generated using advanced TreeAI algorithms and local market intelligence
              </p>
            </div>
            
            {/* Pricing Breakdown */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="font-semibold text-gray-800">Base Price</span>
                <span className="font-semibold">${pricingData.basePrice.toLocaleString()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Price per acre: ${pricingData.pricePerAcre.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total acres: {pricingData.acreage}</div>
              </div>
              
              {/* Adjustments */}
              <div className="space-y-2 pt-2">
                {Object.entries(pricingData.adjustments).map(([key, value]) => {
                  if (value === 0) return null;
                  const labels: Record<string, string> = {
                    difficulty: 'Terrain Difficulty',
                    environmental: 'Environmental Factors',
                    seasonal: 'Seasonal Adjustments',
                    obstacles: 'Site Obstacles',
                    urgency: 'Urgency Premium',
                    travel: 'Travel Surcharge',
                  };
                  
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{labels[key]}:</span>
                      <span className={value > 0 ? 'text-red-600' : 'text-green-600'}>
                        {value > 0 ? '+' : ''}${value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                <span className="text-lg font-bold text-gray-800">Total Project Cost</span>
                <span className="text-2xl font-bold text-green-600">
                  ${pricingData.totalPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Confidence: {Math.round(pricingData.confidence * 100)}%
                </span>
                <span className="text-gray-600">
                  Source: {pricingData.pricingSource}
                </span>
              </div>
            </div>
            
            {/* Risk Assessment */}
            {riskAssessment && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Risk Assessment
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-amber-700">Access Risk:</span>
                    <span className={`ml-2 font-medium capitalize ${
                      riskAssessment.accessRisk === 'high' ? 'text-red-600' :
                      riskAssessment.accessRisk === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {riskAssessment.accessRisk}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-700">Weather Risk:</span>
                    <span className="ml-2 font-medium">
                      {riskAssessment.weatherVulnerability}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-700">Equipment Security:</span>
                    <span className={`ml-2 font-medium capitalize ${
                      riskAssessment.equipmentSecurityRisk === 'high' ? 'text-red-600' :
                      riskAssessment.equipmentSecurityRisk === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {riskAssessment.equipmentSecurityRisk}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Market Insights */}
            {marketInsights && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <span className="mr-2">📊</span>
                  Market Intelligence
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Market Segment:</span>
                    <span className="ml-2 font-medium capitalize text-blue-800">
                      {marketInsights.marketSegment}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Competition Level:</span>
                    <span className="ml-2 font-medium text-blue-800">
                      {Math.round(marketInsights.competitorDensity * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Retention Probability:</span>
                    <span className="ml-2 font-medium text-blue-800">
                      {Math.round(marketInsights.customerRetentionProbability * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => goToStep('details')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Modify Details
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    // Generate and download PDF quote
                    console.log('Generating PDF quote...');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  📄 Download Quote
                </button>
                <button
                  onClick={() => {
                    // Convert to formal proposal
                    console.log('Converting to proposal...');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ✅ Accept Quote
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isCalculating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
              <div className="relative mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-green-600 font-bold">🌲</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                TreeAI Processing Your Quote
              </h3>
              <p className="text-gray-600 text-sm">
                Analyzing property characteristics, market conditions, and generating intelligent pricing...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}