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
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.youtube.com *.stripe.com *.googleapis.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.youtube.com *.googletagmanager.com *.stripe.com *.unsplash.com picsum.photos; frame-src 'self' *.youtube.com *.youtube-nocookie.com; connect-src 'self' *.convex.cloud *.googleapis.com api.stripe.com *.google-analytics.com;"
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
