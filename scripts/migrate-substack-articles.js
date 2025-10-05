const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const Parser = require('rss-parser')
const { parse: parseHTML } = require('node-html-parser')

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
    ],
  },
})

function extractTextFromHTML(html) {
  const root = parseHTML(html)
  return root.textContent || ''
}

function createSlugFromTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function extractCategories(content) {
  const categories = [
    'Land Clearing',
    'Forestry Mulching',
    'Tree Service',
    'Equipment',
    'Business Insights',
    'Industry News'
  ]

  const text = content.toLowerCase()

  for (const category of categories) {
    if (text.includes(category.toLowerCase())) {
      return category
    }
  }

  return 'Industry Insights'
}

function extractTags(title, content) {
  const tags = []
  const text = `${title} ${content}`.toLowerCase()

  const potentialTags = [
    'mulching', 'clearing', 'florida', 'equipment', 'business',
    'safety', 'environment', 'hurricane', 'maintenance', 'commercial',
    'residential', 'forestry', 'excavation', 'contractor'
  ]

  for (const tag of potentialTags) {
    if (text.includes(tag)) {
      tags.push(tag)
    }
  }

  return tags.slice(0, 5)
}

function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

async function migrateSubstackArticles() {
  try {
    console.log('🚀 Migrating Substack articles to GitHub-based system...')

    // Create content directory
    const contentDir = path.join(process.cwd(), 'content/articles')
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }

    // Fetch Substack RSS feed
    const feed = await parser.parseURL('https://mrtreeshop.substack.com/feed')

    console.log(`📄 Found ${feed.items.length} articles from Substack`)

    for (let i = 0; i < feed.items.length; i++) {
      const item = feed.items[i]
      const contentHTML = item.contentEncoded || item.content || ''
      const plainText = extractTextFromHTML(contentHTML)

      const slug = createSlugFromTitle(item.title || 'untitled')
      const category = extractCategories(plainText)
      const tags = extractTags(item.title || '', plainText)

      // Create frontmatter
      const frontmatter = {
        title: item.title,
        excerpt: item.contentSnippet?.slice(0, 200) + '...' || 'Expert insights from TreeShop professionals.',
        author: item.creator || 'TreeShop Team',
        date: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: category,
        tags: tags,
        image: '/project-images/cat-265-forestry-mulcher-fueling.jpg', // Default image
        featured: i < 3, // Make first 3 articles featured
        readTime: calculateReadingTime(plainText),
        seo: {
          title: `${item.title} | TreeShop Professional Services`,
          description: item.contentSnippet?.slice(0, 160) || 'Professional tree service insights from TreeShop experts.',
          keywords: tags.join(', ')
        }
      }

      // Create markdown content
      const markdownContent = matter.stringify(plainText, frontmatter)

      // Write to file
      const fileName = `${slug}.mdx`
      const filePath = path.join(contentDir, fileName)

      fs.writeFileSync(filePath, markdownContent)
      console.log(`✅ Migrated: ${item.title} → ${fileName}`)
    }

    console.log(`🎉 Successfully migrated ${feed.items.length} articles!`)
    console.log('📁 Articles saved to: content/articles/')

  } catch (error) {
    console.error('❌ Error migrating Substack articles:', error)
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateSubstackArticles()
}

module.exports = { migrateSubstackArticles }