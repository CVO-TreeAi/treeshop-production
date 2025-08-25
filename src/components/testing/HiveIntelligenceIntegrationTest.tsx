'use client';

// TreeAI Hive Intelligence Integration Test Suite
// Tests cross-domain coordination and functionality

import React, { useState, useEffect } from 'react';
import InteractivePropertyMap from '@/components/maps/InteractivePropertyMap';
import LocationBasedQuoting from '@/components/location/LocationBasedQuoting';
import AddressAutocompleteVerified from '@/components/location/AddressAutocompleteVerified';
import LocationAnalyticsDashboard from '@/components/location/LocationAnalyticsDashboard';
import { PropertyLocation } from '@/lib/services/LocationService';

interface TestResult {
  testName: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  [key: string]: TestResult;
}

export default function HiveIntelligenceIntegrationTest() {
  const [activeTest, setActiveTest] = useState<'overview' | 'map' | 'autocomplete' | 'quoting' | 'analytics' | 'api'>('overview');
  const [testResults, setTestResults] = useState<TestSuite>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<PropertyLocation | null>(null);

  // Test data
  const testCoordinates = [
    { name: 'Orlando Downtown', lat: 28.5383, lng: -81.3792 },
    { name: 'Winter Park', lat: 28.5948, lng: -81.3516 },
    { name: 'Windermere', lat: 28.4985, lng: -81.5325 },
    { name: 'Outside Service Area', lat: 27.9506, lng: -82.4572 },
  ];

  const testAddresses = [
    '123 Main St, Orlando, FL 32801',
    '456 Park Ave, Winter Park, FL 32789',
    '789 Lake Dr, Windermere, FL 34786',
    'Invalid Address Test 123XYZ',
  ];

  // Initialize test results
  useEffect(() => {
    const initialTests: TestSuite = {
      'Environment Setup': { testName: 'Environment Setup', status: 'pending' },
      'Google Maps API': { testName: 'Google Maps API', status: 'pending' },
      'Location Service': { testName: 'Location Service', status: 'pending' },
      'Address Validation API': { testName: 'Address Validation API', status: 'pending' },
      'Pricing API': { testName: 'Pricing API', status: 'pending' },
      'Analytics API': { testName: 'Analytics API', status: 'pending' },
      'Interactive Map': { testName: 'Interactive Map', status: 'pending' },
      'Address Autocomplete': { testName: 'Address Autocomplete', status: 'pending' },
      'Location Quoting': { testName: 'Location Quoting', status: 'pending' },
      'TreeAI Analysis': { testName: 'TreeAI Analysis', status: 'pending' },
      'Hive Coordination': { testName: 'Hive Coordination', status: 'pending' },
    };
    
    setTestResults(initialTests);
  }, []);

  // Run individual test
  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { ...prev[testName], status: 'running' }
    }));

    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          ...prev[testName],
          status: 'passed',
          duration,
          details: result
        }
      }));
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          ...prev[testName],
          status: 'failed',
          duration,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  // Test environment setup
  const testEnvironment = async () => {
    const requiredEnvVars = [
      'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
      'GOOGLE_MAPS_API_KEY',
      'MAPS_SERVER_API_KEY',
    ];
    
    const missing = requiredEnvVars.filter(envVar => 
      !process.env[envVar as keyof NodeJS.ProcessEnv]
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
    
    return { status: 'All environment variables configured' };
  };

  // Test Google Maps API
  const testGoogleMapsAPI = async () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = () => {
        if (typeof google !== 'undefined') {
          resolve({ status: 'Google Maps API loaded successfully' });
        } else {
          reject(new Error('Google Maps API failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Maps script'));
      document.head.appendChild(script);
    });
  };

  // Test Address Validation API
  const testAddressValidationAPI = async () => {
    const testAddress = 'Orlando, FL';
    
    const response = await fetch('/api/location/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: testAddress,
        includeTreeAIAnalysis: true,
        includeRiskAssessment: true,
        includeMarketAnalytics: true,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API response: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'API returned failure');
    }
    
    return {
      status: 'Address validation API working',
      responseTime: `${response.headers.get('x-response-time') || 'N/A'}ms`,
      locationVerified: data.data.verified,
      treeAIActive: !!data.data.treeAIAnalysis,
    };
  };

  // Test Pricing API
  const testPricingAPI = async () => {
    const testData = {
      coordinates: { lat: 28.5383, lng: -81.3792 },
      acreage: 2.5,
      propertyType: 'residential',
      obstacles: ['Dense undergrowth'],
      urgency: 'standard',
    };
    
    const response = await fetch('/api/location/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });
    
    if (!response.ok) {
      throw new Error(`Pricing API failed: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Pricing calculation failed');
    }
    
    return {
      status: 'Pricing API working',
      totalPrice: data.data.pricing.totalPrice,
      confidence: data.data.pricing.confidence,
      treeAIUsed: !!data.data.treeAIAnalysis,
    };
  };

  // Test Analytics API
  const testAnalyticsAPI = async () => {
    const response = await fetch('/api/location/analytics?period=monthly');
    
    if (!response.ok) {
      throw new Error(`Analytics API failed: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Analytics fetch failed');
    }
    
    return {
      status: 'Analytics API working',
      totalLeads: data.data.summary.totalLeads,
      treeAIMetrics: data.data.treeAIMetrics,
    };
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    
    try {
      await runTest('Environment Setup', testEnvironment);
      await runTest('Google Maps API', testGoogleMapsAPI);
      await runTest('Address Validation API', testAddressValidationAPI);
      await runTest('Pricing API', testPricingAPI);
      await runTest('Analytics API', testAnalyticsAPI);
      
      // Component-specific tests would need to be run manually
      setTestResults(prev => ({
        ...prev,
        'Interactive Map': { ...prev['Interactive Map'], status: 'pending' },
        'Address Autocomplete': { ...prev['Address Autocomplete'], status: 'pending' },
        'Location Quoting': { ...prev['Location Quoting'], status: 'pending' },
        'TreeAI Analysis': { ...prev['TreeAI Analysis'], status: 'pending' },
        'Hive Coordination': { ...prev['Hive Coordination'], status: 'pending' },
      }));
      
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Get test status summary
  const getTestSummary = () => {
    const results = Object.values(testResults);
    return {
      total: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      pending: results.filter(r => r.status === 'pending').length,
      running: results.filter(r => r.status === 'running').length,
    };
  };

  const summary = getTestSummary();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🧪</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  TreeAI Hive Intelligence Integration Test Suite
                </h1>
                <p className="text-gray-600">
                  Comprehensive testing of cross-domain coordination and functionality
                </p>
              </div>
            </div>
            
            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {isRunningTests ? '🔄 Running Tests...' : '▶️ Run All Tests'}
            </button>
          </div>
          
          {/* Test Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-lg font-bold text-gray-800">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-lg font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-green-700">Passed</div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <div className="text-lg font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-lg font-bold text-blue-600">{summary.running}</div>
              <div className="text-sm text-blue-700">Running</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-lg font-bold text-gray-600">{summary.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { key: 'overview', label: 'Test Overview', icon: '📋' },
            { key: 'map', label: 'Interactive Map', icon: '🗺️' },
            { key: 'autocomplete', label: 'Address Autocomplete', icon: '🔍' },
            { key: 'quoting', label: 'Location Quoting', icon: '💰' },
            { key: 'analytics', label: 'Analytics Dashboard', icon: '📊' },
            { key: 'api', label: 'API Tests', icon: '🔌' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTest(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTest === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Test Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTest === 'overview' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Test Results Overview</h2>
              
              <div className="space-y-3">
                {Object.entries(testResults).map(([testName, result]) => (
                  <div key={testName} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        result.status === 'passed' ? 'bg-green-500' :
                        result.status === 'failed' ? 'bg-red-500' :
                        result.status === 'running' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-300'
                      }`}></div>
                      <span className="font-medium">{testName}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm">
                      {result.duration && (
                        <span className="text-gray-500">{result.duration}ms</span>
                      )}
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        result.status === 'passed' ? 'bg-green-100 text-green-700' :
                        result.status === 'failed' ? 'bg-red-100 text-red-700' :
                        result.status === 'running' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTest === 'map' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Interactive Map Test</h2>
              <p className="text-gray-600 mb-6">
                Test the interactive map with TreeAI intelligence. Click anywhere to analyze properties.
              </p>
              
              <InteractivePropertyMap
                height="500px"
                onLocationSelect={(location) => {
                  setSelectedLocation(location);
                  setTestResults(prev => ({
                    ...prev,
                    'Interactive Map': { ...prev['Interactive Map'], status: 'passed', details: location }
                  }));
                }}
                showServiceArea={true}
                showPricingZones={true}
                enableTreeAIAnalysis={true}
                enableRiskAnalysis={true}
                className="rounded-lg border"
              />
              
              {selectedLocation && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">✅ Map Test Passed</h3>
                  <p className="text-green-700 text-sm">
                    Successfully analyzed: {selectedLocation.address}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTest === 'autocomplete' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Address Autocomplete Test</h2>
              <p className="text-gray-600 mb-6">
                Test address autocomplete with TreeAI verification. Try entering an address.
              </p>
              
              <div className="max-w-md">
                <AddressAutocompleteVerified
                  onAddressSelect={(location) => {
                    setSelectedLocation(location);
                    setTestResults(prev => ({
                      ...prev,
                      'Address Autocomplete': { ...prev['Address Autocomplete'], status: 'passed', details: location }
                    }));
                  }}
                  enableTreeAIVerification={true}
                  showServiceAreaStatus={true}
                  variant="enhanced"
                />
              </div>
              
              {selectedLocation && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">✅ Autocomplete Test Passed</h3>
                  <p className="text-green-700 text-sm">
                    Address verified: {selectedLocation.address}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTest === 'quoting' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location-Based Quoting Test</h2>
              <p className="text-gray-600 mb-6">
                Test the comprehensive quoting system with TreeAI pricing intelligence.
              </p>
              
              <LocationBasedQuoting
                onQuoteGenerated={(quote) => {
                  setTestResults(prev => ({
                    ...prev,
                    'Location Quoting': { ...prev['Location Quoting'], status: 'passed', details: quote }
                  }));
                }}
              />
            </div>
          )}
          
          {activeTest === 'analytics' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics Dashboard Test</h2>
              <p className="text-gray-600 mb-6">
                Test the location analytics dashboard and business intelligence features.
              </p>
              
              <LocationAnalyticsDashboard />
            </div>
          )}
          
          {activeTest === 'api' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">API Integration Tests</h2>
              <p className="text-gray-600 mb-6">
                Direct API endpoint testing for debugging and verification.
              </p>
              
              <div className="space-y-4">
                {/* Test coordinates */}
                <div>
                  <h3 className="font-semibold mb-2">Test Coordinates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {testCoordinates.map((coord, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Test coordinate validation
                          fetch('/api/location/validate', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ coordinates: { lat: coord.lat, lng: coord.lng } }),
                          }).then(res => res.json()).then(data => {
                            console.log(`${coord.name}:`, data);
                          });
                        }}
                        className="p-3 text-left border rounded-lg hover:bg-gray-50"
                      >
                        <div className="font-medium">{coord.name}</div>
                        <div className="text-sm text-gray-600">
                          {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Test addresses */}
                <div>
                  <h3 className="font-semibold mb-2">Test Addresses</h3>
                  <div className="space-y-2">
                    {testAddresses.map((address, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Test address validation
                          fetch('/api/location/validate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ address }),
                          }).then(res => res.json()).then(data => {
                            console.log(`${address}:`, data);
                          });
                        }}
                        className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
                      >
                        <div className="font-mono text-sm">{address}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}