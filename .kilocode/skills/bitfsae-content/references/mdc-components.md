# MDC Components Reference

Available MDC components in the BITFSAE website, derived from `content/news/mdc-test.md` and `app/components/content/`.

## Callouts

```markdown
::note
Info message.
::

::tip
Suggestion message.
::

::warning
Warning message.
::

::caution
Danger message.
::
```

## Cards

Single card:

```markdown
::card{icon="i-lucide-rocket" title="Title"}
Content text.
::
```

Card with link:

```markdown
::card{icon="i-lucide-camera" title="Title" to="/cars"}
![alt](https://img.bitfsae.xin/img/photo.jpg)
::
```

Card group (2-3 columns):

```markdown
::card-group{cols="2"}
  :::card{icon="i-lucide-settings" title="Card 1"}
  Content 1
  :::

  :::card{icon="i-lucide-zap" title="Card 2"}
  Content 2
  :::
::
```

## Badges

Inline: `:badge[Label]{color="success"}`

Colors: `info`, `success`, `warning`, `primary`, `neutral`

Block badges (separate with `&nbsp;`):

```markdown
::badge{color="info" icon="i-lucide-languages"}
Label text
::

&nbsp;

::badge{color="success" icon="i-lucide-smartphone"}
Another label
::
```

## Tabs

```markdown
::tabs
  :::tabs-item{icon="i-lucide-pen-tool" label="Tab 1"}
  Tab 1 content...
  :::

  :::tabs-item{icon="i-lucide-wrench" label="Tab 2"}
  Tab 2 content...
  :::
::
```

## Steps

```markdown
::steps
### Step Title 1

Step 1 description.

### Step Title 2

Step 2 description.
::
```

## Collapsible

```markdown
::collapsible
Hidden content revealed on click.
::
```

## Image Gallery

```markdown
::image-gallery{cols="3"}
![Caption 1](https://img.bitfsae.xin/img/photo1.jpg)

![Caption 2](https://img.bitfsae.xin/img/photo2.jpg)

![Caption 3](https://img.bitfsae.xin/img/photo3.jpg)
::
```

Note: Images inside `::image-gallery` must be separated by blank lines.

## Text Alignment (custom components)

```markdown
::center
Centered text or image.
::

::left
Left-aligned block.
::

::right
Right-aligned block (dates, signatures).
::
```

## Colored Text (MSpan)

```markdown
:m-span[Red text]{color="#ef4444"}
:m-span[Green text]{color="#22c55e"}
:m-span[Blue text]{color="#3b82f6"}
```

Presets:

```markdown
:m-span[Highlight]{preset="highlight"}
:m-span[Code style]{preset="code"}
:m-span[Important]{preset="important"}
:m-span[Success]{preset="success"}
```

Sizes: `sm`, `base`, `lg`, `xl`, `2xl`

```markdown
:m-span[Large bold]{size="xl" weight="700"}
```

## Image Styling

Custom width/style on images:

```markdown
![alt](https://img.bitfsae.xin/img/photo.jpg){style="width: 120%; border-radius: 12px;"}
```

Centered image with width:

```markdown
::center
![alt](https://img.bitfsae.xin/img/photo.jpg){width="400"}
::
```

## Nesting Depth

| Depth | Colons | Example |
|---|---|---|
| 1 | `::` | `::card` ... `::` |
| 2 | `:::` | `:::card` ... `:::` (inside a `::card-group`) |
| 3 | `::::` | `::::div` ... `::::` (inside depth-2 component) |

Each nesting level adds one colon to both opening and closing markers.
