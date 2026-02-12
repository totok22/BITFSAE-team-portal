# 优化建议与技术债清单

> 本文档记录项目中已知的技术债、优化方向和改进建议。已解决的问题标记为 ✅，待处理的标记为 ⬜。

---

## 一、已解决的问题

以下问题在近期的代码重构中已修复，记录在此供参考。

### ✅ 1.1 `useTheme` composable 未被使用

**原问题**：[`useTheme.ts`](../app/composables/useTheme.ts) 定义了主题切换逻辑，但 `AppHeader.vue` 中直接内联了主题切换代码。

**已修复**：[`AppHeader.vue`](../app/components/AppHeader.vue:58) 现在通过 `const { currentTheme, toggleTheme, initTheme } = useTheme()` 使用 composable。

### ✅ 1.2 `useTheme` 与 `AppHeader` 主题逻辑不一致

**原问题**：`useTheme.ts` 操作 `document.body`，而 `AppHeader.vue` 和防闪烁脚本操作 `document.documentElement`，导致主题切换不一致。

**已修复**：[`useTheme.ts`](../app/composables/useTheme.ts:9) 现在统一使用 `document.documentElement`。

### ✅ 1.3 `events.vue` 中未使用的 API 数据

**原问题**：`events.vue` 脚本中调用了 `/api/events` API，但模板中完全没有使用返回的数据。

**已修复**：已移除未使用的 API 调用。

### ✅ 1.4 `MobileMenu.vue` 缺少 `localePath`

**原问题**：`MobileMenu.vue` 中的导航链接使用硬编码路径（如 `/news`），未通过 `localePath()` 处理国际化路由。

**已修复**：[`MobileMenu.vue`](../app/components/MobileMenu.vue:43) 现在使用 `const localePath = useLocalePath()` 并在所有链接中使用 `localePath()`。

### ✅ 1.5 `@nuxtjs/google-fonts` 残留

**原问题**：`package.json` 中残留 `@nuxtjs/google-fonts` 依赖，但实际已切换到 `@nuxt/fonts` 使用本地字体。

**已修复**：已从 `package.json` 中移除 `@nuxtjs/google-fonts`。

### ✅ 1.6 `useModalClickOutside` composable 重构

**原问题**：弹窗和菜单的状态管理逻辑分散在各组件中。

**已修复**：拆分为 [`useLoginModal.ts`](../app/composables/useLoginModal.ts) 和 [`useMobileMenu.ts`](../app/composables/useMobileMenu.ts) 两个专用 composable，使用 `useState` 实现跨组件状态共享。

### ✅ 1.7 凭据安全化

**原问题**：GitHub OAuth 凭据硬编码在 `nuxt.config.ts` 中。

**已修复**：
- 构建时通过 GitHub Secrets 注入（[`deploy.yml`](../.github/workflows/deploy.yml:47)）
- 运行时通过服务器 `/opt/bitfsae/.env` 文件加载
- Studio 认证从 `runtimeConfig.oauth` 迁移到 `studio.auth.github`（[`nuxt.config.ts`](../nuxt.config.ts:230)）

### ✅ 1.8 CI/CD 构建稳定性

**原问题**：GitHub Actions 构建时 sharp/libvips 导致 `munmap_chunk(): invalid pointer` 崩溃。

**已修复**：
- 安装 jemalloc 并通过 `LD_PRELOAD` 替代 glibc malloc（[`deploy.yml`](../.github/workflows/deploy.yml:30)）
- 预渲染排除 `_ipx` 路由（[`nuxt.config.ts`](../nuxt.config.ts:152)）
- 预渲染并发数设为 1，防止 SQLite 竞争（[`nuxt.config.ts`](../nuxt.config.ts:146)）

---

## 二、待处理的技术债

### ⬜ 2.1 重复的类型定义

**问题**：`NewsItem` 类型在多个文件中重复定义，字段不完全一致。

| 文件 | 类型名 | 用途 |
|------|--------|------|
| [`app/types/index.ts`](../app/types/index.ts) | `NewsItem` | 前端展示用 |
| [`app/types/api.ts`](../app/types/api.ts) | `NewsItem` | API 响应用 |
| [`app/types/content.ts`](../app/types/content.ts) | `NewsContent` | Content 层用 |

**建议**：
- 统一为一个基础 `NewsItem` 类型，通过 `Pick`/`Omit` 派生不同场景的子类型
- 或保留 `api.ts` 和 `content.ts`，删除 `index.ts` 中的 `NewsItem`

**优先级**：低（不影响功能，但增加维护成本）

### ⬜ 2.2 `global.css` 仍有未使用的样式

