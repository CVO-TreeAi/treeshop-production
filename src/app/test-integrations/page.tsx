'use client';

import { useState } from 'react';
import GoogleTagManager, { trackEvent } from '@/components/GoogleTagManager';
import ConsentBanner from '@/components/ConsentBanner';
import DynamicPhoneNumber, { useDynamicPhone } from '@/components/DynamicPhoneNumber';
import PlacesAutocomplete from '@/components/PlacesAutocomplete';
import EnhancedGbpReviews from '@/components/EnhancedGbpReviews';
import { useEnhancedConversions } from '@/lib/enhancedConversions';
import { AttributionManager } from '@/lib/attribution';

export default function TestIntegrationsPage() {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { displayPhone, numericPhone } = useDynamicPhone();
  const { trackLeadSubmit, trackPhoneCall } = useEnhancedConversions();

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAttributionTracking = () => {
    const attribution = AttributionManager.getStoredAttribution();
    addTestResult(`Attribution data: ${JSON.stringify(attribution, null, 2)}`);
  };

  const testEnhancedConversions = () => {
    trackLeadSubmit({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-123-4567',
      value: 1500,
      proposalId: 'test-proposal-123'
    });
    addTestResult('Enhanced Conversion (Lead Submit) sent');
  };

  const testPhoneTracking = () => {
    trackPhoneCall(numericPhone, 'header');
    addTestResult(`Phone conversion tracked for ${displayPhone}`);
  };

  const testGAEvent = () => {
    trackEvent('test_integration', {
      test_type: 'manual',
      page_location: window.location.href,
      user_agent: navigator.userAgent.substring(0, 50)
    });
    addTestResult('GA4 event sent via GTM');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Include Google Tag Manager for testing */}
      <GoogleTagManager 
        gtmId="GTM-TEST123" 
        serverGtmUrl="https://gtm.treeai.us"
      />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Google Integrations Test Suite
          </h1>
          <p className="text-gray-600 mb-8">
            This page tests all Google integrations components and functionality.
          </p>

          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <button
              onClick={testAttributionTracking}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Attribution Tracking
            </button>
            <button
              onClick={testEnhancedConversions}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Enhanced Conversions
            </button>
            <button
              onClick={testPhoneTracking}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Test Phone Tracking
            </button>
            <button
              onClick={testGAEvent}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Test GA4 Event
            </button>
            <button
              onClick={() => {
                fetch('/api/analytics/event', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: 'server_test_event',
                    params: { test: true, timestamp: Date.now() }
                  })
                }).then(() => addTestResult('Server analytics event sent'))
                .catch(err => addTestResult(`Server event error: ${err.message}`));
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Test Server Analytics
            </button>
            <button
              onClick={() => {
                AttributionManager.clearAttribution();
                addTestResult('Attribution data cleared');
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear Attribution
            </button>
          </div>
        </div>

        {/* Dynamic Phone Number Component Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📞 Dynamic Phone Number Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Header Phone (Full):</label>
              <DynamicPhoneNumber source="header" className="text-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Phone (Link):</label>
              <DynamicPhoneNumber source="cta" displayFormat="link" className="text-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Footer Phone (Text):</label>
              <DynamicPhoneNumber source="footer" displayFormat="text" className="text-gray-600" />
            </div>
            <div className="text-sm text-gray-600">
              Current attribution-based number: {displayPhone} ({numericPhone})
            </div>
          </div>
        </div>

        {/* Places Autocomplete Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📍 Places Autocomplete Test</h2>
          <div className="space-y-4">
            <PlacesAutocomplete
              onPlaceSelect={(place) => {
                setSelectedPlace(place);
                addTestResult(`Place selected: ${place.description} (${place.placeId})`);
              }}
              placeholder="Search for Florida addresses..."
              className="w-full"
            />
            {selectedPlace && (
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Selected Place:</h3>
                <pre className="text-sm">{JSON.stringify(selectedPlace, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Google Business Profile Reviews Test */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">⭐ Google Business Profile Test</h2>
          <EnhancedGbpReviews
            maxReviews={3}
            showLoadingState={true}
            className="bg-gray-900"
          />
        </div>

        {/* Test Results Log */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📋 Test Results Log</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500">No tests run yet. Click the buttons above to test integrations.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setTestResults([])}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Log
          </button>
        </div>
      </div>

      {/* Consent Banner (should appear at bottom) */}
      <ConsentBanner />
    </div>
  );
}