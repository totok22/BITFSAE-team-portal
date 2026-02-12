---
title: MDC组件完整测试
description: 测试所有 MDC 组件的渲染效果，包括图片样式
category: news
date: 2026.02.08
image: https://img.bitfsae.xin/img/20260106143818204.jpg
---

# MDC 组件完整测试

本页面展示所有 Docus Prose MDC 组件的渲染效果。

## 文本样式

这是**粗体文本**，这是*斜体文本*，这是~~删除线文本~~。

行内代码示例：`const hello = 'world'`

## Badge 徽章

这是一个 :badge[新功能] 徽章，还有 :badge[v2.0]{color="success"} 版本徽章。

### 块级 Badge 间距示例

**方式一：使用 `&nbsp;` 空行分隔（推荐，简单直观）**

::badge{color="info" icon="i-lucide-languages"}
中英文双语
::

&nbsp;

::badge{color="success" icon="i-lucide-smartphone"}
响应式设计
::

**方式二：使用内联 badge 放在同一段落中（适合紧凑排列）**

:badge[中英文双语]{color="info" icon="i-lucide-languages"} :badge[响应式设计]{color="success" icon="i-lucide-smartphone"} :badge[高性能优化]{color="warning" icon="i-lucide-zap"}

## Card 卡片

::card{icon="i-lucide-car" title="赛车设计"}
北京理工大学方程式赛车队专注于设计和制造高性能电动方程式赛车，参加中国大学生方程式汽车大赛。
::

::card-group
  :::card{icon="i-lucide-settings" title="底盘设计"}
  负责赛车底盘结构设计与优化
  :::

  :::card{icon="i-lucide-zap" title="动力系统"}
  电机与电池管理系统开发
  :::

  :::card{icon="i-lucide-wind" title="空气动力学"}
  车身空气动力学仿真与测试
  :::
::

## Alert / Callout 提示框

::note
这是一个信息提示框，用于展示重要信息。
::

::tip
这是一个技巧提示框，分享有用的建议。
::

::warning
这是一个警告提示框，提醒用户注意事项。
::

::caution
这是一个危险提示框，警示严重问题。
::

## 图片展示多种方式

### 1. 标准 Markdown 图片

最基础的图片插入方式，适合文章正文插图。

