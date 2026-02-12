# BITFSAE 项目架构与开发指南

> 本文档面向项目开发者，详尽说明 BITFSAE 官网的技术架构、代码细节和开发规范。

---

## 一、项目概览

BITFSAE 是北京理工大学纯电动方程式赛车队（BITFSAE）的官方网站，基于 **Nuxt 4** 全栈框架构建。网站包含首页轮播、关于我们、赛事介绍、历代赛车、赞助商展示和新闻动态六大板块，支持中英文双语、深色/浅色主题切换，并通过 Nuxt Content v3 实现 Markdown 驱动的内容管理。

### 技术栈一览

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Nuxt | ^4.0.0 |
| 前端 | Vue 3 (Composition API) | ^3.5.26 |
| UI 库 | @nuxt/ui (Tailwind Variants) | ^4.4.0 |
| CSS | Tailwind CSS v4 + 自定义 CSS 变量 | — |
| 内容 | @nuxt/content (Collections + SQLite) | ^3.10.0 |
| 国际化 | @nuxtjs/i18n | ^10.2.1 |
| SEO | @nuxtjs/seo | ^3.4.0 |
| 图片 | @nuxt/image + sharp | ^1.8.0 |
| 图标 | @nuxt/icon (Lucide) | ^2.2.1 |
| 字体 | @nuxt/fonts（本地字体，禁用远程下载） | ^0.13.0 |
| 动画 | @formkit/auto-animate | ^0.9.0 |
| 数学公式 | remark-math + rehype-katex | — |
| CMS | nuxt-studio（条件加载） | ^1.2.0 |
| 数据库 | better-sqlite3 (Content 底层) | ^12.6.0 |

---

## 二、目录结构

```
bitfsae-nuxt/
├── app/                          # Nuxt 4 应用目录（前端代码）
│   ├── app.vue                   # 根组件
│   ├── app.config.ts             # 应用配置（UI 主题、Prose 组件样式）
│   ├── assets/styles/            # 样式文件
│   │   ├── ui.css                # Tailwind + Nuxt UI 入口
│   │   ├── variables.css         # CSS 变量（深色/浅色主题）
│   │   ├── global.css            # 全局样式（导航、页脚、动画等）
│   │   └── studio-light.css      # Nuxt Studio 编辑器浅色覆盖
│   ├── components/               # Vue 组件
│   │   ├── AppHeader.vue         # 顶部导航栏
│   │   ├── AppFooter.vue         # 页脚
│   │   ├── MobileMenu.vue        # 移动端侧滑菜单
│   │   ├── LoginModal.vue        # 遥测系统登录弹窗
│   │   ├── ScrollToTopButton.vue # 回到顶部按钮
│   │   └── content/              # MDC 内容组件（全局注册）
│   │       ├── Center.vue        # 居中对齐容器
│   │       ├── Left.vue          # 左对齐容器
│   │       ├── Right.vue         # 右对齐容器
│   │       ├── MSpan.vue         # 富文本 span（颜色/大小/预设）
│   │       ├── Span.vue          # 基础 span 透传
│   │       └── ImageGallery.vue  # 图片画廊网格
│   ├── composables/              # 可组合函数
│   │   ├── useCarousel.ts        # 轮播图逻辑
│   │   ├── useLoginModal.ts      # 登录弹窗状态管理
│   │   ├── useMobileMenu.ts      # 移动端菜单状态管理
│   │   ├── useScrollAnimation.ts # 滚动入场动画
│   │   └── useTheme.ts           # 主题切换（dark/light）
│   ├── layouts/
│   │   └── default.vue           # 默认布局（Header + Main + Footer）
│   ├── pages/                    # 页面路由
│   │   ├── index.vue             # 首页（轮播 + 赞助商）
│   │   ├── about.vue             # 关于我们
│   │   ├── events.vue            # 赛事介绍
│   │   ├── cars.vue              # 历代赛车
│   │   ├── sponsors.vue          # 赞助商
│   │   └── news/
│   │       ├── index.vue         # 新闻列表（搜索/筛选/分页）
│   │       └── [...slug].vue     # 新闻详情（MDC 渲染 + TOC）
│   ├── plugins/
│   │   └── seo.ts                # 全局 SEO meta 和结构化数据
│   ├── types/                    # TypeScript 类型定义
│   │   ├── index.ts              # 前端通用类型
│   │   ├── api.ts                # API 响应类型
│   │   └── content.ts            # Content 内容类型
│   └── utils/
│       ├── data.ts               # 静态数据（赞助商列表等）
│       └── site.ts               # 站点常量（外部链接、favicon）
├── content/                      # Markdown 内容文件
│   ├── news/                     # 新闻文章
│   ├── events/                   # 赛事信息
│   └── cars/                     # 赛车介绍
├── i18n/locales/                 # 国际化翻译文件
│   ├── zh.json                   # 中文
│   └── en.json                   # 英文
├── server/                       # 服务端代码
│   ├── api/                      # API 路由
│   │   ├── news.ts               # 新闻列表 API
│   │   ├── news/[slug].get.ts    # 新闻详情 API
│   │   ├── cars.ts               # 赛车列表 API
│   │   └── events.ts             # 赛事列表 API
│   └── utils/
│       └── news-index.ts         # 新闻索引缓存（带 TTL）
├── public/                       # 静态资源
│   ├── assets/images/            # 图片资源
│   ├── assets/katex/             # KaTeX 样式和字体
│   └── fonts/                    # 本地字体文件（Inter + Outfit）
├── docs/                         # 项目文档
├── .github/workflows/            # CI/CD 工作流
│   ├── deploy.yml                # 自动部署到阿里云
│   └── lockfile-check.yml        # lockfile 一致性检查
├── nuxt.config.ts                # Nuxt 主配置
├── content.config.ts             # 内容集合 schema 定义
├── ecosystem.config.cjs          # PM2 部署配置
└── tailwind.config.ts            # Tailwind CSS 配置
```

