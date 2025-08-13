'use client';

import { useState, useEffect } from 'react';
import { updateConsent } from './GoogleTagManager';

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    functional: true, // Always granted for essential functionality
  });

  useEffect(() => {
    // Check if consent has already been given
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const consentUpdates = {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      personalization_storage: 'granted'
    };
    
    updateConsent(consentUpdates);
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }));
    
    setShowBanner(false);
  };

  const acceptEssential = () => {
    const consentUpdates = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied'
    };
    
    updateConsent(consentUpdates);
    localStorage.setItem('cookie-consent', JSON.stringify({
      analytics: false,
      marketing: false,
      functional: true,
      timestamp: Date.now()
    }));
    
    setShowBanner(false);
  };

  const savePreferences = () => {
    const consentUpdates = {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
      personalization_storage: preferences.analytics ? 'granted' : 'denied'
    };
    
    updateConsent(consentUpdates);
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: Date.now()
    }));
    
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                We use cookies to enhance your experience
              </h3>
              <p className="text-sm text-gray-300">
                We use cookies and similar technologies to provide our services, analyze performance, 
                and deliver personalized content. You can manage your preferences below.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white underline"
              >
                Manage Preferences
              </button>
              <button
                onClick={acceptEssential}
                className="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white"
              >
                Essential Only
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-white">Essential</label>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    disabled
                    className="rounded border-gray-600 bg-gray-800"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Required for the website to function properly. Cannot be disabled.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-white">Analytics</label>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-white">Marketing</label>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-800"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Enable personalized ads and marketing communications.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={savePreferences}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}