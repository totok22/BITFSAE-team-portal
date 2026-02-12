# Events Collection Schema

Source: `content.config.ts` → `events` collection

## Required Fields

```yaml
---
title: string        # Event name
date: string         # Format: YYYY.MM.DD
---
```

## Optional Fields

```yaml
---
location: string     # Event location
description: string  # Brief description
image: string        # Cover image (https://img.bitfsae.xin/img/...)
category: string     # e.g. 'competition'
tags: string[]       # Tag array
---
```

## Template

```markdown
---
title: 2025中国大学生方程式汽车大赛
date: 2025.11.20
location: 珠海国际赛车场
description: BITFSAE 车队参加 FSEC 2025 赛事
image: https://img.bitfsae.xin/img/event-cover.jpg
category: competition
---

赛事介绍正文...
```
