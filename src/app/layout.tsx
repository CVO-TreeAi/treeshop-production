import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import GoogleTagManager from "@/components/GoogleTagManager";
import ConsentBanner from "@/components/ConsentBanner";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import LeadRecoveryInit from "@/components/LeadRecoveryInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://treeshop.app'

export const metadata: Metadata = {
  metadataBase: new URL('https://treeshop.app'),
  title: {
    default: 'TreeShop | Professional Land Clearing, Forestry Mulching & Tree Services in Central Florida',
    template: '%s | TreeShop'
  },
  description: 'Professional land clearing, forestry mulching, and stump grinding services in Central Florida. Licensed, insured, and equipped with CAT machinery. Get your free estimate today.',
  keywords: ['land clearing', 'forestry mulching', 'stump grinding', 'tree service', 'Central Florida', 'professional tree care', 'CAT equipment', 'licensed arborists', 'TreeAI technology'],
  authors: [{ name: 'TreeShop Team' }],
  creator: 'TreeShop LLC',
  publisher: 'TreeShop LLC',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TreeShop',
    title: 'TreeShop | Professional Tree Services & TreeAI Technology in Central Florida',
    description: 'Professional land clearing, forestry mulching, and stump grinding services. Experience the TreeShop difference with systematic operations and TreeAI technology.',
    images: [
      {
        url: '/project-images/cat-265-forestry-mulcher-fueling.jpg',
        width: 1200,
        height: 630,
        alt: 'TreeShop Professional Land Clearing and Forestry Services with CAT Equipment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TreeShop | Professional Tree Services & TreeAI Technology',
    description: 'Professional land clearing, forestry mulching, and stump grinding in Central Florida. Licensed, insured, and revolutionizing tree care with TreeAI technology.',
    images: ['/project-images/cat-265-forestry-mulcher-fueling.jpg'],
    creator: '@TreeShopLLC',
    site: '@TreeShopLLC',
  },
  verification: {
    google: 'your-google-site-verification-code', // Replace with actual verification code
    yandex: 'your-yandex-verification-code', // If needed
    yahoo: 'your-yahoo-verification-code', // If needed
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en-US': '/',
      'es-US': '/es', // If you add Spanish support
    },
  },
  category: 'business',
  icons: {
    icon: [
      { url: '/treeai.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/treeai.png',
    apple: '/treeai.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/treeai.png',
    },
  },
  openGraph: {
    title: 'TreeAI Forestry Services | AI-Powered Land Clearing in Florida',
    description: 'Professional forestry mulching and land clearing across Florida. AI-powered estimates, selective DBH packages, eco‑friendly mulch finish.',
    url: siteUrl,
    siteName: 'TreeAI Forestry Services',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/treeai.png`,
        width: 1200,
        height: 630,
        alt: 'TreeAI Forestry Services - Florida Land Clearing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TreeAI Forestry Services | AI-Powered Land Clearing in Florida',
    description: 'Professional forestry mulching and land clearing across Florida with AI-powered estimates.',
    images: [`${siteUrl}/treeai.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tree Shop LLC",
    "alternateName": "TreeShop",
    "description": "Professional land clearing, forestry mulching, and stump grinding services in Central Florida. Licensed, insured, and equipped with CAT machinery for reliable, systematic tree care operations.",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/treeshop/images/branding/treeshop-logo-land-clearing-company.png`,
      "width": "400",
      "height": "400"
    },
    "image": [
      `${siteUrl}/project-images/cat-265-forestry-mulcher-fueling.jpg`,
      `${siteUrl}/project-images/avon-park-land-clearing-after-forestry-mulching.jpg`,
      `${siteUrl}/project-images/land-clearing-project-1.jpg`
    ],
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": "+1-386-843-5266",
    "email": "office@fltreeshop.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Forestry Lane",
      "addressLocality": "Orlando",
      "addressRegion": "FL",
      "postalCode": "32801",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5383,
      "longitude": -81.3792
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 28.5383,
        "longitude": -81.3792
      },
      "geoRadius": "500 mi"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "17:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/treeaifl",
      "https://www.linkedin.com/company/treeai"
    ],
    "priceRange": "$$",
    "areaServed": [
      {
        "@type": "State",
        "name": "Florida"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Professional Tree Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Small Package - 4\" DBH & Under",
            "description": "Professional forestry mulching for trees up to 4 inches diameter at breast height",
            "serviceType": "Land Clearing",
            "provider": {
              "@type": "LocalBusiness",
              "name": "TreeAI Forestry Services"
            }
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Medium Package - 6\" DBH & Under",
            "description": "Professional forestry mulching for trees up to 6 inches diameter at breast height",
            "serviceType": "Land Clearing"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Large Package - 8\" DBH & Under",
            "description": "Professional forestry mulching for trees up to 8 inches diameter at breast height",
            "serviceType": "Land Clearing"
          }
        }
      ]
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TreeAI Forestry Services",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/treeai.png`
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-407-555-8733",
      "contactType": "customer service",
      "availableLanguage": "English",
      "areaServed": "US"
    },
    "sameAs": [
      "https://www.facebook.com/treeaifl",
      "https://www.linkedin.com/company/treeai"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TreeAI Forestry Services",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {/* Google Ads Conversion Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-11045992121"
          strategy="afterInteractive"
        />
        <Script id="google-ads-conversion" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11045992121');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManager 
          gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-PLACEHOLDER'} 
          serverGtmUrl={process.env.NEXT_PUBLIC_SERVER_GTM_URL}
        />
        <ConvexClientProvider>
          {children}
          <LeadRecoveryInit />
        </ConvexClientProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}