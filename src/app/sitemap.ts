import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.fltreeshop.com'
  const currentDate = new Date()

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/estimate`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/forestry-mulching`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/stump-grinding`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }
  ]

  // Video pages - high priority for SEO
  const videoPages = [
    {
      url: `${baseUrl}/videos`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos/forestry-mulching`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/videos/before-after`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/videos/land-clearing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos/equipment`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ]

  // Location pages
  const locations = [
    'brooksville', 'clermont', 'daytona-beach', 'lakeland', 'orlando', 
    'tampa', 'gainesville', 'jacksonville', 'deland', 'sanford',
    'kissimmee', 'ocklawaha', 'new-smyrna-beach', 'palm-coast'
  ]

  const locationPages = locations.map(location => ({
    url: `${baseUrl}/locations/${location}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Blog category pages
  const blogCategories = ['forestry-mulching', 'innovation', 'land-clearing']
  const blogCategoryPages = blogCategories.map(category => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog posts (dynamic - you might want to fetch actual posts)
  const blogPosts = [
    {
      url: `${baseUrl}/blog/tree-shop-invents-treeai-revolutionary-technology`,
      lastModified: new Date('2025-01-08'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/why-forestry-mulching-beats-traditional-land-clearing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/5-signs-your-property-needs-professional-land-clearing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ]

  return [
    ...staticPages,
    ...videoPages,
    ...locationPages,
    ...blogCategoryPages,
    ...blogPosts,
  ]
}