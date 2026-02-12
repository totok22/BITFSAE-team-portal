# Cars Collection Schema

Source: `content.config.ts` → `cars` collection

## Required Fields

```yaml
---
title: string        # Car name
year: string         # Season year (e.g. "2025")
model: string        # Model code (e.g. "E47")
---
```

## Optional Fields

```yaml
---
image: string        # Cover image (https://img.bitfsae.xin/img/...)
category: string     # e.g. 'electric'
specs: object        # Key-value specs (power, weight, etc.)
features: string[]   # Feature list
description: string  # Brief description
---
```

## Template

```markdown
---
title: E47 纯电动方程式赛车
year: "2025"
model: E47
image: https://img.bitfsae.xin/img/e47-cover.jpg
description: 2025赛季纯电动方程式赛车
specs:
  power: "80kW"
  weight: "280kg"
  wheelbase: "1600mm"
features:
  - 碳纤维单体壳车身
  - 自研电池管理系统
---

赛车介绍正文...
```
