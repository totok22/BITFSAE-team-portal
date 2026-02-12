<template>
  <div class="news-detail-page">
    <div class="page-container">
      
      <!-- Loading State -->
      <div v-if="status === 'pending'" class="loading-state">
        <UIcon name="lucide:loader-2" class="animate-spin w-8 h-8 text-primary" />
      </div>

      <!-- Error State -->
      <div v-else-if="error || !article" class="error-state">
        <div class="error-icon">
          <UIcon name="lucide:alert-circle" class="w-10 h-10" />
        </div>
        <h1>{{ t('newsErrorTitle') }}</h1>
        <p>{{ error?.message || t('newsErrorDesc') }}</p>
        <UButton :to="localePath('/news')" color="neutral" variant="solid">{{ t('backToNewsList') }}</UButton>
      </div>

      <!-- Article Content -->
      <template v-else>
        <!-- Article Header -->
        <div class="article-header">
          <div class="article-meta">
            <span class="meta-badge" :class="article.category || 'news'">
              <UIcon name="lucide:folder-open" class="w-3.5 h-3.5" />
              {{ getCategoryLabel(article.category) }}
            </span>
            <span class="meta-divider"></span>
            <span class="meta-date">
              <UIcon name="lucide:calendar" class="w-3.5 h-3.5" />
              <time>{{ formatDate(article.date) }}</time>
            </span>
          </div>

          <h1 class="article-title">{{ article.title }}</h1>

          <p v-if="article.description" class="article-description">
            {{ article.description }}
          </p>
        </div>

        <!-- Floating TOC Toggle Button -->
        <button
          v-if="tocLinks.length > 0"
          class="toc-fab"
          @click="isTocPanelOpen = true"
          :title="t('openToc')"
        >
          <UIcon name="lucide:list" class="w-5 h-5" />
        </button>

        <!-- TOC Side Panel (Slide-in) -->
        <Teleport to="body">
          <Transition name="toc-panel">
            <div v-if="isTocPanelOpen && tocLinks.length > 0" class="toc-panel-overlay" @click.self="isTocPanelOpen = false">
              <div class="toc-panel">
                <div class="toc-panel-header">
                  <div class="toc-panel-title">
                    <UIcon name="lucide:list" class="w-5 h-5 text-primary" />
                    <span>{{ t('tocTitle') }}</span>
                  </div>
                  <button class="toc-panel-close" @click="isTocPanelOpen = false">
                    <UIcon name="lucide:x" class="w-5 h-5" />
                  </button>
                </div>
                <nav class="toc-panel-content">
                  <div class="toc-progress">
                    <div class="toc-progress-bar" :style="{ height: readProgress + '%' }"></div>
                  </div>
                  <ul>
                    <li
                      v-for="link in tocLinks"
                      :key="link.id"
                      :class="[`depth-${link.depth}`, { active: activeHeading === link.id }]"
                    >
                      <a :href="`#${link.id}`" @click.prevent="handleTocClick(link.id)">
                        <span class="toc-dot"></span>
                        {{ link.text }}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </Transition>
        </Teleport>

        <div class="content-layout">
          <!-- Article Body -->
          <article class="article-main">
            <div class="max-w-none article-content">
              <ContentRenderer :value="article" :prose="true">
                <template #empty>
                  <p>{{ t('emptyArticle') }}</p>
                </template>
              </ContentRenderer>
            </div>

            <!-- Prev/Next Navigation -->
            <nav class="article-nav">
              <NuxtLink v-if="prevArticle" :to="prevArticle.path" class="nav-block prev">
                <div class="nav-label">
                  <UIcon name="lucide:arrow-left" class="w-4 h-4" />
                  {{ t('prevArticle') }}
                </div>
                <div class="nav-title">{{ prevArticle.title }}</div>
              </NuxtLink>
              <div v-else class="nav-block empty"></div>

              <NuxtLink v-if="nextArticle" :to="nextArticle.path" class="nav-block next">
                <div class="nav-label">
                  {{ t('nextArticle') }}
                  <UIcon name="lucide:arrow-right" class="w-4 h-4" />
                </div>
                <div class="nav-title">{{ nextArticle.title }}</div>
              </NuxtLink>
              <div v-else class="nav-block empty"></div>
            </nav>
          </article>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

type AdjacentArticle = {
  title: string
  path: string
  date?: string
} | null

type NewsDetailPayload = {
  article: any
  prev: AdjacentArticle
  next: AdjacentArticle
}

const normalizePath = (path?: string) => {
  if (!path) return '/'
  const cleaned = path.replace(/\/+$/, '')
  return cleaned || '/'
}

