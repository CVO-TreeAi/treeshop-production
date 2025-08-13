// Google Search Console API utilities for TreeAI ProWebsite

export interface SearchConsoleProperty {
  siteUrl: string;
  permissionLevel: string;
}

export interface SubmitSitemapResult {
  success: boolean;
  error?: string;
}

export interface SearchAnalyticsQuery {
  startDate: string;
  endDate: string;
  dimensions?: ('query' | 'page' | 'country' | 'device' | 'searchAppearance')[];
  searchType?: 'web' | 'image' | 'video';
  rowLimit?: number;
}

export interface SearchAnalyticsResult {
  rows: {
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
}

export class GoogleSearchConsoleManager {
  private serviceAccount: any;
  private siteUrl: string;

  constructor(serviceAccountKey: string, siteUrl: string) {
    this.serviceAccount = JSON.parse(serviceAccountKey);
    this.siteUrl = siteUrl;
  }

  // Get OAuth access token using service account
  private async getAccessToken(): Promise<string> {
    const { GoogleAuth } = require('google-auth-library');
    
    const auth = new GoogleAuth({
      credentials: this.serviceAccount,
      scopes: ['https://www.googleapis.com/auth/webmasters']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token');
    }

    return accessToken.token;
  }

  // List Search Console properties
  async listProperties(): Promise<SearchConsoleProperty[]> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Search Console API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.siteEntry || [];
  }

  // Add property to Search Console
  async addProperty(siteUrl: string): Promise<void> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to add property: ${response.status} ${error}`);
    }
  }

  // Submit sitemap to Search Console
  async submitSitemap(sitemapUrl: string): Promise<SubmitSitemapResult> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Sitemap submission failed: ${response.status} ${error}`
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get sitemap status
  async getSitemapStatus(sitemapUrl: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get sitemap status: ${response.status} ${error}`);
    }

    return response.json();
  }

  // Query search analytics data
  async querySearchAnalytics(query: SearchAnalyticsQuery): Promise<SearchAnalyticsResult> {
    const accessToken = await this.getAccessToken();

    const requestBody = {
      startDate: query.startDate,
      endDate: query.endDate,
      dimensions: query.dimensions || ['query'],
      searchType: query.searchType || 'web',
      rowLimit: query.rowLimit || 1000
    };

    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.siteUrl)}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Search analytics query failed: ${response.status} ${error}`);
    }

    return response.json();
  }
}

// Schema.org structured data generators
export class SchemaGenerator {
  private siteUrl: string;
  private businessInfo: any;

  constructor(siteUrl: string, businessInfo: any) {
    this.siteUrl = siteUrl;
    this.businessInfo = businessInfo;
  }

  // Generate LocalBusiness schema
  generateLocalBusinessSchema(): any {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": this.siteUrl,
      "name": this.businessInfo.name || "TreeAI Forestry Services",
      "description": "Professional forestry mulching and land clearing services across Florida. AI-powered estimates, eco-friendly solutions, and expert results.",
      "url": this.siteUrl,
      "telephone": this.businessInfo.phone || "+1-555-TREE-AI",
      "email": this.businessInfo.email || "contact@treeai.us",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": this.businessInfo.address?.street || "123 Forestry Lane",
        "addressLocality": this.businessInfo.address?.city || "Orlando",
        "addressRegion": this.businessInfo.address?.state || "FL",
        "postalCode": this.businessInfo.address?.zip || "32801",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.5383,
        "longitude": -81.3792
      },
      "areaServed": [
        {
          "@type": "State",
          "name": "Florida"
        }
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 28.5383,
          "longitude": -81.3792
        },
        "geoRadius": "500 mi"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Forestry Mulching Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Forestry Mulching - Small Package (4\" DBH & Under)",
              "description": "Professional forestry mulching for trees up to 4 inches diameter at breast height",
              "provider": {
                "@type": "LocalBusiness",
                "name": this.businessInfo.name || "TreeAI Forestry Services"
              }
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Forestry Mulching - Medium Package (6\" DBH & Under)",
              "description": "Professional forestry mulching for trees up to 6 inches diameter at breast height"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Forestry Mulching - Large Package (8\" DBH & Under)",
              "description": "Professional forestry mulching for trees up to 8 inches diameter at breast height"
            }
          }
        ]
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:00",
          "closes": "17:00"
        }
      ],
      "priceRange": "$$",
      "image": `${this.siteUrl}/treeai.png`,
      "logo": `${this.siteUrl}/treeai.png`,
      "sameAs": [
        "https://www.facebook.com/treeaifl",
        "https://www.linkedin.com/company/treeai"
      ]
    };
  }

  // Generate Service schema for specific services
  generateServiceSchema(serviceName: string, description: string): any {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName,
      "description": description,
      "provider": {
        "@type": "LocalBusiness",
        "name": this.businessInfo.name || "TreeAI Forestry Services",
        "url": this.siteUrl,
        "telephone": this.businessInfo.phone || "+1-555-TREE-AI",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Orlando",
          "addressRegion": "FL",
          "addressCountry": "US"
        }
      },
      "areaServed": {
        "@type": "State",
        "name": "Florida"
      },
      "serviceType": "Forestry Services",
      "category": "Land Clearing"
    };
  }

  // Generate FAQPage schema
  generateFAQSchema(faqs: { question: string; answer: string }[]): any {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Generate VideoObject schema for video content
  generateVideoSchema(
    name: string,
    description: string,
    thumbnailUrl: string,
    videoUrl: string,
    uploadDate: string,
    duration?: string
  ): any {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": name,
      "description": description,
      "thumbnailUrl": thumbnailUrl,
      "contentUrl": videoUrl,
      "embedUrl": videoUrl,
      "uploadDate": uploadDate,
      "publisher": {
        "@type": "Organization",
        "name": this.businessInfo.name || "TreeAI Forestry Services",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.siteUrl}/treeai.png`
        }
      },
      ...(duration && { "duration": duration })
    };
  }

  // Generate BreadcrumbList schema
  generateBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]): any {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }
}

// Utility function to create SearchConsoleManager from environment
export function createSearchConsoleManager(): GoogleSearchConsoleManager | null {
  const serviceAccountJson = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://treeai.us/treeshop';

  if (!serviceAccountJson) {
    console.warn('Google Search Console service account not configured');
    return null;
  }

  try {
    return new GoogleSearchConsoleManager(serviceAccountJson, siteUrl);
  } catch (error) {
    console.error('Failed to create Search Console manager:', error);
    return null;
  }
}