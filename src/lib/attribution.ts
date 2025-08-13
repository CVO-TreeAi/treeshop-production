// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { db } from './firebase';

export interface AttributionData {
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  firstTouchTs?: number;
  lastTouchTs?: number;
  touchpoints?: number;
  referrer?: string;
  landingPage?: string;
}

export class AttributionManager {
  private static STORAGE_KEY = 'treeai_attribution';
  private static EXPIRY_DAYS = 90; // 90 day attribution window

  // Extract attribution parameters from URL
  static extractFromUrl(url: string = window.location.href): AttributionData {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    const attribution: AttributionData = {
      firstTouchTs: Date.now(),
      lastTouchTs: Date.now(),
      touchpoints: 1,
      referrer: document.referrer || undefined,
      landingPage: url
    };

    // Google Ads click IDs
    const gclid = searchParams.get('gclid');
    const gbraid = searchParams.get('gbraid');
    const wbraid = searchParams.get('wbraid');

    if (gclid) attribution.gclid = gclid;
    if (gbraid) attribution.gbraid = gbraid;
    if (wbraid) attribution.wbraid = wbraid;

    // UTM parameters
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmTerm = searchParams.get('utm_term');
    const utmContent = searchParams.get('utm_content');

    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
      attribution.utm = {
        source: utmSource || undefined,
        medium: utmMedium || undefined,
        campaign: utmCampaign || undefined,
        term: utmTerm || undefined,
        content: utmContent || undefined
      };
    }

    return attribution;
  }

  // Get stored attribution data
  static getStoredAttribution(): AttributionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      
      // Check if attribution has expired
      const expiryTime = this.EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - data.firstTouchTs > expiryTime) {
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error reading attribution data:', error);
      return null;
    }
  }

  // Store attribution data
  static storeAttribution(attribution: AttributionData): void {
    if (typeof window === 'undefined') return;

    try {
      const existing = this.getStoredAttribution();
      
      // Merge with existing data, preserving first touch
      const merged: AttributionData = {
        ...attribution,
        firstTouchTs: existing?.firstTouchTs || attribution.firstTouchTs,
        lastTouchTs: Date.now(),
        touchpoints: (existing?.touchpoints || 0) + 1,
        
        // Preserve first-touch attribution for key metrics
        gclid: existing?.gclid || attribution.gclid,
        gbraid: existing?.gbraid || attribution.gbraid,
        wbraid: existing?.wbraid || attribution.wbraid,
        utm: existing?.utm || attribution.utm
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Error storing attribution data:', error);
    }
  }

  // Initialize attribution tracking on page load
  static initializeAttribution(): AttributionData | null {
    if (typeof window === 'undefined') return null;

    const urlAttribution = this.extractFromUrl();
    const hasNewAttribution = urlAttribution.gclid || urlAttribution.gbraid || urlAttribution.wbraid || urlAttribution.utm;

    if (hasNewAttribution) {
      // New attribution detected, store it
      this.storeAttribution(urlAttribution);
      return urlAttribution;
    } else {
      // No new attribution, return stored data
      return this.getStoredAttribution();
    }
  }

  // Save attribution to proposal in Firestore
  static async saveToProposal(proposalId: string, attribution: AttributionData): Promise<void> {
    try {
      // const proposalRef = doc(db, 'proposals', proposalId);
      
      // await updateDoc(proposalRef, {
      //   attribution: attribution,
      //   'attribution.savedAt': Date.now()
      // });
      console.log('Attribution save disabled for Convex migration');
    } catch (error) {
      console.error('Error saving attribution to proposal:', error);
      throw error;
    }
  }

  // Get attribution for a specific proposal
  static async getProposalAttribution(proposalId: string): Promise<AttributionData | null> {
    try {
      // const proposalRef = doc(db, 'proposals', proposalId);
      // const proposalSnap = await getDoc(proposalRef);
      
      // if (proposalSnap.exists()) {
      //   const data = proposalSnap.data();
      //   return data.attribution || null;
      // }
      
      console.log('Attribution get disabled for Convex migration');
      return null;
    } catch (error) {
      console.error('Error getting proposal attribution:', error);
      return null;
    }
  }

  // Clear attribution data (for testing or privacy)
  static clearAttribution(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Get attribution summary for reporting
  static getAttributionSummary(attribution: AttributionData): string {
    if (!attribution) return 'Direct';

    if (attribution.gclid) return 'Google Ads (Search)';
    if (attribution.gbraid) return 'Google Ads (Performance Max)';
    if (attribution.wbraid) return 'Google Ads (Web)';
    
    if (attribution.utm?.source) {
      const source = attribution.utm.source;
      const medium = attribution.utm.medium || 'unknown';
      
      if (source === 'google' && medium === 'organic') return 'Google Organic';
      if (source === 'facebook' || source === 'meta') return 'Facebook/Meta';
      if (source === 'youtube') return 'YouTube';
      if (medium === 'social') return `${source} (Social)`;
      if (medium === 'email') return `${source} (Email)`;
      
      return `${source} (${medium})`;
    }

    if (attribution.referrer) {
      try {
        const referrerHost = new URL(attribution.referrer).hostname;
        if (referrerHost.includes('google.com')) return 'Google Organic';
        if (referrerHost.includes('facebook.com')) return 'Facebook';
        if (referrerHost.includes('youtube.com')) return 'YouTube';
        return `Referral (${referrerHost})`;
      } catch {
        return 'Referral';
      }
    }

    return 'Direct';
  }
}