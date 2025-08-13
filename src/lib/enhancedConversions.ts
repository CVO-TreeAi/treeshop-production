import { createGoogleAdsManager, EnhancedConversionData } from './googleAds';
import { trackEvent } from '@/components/GoogleTagManager';

export interface ConversionEventData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  value?: number;
  currency?: string;
  proposalId?: string;
  orderId?: string;
}

export class EnhancedConversionsTracker {
  // Track lead submission with Enhanced Conversions
  static async trackLeadSubmit(data: ConversionEventData): Promise<void> {
    try {
      // Send to GTM/GA4
      trackEvent('lead_submit', {
        value: data.value,
        currency: data.currency || 'USD',
        proposal_id: data.proposalId,
        lead_source: 'website_form'
      });

      // Send Enhanced Conversion to Google Ads
      const adsManager = createGoogleAdsManager();
      if (adsManager) {
        const userData: EnhancedConversionData = {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.address,
          city: data.city,
          region: data.state,
          postalCode: data.postalCode,
          countryCode: 'US' // Assuming US for Florida business
        };

        // Get conversion action from environment or config
        const conversionAction = process.env.GOOGLE_ADS_LEAD_CONVERSION_ACTION;
        if (conversionAction) {
          await adsManager.sendEnhancedConversion(
            conversionAction,
            userData,
            data.value,
            data.currency || 'USD',
            data.orderId || data.proposalId
          );
        }
      }

      // Also send to server analytics endpoint as fallback
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'lead_submit',
          proposalId: data.proposalId,
          customerHash: data.email ? this.hashEmail(data.email) : undefined,
          params: {
            value: data.value,
            currency: data.currency || 'USD',
            lead_source: 'website_form'
          }
        })
      });

    } catch (error) {
      console.error('Enhanced conversion tracking error:', error);
    }
  }

  // Track proposal acceptance with Enhanced Conversions
  static async trackProposalAccepted(data: ConversionEventData): Promise<void> {
    try {
      // Send to GTM/GA4
      trackEvent('proposal_accepted', {
        value: data.value,
        currency: data.currency || 'USD',
        proposal_id: data.proposalId,
        conversion_type: 'accepted'
      });

      // Send Enhanced Conversion to Google Ads
      const adsManager = createGoogleAdsManager();
      if (adsManager) {
        const userData: EnhancedConversionData = {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.address,
          city: data.city,
          region: data.state,
          postalCode: data.postalCode,
          countryCode: 'US'
        };

        // Get conversion action from environment or config
        const conversionAction = process.env.GOOGLE_ADS_ACCEPTANCE_CONVERSION_ACTION;
        if (conversionAction) {
          await adsManager.sendEnhancedConversion(
            conversionAction,
            userData,
            data.value,
            data.currency || 'USD',
            data.orderId || data.proposalId
          );
        }
      }

      // Server analytics fallback
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'proposal_accepted',
          proposalId: data.proposalId,
          customerHash: data.email ? this.hashEmail(data.email) : undefined,
          params: {
            value: data.value,
            currency: data.currency || 'USD',
            conversion_type: 'accepted'
          }
        })
      });

    } catch (error) {
      console.error('Enhanced conversion tracking error:', error);
    }
  }

  // Track deposit payment with Enhanced Conversions
  static async trackDepositPaid(data: ConversionEventData): Promise<void> {
    try {
      // Send to GTM/GA4
      trackEvent('purchase', {
        transaction_id: data.orderId || data.proposalId,
        value: data.value,
        currency: data.currency || 'USD',
        proposal_id: data.proposalId,
        payment_type: 'deposit'
      });

      // Send Enhanced Conversion to Google Ads
      const adsManager = createGoogleAdsManager();
      if (adsManager) {
        const userData: EnhancedConversionData = {
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.address,
          city: data.city,
          region: data.state,
          postalCode: data.postalCode,
          countryCode: 'US'
        };

        // Get conversion action from environment or config
        const conversionAction = process.env.GOOGLE_ADS_PURCHASE_CONVERSION_ACTION;
        if (conversionAction) {
          await adsManager.sendEnhancedConversion(
            conversionAction,
            userData,
            data.value,
            data.currency || 'USD',
            data.orderId || data.proposalId
          );
        }
      }

      // Server analytics fallback
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'purchase',
          proposalId: data.proposalId,
          customerHash: data.email ? this.hashEmail(data.email) : undefined,
          params: {
            transaction_id: data.orderId || data.proposalId,
            value: data.value,
            currency: data.currency || 'USD',
            payment_type: 'deposit'
          }
        })
      });

    } catch (error) {
      console.error('Enhanced conversion tracking error:', error);
    }
  }

  // Track phone conversion (for dynamic number insertion)
  static trackPhoneCall(phoneNumber: string, source: 'header' | 'cta' | 'footer' = 'header'): void {
    try {
      trackEvent('phone_call', {
        phone_number: phoneNumber,
        call_source: source,
        engagement_type: 'phone'
      });

      // Server analytics fallback
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'phone_call',
          params: {
            phone_number: phoneNumber,
            call_source: source,
            engagement_type: 'phone'
          }
        })
      }).catch(error => console.error('Phone conversion tracking error:', error));

    } catch (error) {
      console.error('Phone conversion tracking error:', error);
    }
  }

  // Utility function to hash email for privacy
  private static hashEmail(email: string): string {
    // Simple hash for customer identification (not for security)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  // Extract user data from form submission
  static extractUserData(formData: any): ConversionEventData {
    return {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName || formData.name?.split(' ')[0],
      lastName: formData.lastName || formData.name?.split(' ').slice(1).join(' '),
      address: formData.address || formData.propertyAddress,
      city: formData.city,
      state: formData.state || 'FL', // Default to Florida
      postalCode: formData.zipCode || formData.postalCode,
      proposalId: formData.proposalId,
      orderId: formData.orderId
    };
  }
}

// Hook for client-side usage
export function useEnhancedConversions() {
  return {
    trackLeadSubmit: (data: ConversionEventData) => EnhancedConversionsTracker.trackLeadSubmit(data),
    trackProposalAccepted: (data: ConversionEventData) => EnhancedConversionsTracker.trackProposalAccepted(data),
    trackDepositPaid: (data: ConversionEventData) => EnhancedConversionsTracker.trackDepositPaid(data),
    trackPhoneCall: (phone: string, source?: 'header' | 'cta' | 'footer') => 
      EnhancedConversionsTracker.trackPhoneCall(phone, source)
  };
}