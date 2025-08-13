'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleTagManagerProps {
  gtmId: string;
  serverGtmUrl?: string;
}

export default function GoogleTagManager({ gtmId, serverGtmUrl }: GoogleTagManagerProps) {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Initialize gtag function
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Set default consent state (Consent Mode v2)
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 2000
    });

    // Configure gtag
    window.gtag('js', new Date());
    window.gtag('config', process.env.NEXT_PUBLIC_GA4_ID || 'G-GM7WD5TG62', {
      send_page_view: true,
      server_container_url: serverGtmUrl,
      custom_map: {
        custom_parameter_1: 'proposal_id',
        custom_parameter_2: 'lead_score'
      }
    });

    // Track page view
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href
    });

  }, [gtmId, serverGtmUrl]);

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `
        }}
      />
      
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* GA4 Direct Implementation as Fallback */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || 'G-GM7WD5TG62'}`}
        strategy="afterInteractive"
      />
    </>
  );
}

// Export consent management functions
export const updateConsent = (consentUpdates: Record<string, 'granted' | 'denied'>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', consentUpdates);
  }
};

export const trackEvent = (
  eventName: string, 
  parameters: Record<string, any> = {},
  attribution?: {
    gclid?: string;
    gbraid?: string;
    wbraid?: string;
    utm?: Record<string, string>;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventParams = {
      ...parameters,
      ...attribution
    };
    
    window.gtag('event', eventName, eventParams);
    
    // Also send to our server endpoint as fallback
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: eventName,
        params: eventParams,
        attribution
      })
    }).catch(error => console.error('Analytics fallback error:', error));
  }
};