**文件**：[`app/assets/styles/global.css`](../app/assets/styles/global.css)

**现状**：已从 1584 行精简到约 1118 行，但仍可能存在从旧版单页面应用迁移过来的未使用样式。

**建议**：
1. 使用 PurgeCSS 或手动审查，识别未被引用的全局样式类
2. 将仍在使用的全局样式迁移到对应组件的 `<style scoped>` 中
3. 逐步减小 `global.css` 体积

**优先级**：低（不影响功能，但影响 CSS 体积）

### ⬜ 2.3 SQLite WASM 客户端 bundle 优化

**问题**：`@nuxt/content` v3 使用 SQLite 作为底层存储。在客户端导航时，浏览器需要加载 SQLite WASM 模块（`sql-wasm-*.wasm`），这会增加首次客户端导航的加载时间。

**影响**：
- WASM 文件约 300-400KB（gzip 后约 100KB）
- 首次客户端查询时需要初始化 WASM 运行时
- 对弱网环境（如移动端）影响较大

**可能的优化方向**：
1. **预加载 WASM**：在 `<link rel="preload">` 中提前加载 WASM 文件
2. **服务端优先**：尽量通过 API 路由在服务端查询内容，减少客户端 SQLite 使用
3. **关注上游更新**：Nuxt Content 团队可能在未来版本中优化客户端 bundle

**优先级**：中（影响用户体验，但需要等待上游支持）

### ⬜ 2.4 Tailwind CSS v4 sourcemap 警告

**现象**：构建时可能出现类似以下警告：

```
[WARNING] sourcemap 相关警告信息
```

**原因**：这是 `@tailwindcss/vite` 插件的已知上游问题，在 Tailwind CSS v4 的 Vite 集成中偶尔出现 sourcemap 生成不完整的情况。

**当前处理**：在 [`nuxt.config.ts`](../nuxt.config.ts:167) 中已设置 `css.devSourcemap: false` 来抑制开发环境的 sourcemap 警告。

```typescript
vite: {
  css: {
    devSourcemap: false  // 消除 @tailwindcss/vite sourcemap 警告
  }
}
```

**优先级**：低（不影响功能，等待上游修复）

---

## 三、改进建议

### 3.1 内容管理增强

| 建议 | 说明 | 优先级 |
|------|------|--------|
| 补充赞助商内容 | `content/sponsors/` 目录下尚无 Markdown 文件，schema 已定义但内容待补充 | 中 |
| 添加内容校验 CI | 在 GitHub Actions 中添加 Markdown lint 和 frontmatter 校验步骤 | 低 |
| 图片资源 CDN 化 | 将大图片迁移到 CDN（如阿里云 OSS），减轻服务器带宽压力 | 中 |

>   comment: Markdown lint 无需检验，frontmatter 需要校验。图床已经配置好（腾讯云COS+edgeone加速+本地picgo），网站图片尽量全部使用图床链接，需要向运营组同学强调强制使用，picgo配置联系网站作者。



### 3.2 性能优化

| 建议 | 说明 | 优先级 |
|------|------|--------|
| 关键 CSS 内联 | 将首屏关键 CSS 内联到 HTML 中，减少渲染阻塞 | 低 |
| 图片懒加载优化 | 确保非首屏图片使用 `loading="lazy"`，首屏图片使用 `fetchpriority="high"` | 中 |
| Service Worker 增强 | 当前 `public/sw.js` 为空文件，可实现离线缓存策略 | 低 |

### 3.3 开发体验

| 建议 | 说明 | 优先级 |
|------|------|--------|
| 添加 E2E 测试 | 使用 Playwright 或 Cypress 添加关键页面的端到端测试 | 中 |
| 组件文档 | 为 MDC 自定义组件（Center、MSpan 等）添加使用文档和示例 | 低 |
| 错误监控 | 集成 Sentry 或类似服务，监控生产环境运行时错误 | 中 |

>    comment: 给运营组的指南文档很紧急，这个需要单独一个文档 放在docs文件夹下，其中包括但不限于进入并使用studio可视化编辑，mdc-test.md参照 ，常见问题等。关于这个还要使用skill-creator或者类似skill  来create 一个 skill，创建新文案时使用， 依据项目代码和mdc-test.md示例 以规范用户输入的文本的格式 来输出 网站能够正常显示渲染的格式。

## 四、变更日志

| 日期 | 变更内容 |
|------|---------|
| 2026-02-10 | 全面更新文档，标记已解决的技术债，添加新的优化建议 |
| — | 初始版本：基于代码分析提出冗余代码清理计划和改进建议 |
