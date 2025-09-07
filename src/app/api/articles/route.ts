import { NextRequest, NextResponse } from 'next/server';
import { getSubstackPosts } from '@/lib/substack';
import { getAllPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from Substack first, fallback to local articles if needed
    let articles = await getSubstackPosts();
    
    // If no Substack articles are available, fallback to local articles
    if (articles.length === 0) {
      console.log('No Substack articles found, falling back to local articles');
      articles = getAllPosts();
    }
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    
    // Fallback to local articles on error
    try {
      const localArticles = getAllPosts();
      return NextResponse.json(localArticles);
    } catch (fallbackError) {
      console.error('Error fetching fallback articles:', fallbackError);
      return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
    }
  }
}