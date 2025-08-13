import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/mind-map/',
          '/estimate/confirmation',
          '*?utm_*',
          '*?fb*',
          '*?gclid*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/mind-map/',
          '/estimate/confirmation'
        ],
      },
      {
        userAgent: 'Googlebot-Video',
        allow: [
          '/videos/',
          '/videos/forestry-mulching',
          '/videos/before-after',
          '/videos/land-clearing',
          '/videos/equipment',
          '/services/forestry-mulching'
        ],
      }
    ],
    sitemap: 'https://www.fltreeshop.com/sitemap.xml',
    host: 'https://www.fltreeshop.com'
  }
}