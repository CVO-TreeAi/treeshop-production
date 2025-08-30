import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string // ISO publish date
  author: string
  category: string
  tags: string[]
  coverImage?: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  published: boolean
}

export interface BlogPostPreview extends Omit<BlogPost, 'content'> {}

// Config
const SOURCE_DIR_DEFAULT = path.join(process.cwd(), 'src', 'content', 'blog')
const SCHEDULE_DB = path.join(process.cwd(), '.next-cache', 'blog-schedule.json')

function getSourceDir() {
  return process.env.BLOG_SOURCE_DIR || SOURCE_DIR_DEFAULT
}

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function listMdFiles(): string[] {
  try {
    const files = fs.readdirSync(getSourceDir())
    return files.filter(f => /\.(md|mdx)$/i.test(f)).sort()
  } catch {
    return []
  }
}

function readMd(slug: string): { raw: string, meta: Record<string,any> } | null {
  try {
    const base = path.join(getSourceDir(), slug)
    const fp = fs.existsSync(base + '.md') ? base + '.md' : fs.existsSync(base + '.mdx') ? base + '.mdx' : null
    if (!fp) return null
    const raw = fs.readFileSync(fp, 'utf8')
    const meta: Record<string,any> = {}
    
    // Handle YAML frontmatter
    if (raw.startsWith('---')) {
      const frontmatterEnd = raw.indexOf('\n---\n', 4)
      if (frontmatterEnd !== -1) {
        const frontmatterContent = raw.slice(4, frontmatterEnd)
        const contentStart = frontmatterEnd + 5
        
        // Parse YAML-like frontmatter
        const lines = frontmatterContent.split('\n')
        for (const line of lines) {
          const colonIndex = line.indexOf(':')
          if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim()
            let value = line.slice(colonIndex + 1).trim()
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1)
            }
            
            // Handle arrays (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
              const arrayContent = value.slice(1, -1)
              meta[key] = arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''))
            } else {
              meta[key] = value
            }
          }
        }
        
        return { raw: raw.slice(contentStart), meta }
      }
    }
    
    // Fallback to simple key: value format
    const lines = raw.split('\n')
    let contentStart = 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const m = line.match(/^\s*([A-Za-z_-]+):\s*(.+)$/)
      if (m) {
        meta[m[1].trim()] = m[2].trim()
        contentStart = i + 1
      } else {
        break
      }
    }
    
    return { raw: lines.slice(contentStart).join('\n'), meta }
  } catch {
    return null
  }
}

function computeReading(raw: string) {
  const words = raw.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return { text: `${minutes} min read`, minutes, time: minutes * 60 * 1000, words }
}

function loadSchedule(): Record<string, string> { // slug -> ISO date
  try {
    return JSON.parse(fs.readFileSync(SCHEDULE_DB, 'utf8'))
  } catch {
    return {}
  }
}

function saveSchedule(data: Record<string, string>) {
  ensureDir(SCHEDULE_DB)
  fs.writeFileSync(SCHEDULE_DB, JSON.stringify(data, null, 2))
}

// Assign publish dates with 1/day drip
function schedulePosts(slugs: string[]): Record<string, string> {
  const schedule = loadSchedule()
  let current = new Date()
  current.setHours(9, 0, 0, 0)

  const existing = Object.values(schedule).map(d => new Date(d).getTime())
  const lastTs = existing.length ? Math.max(...existing) : 0
  if (lastTs > current.getTime()) current = new Date(lastTs)

  for (const slug of slugs) {
    if (!schedule[slug]) {
      if (Object.keys(schedule).length) current = new Date(current.getTime() + 24*60*60*1000)
      schedule[slug] = current.toISOString()
    }
  }
  saveSchedule(schedule)
  return schedule
}

function collectPosts(): BlogPost[] {
  const files = listMdFiles().map(f => f.replace(/\.(md|mdx)$/i, ''))
  const schedule = schedulePosts(files)
  const posts: BlogPost[] = []
  for (const slug of files) {
    const md = readMd(slug)
    if (!md) continue
    const { raw, meta } = md
    const title = meta.title || slug.replace(/[-_]/g, ' ')
    const excerpt = meta.excerpt || raw.split('\n').slice(0,3).join(' ').slice(0,260)
    const date = meta.date || schedule[slug] || new Date().toISOString()
    const readingTime = computeReading(raw)
    const published = meta.published !== undefined ? meta.published === true || meta.published === 'true' : (new Date(date).getTime() <= Date.now())
    
    posts.push({
      slug,
      title,
      excerpt,
      content: raw,
      date,
      author: meta.author || 'ALeX - TreeAI',
      category: meta.category || 'Forestry Mulching',
      tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? meta.tags.split(',').map(s=>s.trim()) : []),
      coverImage: meta.coverImage,
      readingTime,
      published,
    })
  }
  return posts.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getAllPosts(): BlogPostPreview[] {
  return collectPosts().filter(p => p.published)
}

export function getPostBySlug(slug: string): BlogPost | null {
  return collectPosts().find(p => p.slug === slug && p.published) || null
}

export function getPostsByCategory(category: string): BlogPostPreview[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase())
}

export function getPostsByTag(tag: string): BlogPostPreview[] {
  const allPosts = getAllPosts()
  return allPosts.filter((post) => post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()))
}

export function getAllCategories(): string[] {
  const allPosts = getAllPosts()
  const categories = allPosts.map((post) => post.category)
  return [...new Set(categories)].sort()
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts()
  const tags = allPosts.flatMap((post) => post.tags)
  return [...new Set(tags)].sort()
}

export function getFeaturedPosts(limit: number = 3): BlogPostPreview[] {
  const allPosts = getAllPosts()
  return allPosts.slice(0, limit)
}