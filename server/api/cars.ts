import { queryCollection } from '@nuxt/content/server'
import type { APIResponse, CarItem } from '~/types/api'

export default defineEventHandler(async (event): Promise<APIResponse<CarItem[]>> => {
  const query = getQuery(event)
  const year = query.year as string | undefined

  try {
    // 查询 cars collection（Nuxt Content server-side signature）
    const cars = await queryCollection(event, 'cars').all()

    // 按年份筛选
    let filteredCars = cars
    if (year) {
      filteredCars = cars.filter((car: any) => car.year === year)
    }

    // 按年份倒序排列
    const sortedCars = filteredCars.sort((a: any, b: any) => {
      return parseInt(b.year || '0') - parseInt(a.year || '0')
    })

    // 转换为 CarItem 格式
    const data: CarItem[] = sortedCars.map((item: any) => ({
      id: item._id,
      title: item.title,
      year: item.year,
      model: item.model,
      image: item.image || undefined,
      category: item.category || undefined,
      specs: item.specs || {},
      features: item.features || [],
      description: item.description || undefined,
      _path: item.path || item._path
    }))

    return {
      data,
      total: data.length
    }
  } catch (error) {
    console.error('Error fetching cars:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
