# BITFSAE 官方网站

> 北京理工大学纯电动方程式赛车队（BITFSAE）官网，基于 Nuxt 4 + Nuxt Content v3 构建。

## 项目简介

本项目用于展示车队新闻动态、赛事介绍、历代赛车与赞助信息，支持中英文双语与深浅色主题。网站采用 SSR + ISR 混合渲染策略，通过 Nuxt Studio 提供可视化内容编辑能力。

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Nuxt 4、Vue 3 + TypeScript |
| 内容管理 | @nuxt/content v3（Markdown + MDC）、nuxt-studio（可视化编辑） |
| UI 组件 | @nuxt/ui v4、@nuxt/icon、@formkit/auto-animate |
| 样式 | Tailwind CSS v4、@tailwindcss/typography |
| 图片处理 | @nuxt/image + sharp（服务端图片优化） |
| 国际化 | @nuxtjs/i18n（中/英双语） |
| SEO | @nuxtjs/seo |
| 字体 | @nuxt/fonts（Inter + Outfit） |
| 数学公式 | remark-math + rehype-katex |
| 部署 | PM2（cluster 模式）、GitHub Actions CI/CD |

## 快速开始

### 环境要求

- Node.js >= 22
- npm >= 10

### 安装与开发

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3000`

### 构建与预览

```bash
npm run build
npm run preview
```

## 环境变量配置

项目使用环境变量管理敏感凭据和运行时配置。**不要将真实凭据提交到代码仓库。**

### `.env` 文件模板

在项目根目录创建 `.env` 文件（已被 `.gitignore` 忽略）：

```bash
# ===== Nuxt Studio 构建时变量 =====
# 设为 'true' 时构建产物包含 nuxt-studio 模块
NUXT_STUDIO=true

# ===== Nuxt Studio GitHub OAuth =====
# nuxt-studio 模块使用 STUDIO_ 前缀读取
STUDIO_GITHUB_CLIENT_ID=你的_GitHub_OAuth_App_Client_ID
STUDIO_GITHUB_CLIENT_SECRET=你的_GitHub_OAuth_App_Client_Secret
STUDIO_GITHUB_REDIRECT_URL=https://你的域名/__nuxt_studio/auth/github

# ===== 站点 URL =====
NUXT_PUBLIC_SITE_URL=https://bitfsae.xin
```

### 开发环境 vs 生产环境

| 变量 | 开发环境 | 生产环境（构建时） | 生产环境（运行时） |
|------|---------|-------------------|-------------------|
| `NUXT_STUDIO` | 可选 | `true`（deploy.yml） | ⚠️ **不要设置**（见下方说明） |
| `STUDIO_GITHUB_CLIENT_ID` | 可选 | GitHub Secrets | 服务器 `.env` |
| `STUDIO_GITHUB_CLIENT_SECRET` | 可选 | GitHub Secrets | 服务器 `.env` |
| `NUXT_PUBLIC_SITE_URL` | 不需要 | 不需要 | `ecosystem.config.cjs` |

> **⚠️ 重要：** 运行时不要设置 `NUXT_STUDIO` 环境变量。Nuxt 会将 `NUXT_` 前缀的环境变量自动映射到 `runtimeConfig`，`NUXT_STUDIO='true'` 会把 `runtimeConfig.studio` 对象覆盖为字符串 `'true'`，导致 `studio.repository.private` 等配置读取失败。`NUXT_STUDIO` 仅在构建时用于条件加载 `nuxt-studio` 模块。

## Nuxt Studio 使用说明

[Nuxt Studio](https://nuxt.studio) 为运营团队提供可视化内容编辑界面，无需直接修改代码即可管理网站内容。

### 认证流程

1. 访问 `https://你的域名/__nuxt_studio/` 进入 Studio 界面
2. 点击 GitHub 登录，通过 OAuth 完成身份验证
3. 认证成功后即可在线编辑 Markdown 内容

### 配置位置

- 模块条件加载：[`nuxt.config.ts`](nuxt.config.ts:8)（`NUXT_STUDIO` 环境变量控制）
- Studio 配置块：[`nuxt.config.ts`](nuxt.config.ts:220)（`studio.auth.github` 认证配置）
- OAuth 凭据：构建时通过 GitHub Secrets 注入，运行时通过服务器 `.env` 文件加载

