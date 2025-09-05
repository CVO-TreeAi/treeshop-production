import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

export interface Article {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: string;
  coverImage?: string;
  content: string;
  excerpt: string;
}

// Get all articles
export function getAllArticles(): Article[] {
  try {
    if (!fs.existsSync(articlesDirectory)) {
      return [];
    }
    
    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticles = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        return getArticleBySlug(slug);
      })
      .filter(Boolean) as Article[];

    // Sort by date (newest first)
    return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting articles:', error);
    return [];
  }
}

// Get article by slug
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Generate excerpt from content (first 200 chars)
    const excerpt = content.replace(/[#*`]/g, '').substring(0, 200).trim() + '...';
    
    return {
      slug,
      title: data.title,
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'TreeShop Editorial',
      description: data.description,
      category: data.category,
      tags: data.tags || [],
      featured: data.featured || false,
      readingTime: data.readingTime || calculateReadingTime(content),
      coverImage: data.coverImage,
      content,
      excerpt: data.excerpt || excerpt,
    };
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error);
    return null;
  }
}

// Calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all categories
export function getAllCategories(): string[] {
  const articles = getAllArticles();
  const categories = [...new Set(articles.map(article => article.category))];
  return categories.sort();
}

// Get all tags
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const allTags = articles.flatMap(article => article.tags);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags.sort();
}

// Get articles by category
export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles();
  return articles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
}

// Get articles by tag
export function getArticlesByTag(tag: string): Article[] {
  const articles = getAllArticles();
  return articles.filter(article => 
    article.tags.some(articleTag => 
      articleTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

// Get featured articles
export function getFeaturedArticles(): Article[] {
  const articles = getAllArticles();
  return articles.filter(article => article.featured);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}