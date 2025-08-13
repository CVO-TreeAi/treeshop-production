import fs from 'fs';
import path from 'path';

export type BlogPost = { slug: string; title: string; summary?: string; content: string };

const DEFAULT_SOURCE = '/Users/ain/ProWebsite/ForestryMulching-ArticleTreasureChest';

export function getBlogSourceDir(): string {
  return process.env.BLOG_SOURCE_DIR || DEFAULT_SOURCE;
}

export function listMarkdownFiles(): string[] {
  try {
    const dir = getBlogSourceDir();
    const files = fs.readdirSync(dir);
    return files.filter((f) => f.toLowerCase().endsWith('.md') || f.toLowerCase().endsWith('.mdx'));
  } catch {
    return [];
  }
}

export function readMarkdown(slug: string): BlogPost | null {
  try {
    const dir = getBlogSourceDir();
    const file = path.join(dir, `${slug}.md`);
    const fileMdx = path.join(dir, `${slug}.mdx`);
    const target = fs.existsSync(file) ? file : fs.existsSync(fileMdx) ? fileMdx : null;
    if (!target) return null;
    const raw = fs.readFileSync(target, 'utf8');
    const title = (raw.match(/^#\s+(.+)$/m)?.[1] || slug.replace(/[-_]/g, ' ')).trim();
    const summary = (raw.match(/^>\s+(.+)$/m)?.[1] || '').trim() || undefined;
    return { slug, title, summary, content: raw };
  } catch {
    return null;
  }
}

export function toHtml(md: string): string {
  // Minimal Markdown→HTML (headings, paragraphs, bold/italic, lists). Not exhaustive but safe for now.
  let html = md
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Wrap loose lines in <p>
  html = html
    .split(/\n\n+/)
    .map((blk) => (blk.trim().startsWith('<') ? blk : `<p>${blk}</p>`))
    .join('\n');
  // Fix list blocks
  html = html.replace(/(<li>[^<]*<\/li>\n?)+/g, (m) => `<ul>\n${m}\n</ul>`);
  return html;
}


