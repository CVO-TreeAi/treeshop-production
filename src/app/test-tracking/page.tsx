'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/components/GoogleTagManager';
import { useEnhancedConversions } from '@/lib/enhancedConversions';

export default function TestTracking() {
  const { trackLeadSubmit, trackPhoneCall } = useEnhancedConversions();

  useEffect(() => {
    // Check if gtag is loaded
    if (typeof window !== 'undefined') {
      console.log('🔍 Google Tag Manager Status:');
      console.log('gtag available:', typeof (window as any).gtag !== 'undefined');
      console.log('dataLayer available:', typeof (window as any).dataLayer !== 'undefined');

      if ((window as any).dataLayer) {
        console.log('dataLayer contents:', (window as any).dataLayer);
      }
    }
  }, []);

  const testPhoneTracking = () => {
    console.log('📞 Testing Phone Call Tracking...');

    // Test using enhanced conversions
    trackPhoneCall('+15558733776', 'header');

    // Test using direct gtag
    if ((window as any).gtag) {
      (window as any).gtag('event', 'phone_call_click', {
        event_category: 'engagement',
        event_label: 'header_phone',
        value: 1
      });
      console.log('✅ Phone tracking event sent via gtag');
    }

    // Test using trackEvent helper
    trackEvent('phone_call_test', {
      source: 'test_page',
      phone_number: '+15558733776'
    });
    console.log('✅ Phone tracking event sent via trackEvent helper');
  };

  const testLeadTracking = () => {
    console.log('📝 Testing Lead Submit Tracking...');

    // Test using enhanced conversions
    trackLeadSubmit({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+15558733776',
      leadScore: 85,
      projectType: 'tree_removal'
    });

    // Test using direct gtag
    if ((window as any).gtag) {
      (window as any).gtag('event', 'generate_lead', {
        currency: 'USD',
        value: 500,
        event_category: 'engagement',
        event_label: 'test_form'
      });
      console.log('✅ Lead tracking event sent via gtag');
    }

    // Test using trackEvent helper
    trackEvent('lead_submit_test', {
      source: 'test_page',
      form_name: 'test_form',
      lead_quality: 'high'
    });
    console.log('✅ Lead tracking event sent via trackEvent helper');
  };

  const checkCSP = () => {
    console.log('🔐 Checking CSP Configuration...');

    // Try to load Google Analytics
    const testScript = document.createElement('script');
    testScript.src = 'https://www.googletagmanager.com/gtag/js?test=1';
    testScript.onload = () => console.log('✅ Google Tag Manager scripts can load');
    testScript.onerror = () => console.log('❌ CSP blocking Google Tag Manager scripts');
    document.head.appendChild(testScript);

    // Check fetch to Google Analytics
    fetch('https://www.google-analytics.com/g/collect?test=1', { method: 'HEAD' })
      .then(() => console.log('✅ Can connect to Google Analytics'))
      .catch(() => console.log('❌ CSP blocking Google Analytics connections'));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Google Tag Tracking Test Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tracking Status</h2>
          <p className="text-gray-600 mb-4">Open browser console to see tracking details</p>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">GA4 ID:</span> {process.env.NEXT_PUBLIC_GA4_ID || 'G-GM7WD5TG62'}
            </div>
            <div>
              <span className="font-medium">GTM ID:</span> {process.env.NEXT_PUBLIC_GTM_ID || 'Not configured'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Phone Call Button Test</h2>
            <button
              onClick={testPhoneTracking}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Phone Call Tracking
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Simulates clicking the phone call button
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Lead Submit Button Test</h2>
            <button
              onClick={testLeadTracking}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Lead Submit Tracking
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Simulates form submission tracking
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">CSP Check</h2>
            <button
              onClick={checkCSP}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Check CSP Configuration
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Verifies CSP allows Google services
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Real Phone Link</h2>
            <a
              href="tel:+15558733776"
              onClick={() => {
                console.log('📞 Real phone link clicked');
                trackPhoneCall('+15558733776', 'footer');
              }}
              className="block w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              Call (555) TREE-PRO
            </a>
            <p className="text-sm text-gray-600 mt-2">
              Actual phone link with tracking
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>Open browser Developer Console (F12)</li>
            <li>Go to Network tab and filter by "google"</li>
            <li>Click test buttons and watch for tracking requests</li>
            <li>Check Console tab for tracking logs</li>
            <li>Look for requests to googletagmanager.com and google-analytics.com</li>
          </ol>
        </div>
      </div>
    </div>
  );
}