import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from "convex/browser"
import { api } from '../../../../../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get blog posts from Convex
    const blogPosts = await convex.query(api.blog.getBlogPosts, {
      status: published ? 'published' : undefined,
      limit,
    })

    // Filter for featured if requested
    let filteredBlogs = blogPosts
    if (featured) {
      // For now, we'll consider the first 3 as featured
      filteredBlogs = blogPosts.slice(0, 3)
    }

    // If no blog posts found, return mock data for development
    if (!filteredBlogs || filteredBlogs.length === 0) {
      const mockBlogs = [
        {
          _id: '1',
          title: 'Why Forestry Mulching Beats Traditional Land Clearing',
          excerpt: 'Discover the environmental and cost benefits of forestry mulching over traditional land clearing methods.',
          slug: 'why-forestry-mulching-beats-traditional-land-clearing',
          status: 'published',
          publishedAt: Date.now(),
          category: 'forestry-mulching',
          tags: ['forestry-mulching', 'land-clearing', 'environmental'],
          authorName: 'TreeShop Team',
          createdAt: Date.now(),
        },
        {
          _id: '2', 
          title: '5 Signs Your Property Needs Professional Land Clearing',
          excerpt: 'Learn the key indicators that your Florida property requires professional land clearing services.',
          slug: '5-signs-your-property-needs-professional-land-clearing',
          status: 'published',
          publishedAt: Date.now(),
          category: 'land-clearing',
          tags: ['land-clearing', 'property-management', 'florida'],
          authorName: 'TreeShop Team',
          createdAt: Date.now(),
        },
        {
          _id: '3',
          title: 'TreeShop Invents TreeAI: Revolutionary Technology',
          excerpt: 'Introducing TreeAI, the revolutionary AI technology transforming forestry services in Florida.',
          slug: 'tree-shop-invents-treeai-revolutionary-technology', 
          status: 'published',
          publishedAt: Date.now(),
          category: 'technology',
          tags: ['treeai', 'innovation', 'technology'],
          authorName: 'TreeShop Team',
          createdAt: Date.now(),
        }
      ]
      
      filteredBlogs = mockBlogs.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      data: filteredBlogs,
      count: filteredBlogs.length,
      source: filteredBlogs.length > 0 && filteredBlogs[0]._id !== '1' ? 'convex' : 'mock'
    })

  } catch (error) {
    console.error('Blog API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog posts',
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      status,
      authorName,
    } = body

    // Create blog post using Convex
    const blogPostId = await convex.mutation(api.blog.createBlogPost, {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags || [],
      status: status || 'draft',
      authorName: authorName || 'TreeShop Team',
    })

    return NextResponse.json({
      success: true,
      data: { id: blogPostId },
      message: 'Blog post created successfully'
    })

  } catch (error) {
    console.error('Blog creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create blog post'
    }, { status: 500 })
  }
}