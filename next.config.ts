import withPWA from 'next-pwa'
import withMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configure the MDX file extension
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],
  
  // Temporarily skip ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Temporarily skip TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure allowed image domains with performance optimizations
  images: {
    unoptimized: true, // Disable optimization temporarily to fix 400 errors
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@mdx-js/react', 'firebase', 'date-fns'],
    // optimizeCss: true, // Disabled due to critters module issue in production
  },
  
  // Security headers
  async headers() {
    // More permissive CSP for development
    const isDevelopment = process.env.NODE_ENV === 'development'

    const cspValue = isDevelopment
      ? "default-src 'self' localhost:* ws://localhost:* http://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' localhost:* *.googletagmanager.com *.google-analytics.com *.youtube.com *.stripe.com *.googleapis.com maps.googleapis.com *.doubleclick.net *.googlesyndication.com *.googleadservices.com; style-src 'self' 'unsafe-inline' localhost:* fonts.googleapis.com *.googletagmanager.com; font-src 'self' localhost:* fonts.gstatic.com data:; img-src 'self' data: blob: localhost:* *.youtube.com *.googletagmanager.com *.stripe.com *.unsplash.com picsum.photos maps.gstatic.com *.googleapis.com *.doubleclick.net *.google.com *.google-analytics.com; frame-src 'self' localhost:* *.youtube.com *.youtube-nocookie.com *.googletagmanager.com *.doubleclick.net; connect-src 'self' ws://localhost:* http://localhost:* *.convex.cloud *.googleapis.com api.stripe.com *.google-analytics.com *.analytics.google.com maps.googleapis.com www.google.com *.googletagmanager.com *.doubleclick.net;"
      : "default-src 'self' https: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: *.vercel.app *.treeshop.app *.googletagmanager.com *.google-analytics.com *.youtube.com *.stripe.com *.googleapis.com maps.googleapis.com *.doubleclick.net *.googlesyndication.com *.googleadservices.com *.gstatic.com cdn.jsdelivr.net unpkg.com; style-src 'self' 'unsafe-inline' https: fonts.googleapis.com *.googletagmanager.com cdn.jsdelivr.net unpkg.com; font-src 'self' fonts.gstatic.com data: https:; img-src 'self' data: blob: https: *.youtube.com *.googletagmanager.com *.stripe.com *.unsplash.com picsum.photos maps.gstatic.com *.googleapis.com *.doubleclick.net *.google.com *.google-analytics.com *.gstatic.com *.ytimg.com; frame-src 'self' https: *.youtube.com *.youtube-nocookie.com *.googletagmanager.com *.doubleclick.net *.stripe.com; connect-src 'self' https: wss: *.vercel.app *.treeshop.app *.convex.cloud *.googleapis.com api.stripe.com *.google-analytics.com *.analytics.google.com maps.googleapis.com www.google.com *.googletagmanager.com *.doubleclick.net vitals.vercel-insights.com;"

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspValue
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  
  // Enable compression and remove powered-by header
  compress: true,
  poweredByHeader: false,
}

// Combine PWA and MDX configurations
const withBoth = withPWA({ dest: 'public', disable: process.env.NODE_ENV === 'development' })
const withMDXConfig = withMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withBoth(withMDXConfig(nextConfig))
