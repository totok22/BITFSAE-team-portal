// Content 类型定义

interface BaseContent {
  id?: string
  path?: string
  _path?: string
  body?: Record<string, any>
}

export interface NewsContent extends BaseContent {
  title: string
  date: string
  description?: string
  image?: string
  category?: 'news' | 'people' | 'event' | 'other'
  source?: string
  tags?: string[]
  link?: string
}

export interface CarContent extends BaseContent {
  title: string
  year: string
  model: string
  image?: string
  category?: string
  specs?: Record<string, any>
  features?: string[]
  description?: string
}

export interface EventContent extends BaseContent {
  title: string
  date: string
  location?: string
  description?: string
  image?: string
  category?: string
  tags?: string[]
}

export interface SponsorContent extends BaseContent {
  title: string
  category?: string
  logo?: string
  website?: string
  description?: string
}