const contentPath = computed(() => {
  // 使用动态参数构建内容路径，避免 i18n 前缀/尾斜杠影响
  const rawSlug = route.params.slug
  const slug = Array.isArray(rawSlug) ? rawSlug.join('/') : (rawSlug || '')
  return normalizePath(`/news/${slug}`)
})

// 1. Fetch Article + Adjacent in one request
const slugParam = computed(() => {
  const rawSlug = route.params.slug
  return Array.isArray(rawSlug) ? rawSlug.join('/') : String(rawSlug || '')
})

const { data: detailData, error, status } = await useAsyncData<NewsDetailPayload | null>(
  () => `news-detail-${contentPath.value}`,
  async () => {
    if (!slugParam.value) return null
    const response = await $fetch<{ data: NewsDetailPayload | null, error?: string }>(`/api/news/${slugParam.value}`)
    if (response?.error) {
      throw createError({ statusCode: 404, statusMessage: response.error })
    }
    return response?.data || null
  },
  {
    watch: [slugParam],
    default: () => null
  }
)

const article = computed(() => detailData.value?.article || null)
const prevArticle = computed(() => detailData.value?.prev || null)
const nextArticle = computed(() => detailData.value?.next || null)

// 3. TOC Logic
const tocLinks = computed(() => {
  const toc = (article.value?.body as any)?.toc?.links
  if (!toc) return []
  
  const flatten = (links: any[]): any[] => {
    let res: any[] = []
    for (const link of links) {
      res.push(link)
      if (link.children) res = res.concat(flatten(link.children))
    }
    return res
  }
  return flatten(toc)
})

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = 90
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }
}

// Active heading tracking for TOC
const activeHeading = ref('')
const isTocPanelOpen = ref(false)
const readProgress = ref(0)

// Handle TOC click - scroll and close panel
const handleTocClick = (id: string) => {
  scrollToHeading(id)
  isTocPanelOpen.value = false
}

onMounted(() => {
  // Intersection Observer for active heading
  const headings = document.querySelectorAll('h2[id], h3[id]')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeHeading.value = entry.target.id
        }
      })
    },
    { rootMargin: '-90px 0px -80% 0px' }
  )
  headings.forEach((h) => observer.observe(h))

  // Read progress tracking
  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    readProgress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
  }
  window.addEventListener('scroll', updateProgress, { passive: true })
})

// 4. Helpers
const formatDate = (str?: string) => {
  if (!str) return ''
  return str.replace(/\./g, ' / ')
}

const getCategoryLabel = (cat?: string) => {
  const map: Record<string, string> = {
    news: t('filterNews'),
    event: t('filterEvent'),
    people: t('filterPeople'),
    other: t('filterOther')
  }
  return (cat && map[cat]) || t('sectionNews')
}

// SEO
useHead({
  title: () => article.value?.title || 'News'
})

useSeoMeta({
  description: () => article.value?.description || '',
  ogTitle: () => article.value?.title || 'News',
  ogDescription: () => article.value?.description || ''
})
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  padding: 100px 20px 60px;
  background: var(--bg-color);
  color: var(--text-color);
}

.page-container {
  max-width: 860px;
  margin: 0 auto;
}

.article-header {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--glass-border);
}

.article-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.meta-badge.news {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.meta-badge.event {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.meta-badge.people {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.meta-badge.other {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.meta-divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-dim);
  opacity: 0.4;
}

.meta-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-dim);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

[data-theme="light"] .meta-badge.news,
.light .meta-badge.news {
  background: rgba(59, 130, 246, 0.12);
}

[data-theme="light"] .meta-badge.event,
.light .meta-badge.event {
  background: rgba(16, 185, 129, 0.12);
}

[data-theme="light"] .meta-badge.people,
.light .meta-badge.people {
  background: rgba(245, 158, 11, 0.12);
}

[data-theme="light"] .meta-badge.other,
.light .meta-badge.other {
  background: rgba(139, 92, 246, 0.12);
}

.article-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 20px;
  letter-spacing: -0.02em;
}

.article-description {
  font-size: 1.15rem;
  color: var(--text-dim);
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
}

/* Layout */
.content-layout {
  display: flex;
  flex-direction: column;
}

.article-main {
  min-width: 0;
  width: 100%;
}

