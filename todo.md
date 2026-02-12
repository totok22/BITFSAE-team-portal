参见docs文件夹下的SUGGESTIONS.md，全文阅读，opus4.6分析撰写的，分析的感觉不错，我自己也已经做了一些comments，但是也不一定完全准确/正确，需要仔细查看相关代码。


- 把页面级 SEO 全量规范到 useSeoMeta()（已起步，建议覆盖 about/cars/events/sponsors/news 全页）。
- 增加新闻详情的 ogImage 与 ogUrl（可基于文章 frontmatter + site.url 生成）。
- 校验线上运行时路由：/robots.txt、/sitemap.xml（模块已配置于 nuxt.config.ts 与 nuxt.config.ts）。
- 清理 SEO 插件中仍可下放给模块的内容，仅保留“模块不自动生成”的 JSON-LD。


- 构建流程并行化与缓存化：
在 CI 启用 node_modules 与 Nuxt 缓存目录复用（Windows runner 也可做目录缓存）。
对内容不频繁变化的分支使用增量构建策略。

- 发布策略优化：
静态可预渲染页面继续保持 prerender；新闻页保持 SWR。
对 API 路由缓存命中率做监控，避免无效回源。

- News API 改为“查询前置过滤 + 最小字段返回 + 预索引文本”，避免每次 all() 后再处理：参考当前热点位置 server/api/news.ts。（这个似乎已经处理了）
- 全局 CSS 进一步拆分为页面级，减少入口样式  或者其他方式缩减，但不应改变网站呈现；参考文件 app/assets/styles/global.css。
- 首页 Hero 图策略分层（首图高质量，其余图延迟策略）；参考 app/pages/index.vue。

---

## 新增改进计划（2026-02-11 代码分析）

> 以下基于对项目代码的全面审查，按优先级排列。

### 高优先级

- [ ] **页面级 SEO 补全**：about.vue、cars.vue、events.vue、sponsors.vue 均缺少 `useSeoMeta()` 调用。当前仅 seo.ts 插件设置了全局 meta，各页面应补充 title/description/ogImage 等页面级 SEO。新闻详情页 `[...slug].vue` 应基于文章 frontmatter 生成 ogImage 和 ogUrl。

- [ ] **AppHeader logo 使用原生 img 标签**：`AppHeader.vue:6` 使用 `<img src="/assets/images/bitfsae.svg">` 而非 `<NuxtImg>`，无法享受图片优化。建议改为 NuxtImg 或至少添加 width/height 属性避免 CLS。

- [ ] **about.vue 缺少 useSeoMeta**：`about.vue` 的 `<script setup>` 中没有任何 SEO 设置，仅导入了 IMAGE_URLS。

- [ ] **events.vue 空 script setup**：`events.vue:66-67` 的 `<script setup lang="ts">` 完全为空，可以移除 lang="ts" 或添加页面级 SEO。

- [ ] **sponsors.vue 页面内容待补充**：`content/sponsors/` 目录下无任何 Markdown 文件，schema 已定义但内容为空。

### 中优先级

- [ ] **类型定义重复**：`NewsItem` 在 `app/types/api.ts`、`app/types/content.ts`（NewsContent）、`app/types/index.ts` 中重复定义。建议统一为基础类型 + Pick/Omit 派生，减少维护成本。

- [ ] **scroll 事件未节流**：`AppHeader.vue:72-74` 的 `handleScroll` 直接绑定 scroll 事件无节流/防抖，高频触发影响性能。建议使用 `requestAnimationFrame` 或 VueUse 的 `useScroll`。

- [ ] **default.vue 路由监听使用 route 对象**：`default.vue:36` 使用 `watch(route, ...)` 监听整个 route 对象，可能导致不必要的重新执行。建议改为 `watch(() => route.path, ...)`。

- [ ] **sw.js 为空文件**：`public/sw.js` 是空的 Service Worker 文件，仅用于避免 404。可以考虑实现基础的离线缓存策略（缓存静态资源和已访问页面），或者如果不需要 SW 功能则在 nuxt.config.ts 中移除相关 routeRules。

- [ ] **CI 添加 frontmatter 校验**：在 GitHub Actions 中添加 frontmatter 格式校验步骤（验证必填字段、date 格式、image URL 前缀等），防止运营组提交格式错误的内容。

- [ ] **global.css 继续精简**：当前约 1118 行，仍可能存在未使用的样式。建议使用 PurgeCSS 审查或逐步将全局样式迁移到组件 scoped style 中。

### 低优先级

- [ ] **index.ts 中的 CarSpecs 接口硬编码**：`app/types/index.ts:16-34` 的 CarSpecs 接口字段是硬编码的（frame、bodyMaterial 等），而 `content.config.ts` 中 cars 的 specs 定义为 `z.record(z.any())`。两者不一致，建议统一。

- [ ] **ImageUrls 接口维护成本高**：`app/types/index.ts:36-49` 的 ImageUrls 接口需要手动维护每张图片的 key，且已有 `[key: string]: string` 兜底。建议简化为 `Record<string, string>` 或使用 const 对象自动推导类型。

- [ ] **新闻详情页样式体积大**：`app/pages/news/[...slug].vue` 有 749 行，其中大量是 scoped CSS。可考虑将文章渲染样式抽取为独立的 CSS 文件或 composable。

- [ ] **Tailwind CSS v4 sourcemap 警告**：等待上游 `@tailwindcss/vite` 修复，当前已通过 `css.devSourcemap: false` 抑制。

- [ ] **SQLite WASM 客户端优化**：关注 Nuxt Content 上游更新，考虑预加载 WASM 或尽量通过 API 路由在服务端查询。
