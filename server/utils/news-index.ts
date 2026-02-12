import { readdir, readFile } from 'node:fs/promises'
import { join, posix } from 'node:path'
import { queryCollection } from '@nuxt/content/server'
import type { H3Event } from 'h3'

export interface CachedNewsIndexItem {
  id: string
  title: string
  date: string
  description: string
  image?: string
  category?: 'news' | 'people' | 'event' | 'other'
  source?: string
  tags: string[]
  link?: string
  path: string
  searchText: string
  dateTs: number
}

type NewsIndexCache = {
  expiresAt: number
  items: CachedNewsIndexItem[]
}

let newsIndexCache: NewsIndexCache | null = null

const NEWS_INDEX_TTL_MS = process.env.NODE_ENV === 'development' ? 1000 * 30 : 1000 * 60 * 10

function extractTextFromHast(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractTextFromHast).join('')
  if (typeof node === 'object') {
    if (node.type === 'text' && typeof node.value === 'string') return node.value
    if (node.children && Array.isArray(node.children)) return node.children.map(extractTextFromHast).join('')
    if (typeof node.value === 'string') return node.value
    if (Array.isArray(node.value)) return extractTextFromHast(node.value)
  }
  return ''
}

function extractTextFromBody(item: any): string {
  const body = item?.body || item?._body
  if (!body) return ''
  if (body.value && Array.isArray(body.value)) return extractTextFromHast(body.value)
  if (Array.isArray(body)) return extractTextFromHast(body)
  if (typeof body === 'string') return body
  return ''
}

export function normalizePath(path?: string): string {
  if (!path) return '/'
  const cleaned = path.replace(/\/+$/g, '')
  return cleaned || '/'
}

function normalizeDateTimestamp(date?: string): number {
  const ts = Date.parse(date || '')
  return Number.isNaN(ts) ? 0 : ts
}

function toArray(value: string): string[] {
  const trimmed = value.trim()
  if (!trimmed) return []

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return trimmed
    .split(',')
    .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

function parseFrontmatter(raw: string): Record<string, any> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatterBlock = match[1] || ''
  const lines = frontmatterBlock.split('\n')
  const result: Record<string, any> = {}
  let currentArrayKey: string | null = null

  for (const line of lines) {
    if (line.startsWith('  - ') || line.startsWith('- ')) {
      if (!currentArrayKey) continue
      if (!Array.isArray(result[currentArrayKey])) result[currentArrayKey] = []
      result[currentArrayKey].push(line.replace(/^\s*-\s*/, '').trim().replace(/^['"]|['"]$/g, ''))
      continue
    }

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) {
      currentArrayKey = null
      continue
    }

    const key = kv[1]
    const value = (kv[2] || '').trim()

    if (!key) {
      currentArrayKey = null
      continue
    }

    if (!value) {
      result[key] = []
      currentArrayKey = key
      continue
    }

    currentArrayKey = null

    if (key === 'tags') {
      result[key] = toArray(value)
      continue
    }

    result[key] = value.replace(/^['"]|['"]$/g, '')
  }

  return result
}

function splitFrontmatter(raw: string): { frontmatter: Record<string, any>, body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {}, body: raw }
  }

  const frontmatterText = `---\n${match[1] || ''}\n---`
  const frontmatter = parseFrontmatter(frontmatterText)
  const body = match[2] || ''
  return { frontmatter, body }
}

async function buildNewsIndexFromFiles(): Promise<CachedNewsIndexItem[]> {
  const contentNewsDir = join(process.cwd(), 'content', 'news')
  const files = await readdir(contentNewsDir)
  const markdownFiles = files.filter(file => file.endsWith('.md'))

  const items = await Promise.all(markdownFiles.map(async (file) => {
    const fullPath = join(contentNewsDir, file)
    const raw = await readFile(fullPath, 'utf-8')
    const fm = parseFrontmatter(raw)

    const stem = file.replace(/\.md$/, '')
    const path = normalizePath(posix.join('/news', stem))
    const title = String(fm.title || stem)
    const description = String(fm.description || '')
    const tags = Array.isArray(fm.tags) ? fm.tags : []
    const date = String(fm.date || '')

    return {
      id: stem,
      title,
      date,
      description,
      image: fm.image || undefined,
      category: fm.category || undefined,
      source: fm.source || undefined,
      tags,
      link: fm.link || undefined,
      path,
      searchText: [title, description, tags.join(' '), raw].join(' ').toLowerCase(),
      dateTs: normalizeDateTimestamp(date)
    } satisfies CachedNewsIndexItem
  }))

  return items.sort((a, b) => b.dateTs - a.dateTs)
}

async function buildNewsIndexFromContent(event: H3Event): Promise<CachedNewsIndexItem[]> {
  const rawNews = await queryCollection(event, 'news').all()

  const items = rawNews.map((item: any) => {
    const title = item.title || ''
    const description = item.description || ''
    const tags = Array.isArray(item.tags) ? item.tags : []
    const bodyText = extractTextFromBody(item)
    const searchText = [title, description, tags.join(' '), bodyText]
      .join(' ')
      .toLowerCase()

    const path = normalizePath(item.path || item._path || (item.stem ? `/news/${item.stem}` : '/news'))

    return {
      id: item.id || item.stem || path,
      title,
      date: item.date || '',
      description,
      image: item.image || undefined,
      category: item.category,
      source: item.source || undefined,
      tags,
      link: item.link || undefined,
      path,
      searchText,
      dateTs: normalizeDateTimestamp(item.date)
    } satisfies CachedNewsIndexItem
  })

  return items.sort((a, b) => b.dateTs - a.dateTs)
}

export async function getNewsIndex(event: H3Event): Promise<CachedNewsIndexItem[]> {
  const now = Date.now()
  if (newsIndexCache && newsIndexCache.expiresAt > now) {
    return newsIndexCache.items
  }

  try {
    const items = await buildNewsIndexFromContent(event)
    newsIndexCache = { expiresAt: now + NEWS_INDEX_TTL_MS, items }
    return items
  } catch (error) {
    if (newsIndexCache?.items?.length) {
      return newsIndexCache.items
    }

    const items = await buildNewsIndexFromFiles()
    newsIndexCache = { expiresAt: now + 5000, items }
    console.warn('[news-index] Fallback to content/news markdown files because content DB query failed:', error)
    return items
  }
}

export async function getNewsArticleFromFile(slug: string) {
  const safeSlug = slug.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\.\.+/g, '')
  const filePath = join(process.cwd(), 'content', 'news', `${safeSlug}.md`)
  const raw = await readFile(filePath, 'utf-8')
  const { frontmatter, body } = splitFrontmatter(raw)

  const path = normalizePath(posix.join('/news', safeSlug))

  return {
    id: safeSlug,
    title: String(frontmatter.title || safeSlug),
    date: String(frontmatter.date || ''),
    description: String(frontmatter.description || ''),
    image: frontmatter.image || undefined,
    category: frontmatter.category || undefined,
    source: frontmatter.source || undefined,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    link: frontmatter.link || undefined,
    path,
    rawMarkdown: body
  }
}

