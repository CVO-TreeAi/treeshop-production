import Parser from 'rss-parser';
import { parse as parseHTML } from 'node-html-parser';

export interface SubstackPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  coverImage?: string;
  link: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
      ['media:content', 'mediaContent'],
    ],
  },
});

// Cache configuration
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let cache: { posts: SubstackPost[] | null; timestamp: number } = {
  posts: null,
  timestamp: 0,
};

function calculateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return {
    text: `${minutes} min read`,
    minutes,
    time: minutes * 60 * 1000,
    words,
  };
}

function extractTextFromHTML(html: string): string {
  const root = parseHTML(html);
  return root.textContent || '';
}

function extractExcerpt(html: string, maxLength: number = 160): string {
  const text = extractTextFromHTML(html);
  const cleanText = text.replace(/\s+/g, ' ').trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Try to cut at sentence end
  const truncated = cleanText.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastPeriod > maxLength * 0.8) {
    return truncated.slice(0, lastPeriod + 1);
  }

  return truncated.slice(0, lastSpace) + '...';
}

function extractFirstImage(html: string): string | undefined {
  const root = parseHTML(html);
  const img = root.querySelector('img');
  return img?.getAttribute('src');
}

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractCategories(content: string): string {
  // Default category for TreeShop content
  const categories = [
    'Land Clearing',
    'Forestry Mulching',
    'Tree Service',
    'Property Management',
    'Business Insights',
    'Equipment',
    'Industry News'
  ];

  const text = content.toLowerCase();

  for (const category of categories) {
    if (text.includes(category.toLowerCase())) {
      return category;
    }
  }

  return 'Industry Insights';
}

function extractTags(title: string, content: string): string[] {
  const tags: string[] = [];
  const text = `${title} ${content}`.toLowerCase();

  // Common tags for tree service industry
  const potentialTags = [
    'mulching',
    'clearing',
    'florida',
    'equipment',
    'business',
    'safety',
    'environment',
    'hurricane',
    'maintenance',
    'commercial',
    'residential',
    'forestry',
    'excavation',
    'grading',
    'contractor'
  ];

  for (const tag of potentialTags) {
    if (text.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags.slice(0, 5); // Limit to 5 tags
}

export async function fetchSubstackPosts(): Promise<SubstackPost[]> {
  // Check cache first
  const now = Date.now();
  if (cache.posts && (now - cache.timestamp) < CACHE_DURATION) {
    return cache.posts;
  }

  try {
    // Fetch RSS feed from Substack using WHATWG URL API
    const feedUrl = new URL('https://mrtreeshop.substack.com/feed').toString();
    const feed = await parser.parseURL(feedUrl);

    const posts: SubstackPost[] = feed.items.map((item) => {
      const contentHTML = item.contentEncoded || item.content || '';
      const plainText = extractTextFromHTML(contentHTML);
      const excerpt = item.contentSnippet
        ? extractExcerpt(item.contentSnippet)
        : extractExcerpt(contentHTML);

      const slug = createSlugFromTitle(item.title || 'untitled');
      const category = extractCategories(plainText);
      const tags = extractTags(item.title || '', plainText);
      const coverImage = extractFirstImage(contentHTML);

      return {
        id: item.guid || item.link || '',
        slug,
        title: item.title || 'Untitled',
        excerpt,
        content: contentHTML,
        date: item.pubDate || new Date().toISOString(),
        author: item.creator || 'The Tree Shop Team',
        category,
        tags,
        coverImage,
        link: item.link || '',
        readingTime: calculateReadingTime(plainText),
      };
    });

    // Update cache
    cache = {
      posts,
      timestamp: now,
    };

    return posts;
  } catch (error) {
    console.error('Error fetching Substack posts:', error);

    // Return cached posts if available, even if expired
    if (cache.posts) {
      return cache.posts;
    }

    return [];
  }
}

export async function getSubstackPostBySlug(slug: string): Promise<SubstackPost | null> {
  const posts = await fetchSubstackPosts();
  return posts.find(post => post.slug === slug) || null;
}

export async function getSubstackCategories(): Promise<string[]> {
  const posts = await fetchSubstackPosts();
  const categories = posts.map(post => post.category);
  return [...new Set(categories)].sort();
}

export async function getSubstackTags(): Promise<string[]> {
  const posts = await fetchSubstackPosts();
  const tags = posts.flatMap(post => post.tags);
  return [...new Set(tags)].sort();
}

export async function getSubstackPostsByCategory(category: string): Promise<SubstackPost[]> {
  const posts = await fetchSubstackPosts();
  return posts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export async function getSubstackPostsByTag(tag: string): Promise<SubstackPost[]> {
  const posts = await fetchSubstackPosts();
  return posts.filter(post =>
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}