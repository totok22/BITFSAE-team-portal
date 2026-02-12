# Sponsors Collection Schema

Source: `content.config.ts` → `sponsors` collection

## Required Fields

```yaml
---
title: string        # Sponsor name
---
```

## Optional Fields

```yaml
---
category: string     # e.g. 'gold', 'silver', 'bronze'
logo: string         # Logo image (https://img.bitfsae.xin/img/...)
website: string      # Sponsor website URL
description: string  # Brief description
---
```

## Template

```markdown
---
title: 赞助商名称
category: gold
logo: https://img.bitfsae.xin/img/sponsor-logo.png
website: https://sponsor.com
description: 赞助商简介
---

赞助商详细介绍...
```
