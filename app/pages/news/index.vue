<template>
  <div class="news-page">
    <section class="section-header">
      <h2>{{ t('newsPageTitle') }}</h2>
      <div class="section-line"></div>
    </section>

    <!-- 顶部控制栏 (搜索 & 筛选) -->
    <section class="controls-section">
      <div class="search-bar-container">
        <div class="search-box">
          <Icon name="lucide:search" class="w-5 h-5 search-icon" />
          <input
            v-model="searchQuery"
            class="search-input"
            type="text"
            :placeholder="t('searchPlaceholder')"
          >
          <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <div class="filter-groups">
          <!-- 分类筛选 -->
          <div class="filter-group">
            <span class="filter-label"><Icon name="lucide:filter" class="w-3 h-3" /> {{ t('filterCategory') }}</span>
        <div class="filter-chips" v-auto-animate>
              <button
                v-for="cat in categories"
                :key="cat.value"
                :class="['filter-chip', { active: selectedCategory === cat.value }]"
                @click="selectedCategory = cat.value"
              >
                {{ cat.label }}
                <!-- <span class="chip-count" v-if="selectedCategory === cat.value || cat.value === 'all'">{{ getCategoryCount(cat.value) }}</span> -->
              </button>
            </div>
          </div>
          
          <!-- 时间筛选 (可选展开) -->
          <!-- 暂时隐藏或以更紧凑方式展示，避免占用过多空间 -->
        </div>

        <div class="filter-actions" v-if="hasActiveFilters">
           <button class="reset-btn" @click="clearAllFilters">
             <Icon name="lucide:rotate-ccw" class="w-3 h-3" />
             {{ t('clearAll') }}
           </button>
        </div>
      </div>
    </section>

    <section class="content-shell">
      <main class="main-list">
        <div v-if="status === 'pending'" class="state-box loading">
           <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin" />
           <p>{{ t('loading') }}</p>
        </div>
        <div v-else-if="status === 'error'" class="state-box error">{{ t('newsLoadFailed') }}</div>
        <div v-else-if="filteredCount === 0" class="state-box empty">
          <Icon name="lucide:inbox" class="w-12 h-12" />
          <p>{{ t('noResults') }}</p>
          <button class="btn-text" @click="clearAllFilters">{{ t('clearFilterConditions') }}</button>
        </div>

        <div v-else class="articles-grid">
          <NuxtLink
            v-for="article in currentPageArticles"
            :key="article.path"
            :to="article.path"
            class="article-card"
          >
            <div class="card-image-wrapper" v-if="article.image">
              <NuxtImg :src="article.image" :alt="article.title" format="webp" quality="80" loading="lazy" class="card-img" />
            </div>
            <div class="card-content">
              <div class="card-meta">
                <span class="badge" :class="article.category || 'news'">{{ getCategoryLabel(article.category) }}</span>
                <time>{{ formatDate(article.date) }}</time>
              </div>
              <h3 class="card-title">{{ article.title }}</h3>
              <p class="card-desc" v-if="article.description">{{ article.description }}</p>
              
              <div class="card-footer">
                <div class="tags-list" v-if="article.tags && article.tags.length">
                  <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="mini-tag">#{{ tag }}</span>
                </div>
                <span class="read-more">{{ t('readArticle') }} <Icon name="lucide:arrow-right" class="w-3 h-3" /></span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- 分页信息 -->
        <div class="pagination-info" v-if="totalItems > 0">
          <div class="pagination-controls">
            <span class="stats-text">
              {{ t('showingRangeTotal', {
                start: (currentPage - 1) * itemsPerPage + 1,
                end: Math.min(currentPage * itemsPerPage, totalItems),
                total: totalItems
              }) }}
            </span>
            <div class="page-size-selector">
              <span class="selector-label">{{ t('perPage') }}</span>
              <div class="selector-options">
                <button
                  v-for="size in pageSizeOptions"
                  :key="size"
                  :class="['size-btn', { active: itemsPerPage === size }]"
                  @click="itemsPerPage = size"
                >
                  {{ size }}
                </button>
              </div>
              <span class="selector-label">{{ t('itemsUnit') }}</span>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            <Icon name="lucide:chevron-left" class="w-4 h-4" />
          </button>

          <!-- 页码按钮 -->
          <div class="page-numbers">
            <button
              v-for="page in displayedPages"
              :key="page"
              :class="['page-number', { active: currentPage === page, ellipsis: page === -1 }]"
              @click="page !== -1 && goToPage(page)"
              :disabled="page === -1"
            >
              {{ page === -1 ? '...' : page }}
            </button>
          </div>

          <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
            <Icon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>

        <div v-else-if="totalItems > 0" class="pagination-single">
          <span class="page-text">{{ t('totalItemsOnly', { total: totalItems }) }}</span>
        </div>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
type Category = 'all' | 'news' | 'event' | 'people' | 'other'

interface NewsArticle {
  title: string
  date?: string
  description?: string
  image?: string
  category?: 'news' | 'event' | 'people' | 'other'
  source?: string
  tags?: string[]
  bodyText?: string
  path: string
}

const { t } = useI18n()

const normalizeDateText = (date?: string) => (date || '').replace(/\./g, '-').trim()

const searchQuery = ref('')
const selectedCategory = ref<Category>('all')
const currentPage = ref(1)
const itemsPerPage = ref(9) // 3x3 grid
const pageSizeOptions = [6, 9, 12, 24] // 可选每页条数

// 切换每页条数时重置到第一页
watch(itemsPerPage, () => {
  currentPage.value = 1
})

