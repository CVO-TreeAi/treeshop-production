// Multi-site analytics tracking utility
export const trackEvent = async (eventName: string, eventParams: any = {}) => {
  try {
    // Add site identification
    const enrichedParams = {
      ...eventParams,
      site_source: 'treeshop.app',
      timestamp: new Date().toISOString(),
      client_id: getOrCreateClientId(),
    };

    // Send to Google Analytics via API route
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventParams: enrichedParams,
      }),
    });

    // Also send to GTM dataLayer if available
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        ...enrichedParams,
      });
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Get or create a client ID for Google Analytics
function getOrCreateClientId(): string {
  if (typeof window === 'undefined') return 'server_side_client';
  
  let clientId = localStorage.getItem('ga_client_id');
  if (!clientId) {
    clientId = `${Date.now()}.${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('ga_client_id', clientId);
  }
  return clientId;
}

// Track form submissions with site identification
export const trackFormSubmission = async (formData: any, formType: string) => {
  await trackEvent('form_submit', {
    form_type: formType,
    site_source: 'treeshop.app',
    ...formData,
  });
};

// Track page views with site identification
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
  await trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    site_source: 'treeshop.app',
  });
};

// Track lead generation with site identification
export const trackLeadGeneration = async (leadData: any) => {
  await trackEvent('generate_lead', {
    ...leadData,
    site_source: 'treeshop.app',
    lead_source: 'treeshop.app',
  });
};