# <img src="https://img.bitfsae.xin/img/20260212221151299.svg" height="22" style="vertical-align: middle;" /> BITFSAE 门户网站

<p align="center">
  <strong>简体中文</strong> | <a href="./README.en.md">English</a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js" alt="Nuxt" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js" alt="Vue" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" /></a>
</p>

> 北京理工大学纯电动方程式赛车队门户网站

**线上地址**: [bitfsae.xin](https://bitfsae.xin)

## 项目简介

这是 BITFSAE（北京理工大学纯电动方程式赛车队）的门户网站，用于展示：

- 车队新闻动态与赛事报道
- 赛事信息与成绩
- 历代赛车技术参数
- 赞助商信息

项目支持中英文双语切换、深浅色主题，以及 SSR + ISR 混合渲染。

## 技术栈

| 分类 | 技术 |
|------|------|
| **框架** | Nuxt 4、Vue 3 + TypeScript |
| **内容管理** | Nuxt Content v3、Nuxt Studio |
| **UI** | Nuxt UI v4、Tailwind CSS v4 |
| **图片** | Nuxt Image + Sharp |
| **国际化** | @nuxtjs/i18n |
| **数学公式** | KaTeX (remark-math) |

## 快速开始

### 环境要求

- Node.js >= 22
- npm >= 10

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看网站。

### 构建生产版本

```bash
npm run build
npm run preview
```

## 项目结构

```text
bitfsae-nuxt/
├── app/                    # Nuxt 应用层
│   ├── components/         # Vue 组件
│   ├── pages/              # 页面路由
│   ├── layouts/            # 布局模板
│   └── assets/styles/      # 全局样式
├── content/                # Markdown 内容
│   ├── news/               # 新闻文章
│   ├── events/             # 赛事信息
│   └── cars/               # 赛车介绍
├── i18n/locales/           # 国际化翻译
├── public/                 # 静态资源
└── server/                 # 服务端 API
```

## 内容管理

内容使用 Markdown 格式存储在 `content/` 目录，支持 MDC 语法增强。

### 内容集合

| 集合 | 路径 | 说明 |
|------|------|------|
| 新闻 | `content/news/` | 车队新闻、人物故事 |
| 赛事 | `content/events/` | 赛事信息 |
| 赛车 | `content/cars/` | 历代赛车 |

## 国际化

项目支持中英文双语：

- `i18n/locales/zh.json` - 中文翻译
- `i18n/locales/en.json` - 英文翻译

## License

本项目基于 [MIT License](LICENSE) 开源。

## 致谢

感谢所有为 BITFSAE 车队做出贡献的成员和赞助商。

---

<p align="center">
  <strong>BITFSAE - 北京理工大学纯电动方程式赛车队</strong>
</p>
