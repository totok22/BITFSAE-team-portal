# News Collection Schema

Source: `content.config.ts` → `news` collection

## Required Fields

```yaml
---
title: string        # Article title
date: string         # Format: YYYY.MM.DD (e.g. 2026.02.08)
---
```

## Optional Fields

```yaml
---
description: string  # SEO description, shown in news list (default: '')
image: string        # Cover image URL (must be https://img.bitfsae.xin/img/...)
category: enum       # One of: news | people | event | other
source: string       # Content source (e.g. 'BITFSAE公众号')
link: string         # External URL (e.g. WeChat article link)
tags: string[]       # Tag array
---
```

## Category Meanings

| Value | Use for |
|---|---|
| `news` | Team news, announcements |
| `people` | Member stories, interviews |
| `event` | Competition reports |
| `other` | Website updates, misc |

## Templates

### WeChat Repost (most common)

```markdown
---
title: '文章标题'
date: '2026.01.12'
category: 'news'
description: '简短描述'
image: 'https://img.bitfsae.xin/img/cover.jpg'
source: 'BITFSAE公众号'
link: 'https://mp.weixin.qq.com/s/xxxxx'
---

[查看完整报道](https://mp.weixin.qq.com/s/xxxxx)
```

### People Story Repost

```markdown
---
title: '【人物】人物名称'
date: '2026.01.12'
category: 'people'
description: '人物故事简介'
image: 'https://img.bitfsae.xin/img/cover.jpg'
source: 'BITFSAE公众号'
link: 'https://mp.weixin.qq.com/s/xxxxx'
---

[查看完整报道](https://mp.weixin.qq.com/s/xxxxx)
```

### Original Article (full content on site)

```markdown
---
title: 文章标题
description: 简短描述
category: news
date: 2026.02.08
image: https://img.bitfsae.xin/img/cover.jpg
---

开头段落...

## 章节标题

正文内容...
```