// 使用API进行搜索和分页
const { data: apiResponse, status, refresh } = await useAsyncData('news-list', async () => {
  const response = await $fetch('/api/news', {
    query: {
      page: currentPage.value,
      pageSize: itemsPerPage.value,
      category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
      search: searchQuery.value.trim() || undefined
    }
  })
  return response
}, {
  watch: [currentPage, itemsPerPage, selectedCategory, searchQuery]
})

const allArticles = computed(() => {
  if (!apiResponse.value?.data) return []
  return apiResponse.value.data.map((item: any) => ({
    title: item.title,
    date: normalizeDateText(item.date),
    description: item.description,
    image: item.image,
    category: item.category,
    source: item.source,
    tags: item.tags || [],
    path: item._path || item.path
  })) as NewsArticle[]
})

const totalItems = computed(() => apiResponse.value?.total || 0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))

const categories = computed<{ value: Category, label: string }[]>(() => [
  { value: 'all', label: t('filterAll') },
  { value: 'news', label: t('filterNews') },
  { value: 'event', label: t('filterEvent') },
  { value: 'people', label: t('filterPeople') },
  { value: 'other', label: t('filterOther') }
])

const categoryLabelMap = computed(() => ({
  news: t('filterNews'),
  event: t('filterEvent'),
  people: t('filterPeople'),
  other: t('filterOther')
}))

const getCategoryLabel = (category?: string) => {
  if (!category) return t('sectionNews')
  return categoryLabelMap.value[category as keyof typeof categoryLabelMap.value] || category
}

// API返回的数据已经是过滤和分页后的结果
const currentPageArticles = allArticles
const filteredCount = totalItems

const hasActiveFilters = computed(() => selectedCategory.value !== 'all' || !!searchQuery.value)

const clearSearch = () => {
  searchQuery.value = ''
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 计算要显示的页码（包含省略号逻辑）
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []

  if (total <= 7) {
    // 页数较少时显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 页数较多时的显示逻辑
    if (current <= 4) {
      // 当前页靠前
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push(-1) // 省略号
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页靠后
      pages.push(1)
      pages.push(-1) // 省略号
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push(-1) // 省略号
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push(-1) // 省略号
      pages.push(total)
    }
  }

  return pages
})

const formatDate = (date?: string) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

useHead({
  title: () => t('newsPageTitle')
})

useSeoMeta({
  description: () => t('newsSeoDescription'),
  ogTitle: () => t('newsPageTitle'),
  ogDescription: () => t('newsSeoDescription')
})
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  padding: 100px 20px 60px; /* Increased top padding for fixed header */
  max-width: 1200px;
  margin: 0 auto;
}

/* 统一使用 section-header 样式，与 about 页面一致 */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
}

.section-line {
  width: 80px;
  height: 4px;
  background: var(--primary-color);
  margin: 0 auto 20px;
  border-radius: 2px;
}

.page-subtitle {
  margin: 0;
  color: var(--text-dim);
  font-size: 1.1rem;
}

/* Controls Section */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar-container {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.search-box:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 4px 20px rgba(var(--primary-glow), 0.15);
}

.search-icon { color: var(--text-dim); }

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 16px;
  color: var(--text-color);
  outline: none;
}

.clear-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-dim);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-dim);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-chip:hover {
  background: var(--card-bg);
  color: var(--text-color);
}

.filter-chip.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.reset-btn {
  background: transparent;
  border: none;
  color: var(--text-dim);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.reset-btn:hover { color: var(--primary-color); }


/* Article Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.article-card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

.card-image-wrapper {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--bg-color);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .card-img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--text-dim);
}

.badge {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(128,128,128,0.1);
}

.badge.news { color: #3b82f6; background: rgba(59,130,246,0.1); }
.badge.event { color: #10b981; background: rgba(16,185,129,0.1); }
.badge.people { color: #f59e0b; background: rgba(245,158,11,0.1); }
.badge.other { color: #8b5cf6; background: rgba(139,92,246,0.1); }

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin: 0 0 20px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tags-list {
  display: flex;
  gap: 6px;
}

.mini-tag {
  font-size: 11px;
  color: var(--text-dim);
  background: var(--bg-color);
  padding: 2px 6px;
  border-radius: 4px;
}

.read-more {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* State Boxes */
.state-box {
  padding: 60px 20px;
  text-align: center;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  color: var(--text-dim);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.btn-text {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

/* Pagination Info */
.pagination-info {
  margin-top: 40px;
  margin-bottom: 16px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.stats-text {
  font-size: 14px;
  color: var(--text-dim);
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selector-label {
  font-size: 13px;
  color: var(--text-dim);
}

.selector-options {
  display: flex;
  gap: 4px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 3px;
}

.size-btn {
  min-width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-variant-numeric: tabular-nums;
}

.size-btn:hover:not(.active) {
  background: rgba(128, 128, 128, 0.1);
  color: var(--text-color);
}

.size-btn.active {
  background: var(--primary-color);
  color: white;
  font-weight: 600;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.pagination-single {
  text-align: center;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  min-width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  padding: 0 12px;
}

.page-number:hover:not(:disabled):not(.active):not(.ellipsis) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.page-number.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  font-weight: 600;
}

.page-number.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
  color: var(--text-dim);
}

.page-text {
  font-size: 14px;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

/* Responsive */
@media (max-width: 768px) {
  .news-page { padding: 80px 16px 40px; }

  .section-header h2 {
    font-size: 28px;
    margin-bottom: 15px;
  }

  .section-line {
    width: 60px;
    height: 3px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-chips {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 16px;
  }

  .page-numbers {
    order: -1;
  }

  .page-number:not(.active):not(.ellipsis) {
    display: none;
  }

  .page-number.active,
  .page-number.ellipsis {
    display: flex;
  }
}
</style>
