import type { APIResponse, NewsItem } from '~/types/api'
import { getNewsIndex, type CachedNewsIndexItem } from '../utils/news-index'

export default defineEventHandler(async (event): Promise<APIResponse<NewsItem[]>> => {
  const query = getQuery(event)
  const category = query.category as string | undefined
  const search = (query.search as string | undefined)?.trim().toLowerCase()
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(query.pageSize) || 10))

  try {
    const newsIndex = await getNewsIndex(event)

    // 分类筛选
    let filteredNews: CachedNewsIndexItem[] = newsIndex
    if (category && category !== 'all') {
      filteredNews = filteredNews.filter((item) => item.category === category)
    }

    // 搜索功能 (支持标题、描述、标签、正文)
    if (search) {
      filteredNews = filteredNews.filter((item) => item.searchText.includes(search))
    }

    // 分页
    const skip = (page - 1) * pageSize
    const paginatedNews = filteredNews.slice(skip, skip + pageSize)

    const total = filteredNews.length

    // 转换为 NewsItem 格式
    const data: NewsItem[] = paginatedNews.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      description: item.description,
      image: item.image,
      category: item.category,
      source: item.source,
      tags: item.tags,
      link: item.link,
      _path: item.path
    }))

    return {
      data,
      total,
      page,
      pageSize
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
