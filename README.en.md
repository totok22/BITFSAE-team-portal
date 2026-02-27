# <img src="https://img.bitfsae.xin/img/20260212221151299.svg" height="22" style="vertical-align: middle;" /> BITFSAE Portal Website

<p align="center">
  <a href="./README.md">简体中文</a> | <strong>English</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js" alt="Nuxt" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js" alt="Vue" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" /></a>
</p>

> Official portal website of the BIT Formula SAE Electric Team at Beijing Institute of Technology.

**Website**: [bitfsae.xin](https://bitfsae.xin)

## Overview

This repository hosts the official BITFSAE portal website. It is used to present:

- Team news and race reports
- Event information and results
- Technical data of race cars from different seasons
- Sponsor information

The project supports bilingual content (Chinese and English), light/dark themes, and hybrid rendering with SSR + ISR.

## Tech Stack

| Category | Technology |
|------|------|
| **Framework** | Nuxt 4, Vue 3 + TypeScript |
| **Content Management** | Nuxt Content v3, Nuxt Studio |
| **UI** | Nuxt UI v4, Tailwind CSS v4 |
| **Image Processing** | Nuxt Image + Sharp |
| **i18n** | @nuxtjs/i18n |
| **Math Rendering** | KaTeX (remark-math) |

## Quick Start

### Requirements

- Node.js >= 22
- npm >= 10

### Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```text
bitfsae-nuxt/
├── app/                    # Nuxt application layer
│   ├── components/         # Vue components
│   ├── pages/              # Route pages
│   ├── layouts/            # Layout templates
│   └── assets/styles/      # Global styles
├── content/                # Markdown content
│   ├── news/               # News posts
│   ├── events/             # Event pages
│   └── cars/               # Car profiles
├── i18n/locales/           # Translation files
├── public/                 # Static assets
└── server/                 # Server API routes
```

## Content Management

Content files are stored in the `content/` directory in Markdown format with MDC syntax support.

### Content Collections

| Collection | Path | Description |
|------|------|------|
| News | `content/news/` | Team news and stories |
| Events | `content/events/` | Event information |
| Cars | `content/cars/` | Historical race cars |

## Internationalization

This project provides bilingual support:

- `i18n/locales/zh.json` - Chinese translations
- `i18n/locales/en.json` - English translations

## License

This project is open-sourced under the [MIT License](LICENSE).

## Acknowledgements

Thanks to every BITFSAE member and sponsor who contributes to the team.

---

<p align="center">
  <strong>BITFSAE - Beijing Institute of Technology Formula SAE Electric Team</strong>
</p>
