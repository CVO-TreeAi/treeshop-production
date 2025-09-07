import { BlogPost, BlogPostPreview } from './blog';

export interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content: string;
  author: string;
  categories: string[];
  guid: string;
}

function calculateReadingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return { text: `${minutes} min read`, minutes, time: minutes * 60 * 1000, words };
}

function htmlToMarkdown(html: string): string {
  return html
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gis, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gis, '###### $1\n\n')
    
    // Lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      return content.replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n') + '\n';
    })
    .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
      let counter = 1;
      return content.replace(/<li[^>]*>(.*?)<\/li>/gis, () => `${counter++}. $1\n`) + '\n';
    })
    
    // Text formatting
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
    
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, '[$2]($1)')
    
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    
    // Code
    .replace(/<code[^>]*>(.*?)<\/code>/gis, '`$1`')
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n\n')
    
    // Line breaks and paragraphs
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
    
    // Divs - treat as paragraph breaks
    .replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n\n')
    
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Clean up HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchSubstackRSS(): Promise<SubstackPost[]> {
  try {
    // Add cache busting to ensure we get fresh content
    const cacheBuster = Date.now();
    const response = await fetch(`https://mrtreeshop.substack.com/feed?t=${cacheBuster}`, {
      headers: {
        'User-Agent': 'TreeShop-Website/1.0',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store', // Bypass Next.js cache
      next: { revalidate: 0 } // No caching
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status}`);
    }
    
    const rssText = await response.text();
    const posts: SubstackPost[] = [];
    
    // Parse RSS XML manually (simple approach)
    const itemMatches = rssText.match(/<item[^>]*>[\s\S]*?<\/item>/gi);
    
    if (itemMatches) {
      for (const itemXml of itemMatches) {
        const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || 
                     itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
        
        const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
        
        const description = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || 
                           itemXml.match(/<description>(.*?)<\/description>/)?.[1] || '';
        
        const contentEncoded = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || '';
        
        const content = contentEncoded || description;
        const guid = itemXml.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1] || link;
        
        // Extract categories/tags
        const categoryMatches = itemXml.match(/<category[^>]*>(.*?)<\/category>/gi);
        const categories = categoryMatches ? categoryMatches.map(cat => 
          cat.replace(/<[^>]*>/g, '').trim()
        ) : ['Forestry Mulching'];
        
        if (title && link) {
          const post = {
            title: title.trim(),
            link,
            pubDate,
            description: extractTextFromHtml(description),
            content,
            author: 'Jeremiah Anderson',
            categories,
            guid
          };
          posts.push(post);
        }
      }
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching Substack RSS:', error);
    return [];
  }
}

function convertSubstackToBlogPost(substackPost: SubstackPost): BlogPost {
  const slug = createSlugFromTitle(substackPost.title);
  const markdownContent = htmlToMarkdown(substackPost.content);
  const readingTime = calculateReadingTime(substackPost.content);
  
  // Create excerpt from description or content
  let excerpt = substackPost.description;
  if (!excerpt || excerpt.length < 100) {
    excerpt = extractTextFromHtml(substackPost.content).slice(0, 260);
  }
  if (excerpt.length > 260) {
    excerpt = excerpt.slice(0, 260) + '...';
  }
  
  return {
    slug,
    title: substackPost.title,
    excerpt,
    content: markdownContent,
    date: new Date(substackPost.pubDate).toISOString(),
    author: substackPost.author,
    category: substackPost.categories[0] || 'Forestry Mulching',
    tags: substackPost.categories.slice(1),
    readingTime,
    published: true
  };
}

export async function getSubstackPosts(): Promise<BlogPostPreview[]> {
  try {
    const substackPosts = await fetchSubstackRSS();
    const blogPosts = substackPosts.map(convertSubstackToBlogPost);
    
    // Sort by date (newest first)
    return blogPosts.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error getting Substack posts:', error);
    return [];
  }
}

export async function getSubstackPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getSubstackPosts();
    return posts.find(post => post.slug === slug) as BlogPost || null;
  } catch (error) {
    console.error('Error getting Substack post by slug:', error);
    return null;
  }
}