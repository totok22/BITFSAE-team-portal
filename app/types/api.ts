// API 类型定义

export interface NewsItem {
  id: string
  title: string
  date: string
  description?: string
  image?: string
  category?: 'news' | 'people' | 'event' | 'other'
  source?: string
  tags?: string[]
  link?: string
  _path: string
}

export interface CarItem {
  id: string
  title: string
  year: string
  model: string
  image?: string
  category?: string
  specs: Record<string, any>
  features?: string[]
  description?: string
  _path: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  location?: string
  description?: string
  image?: string
  category?: string
  tags?: string[]
  _path: string
}

export interface SponsorItem {
  id: string
  title: string
  category?: string
  logo?: string
  website?: string
  description?: string
  _path: string
}

export interface APIResponse<T> {
  data: T
  total?: number
  page?: number
  pageSize?: number
  error?: string
}