![BITFSAE 赛车](https://img.bitfsae.xin/img/20260106143818204.jpg)

### 2. 带标题和链接的卡片图片

使用 `::card` 包裹图片，可以添加标题、图标和点击跳转链接。

::card{icon="i-lucide-camera" title="E07 赛车侧视图" to="/cars"}
![E07 Side View](https://img.bitfsae.xin/img/20260106143818204.jpg)
::

### 3. 双列图片并排

使用 `::card-group` 实现并排显示，适合对比展示。

::card-group{cols="2"}
  :::card
  ![左侧图片](https://img.bitfsae.xin/img/20260106143818204.jpg)
  :::

  :::card
  ![右侧图片](https://img.bitfsae.xin/img/20260106143818204.jpg)
  :::
::

### 4. 三列图片展示

适合展示图集或多角度照片。

::card-group{cols="3"}
  :::card
  ![角度1](https://img.bitfsae.xin/img/20260106143818204.jpg)
  :::

  :::card
  ![角度2](https://img.bitfsae.xin/img/20260106143818204.jpg)
  :::

  :::card
  ![角度3](https://img.bitfsae.xin/img/20260106143818204.jpg)
  :::
::

### 5. 图文混排

左图右文或上图下文的布局。

::card
  :::div{.flex.flex-col.md:flex-row.gap-4.items-center}
  ![](https://img.bitfsae.xin/img/20260106143818204.jpg){.w-full.md:w-1/2.rounded-lg}

    ::::div{.flex-1}
    ### 图片说明标题

    这里是对左侧图片的详细说明文字。使用 Flex 布局可以轻松实现响应式的图文混排效果。在移动端图片会在上方，桌面端在左侧。
    ::::
  :::
::

### 6. HTML ![]() 标签 (自定义控制)

如果需要更精细的控制（如宽度百分比），可以直接使用 HTML 标签。

![自定义样式图片](https://img.bitfsae.xin/img/20260106143818204.jpg){style="width: 120%; margin: 0 auto; display: block; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"}

## Tabs 选项卡

::tabs
  :::tabs-item{icon="i-lucide-pen-tool" label="设计"}
  ### 设计阶段

  使用CATIA和SolidWorks进行3D建模，通过ANSYS进行有限元分析。

  ```bash
  # 设计工作流
  建模 → 仿真 → 优化 → 验证
  ```
  :::

  :::tabs-item{icon="i-lucide-wrench" label="制造"}
  ### 制造阶段

  采用碳纤维复合材料和铝合金，使用CNC加工和3D打印技术。
  :::

  :::tabs-item{icon="i-lucide-activity" label="测试"}
  ### 测试阶段

  进行台架测试、动态测试和赛道验证。
  :::
::

## 代码块

### TypeScript 示例

```typescript
interface RaceCarConfig {
  power: number
  weight: number
  wheelbase: number
}

const e07Config: RaceCarConfig = {
  power: 80, // kW
  weight: 280, // kg
  wheelbase: 1600 // mm
}

function calculateAcceleration(config: RaceCarConfig): number {
  return config.power / config.weight
}
```

### Vue 组件示例

```vue
<template>
  <div class="race-car-dashboard">
    <h1>{{ carModel }}</h1>
    <div class="stats">
      <div class="stat">
        <span class="label">速度</span>
        <span class="value">{{ speed }} km/h</span>
      </div>
      <div class="stat">
        <span class="label">电池</span>
        <span class="value">{{ battery }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const carModel = ref('E07')
const speed = ref(0)
const battery = ref(100)
</script>
```

### 带文件名的代码块

```bash [terminal]
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## Steps 步骤

::steps
### 报名参赛

访问中国大学生方程式汽车大赛官网，提交报名信息。

### 设计制造

按照赛事规则设计和制造赛车，完成所有技术报告。

### 参加比赛

携带赛车前往比赛场地，参加静态和动态项目。
::

## Collapsible 折叠面板

::collapsible
| 参数          | 类型       | 说明       |
| ----------- | -------- | -------- |
| `power`     | `number` | 最大功率(kW) |
| `weight`    | `number` | 整车重量(kg) |
| `wheelbase` | `number` | 轴距(mm)   |
::

## 表格

| 赛季   | 赛车型号 | 总成绩  | 最佳单项    |
| ---- | ---- | ---- | ------- |
| 2023 | E07  | 第8名  | 高速避障第3名 |
| 2022 | E06  | 第12名 | 直线加速第5名 |
| 2021 | E05  | 第15名 | 耐久赛第7名  |

## 引用

> 速度不是一切，稳定性和可靠性同样重要。只有经过反复测试和优化的赛车，才能在赛场上发挥最佳性能。
>
> —— BITFSAE 技术总监

## 列表

### 无序列表

- 底盘组
  - 车架设计
  - 悬架系统
  - 制动系统
- 动力组
  - 电机选型
  - 电池管理
  - 电控系统
- 车身组
  - 空气动力学
  - 车身造型
  - 碳纤维制造

### 有序列表

1. 概念设计阶段
2. 详细设计阶段
3. 制造装配阶段
4. 测试优化阶段
5. 参赛准备阶段

## 图片画廊示例

::image-gallery{cols="3"}
![赛车研发](https://img.bitfsae.xin/img/20260106143818204.jpg)

![团队协作](https://img.bitfsae.xin/img/20260106143818204.jpg)

![赛场风采](https://img.bitfsae.xin/img/20260106143818204.jpg)

![冠军时刻](https://img.bitfsae.xin/img/20260106143818204.jpg)

![技术交流](https://img.bitfsae.xin/img/20260106143818204.jpg)

![赛车测试](https://img.bitfsae.xin/img/20260106143818204.jpg)
::

## 总结

以上展示了所有常用的 MDC 组件及其在车队网站中的应用场景。

---

## 高级样式测试

### 文本居中

::center
这段文字是居中对齐的，适用于标题、引用或特殊内容展示。
::

::center
![居中图片](https://img.bitfsae.xin/img/20260106143818204.jpg){width="400"}
::

### 字体颜色 (html 方式)

<span style="color:#ef4444;">红色文本</span> · <span style="color:#22c55e;">绿色文本</span> · <span style="color:#3b82f6;">蓝色文本</span> · <span style="color:#f97316;">橙色文本</span> · <span style="color:#a855f7;">紫色文本</span>

### 字体颜色 (MDC 方式)

:m-span[红色文本]{color="#ef4444"} · :m-span[绿色文本]{color="#22c55e"} · :m-span[蓝色文本]{color="#3b82f6"} · :m-span[橙色文本]{color="#f97316"} · :m-span[紫色文本]{color="#a855f7"}


### 背景颜色  (html 方式)

<span style="background:linear-gradient(120deg,#ffd700 0%,#ffec8b 100%);padding:2px 8px;border-radius:4px;color:#1a1a1a;">高亮文本</span>

<span style="background:rgba(59,130,246,.15);padding:2px 8px;border-radius:4px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:#2563eb;">代码风格</span>

### 背景颜色 (MDC 方式)

:m-span[高亮文本]{preset="highlight"}
:m-span[代码风格]{preset="code"}

### 字体大小  (html 方式)

<span style="font-size:.75rem;">小号字体</span> · <span style="font-size:1rem;">正常字体</span> · <span style="font-size:1.25rem;">大号字体</span> · <span style="font-size:1.5rem;">超大字体</span> · <span style="font-size:2rem;font-weight:700;">巨型字体</span>


### 字体大小 (MDC 方式)

:m-span[小号字体]{size="sm"} · :m-span[正常字体]{size="base"} · :m-span[大号字体]{size="lg"} · :m-span[超大字体]{size="xl"} · :m-span[巨型字体]{size="2xl" weight="700"}

### 组合样式  (html 方式)

<span style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:4px 12px;border-radius:6px;font-weight:600;font-size:.875rem;">重要提示</span>

<span style="background:#22c55e;color:#fff;padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:600;">成功状态</span>

### 组合样式 (MDC 方式)

:m-span[重要提示]{preset="important"}

:m-span[成功状态]{preset="success"}

### 高亮文本换行方法

MDC方式的高亮文本如果需要换行，有以下几种方法：

**方法1：使用多个 m-span 组件**

:m-span[这是第一行高亮文本]{preset="highlight"}
:m-span[这是第二行高亮文本]{preset="highlight"}

**方法2：使用 HTML br 标签配合 span**

<span style="background:linear-gradient(120deg,#ffd700 0%,#ffec8b 100%);padding:2px 8px;border-radius:4px;color:#1a1a1a;">这是第一行高亮文本<br>这是第二行高亮文本</span>

**方法3：使用多个 m-span 配合 display:block**

<div>
  <span style="display:block;background:linear-gradient(120deg,#ffd700 0%,#ffec8b 100%);padding:2px 8px;border-radius:4px;color:#1a1a1a;margin-bottom:4px;">第一行高亮文本</span>
  <span style="display:block;background:linear-gradient(120deg,#ffd700 0%,#ffec8b 100%);padding:2px 8px;border-radius:4px;color:#1a1a1a;">第二行高亮文本</span>
</div>

**方法4：使用自定义样式类（推荐用于多行）**

<div class="highlight-block">
  <p>第一行高亮内容</p>
  <p>第二行高亮内容</p>
</div>

<style>
.highlight-block {
  background: linear-gradient(120deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 236, 139, 0.2) 100%);
  border-left: 4px solid #ffd700;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  margin: 16px 0;
}
.highlight-block p {
  margin: 4px 0;
  color: var(--text-color);
}
.highlight-block p:first-child {
  margin-top: 0;
}
.highlight-block p:last-child {
  margin-bottom: 0;
}
</style>

### 左对齐 / 右对齐

### 左对齐 / 右对齐

::left
这段文字是左对齐的，适用于常规正文内容。
::

::right
这段文字是右对齐的，适用于日期、签名等。
::

### 数学公式（需要KaTeX支持）

行内公式：$E = mc^2$

块级公式：

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