---

## 三、模块配置详解

模块在 [`nuxt.config.ts`](../nuxt.config.ts:18) 的 `modules` 数组中注册：

```typescript
modules: [
  '@nuxt/fonts',
  '@nuxt/content',
  studioEnabled ? 'nuxt-studio' : undefined,  // 条件加载
  '@nuxt/image',
  '@nuxtjs/i18n',
  '@nuxt/ui',
  '@nuxt/icon',
  '@formkit/auto-animate/nuxt',
  '@nuxtjs/seo'
].filter(Boolean)
```

### 3.1 @nuxt/content — 内容管理

- **配置位置**：[`nuxt.config.ts`](../nuxt.config.ts:36)
- **集合定义**：[`content.config.ts`](../content.config.ts)

内容系统使用 SQLite 作为底层存储，通过 `defineCollection` 定义四个集合：

| 集合 | 源路径 | 类型 | 主要字段 |
|------|--------|------|---------|
| `news` | `content/news/*.md` | page | title, date, description, image, category, tags |
| `cars` | `content/cars/*.md` | page | title, year, model, image, specs, features |
| `events` | `content/events/*.md` | page | title, date, location, description, image |
| `sponsors` | `content/sponsors/*.md` | page | title, category, logo, website |

Markdown 处理配置：
- **代码高亮**：使用 `github-dark` 主题，预加载 ts/js/css/vue/bash/md/yaml/json 语言
- **数学公式**：通过 `remark-math` + `rehype-katex` 支持 LaTeX 语法
- **MDC 组件**：在 `app/components/content/` 目录下定义，全局注册

### 3.2 nuxt-studio — 可视化编辑

- **条件加载**：[`nuxt.config.ts`](../nuxt.config.ts:8) 通过 `NUXT_STUDIO` 环境变量控制
- **配置位置**：[`nuxt.config.ts`](../nuxt.config.ts:220)

```typescript
const studioEnabled = process.env.NUXT_STUDIO === 'true'
```

**为什么条件加载？**
- `nuxt-studio` 依赖 `nuxt-component-meta`，在 Windows 开发环境下可能报错
- 仅在生产构建时启用（CI 中设置 `NUXT_STUDIO=true`），避免影响日常开发

**认证流程**：

```
用户访问 /__nuxt_studio/
    │
    ▼
Studio 前端界面加载
    │
    ▼
点击 GitHub 登录
    │
    ▼
重定向到 GitHub OAuth 授权页
    │
    ▼
用户授权后回调到 /__nuxt_studio/auth/github
    │
    ▼
nuxt-studio 模块验证 OAuth token
    │
    ▼
认证成功，进入可视化编辑界面
```

**认证配置结构**（[`nuxt.config.ts`](../nuxt.config.ts:220)）：

```typescript
studio: {
  repository: {
    provider: 'github',
    owner: 'totok22',
    repo: 'bitfsae-nuxt',
    branch: 'main',
    private: true
  },
  auth: {
    github: {
      clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
      clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET
    }
  }
}
```

