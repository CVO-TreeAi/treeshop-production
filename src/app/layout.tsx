import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import GoogleTagManager from "@/components/GoogleTagManager";
import ConsentBanner from "@/components/ConsentBanner";
import { ConvexClientProvider } from "@/components/convex-client-provider";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://treeai.us/treeshop'

export const metadata: Metadata = {
  title: 'TreeAI Forestry Services | AI-Powered Land Clearing & Forestry Mulching in Florida',
  description: 'Professional forestry mulching and land clearing across Florida. AI-powered estimates, selective DBH packages, eco‑friendly mulch finish, fast scheduling.',
  alternates: { canonical: siteUrl },
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
    "name": "TreeAI Forestry Services",
    "description": "Professional forestry mulching and land clearing services across Florida. AI-powered estimates, eco-friendly solutions, and expert results for properties of all sizes.",
    "image": `${siteUrl}/treeai.png`,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/treeai.png`,
      "width": "512",
      "height": "512"
    },
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": "+1-407-555-8733",
    "email": "contact@treeai.us",
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
      "name": "Forestry Mulching Services",
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
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
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
        </ConvexClientProvider>
        <ConsentBanner />
        <Script 
          src="https://treeshopterminal.com/terminal-tracker.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}