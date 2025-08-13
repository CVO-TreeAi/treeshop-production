'use client';

import { useState, useEffect } from 'react';
import { useEnhancedConversions } from '@/lib/enhancedConversions';
import { AttributionManager } from '@/lib/attribution';

interface DynamicPhoneNumberProps {
  className?: string;
  displayFormat?: 'full' | 'link' | 'text';
  source?: 'header' | 'cta' | 'footer';
  children?: React.ReactNode;
}

// Phone numbers for different traffic sources
const PHONE_NUMBERS = {
  google_ads: '(555) ADS-TREE', // +1-555-237-8733
  organic: '(555) ORG-TREE',     // +1-555-674-8733  
  social: '(555) SOC-TREE',      // +1-555-762-8733
  direct: '(555) DIR-TREE',      // +1-555-347-8733
  default: '(555) TREE-PRO'      // +1-555-873-3776
};

const PHONE_NUMBERS_NUMERIC = {
  google_ads: '+15552378733',
  organic: '+15556748733',
  social: '+15557628733',
  direct: '+15553478733',
  default: '+15558733776'
};

export default function DynamicPhoneNumber({ 
  className = '', 
  displayFormat = 'full',
  source = 'header',
  children 
}: DynamicPhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState(PHONE_NUMBERS.default);
  const [numericPhone, setNumericPhone] = useState(PHONE_NUMBERS_NUMERIC.default);
  const { trackPhoneCall } = useEnhancedConversions();

  useEffect(() => {
    // Get attribution to determine which phone number to show
    const attribution = AttributionManager.getStoredAttribution();
    let phoneKey: keyof typeof PHONE_NUMBERS = 'default';

    if (attribution) {
      if (attribution.gclid || attribution.gbraid || attribution.wbraid) {
        phoneKey = 'google_ads';
      } else if (attribution.utm?.source) {
        const source = attribution.utm.source.toLowerCase();
        if (['facebook', 'meta', 'instagram', 'twitter', 'linkedin'].includes(source)) {
          phoneKey = 'social';
        } else if (source === 'google' && attribution.utm.medium === 'organic') {
          phoneKey = 'organic';
        }
      } else if (!attribution.referrer) {
        phoneKey = 'direct';
      }
    }

    setPhoneNumber(PHONE_NUMBERS[phoneKey]);
    setNumericPhone(PHONE_NUMBERS_NUMERIC[phoneKey]);
  }, []);

  const handlePhoneClick = () => {
    // Track the phone conversion
    trackPhoneCall(numericPhone, source);
    
    // For click-to-call functionality, the browser will handle the tel: link
  };

  if (displayFormat === 'text') {
    return <span className={className}>{children || phoneNumber}</span>;
  }

  if (displayFormat === 'link') {
    return (
      <a
        href={`tel:${numericPhone}`}
        onClick={handlePhoneClick}
        className={`hover:underline ${className}`}
      >
        {children || phoneNumber}
      </a>
    );
  }

  // Full format with call tracking
  return (
    <a
      href={`tel:${numericPhone}`}
      onClick={handlePhoneClick}
      className={`inline-flex items-center space-x-2 hover:opacity-80 transition-opacity ${className}`}
      aria-label={`Call ${phoneNumber}`}
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
        />
      </svg>
      <span>{children || phoneNumber}</span>
    </a>
  );
}

// Hook to get the appropriate phone number for the current visitor
export function useDynamicPhone(): { displayPhone: string; numericPhone: string } {
  const [phoneData, setPhoneData] = useState({
    displayPhone: PHONE_NUMBERS.default,
    numericPhone: PHONE_NUMBERS_NUMERIC.default
  });

  useEffect(() => {
    const attribution = AttributionManager.getStoredAttribution();
    let phoneKey: keyof typeof PHONE_NUMBERS = 'default';

    if (attribution) {
      if (attribution.gclid || attribution.gbraid || attribution.wbraid) {
        phoneKey = 'google_ads';
      } else if (attribution.utm?.source) {
        const source = attribution.utm.source.toLowerCase();
        if (['facebook', 'meta', 'instagram', 'twitter', 'linkedin'].includes(source)) {
          phoneKey = 'social';
        } else if (source === 'google' && attribution.utm.medium === 'organic') {
          phoneKey = 'organic';
        }
      } else if (!attribution.referrer) {
        phoneKey = 'direct';
      }
    }

    setPhoneData({
      displayPhone: PHONE_NUMBERS[phoneKey],
      numericPhone: PHONE_NUMBERS_NUMERIC[phoneKey]
    });
  }, []);

  return phoneData;
}