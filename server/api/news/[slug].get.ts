import { queryCollection } from '@nuxt/content/server'
import type { APIResponse } from '~/types/api'
import { getNewsArticleFromFile, getNewsIndex, normalizePath } from '../../utils/news-index'

export default defineEventHandler(async (event): Promise<APIResponse<any>> => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    return {
      data: null,
      error: 'Missing slug parameter'
    }
  }

  try {
    const path = normalizePath(`/news/${slug}`)

    let article: any = null
    try {
      article = await queryCollection(event, 'news').path(path).first()
    } catch (error) {
      console.warn('[news-detail] queryCollection failed, fallback to markdown file:', error)
    }

    if (!article) {
      try {
        const fileArticle = await getNewsArticleFromFile(slug)
        article = {
          ...fileArticle,
          _path: fileArticle.path
        }
      } catch {
        return {
          data: null,
          error: 'Article not found'
        }
      }
    }

    const all = await getNewsIndex(event)

    const idx = all.findIndex((item: any) => normalizePath(item.path || item._path) === path)
    const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null
    const next = idx > 0 ? all[idx - 1] : null

    return {
      data: {
        article,
        prev,
        next
      }
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