> **⚠️ 注意**：OAuth 凭据使用 `STUDIO_` 前缀（而非 `NUXT_` 前缀），因为 `nuxt-studio` 模块直接读取 `STUDIO_GITHUB_*` 环境变量。使用 `NUXT_` 前缀会被 Nuxt 映射到 `runtimeConfig`，可能覆盖 studio 的配置对象。

### 3.3 @nuxtjs/i18n — 国际化

- **配置位置**：[`nuxt.config.ts`](../nuxt.config.ts:114)
- **翻译文件**：`i18n/locales/zh.json`、`i18n/locales/en.json`

```typescript
i18n: {
  locales: [
    { code: 'en', file: 'en.json', name: 'English' },
    { code: 'zh', file: 'zh.json', name: '简体中文' }
  ],
  defaultLocale: 'zh',
  strategy: 'prefix_except_default',  // 中文无前缀，英文 /en/
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'i18n_redirected',
    fallbackLocale: 'zh'
  }
}
```

路由策略：`prefix_except_default` — 默认语言（中文）不添加 URL 前缀，英文路由以 `/en/` 开头。

### 3.4 @nuxt/image — 图片优化

- **配置位置**：[`nuxt.config.ts`](../nuxt.config.ts:128)

```typescript
image: {
  format: ['webp', 'avif', 'jpg'],
  quality: 80,
  screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }
}
```

`@nuxt/image` 使用 sharp 进行服务端图片处理，通过 `/_ipx/` 路由提供动态图片优化。

### 3.5 @nuxt/fonts — 字体管理

- **配置位置**：[`nuxt.config.ts`](../nuxt.config.ts:91)

```typescript
fonts: {
  providers: { google: false },  // 禁用远程下载
  families: [
    { name: 'Inter', src: '/fonts/Inter/Inter-VariableFont_opsz-wght.ttf' },
    { name: 'Outfit', src: '/fonts/Outfit/Outfit-VariableFont_wght.ttf' }
  ]
}
```

由于国内网络环境限制，禁用 Google Fonts 远程下载，使用本地字体文件。

### 3.6 @nuxtjs/seo — SEO 优化

- **配置位置**：[`nuxt.config.ts`](../nuxt.config.ts:207)
- **SEO 插件**：[`app/plugins/seo.ts`](../app/plugins/seo.ts)

包含 sitemap 生成（`zeroRuntime` 模式）和 robots.txt 配置。

---

## 四、渲染策略

项目采用 **SSR + ISR + 预渲染** 混合策略，在 [`nuxt.config.ts`](../nuxt.config.ts:243) 的 `routeRules` 中配置。

### 4.1 预渲染（Prerender）

以下页面在构建时生成静态 HTML：

```typescript
routeRules: {
  '/': { prerender: true },
  '/about': { prerender: true },
  '/sponsors': { prerender: true },
  '/cars': { prerender: true },
  '/sw.js': { static: true },
}
```

### 4.2 ISR（增量静态再生）

新闻页面和 API 路由使用 `swr`（Stale-While-Revalidate）策略，在开发环境下禁用以避免缓存干扰调试：

```typescript
// 新闻页面：1 小时缓存
'/news': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 },
'/news/**': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 },

// API 路由缓存
'/api/news': process.env.NODE_ENV === 'development' ? {} : { swr: 1800 },   // 30 分钟
'/api/cars': process.env.NODE_ENV === 'development' ? {} : { swr: 7200 },   // 2 小时
'/api/events': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 }, // 1 小时
```

**ISR 工作原理**：
1. 首次请求时，服务端渲染页面并缓存
2. 在 `swr` 指定的时间内，直接返回缓存内容
3. 缓存过期后，下一次请求仍返回旧缓存，同时在后台重新渲染
4. 后台渲染完成后，更新缓存供后续请求使用

### 4.3 预渲染配置

[`nuxt.config.ts`](../nuxt.config.ts:145) 的 `nitro.prerender` 配置：

```typescript
nitro: {
  prerender: {
    concurrency: 1,       // 串行处理，防止多进程抢占 SQLite
    failOnError: true,
    crawlLinks: true,
    ignore: ['/_ipx/**']  // 排除动态图片处理路由
  }
}
```

- **`concurrency: 1`**：强制串行预渲染，避免多个进程同时访问 SQLite 数据库导致内存指针错误
- **`ignore: ['/_ipx/**']`**：`_ipx` 是 `@nuxt/image` 的动态图片处理路由，不应被预渲染（预渲染时会触发 sharp 的 native 内存管理问题）

---

## 五、主题系统

### 5.1 主题切换流程

