// Firestore collection interfaces and schema definitions

export interface YouTubeVideo {
  id: string
  youtubeId: string
  title: string
  description: string
  category: 'forestry-mulching' | 'stump-grinding' | 'before-after' | 'equipment' | 'technology' | 'tips'
  location: string
  acreage: string
  packageSize: 'Small Package (4" DBH)' | 'Medium Package (6" DBH)' | 'Large Package (8" DBH)' | 'Custom'
  duration: string
  views: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
  sortOrder: number
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string // MDX content
  category: 'Forestry' | 'Land Clearing' | 'Property Management' | 'Equipment' | 'Safety' | 'Environmental' | 'Tips & Tricks' | 'Case Studies'
  tags: string[]
  author: string
  coverImage?: string
  published: boolean
  featured: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  seoKeywords?: string[]
  sortOrder: number
}

export interface ProjectMedia {
  id: string
  location: string
  packageSize: 'Small Package (4" DBH)' | 'Medium Package (6" DBH)' | 'Large Package (8" DBH)' | 'Custom'
  description: string
  beforeImages: {
    url: string
    alt: string
    caption?: string
  }[]
  afterImages: {
    url: string
    alt: string
    caption?: string
  }[]
  acreage: string
  timeframe: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
  sortOrder: number
  additionalDetails?: {
    equipmentUsed?: string[]
    challenges?: string
    results?: string
    clientTestimonial?: string
  }
}

export interface SiteMedia {
  id: string
  type: 'hero-bg' | 'service-tile' | 'about-section' | 'cta-bg' | 'logo' | 'icon' | 'general'
  url: string
  alt: string
  caption?: string
  title: string
  description?: string
  category?: string
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
  dimensions?: {
    width: number
    height: number
  }
  fileSize?: number
  mimeType: string
}

export interface MediaSettings {
  id: string
  youtubeChannelId: string
  youtubeChannelName: string
  youtubeSubscribers: string
  youtubeTotalViews: string
  youtubeTotalVideos: string
  defaultProjectPackageSize: string
  defaultAuthor: string
  featuredVideosLimit: number
  featuredProjectsLimit: number
  featuredBlogsLimit: number
  autoPublishVideos: boolean
  autoPublishProjects: boolean
  autoPublishBlogs: boolean
  updatedAt: Date
}

// Collection names
export const COLLECTIONS = {
  YOUTUBE_VIDEOS: 'youtubeVideos',
  BLOG_POSTS: 'blogPosts', 
  PROJECT_MEDIA: 'projectMedia',
  SITE_MEDIA: 'siteMedia',
  MEDIA_SETTINGS: 'mediaSettings'
} as const

// Default values
export const DEFAULT_CATEGORIES = {
  VIDEO: [
    'forestry-mulching',
    'stump-grinding', 
    'before-after',
    'equipment',
    'technology',
    'tips'
  ],
  BLOG: [
    'Forestry',
    'Land Clearing',
    'Property Management', 
    'Equipment',
    'Safety',
    'Environmental',
    'Tips & Tricks',
    'Case Studies'
  ],
  PACKAGE_SIZES: [
    'Small Package (4" DBH)',
    'Medium Package (6" DBH)', 
    'Large Package (8" DBH)',
    'Custom'
  ]
} as const