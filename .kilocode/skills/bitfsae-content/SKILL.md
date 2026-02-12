---
name: bitfsae-content
description: "Use when creating or editing content files for the BITFSAE website (content/news/*.md, content/events/*.md, content/cars/*.md, content/sponsors/*.md). Ensures correct frontmatter schema, MDC component syntax, image URL format, and file naming conventions so the output renders correctly on the Nuxt Content site. Trigger on: writing news articles, event pages, car profiles, sponsor entries, or any Markdown destined for the content/ directory."
---

# BITFSAE Content Writer

Generates Markdown files that render correctly on the BITFSAE Nuxt Content v3 website.

## When to Use

- Creating new content files under `content/`
- Editing existing content Markdown
- Converting external text (e.g. WeChat articles) into site-compatible format

## File Naming

- Lowercase English, words separated by `-`
- Extension: `.md`
- Examples: `website-launch-2026.md`, `fsec-2025.md`

## Frontmatter Schemas

Load the reference for the target collection:

| Collection | Path pattern | Reference |
|---|---|---|
| news | `content/news/*.md` | [references/news-schema.md](references/news-schema.md) |
| events | `content/events/*.md` | [references/events-schema.md](references/events-schema.md) |
| cars | `content/cars/*.md` | [references/cars-schema.md](references/cars-schema.md) |
| sponsors | `content/sponsors/*.md` | [references/sponsors-schema.md](references/sponsors-schema.md) |

Always load the matching schema reference before generating content.

## Image Rules

- **All images MUST use the CDN URL**: `https://img.bitfsae.xin/img/<filename>`
- Never use relative paths or commit images to the repo
- Markdown syntax: `![alt text](https://img.bitfsae.xin/img/filename.jpg)`

## MDC Components Quick Reference

Load [references/mdc-components.md](references/mdc-components.md) when using any MDC component.

### Available Components

| Component | Syntax | Use for |
|---|---|---|
| Note | `::note` | Info callout |
| Tip | `::tip` | Suggestion |
| Warning | `::warning` | Caution |
| Caution | `::caution` | Danger |
| Card | `::card{icon title}` | Featured content block |
| Card Group | `::card-group{cols}` | Multi-column cards |
| Badge (inline) | `:badge[text]{color}` | Tags, labels |
| Badge (block) | `::badge{color icon}` | Prominent labels (separate with `&nbsp;`) |
| Tabs | `::tabs` + `:::tabs-item{label}` | Tabbed content |
| Steps | `::steps` + `### Step` | Sequential instructions |
| Collapsible | `::collapsible` | Expandable details |
| Image Gallery | `::image-gallery{cols}` | Photo grids |
| Center | `::center` | Centered text/images |
| Left | `::left` | Left-aligned block |
| Right | `::right` | Right-aligned block |
| MSpan | `:m-span[text]{color size preset}` | Colored/styled inline text |

### MDC Nesting Rules

- Level 1: `::component` / `::`
- Level 2 (inside level 1): `:::component` / `:::`
- Level 3 (inside level 2): `::::component` / `::::`
- Each deeper nesting adds one more `:`

## Output Checklist

Before finalizing any content file, verify:

- [ ] Frontmatter has all required fields for the collection
- [ ] `date` format is `YYYY.MM.DD` (e.g. `2026.02.08`)
- [ ] `image` uses `https://img.bitfsae.xin/img/` prefix
- [ ] All body images use CDN URLs
- [ ] MDC components are properly opened and closed
- [ ] Nesting levels use correct colon counts
- [ ] File name is lowercase English with `-` separators