1. **防闪烁脚本**（[`nuxt.config.ts`](../nuxt.config.ts:60)）：在 `<head>` 中内联执行，读取 `localStorage` 并立即设置 `data-theme` 属性和 `dark` class
2. **`useTheme` composable**（[`app/composables/useTheme.ts`](../app/composables/useTheme.ts)）：提供 `setTheme()`、`toggleTheme()`、`initTheme()` 方法
3. **`AppHeader.vue`**（[`app/components/AppHeader.vue`](../app/components/AppHeader.vue:58)）：调用 `useTheme()` 实现主题切换按钮

所有主题操作统一作用于 `document.documentElement`（`<html>` 元素），通过 `data-theme` 属性和 `dark` class 控制样式。

### 5.2 CSS 变量

主题变量定义在 [`app/assets/styles/variables.css`](../app/assets/styles/variables.css) 中，通过 `[data-theme="dark"]` 和 `[data-theme="light"]` 选择器切换。

---

## 六、服务端 API

### 6.1 API 路由

| 路由 | 文件 | 说明 |
|------|------|------|
| `GET /api/news` | [`server/api/news.ts`](../server/api/news.ts) | 新闻列表（支持搜索、分页、分类筛选） |
| `GET /api/news/:slug` | [`server/api/news/[slug].get.ts`](../server/api/news/[slug].get.ts) | 新闻详情 |
| `GET /api/cars` | [`server/api/cars.ts`](../server/api/cars.ts) | 赛车列表 |
| `GET /api/events` | [`server/api/events.ts`](../server/api/events.ts) | 赛事列表 |

### 6.2 新闻索引缓存

[`server/utils/news-index.ts`](../server/utils/news-index.ts) 实现了带 TTL 的内存缓存：

- **开发环境 TTL**：30 秒
- **生产环境 TTL**：10 分钟
- **缓存内容**：新闻列表的索引数据（标题、日期、描述、搜索文本等）
- **数据源**：优先从 `@nuxt/content` 的 `queryCollection` 获取，失败时回退到文件系统直接读取

---

## 七、内容组件（MDC）

MDC（Markdown Components）允许在 Markdown 中使用 Vue 组件。自定义组件定义在 [`app/components/content/`](../app/components/content/) 目录下，通过 [`nuxt.config.ts`](../nuxt.config.ts:82) 全局注册：

```typescript
components: [
  { path: '~/components/content', global: true },
  '~/components'
]
```

### 可用组件

| 组件 | 用途 | MDC 语法示例 |
|------|------|-------------|
| `Center` | 居中对齐 | `::center\n内容\n::` |
| `Left` | 左对齐 | `::left\n内容\n::` |
| `Right` | 右对齐 | `::right\n内容\n::` |
| `MSpan` | 富文本 span | `:m-span{color="red" size="lg"}文本` |
| `Span` | 基础 span | `:span{class="..."}文本` |
| `ImageGallery` | 图片画廊 | `::image-gallery\n![alt](url)\n::` |

---

## 八、Composables 说明

| Composable | 文件 | 说明 |
|------------|------|------|
| `useCarousel` | [`app/composables/useCarousel.ts`](../app/composables/useCarousel.ts) | 首页轮播图逻辑（自动播放、手动切换） |
| `useLoginModal` | [`app/composables/useLoginModal.ts`](../app/composables/useLoginModal.ts) | 遥测系统登录弹窗状态管理（`useState` 跨组件共享） |
| `useMobileMenu` | [`app/composables/useMobileMenu.ts`](../app/composables/useMobileMenu.ts) | 移动端菜单状态管理（`useState` 跨组件共享） |
| `useScrollAnimation` | [`app/composables/useScrollAnimation.ts`](../app/composables/useScrollAnimation.ts) | 基于 IntersectionObserver 的滚动入场动画 |
| `useTheme` | [`app/composables/useTheme.ts`](../app/composables/useTheme.ts) | 深色/浅色主题切换，操作 `document.documentElement` |

---

## 九、构建优化

### 9.1 Vite 配置

[`nuxt.config.ts`](../nuxt.config.ts:162) 中的 Vite 配置：

```typescript
vite: {
  build: {
    assetsInlineLimit: 4096,  // 超过 4KB 的文件作为独立文件加载
  },
  css: {
    devSourcemap: false  // 消除 @tailwindcss/vite sourcemap 警告
  }
}
```

### 9.2 Bundle 分析

设置 `ANALYZE=true` 环境变量可启用 `rollup-plugin-visualizer`，生成 `stats.html` 可视化报告。

### 9.3 TypeScript 配置

启用严格模式（[`nuxt.config.ts`](../nuxt.config.ts:141)）：

```typescript
typescript: { strict: true }
```
