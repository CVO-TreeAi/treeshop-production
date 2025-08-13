import { NextRequest, NextResponse } from 'next/server';

// For now, return mock data to make the build pass
// In production, this would connect to your blog data source
export async function GET(req: NextRequest) {
  try {
    // Mock blog posts for development
    const mockPosts = [
      {
        slug: 'welcome-to-treeshop-ai',
        title: 'Welcome to TreeShop AI-Powered Services',
        excerpt: 'Discover how our AI-powered forestry mulching estimates and lead scoring are revolutionizing tree services in Florida.',
        date: new Date().toISOString(),
        author: 'TreeShop Team',
        category: 'Company News',
        tags: ['ai', 'forestry-mulching', 'innovation'],
        readingTime: {
          text: '3 min read',
          minutes: 3,
          time: 180000,
          words: 600
        },
        published: true
      },
      {
        slug: 'ai-pricing-accuracy',
        title: 'How AI Pricing Achieves 94% Accuracy',
        excerpt: 'Learn about the machine learning algorithms behind our accurate forestry mulching estimates.',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        author: 'Technical Team',
        category: 'Technology',
        tags: ['ai', 'pricing', 'accuracy'],
        readingTime: {
          text: '5 min read',
          minutes: 5,
          time: 300000,
          words: 1000
        },
        published: true
      }
    ];

    return NextResponse.json(mockPosts);
  } catch (error) {
    console.error('Blog API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}