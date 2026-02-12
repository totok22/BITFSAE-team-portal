/**
 * 共享配置文件
 * 所有图片链接、轮播图配置等统一管理在此文件中
 * 
 * 注意：内容数据（新闻、赛车、赛事等）已迁移到 Content Collections
 * 详见 content/ 目录和 content.config.ts
 */

import type { ImageUrls, Slide } from '~/types'

// ==================== 图片链接 ====================
export const IMAGE_URLS: ImageUrls = {
  // 轮播图
  HERO_0: 'https://img.bitfsae.xin/img/20260106143818204.jpg',
  HERO_1: 'https://img.bitfsae.xin/img/20260106223231690.jpg',
  HERO_2: 'https://img.bitfsae.xin/img/20260106223334196.jpg',
  
  // 赞助商
  SPONSORS: 'https://img.bitfsae.xin/img/20260106151337415.png',
  
  // 微信公众号
  WECHAT_QRCODE: 'https://img.bitfsae.xin/img/20260106151635985.jpg',
  
  // 社交媒体二维码
  SOCIAL_MEDIA_QRCODE: 'https://img.bitfsae.xin/img/20260106152115488.jpg',
  
  // 赛车图片
  CAR_E47: 'https://img.bitfsae.xin/img/20260106143818204.jpg',
  
  // 动态封面
  NEWS_2025_11_24: 'https://img.bitfsae.xin/img/20260106204750969.jpg',
  NEWS_2025_12_11: 'https://img.bitfsae.xin/img/20260106210212589.jpg',
  NEWS_2026_01_09: 'https://img.bitfsae.xin/img/20260112142711324.jpg',
  NEWS_2026_01_12_1: 'https://img.bitfsae.xin/img/20260112142704873.jpg',
}

// ==================== 轮播图配置 ====================
export const HERO_SLIDES: Slide[] = [
  {
    image: IMAGE_URLS.HERO_0,
    alt: '25E赛车实照'
  },
  {
    image: IMAGE_URLS.HERO_1,
    alt: 'HERO_1'
  },
  {
    image: IMAGE_URLS.HERO_2,
    alt: '车队合照'
  }
]