/* Article content - ensure proper centering */
.article-content {
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Ensure images center properly within the article */
.article-content :deep(figure) {
  margin: 1.5rem 0;
  text-align: center;
}

.article-content :deep(figure img) {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}

/* Center and Right alignment within article */
.article-content :deep(.prose-center) {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.article-content :deep(.prose-right) {
  text-align: right;
  width: 100%;
}

.article-content :deep(.prose-left) {
  text-align: left;
  width: 100%;
}

/* Nav Blocks - centered */
.article-nav {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--glass-border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 100%;
}

.nav-block {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  min-height: 72px;
}

.nav-block.empty {
  background: transparent;
  border: 1px dashed var(--glass-border);
  min-height: 72px;
  pointer-events: none;
  opacity: 0;
}

.nav-block:hover:not(.empty) {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  background: rgba(59, 130, 246, 0.05);
}

.nav-block.next { text-align: right; }

.nav-label {
  font-size: 12px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-block.next .nav-label { justify-content: flex-end; }
.nav-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: 15px;
  line-height: 1.4;
}

/* Light mode for nav */
[data-theme="light"] .nav-block:hover:not(.empty),
.light .nav-block:hover:not(.empty) {
  background: rgba(59, 130, 246, 0.08);
}

/* Responsive */
@media (max-width: 768px) {
  .news-detail-page {
    padding: 80px 16px 40px;
  }

  .article-nav {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .nav-block.next { 
    text-align: left; 
  }
  
  .nav-block.next .nav-label { 
    justify-content: flex-start; 
  }
}

/* TOC Floating Action Button */
.toc-fab {
  position: fixed;
  right: 32px;
  bottom: 100px;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color), #3b82f6);
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.toc-fab:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
}

.toc-fab:active {
  transform: translateY(-1px) scale(1.02);
}



/* TOC Panel Overlay */
.toc-panel-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* TOC Side Panel */
.toc-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 340px;
  max-width: 85vw;
  background: var(--card-bg, #ffffff);
  box-shadow: -4px 0 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toc-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--glass-border, rgba(128, 128, 128, 0.2));
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  flex-shrink: 0;
}

.toc-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
}

.toc-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(128, 128, 128, 0.1);
  border: none;
  border-radius: 50%;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toc-panel-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.toc-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
  position: relative;
}

.toc-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(128, 128, 128, 0.1);
}

.toc-progress-bar {
  width: 100%;
  background: linear-gradient(180deg, var(--primary-color), #60a5fa);
  transition: height 0.15s ease;
  border-radius: 0 0 2px 2px;
}

.toc-panel-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-panel-content li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px 10px 20px;
  font-size: 14px;
  color: var(--text-dim);
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  line-height: 1.5;
}

.toc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(128, 128, 128, 0.3);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.toc-panel-content li a:hover {
  color: var(--primary-color);
  background: rgba(59, 130, 246, 0.05);
}

.toc-panel-content li a:hover .toc-dot {
  background: var(--primary-color);
  transform: scale(1.3);
}

.toc-panel-content li.active a {
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  background: rgba(59, 130, 246, 0.08);
  font-weight: 600;
}

.toc-panel-content li.active .toc-dot {
  background: var(--primary-color);
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
  transform: scale(1.3);
}

.toc-panel-content .depth-3 a { padding-left: 40px; }
.toc-panel-content .depth-3 .toc-dot { width: 5px; height: 5px; }
.toc-panel-content .depth-4 a { padding-left: 56px; }
.toc-panel-content .depth-4 .toc-dot { width: 4px; height: 4px; }

/* TOC Panel Transitions */
.toc-panel-enter-active,
.toc-panel-leave-active {
  transition: all 0.3s ease;
}

.toc-panel-enter-active .toc-panel,
.toc-panel-leave-active .toc-panel {
  transition: transform 0.3s ease;
}

.toc-panel-enter-from,
.toc-panel-leave-to {
  opacity: 0;
}

.toc-panel-enter-from .toc-panel,
.toc-panel-leave-to .toc-panel {
  transform: translateX(100%);
}

/* Dark mode adjustments */
.dark .toc-panel {
  background: var(--card-bg, #1f2937);
}

.dark .toc-panel-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
}

/* Light mode adjustments */
[data-theme="light"] .toc-panel,
.light .toc-panel {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px) saturate(110%);
  -webkit-backdrop-filter: blur(12px) saturate(110%);
  box-shadow: -4px 0 30px rgba(15, 23, 42, 0.14);
}

[data-theme="light"] .toc-panel-header,
.light .toc-panel-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.04));
  border-bottom-color: rgba(15, 23, 42, 0.08);
}

[data-theme="light"] .toc-panel-content li a,
.light .toc-panel-content li a {
  color: #334155;
}

[data-theme="light"] .toc-panel-content li a:hover,
.light .toc-panel-content li a:hover {
  background: rgba(59, 130, 246, 0.08);
}

[data-theme="light"] .toc-panel-content li.active a,
.light .toc-panel-content li.active a {
  background: rgba(59, 130, 246, 0.14);
}
</style>
