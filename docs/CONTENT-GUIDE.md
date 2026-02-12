# 运营组内容编辑指南

> 本文档面向 BITFSAE 车队运营组成员，指导如何在网站上发布和编辑新闻、赛事等内容。

---

## 一、快速开始

### 1.1 两种编辑方式

| 方式 | 适用场景 | 技术要求 |
|------|---------|---------|
| **Nuxt Studio 可视化编辑** | 日常内容更新、简单文案修改 | 无需编程基础 |
| **直接编辑 Markdown 文件** | 需要使用高级 MDC 组件、复杂排版 | 了解基本 Markdown 语法 |

推荐运营组同学优先使用 Nuxt Studio 可视化编辑，简单直观。

---

## 二、使用 Nuxt Studio 可视化编辑

### 2.1 访问 Studio

1. 打开浏览器，访问 [https://bitfsae.xin/_studio](https://bitfsae.xin/_studio)
2. 使用你的 GitHub 账号登录，联系网站管理员将你的 GitHub 账号添加为仓库协作者
3. 首次登录需要授权 Nuxt Studio 访问仓库
4. 点击左下角按钮进入编辑界面

### 2.2 编辑内容

1. 左侧文件树中，展开 `content/` 目录
2. 根据内容类型选择对应文件夹：
   - `content/news/` — 新闻、人物故事、赛事报道
   - `content/events/` — 赛事活动
   - `content/cars/` — 赛车介绍
   - `content/sponsors/` — 赞助商信息
3. 点击已有文件可直接编辑，或点击 **New file** 创建新文件
4. Studio 提供所见即所得的编辑器，支持富文本编辑
5. 编辑完成后点击 **Save** 保存，Studio 会自动提交到 GitHub 仓库

### 2.3 预览与发布

- Studio 编辑器右侧有实时预览面板
- 保存后内容会自动触发 GitHub Actions 构建部署
- 部署通常需要 3-5 分钟，之后即可在 [https://bitfsae.xin](https://bitfsae.xin) 看到更新

---

## 三、内容文件格式规范

### 3.1 文件命名

- 使用**英文小写字母**，单词之间用 `-` 连接
- 文件扩展名为 `.md`
- 示例：`website-launch-2026.md`、`battery-box-story.md`、`fsec-2025.md`

### 3.2 Frontmatter（文件头信息）

每个 Markdown 文件开头必须包含 `---` 包裹的元数据区域，这是文章的基本信息。

#### 新闻文章 (`content/news/*.md`)

```yaml
---
title: 文章标题
description: 文章简短描述（用于 SEO 和列表预览，建议不超过 100 字）
category: news
date: 2026.02.08
image: https://img.bitfsae.xin/img/你的图片文件名.jpg
source: 来源名称（可选，如"BITFSAE公众号"）
link: 外部链接（可选，如微信公众号原文链接）
tags:
  - 标签1
  - 标签2  （可选）
---
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 发布日期，格式为 `YYYY.MM.DD`（如 `2026.02.08`） |
| `description` | 建议填写 | 文章摘要，影响 SEO 和列表页展示 |
| `category` | 建议填写 | 分类：`news`（新闻）、`people`（人物）、`event`（赛事）、`other`（其他） |
| `image` | 建议填写 | 封面图 URL，**必须使用图床链接**（见下方图片规范） |
| `source` | 可选 | 内容来源 |
| `link` | 可选 | 外部原文链接（如微信公众号文章） |
| `tags` | 可选 | 标签数组 |

#### 赛事活动 (`content/events/*.md`)

```yaml
---
title: 赛事名称
date: 2025.11.20
location: 比赛地点
description: 赛事简介
image: https://img.bitfsae.xin/img/图片.jpg
category: competition
---
```

#### 赛车介绍 (`content/cars/*.md`)

```yaml
---
title: 赛车名称
year: "2025"
model: E47
image: https://img.bitfsae.xin/img/图片.jpg
description: 赛车简介
---
```

### 3.3 图片使用规范

> ⚠️ **重要：网站图片必须全部使用图床链接，禁止上传到仓库！**

- 图床地址格式：`https://img.bitfsae.xin/img/文件名.jpg`
- 使用 PicGo 工具上传图片到腾讯云 COS，自动获取图床链接
- PicGo 配置请联系网站管理员获取
- 图片建议：
  - 封面图宽度建议 ≥ 1200px
  - 格式优先使用 `.jpg` 或 `.webp`，或者其他常用格式。
  - 文件大小控制在 500KB 以内，不要超过1MB。可用[https://docsmall.com/image-compress](https://docsmall.com/image-compress)在线压缩图片

---

## 四、正文内容编写

### 4.1 基础 Markdown 语法

```markdown
# 一级标题（文章中一般不用，frontmatter 的 title 就是标题）
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*
~~删除线文本~~

- 无序列表项
- 无序列表项

1. 有序列表项
2. 有序列表项

> 引用文本

[链接文字](https://example.com)

![图片描述](https://img.bitfsae.xin/img/图片.jpg)
```

### 4.2 MDC 组件（增强排版）

MDC（Markdown Components）是本网站支持的增强语法，可以在 Markdown 中使用丰富的 UI 组件。

#### 提示框

```markdown
::note
这是一条信息提示。
::

::tip
这是一条建议提示。
::

::warning
这是一条警告提示。
::

::caution
这是一条危险提示。
::
```

#### 卡片

```markdown
::card{icon="i-lucide-rocket" title="卡片标题"}
卡片内容文字。
::
```

多个卡片并排：

```markdown
::card-group
  :::card{icon="i-lucide-settings" title="卡片1"}
  内容1
  :::

  :::card{icon="i-lucide-zap" title="卡片2"}
  内容2
  :::
::
```

#### 徽章

行内徽章：

```markdown
:badge[标签文字]{color="success"}
```

可用颜色：`info`、`success`、`warning`、`primary`、`neutral`

块级徽章（多个之间用 `&nbsp;` 分隔）：

```markdown
::badge{color="info" icon="i-lucide-languages"}
中英文双语
::

&nbsp;

::badge{color="success" icon="i-lucide-smartphone"}
响应式设计
::
```

#### 图片展示

标准图片：

```markdown
![图片描述](https://img.bitfsae.xin/img/图片.jpg)
```

卡片包裹图片（带标题和链接）：

```markdown
::card{icon="i-lucide-camera" title="图片标题" to="/cars"}
![图片描述](https://img.bitfsae.xin/img/图片.jpg)
::
```

两列图片对比：

```markdown
::card-group{cols="2"}
  :::card
  ![左侧图片](https://img.bitfsae.xin/img/图片1.jpg)
  :::

  :::card
  ![右侧图片](https://img.bitfsae.xin/img/图片2.jpg)
  :::
::
```

三列图片画廊：

```markdown
::card-group{cols="3"}
  :::card
  ![角度1](https://img.bitfsae.xin/img/图片1.jpg)
  :::

  :::card
  ![角度2](https://img.bitfsae.xin/img/图片2.jpg)
  :::

  :::card
  ![角度3](https://img.bitfsae.xin/img/图片3.jpg)
  :::
::
```

图片画廊组件（推荐用于多图展示）：

```markdown
::image-gallery{cols="3"}
![图片1](https://img.bitfsae.xin/img/图片1.jpg)

![图片2](https://img.bitfsae.xin/img/图片2.jpg)

![图片3](https://img.bitfsae.xin/img/图片3.jpg)
::
```

#### 选项卡

```markdown
::tabs
  :::tabs-item{icon="i-lucide-pen-tool" label="设计"}
  设计阶段的内容...
  :::

  :::tabs-item{icon="i-lucide-wrench" label="制造"}
  制造阶段的内容...
  :::
::
```

#### 步骤

```markdown
::steps
### 第一步标题

第一步的说明文字。

### 第二步标题

第二步的说明文字。

### 第三步标题

第三步的说明文字。
::
```

#### 折叠面板

```markdown
::collapsible
这里是可以折叠/展开的内容。
::
```

#### 文本对齐

```markdown
::center
居中对齐的文字
::

::left
左对齐的文字
::

::right
右对齐的文字（适合日期、签名等）
::
```

#### 彩色文本（MDC 方式）

```markdown
:m-span[红色文本]{color="#ef4444"}
:m-span[绿色文本]{color="#22c55e"}
:m-span[蓝色文本]{color="#3b82f6"}
```

预设样式：

```markdown
:m-span[高亮文本]{preset="highlight"}
:m-span[代码风格]{preset="code"}
:m-span[重要提示]{preset="important"}
:m-span[成功状态]{preset="success"}
```

字体大小：

```markdown
:m-span[小号字体]{size="sm"}
:m-span[正常字体]{size="base"}
:m-span[大号字体]{size="lg"}
:m-span[超大字体]{size="xl"}
```

---

## 五、常见内容模板

### 5.1 微信公众号文章转载

大部分新闻是从微信公众号转载的，只需要填写 frontmatter 和一个链接即可：

```markdown
---
title: '文章标题'
date: '2026.01.12'
category: 'news'
description: '文章简短描述'
image: 'https://img.bitfsae.xin/img/封面图.jpg'
source: 'BITFSAE公众号'
link: 'https://mp.weixin.qq.com/s/xxxxxx'
---

[查看完整报道](https://mp.weixin.qq.com/s/xxxxxx)
```

### 5.2 人物故事

```markdown
---
title: '【人物】人物名称和标题'
date: '2026.01.12'
category: 'people'
description: '人物故事简介'
image: 'https://img.bitfsae.xin/img/封面图.jpg'
source: 'BITFSAE公众号'
link: 'https://mp.weixin.qq.com/s/xxxxxx'
---

[查看完整报道](https://mp.weixin.qq.com/s/xxxxxx)
```

### 5.3 原创长文（在网站上直接展示全文）

```markdown
---
title: 文章标题
description: 文章简短描述
category: news
date: 2026.02.08
image: https://img.bitfsae.xin/img/封面图.jpg
---

开头引言段落，简要介绍文章主题。

::note
重要信息或背景说明。
::

## 第一部分标题

正文内容...

![配图描述](https://img.bitfsae.xin/img/配图.jpg)

## 第二部分标题

正文内容...

::tip
有用的补充信息。
::

## 总结

总结段落。
```

---

## 六、常见问题

### Q1：文件保存后网站没有更新？

- 检查 GitHub Actions 是否正常运行（访问仓库的 Actions 页面）
- 部署通常需要 3-5 分钟，请耐心等待
- 如果构建失败，联系网站管理员查看错误日志

### Q2：图片不显示？

- 确认使用的是图床链接（`https://img.bitfsae.xin/img/...`）
- 确认图片已成功上传到图床
- 检查链接是否有拼写错误
- 不要使用本地路径或仓库内的图片路径

### Q3：MDC 组件没有正确渲染？

- 检查 `::` 标记是否成对出现（开头 `::组件名` 和结尾 `::` 必须匹配）
- 嵌套组件需要增加冒号数量（外层 `::` 两个，内层 `:::` 三个，再内层 `::::` 四个）
- 组件名和 `{` 之间不要有空格：`::card{title="标题"}` ✅，`::card {title="标题"}` ❌
- 属性值如果包含空格，需要用引号包裹

### Q4：Frontmatter 格式报错？

- 确保 `---` 前后没有多余空格
- 字段值如果包含特殊字符（如 `:`、`|`、`#`），需要用引号包裹
- 日期格式统一使用 `YYYY.MM.DD`
- 注意 YAML 缩进使用空格，不要用 Tab

### Q5：如何在 Studio 中创建新文件？

1. 在左侧文件树中导航到目标文件夹（如 `content/news/`）
2. 点击文件夹旁的 **+** 按钮或右键选择 **New file**
3. 输入文件名（如 `my-new-article.md`）
4. 在编辑器中填写 frontmatter 和正文内容

### Q6：category 分类怎么选？

| 分类值 | 含义 | 使用场景 |
|--------|------|---------|
| `news` | 新闻 | 车队动态、技术进展、获奖消息 |
| `people` | 人物 | 成员故事、人物专访 |
| `event` | 赛事 | 比赛报道、赛事日程 |
| `other` | 其他 | 网站公告、其他不属于以上分类的内容 |

### Q7：如何使用 PicGo 上传图片？

1. 下载安装 PicGo：[https://molunerfinn.com/PicGo/](https://molunerfinn.com/PicGo/)
2. 联系网站管理员获取腾讯云 COS 配置信息
3. 在 PicGo 中配置腾讯云 COS 图床
4. 拖拽或粘贴图片即可上传，自动复制图床链接到剪贴板
5. 将链接粘贴到 Markdown 文件中使用

---

## 七、注意事项

1. **图片必须使用图床**：所有图片通过 PicGo 上传到腾讯云 COS，使用 `https://img.bitfsae.xin/img/` 开头的链接
2. **文件名用英文**：Markdown 文件名只用英文小写字母和 `-`，不要用中文
3. **及时填写 description**：影响搜索引擎收录和列表页展示效果
4. **封面图很重要**：`image` 字段的封面图会在新闻列表页显示，建议每篇文章都配一张
5. **保存前预览**：在 Studio 中编辑时注意右侧预览效果，确认无误再保存
6. **不确定就问**：遇到任何问题，及时联系网站管理员

---

## 八、参考资料

- MDC 组件完整示例：查看仓库中的 `content/news/mdc-test.md` 文件
- Nuxt Studio 官方文档：[https://nuxt.studio/introduction](https://nuxt.studio/introduction)
- Markdown 基础语法：[https://www.markdownguide.org/basic-syntax/](https://www.markdownguide.org/basic-syntax/)