## 内容目录

| 集合 | 路径 | 说明 |
|------|------|------|
| 新闻 | `content/news/` | 车队新闻、人物故事、赛事报道 |
| 赛事 | `content/events/` | 赛事信息与介绍 |
| 赛车 | `content/cars/` | 历代赛车技术参数与介绍 |
| 赞助商 | `content/sponsors/` | 赞助商信息（schema 已定义，内容待补充） |

内容集合的 schema 定义见 [`content.config.ts`](content.config.ts)。

## 项目结构

```
bitfsae-nuxt/
├── app/                    # Nuxt 应用层
│   ├── components/         # Vue 组件
│   │   └── content/        # MDC 自定义组件
│   ├── composables/        # 组合式函数
│   ├── layouts/            # 布局模板
│   ├── pages/              # 页面路由
│   ├── plugins/            # 插件（SEO 等）
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   └── assets/styles/      # 全局样式
├── content/                # Markdown 内容文件
├── i18n/locales/           # 国际化翻译文件（zh.json / en.json）
├── server/                 # 服务端 API 路由
├── public/                 # 静态资源
├── docs/                   # 项目文档
├── .github/workflows/      # CI/CD 工作流
├── nuxt.config.ts          # Nuxt 主配置
├── content.config.ts       # 内容集合定义
├── ecosystem.config.cjs    # PM2 部署配置
└── tailwind.config.ts      # Tailwind CSS 配置
```

## 文档导航

| 文档 | 说明 |
|------|------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | 架构说明：模块配置、认证流程、缓存策略 |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | 部署文档：CI/CD 流程、服务器配置、环境变量 |
| [`docs/SUGGESTIONS.md`](docs/SUGGESTIONS.md) | 优化建议：技术债清单、性能优化方向 |

## 常见问题（FAQ）

### Q: 本地开发时 Nuxt Content 数据库异常怎么办？

停止 dev 进程，清理缓存目录后重启：

```bash
# Windows
rmdir /s /q .nuxt .data .nitro
# macOS / Linux
rm -rf .nuxt .data .nitro

npm run dev
```

### Q：如何推到github而不触发CI部署
可以在commit信息中加入 [ci skip] 或 [skip ci] 来跳过CI部署，例如：
```
git commit -m "更新文档 [skip ci]"
```
### Studio 显示 "content differs"

原因是：Nuxt Content v3 在构建时会对 Markdown 进行解析和规范化处理（通过 remark/rehype 管道），解析后的 AST 再序列化回 Markdown 时，空行数量、行位置等可能与原始文件不同。Studio 对比的是 GitHub 上的原始 .md 文件和网站上已解析/渲染的版本，两者在格式上会有差异。这是 Nuxt Content 的已知行为，不影响实际渲染效果。

### Q: 构建时出现 `munmap_chunk(): invalid pointer` 崩溃？

这是 sharp/libvips 的 native 内存管理与 glibc 默认分配器冲突导致的。CI 中已通过安装 jemalloc 并设置 `LD_PRELOAD` 解决。本地 Linux 环境如遇此问题，可参考 [部署文档](docs/DEPLOYMENT.md) 中的 jemalloc 说明。

### Q: 为什么运行时不能设置 `NUXT_STUDIO` 环境变量？

Nuxt 会将所有 `NUXT_` 前缀的环境变量映射到 `runtimeConfig`。设置 `NUXT_STUDIO='true'` 会把 `runtimeConfig.studio` 从对象覆盖为字符串 `'true'`，导致 Studio 认证配置（如 `studio.auth.github`）读取失败。该变量仅在构建时用于条件加载 `nuxt-studio` 模块。

### Q: 预渲染时 `_ipx` 路由报错？

`_ipx` 是 `@nuxt/image` 的动态图片处理路由，不应被预渲染。已在 [`nuxt.config.ts`](nuxt.config.ts:152) 的 `nitro.prerender.ignore` 中排除。

### Q: Tailwind CSS 构建时出现 sourcemap 警告？

这是已知的上游问题，不影响功能。详见 [`docs/SUGGESTIONS.md`](docs/SUGGESTIONS.md)。
