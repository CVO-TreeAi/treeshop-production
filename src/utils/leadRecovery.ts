// Lead Recovery Utility - Retries failed lead submissions from localStorage

export interface FailedLead {
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  serviceType: string;
  acres: string;
  selectedPackage: string;
  debrisHandling?: string;
  message?: string;
  price: number | { min: number; max: number };
  timestamp: string;
  retryCount?: number;
}

export const retryFailedLeads = async () => {
  const failedLeads = JSON.parse(localStorage.getItem('failed_leads') || '[]') as FailedLead[];

  if (failedLeads.length === 0) return;

  console.log(`🔄 Attempting to recover ${failedLeads.length} failed lead(s)...`);

  const successfulLeads: FailedLead[] = [];
  const stillFailedLeads: FailedLead[] = [];

  for (const lead of failedLeads) {
    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          args: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            address: lead.address,
            zipCode: lead.zipCode,
            acreage: parseFloat(lead.acres) || 0,
            selectedPackage: lead.selectedPackage,
            obstacles: [],
            leadScore: 'warm',
            leadSource: 'website_estimate_v3_recovery',
            leadPage: 'estimate',
            siteSource: 'treeshop.app',
            status: 'new',
            notes: `Service: ${lead.serviceType} | ${lead.message || ''} | Failed submission recovered from ${lead.timestamp}`,
            estimatedTotal: typeof lead.price === 'number' ? lead.price : lead.price.min,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        })
      });

      if (response.ok) {
        console.log(`✅ Successfully recovered lead for ${lead.name}`);
        successfulLeads.push(lead);
      } else {
        const retryCount = (lead.retryCount || 0) + 1;
        if (retryCount < 5) {
          // Keep trying up to 5 times
          stillFailedLeads.push({ ...lead, retryCount });
        }
        console.log(`❌ Failed to recover lead for ${lead.name} (attempt ${retryCount})`);
      }
    } catch (error) {
      console.error(`Error recovering lead for ${lead.name}:`, error);
      const retryCount = (lead.retryCount || 0) + 1;
      if (retryCount < 5) {
        stillFailedLeads.push({ ...lead, retryCount });
      }
    }
  }

  // Update localStorage with only the leads that still need recovery
  if (stillFailedLeads.length > 0) {
    localStorage.setItem('failed_leads', JSON.stringify(stillFailedLeads));
  } else {
    localStorage.removeItem('failed_leads');
  }

  if (successfulLeads.length > 0) {
    console.log(`🎉 Recovered ${successfulLeads.length} lead(s) successfully!`);
  }
};

// Run recovery check on page load and every 5 minutes
export const initLeadRecovery = () => {
  // Initial check after 10 seconds
  setTimeout(retryFailedLeads, 10000);

  // Check every 5 minutes
  setInterval(retryFailedLeads, 5 * 60 * 1000);
};