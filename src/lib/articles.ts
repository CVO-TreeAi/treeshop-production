import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import readingTime from 'reading-time'

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  featured: boolean
  readTime: string
  seo: {
    title: string
    description: string
    keywords: string
  }
}

const articlesDirectory = path.join(process.cwd(), 'content/articles')

export function getArticleSlugs() {
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }
  return fs.readdirSync(articlesDirectory)
    .filter(name => name.endsWith('.mdx') || name.endsWith('.md'))
    .map(name => name.replace(/\.mdx?$/, ''))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.mdx`)
    const altPath = path.join(articlesDirectory, `${slug}.md`)

    let fileContents: string

    if (fs.existsSync(fullPath)) {
      fileContents = fs.readFileSync(fullPath, 'utf8')
    } else if (fs.existsSync(altPath)) {
      fileContents = fs.readFileSync(altPath, 'utf8')
    } else {
      return null
    }

    const { data, content } = matter(fileContents)

    // Process markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content)

    const contentHtml = processedContent.toString()
    const readTimeStats = readingTime(content)

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content: contentHtml,
      author: data.author || 'TreeShop Team',
      date: data.date,
      category: data.category || 'Industry Insights',
      tags: data.tags || [],
      image: data.image || '/project-images/cat-265-forestry-mulcher-fueling.jpg',
      featured: data.featured || false,
      readTime: data.readTime || readTimeStats.text,
      seo: data.seo || {
        title: data.title,
        description: data.excerpt,
        keywords: data.tags?.join(', ') || ''
      }
    }
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error)
    return null
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const slugs = getArticleSlugs()
  const articles = await Promise.all(
    slugs.map(slug => getArticleBySlug(slug))
  )

  return articles
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const allArticles = await getAllArticles()
  return allArticles.filter(article => article.featured)
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const allArticles = await getAllArticles()
  return allArticles.filter(article =>
    article.category.toLowerCase() === category.toLowerCase()
  )
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const allArticles = await getAllArticles()
  return allArticles.filter(article =>
    article.tags.some(articleTag =>
      articleTag.toLowerCase() === tag.toLowerCase()
    )
  )
}

export async function getAllCategories(): Promise<string[]> {
  const allArticles = await getAllArticles()
  const categories = allArticles.map(article => article.category)
  return [...new Set(categories)].sort()
}

export async function getAllTags(): Promise<string[]> {
  const allArticles = await getAllArticles()
  const tags = allArticles.flatMap(article => article.tags)
  return [...new Set(tags)].sort()
}