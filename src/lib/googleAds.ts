import crypto from 'crypto';

export interface GoogleAdsConfig {
  customerId: string;
  loginCustomerId?: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface EnhancedConversionData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
}

export interface OfflineConversionData {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  conversionAction: string;
  conversionDateTime: string;
  conversionValue?: number;
  currencyCode?: string;
  orderId?: string;
}

export class GoogleAdsManager {
  private config: GoogleAdsConfig;
  private accessToken?: string;
  private tokenExpiry?: number;

  constructor(config: GoogleAdsConfig) {
    this.config = config;
  }

  // Hash user data for Enhanced Conversions (SHA256)
  private hashUserData(data: EnhancedConversionData): Record<string, string> {
    const hashed: Record<string, string> = {};

    if (data.email) {
      hashed.hashedEmail = crypto.createHash('sha256')
        .update(data.email.toLowerCase().trim())
        .digest('hex');
    }

    if (data.phone) {
      // Remove all non-numeric characters and prepend country code if missing
      let cleanPhone = data.phone.replace(/\D/g, '');
      if (!cleanPhone.startsWith('1') && cleanPhone.length === 10) {
        cleanPhone = '1' + cleanPhone; // Add US country code
      }
      hashed.hashedPhoneNumber = crypto.createHash('sha256')
        .update(cleanPhone)
        .digest('hex');
    }

    if (data.firstName) {
      hashed.hashedFirstName = crypto.createHash('sha256')
        .update(data.firstName.toLowerCase().trim())
        .digest('hex');
    }

    if (data.lastName) {
      hashed.hashedLastName = crypto.createHash('sha256')
        .update(data.lastName.toLowerCase().trim())
        .digest('hex');
    }

    if (data.street) {
      hashed.hashedStreetAddress = crypto.createHash('sha256')
        .update(data.street.toLowerCase().trim())
        .digest('hex');
    }

    if (data.city) {
      hashed.city = crypto.createHash('sha256')
        .update(data.city.toLowerCase().trim())
        .digest('hex');
    }

    if (data.region) {
      hashed.region = crypto.createHash('sha256')
        .update(data.region.toLowerCase().trim())
        .digest('hex');
    }

    if (data.postalCode) {
      hashed.postalCode = crypto.createHash('sha256')
        .update(data.postalCode.trim())
        .digest('hex');
    }

    if (data.countryCode) {
      hashed.countryCode = crypto.createHash('sha256')
        .update(data.countryCode.toLowerCase().trim())
        .digest('hex');
    }

    return hashed;
  }

  // Get OAuth access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: this.config.refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

    return this.accessToken;
  }

  // Send Enhanced Conversions
  async sendEnhancedConversion(
    conversionAction: string,
    userData: EnhancedConversionData,
    conversionValue?: number,
    currencyCode: string = 'USD',
    orderId?: string
  ): Promise<void> {
    const accessToken = await this.getAccessToken();
    const hashedUserData = this.hashUserData(userData);

    const conversion = {
      conversion_action: `customers/${this.config.customerId}/conversionActions/${conversionAction}`,
      conversion_date_time: new Date().toISOString(),
      conversion_value: conversionValue,
      currency_code: currencyCode,
      order_id: orderId,
      user_identifiers: Object.entries(hashedUserData).map(([key, value]) => ({
        [key]: value
      }))
    };

    const requestBody = {
      conversions: [conversion],
      partial_failure_error: true
    };

    const response = await fetch(
      `https://googleads.googleapis.com/v18/customers/${this.config.customerId}:uploadConversions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Developer-Token': this.config.developerToken,
          'Content-Type': 'application/json',
          ...(this.config.loginCustomerId && { 'Login-Customer-Id': this.config.loginCustomerId })
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Enhanced Conversions upload failed: ${error}`);
    }

    const result = await response.json();
    if (result.partial_failure_error) {
      console.warn('Enhanced Conversions partial failure:', result.partial_failure_error);
    }
  }

  // Send Offline Conversion Import
  async uploadOfflineConversions(conversions: OfflineConversionData[]): Promise<{uploaded: number, errors: string[]}> {
    const accessToken = await this.getAccessToken();
    const errors: string[] = [];
    let uploaded = 0;

    // Process conversions in batches of 2000 (Google Ads API limit)
    const batchSize = 2000;
    for (let i = 0; i < conversions.length; i += batchSize) {
      const batch = conversions.slice(i, i + batchSize);
      
      const clickConversions = batch.map(conv => ({
        gclid: conv.gclid,
        gbraid: conv.gbraid,
        wbraid: conv.wbraid,
        conversion_action: `customers/${this.config.customerId}/conversionActions/${conv.conversionAction}`,
        conversion_date_time: conv.conversionDateTime,
        conversion_value: conv.conversionValue,
        currency_code: conv.currencyCode || 'USD',
        order_id: conv.orderId
      })).filter(conv => conv.gclid || conv.gbraid || conv.wbraid); // Only include conversions with click IDs

      if (clickConversions.length === 0) {
        continue;
      }

      const requestBody = {
        conversions: clickConversions,
        partial_failure_error: true
      };

      try {
        const response = await fetch(
          `https://googleads.googleapis.com/v18/customers/${this.config.customerId}:uploadClickConversions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Developer-Token': this.config.developerToken,
              'Content-Type': 'application/json',
              ...(this.config.loginCustomerId && { 'Login-Customer-Id': this.config.loginCustomerId })
            },
            body: JSON.stringify(requestBody)
          }
        );

        if (!response.ok) {
          const error = await response.text();
          errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error}`);
          continue;
        }

        const result = await response.json();
        if (result.partial_failure_error) {
          errors.push(`Batch ${Math.floor(i/batchSize) + 1} partial failure: ${JSON.stringify(result.partial_failure_error)}`);
        }

        uploaded += clickConversions.length;
      } catch (error) {
        errors.push(`Batch ${Math.floor(i/batchSize) + 1} exception: ${error}`);
      }
    }

    return { uploaded, errors };
  }

  // Get conversion actions for the account
  async getConversionActions(): Promise<{id: string, name: string, category: string}[]> {
    const accessToken = await this.getAccessToken();

    const query = `
      SELECT 
        conversion_action.id,
        conversion_action.name,
        conversion_action.category
      FROM conversion_action
      WHERE conversion_action.status = 'ENABLED'
    `;

    const response = await fetch(
      `https://googleads.googleapis.com/v18/customers/${this.config.customerId}/googleAds:search`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Developer-Token': this.config.developerToken,
          'Content-Type': 'application/json',
          ...(this.config.loginCustomerId && { 'Login-Customer-Id': this.config.loginCustomerId })
        },
        body: JSON.stringify({ query })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch conversion actions: ${response.statusText}`);
    }

    const result = await response.json();
    return result.results?.map((row: any) => ({
      id: row.conversion_action.id,
      name: row.conversion_action.name,
      category: row.conversion_action.category
    })) || [];
  }
}

// Utility function to create GoogleAdsManager from environment
export function createGoogleAdsManager(): GoogleAdsManager | null {
  const config = {
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  };

  // Check if all required config is present
  if (!config.customerId || !config.developerToken || !config.clientId || 
      !config.clientSecret || !config.refreshToken) {
    console.warn('Google Ads configuration incomplete, skipping ads integration');
    return null;
  }

  return new GoogleAdsManager(config as GoogleAdsConfig);
}