import { queryCollection } from '@nuxt/content/server'
import type { APIResponse, EventItem } from '~/types/api'

export default defineEventHandler(async (event): Promise<APIResponse<EventItem[]>> => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const pageSize = Number(query.pageSize) || 10

  try {
    // 查询 events collection（Nuxt Content server-side signature）
    const events = await queryCollection(event, 'events').all()

    // 按日期倒序排列
    const sortedEvents = events.sort((a: any, b: any) => {
      const dateA = new Date(a.date || '1900-01-01')
      const dateB = new Date(b.date || '1900-01-01')
      return dateB.getTime() - dateA.getTime()
    })

    // 分页
    const skip = (page - 1) * pageSize
    const paginatedEvents = sortedEvents.slice(skip, skip + pageSize)

    const total = events.length

    // 转换为 EventItem 格式
    const data: EventItem[] = paginatedEvents.map((item: any) => ({
      id: item._id,
      title: item.title,
      date: item.date,
      location: item.location || undefined,
      description: item.description || undefined,
      image: item.image || undefined,
      category: item.category || undefined,
      tags: item.tags || [],
      _path: item._path
    }))

    return {
      data,
      total,
      page,
      pageSize
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
