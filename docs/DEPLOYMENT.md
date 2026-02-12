# 部署与环境配置文档

> 本文档描述 BITFSAE 官网的 CI/CD 流程、服务器部署配置和环境变量管理。

## 目录

- [CI/CD 流程概览](#cicd-流程概览)
- [GitHub Actions 工作流详解](#github-actions-工作流详解)
- [GitHub Secrets 配置清单](#github-secrets-配置清单)
- [服务器环境配置](#服务器环境配置)
- [PM2 部署配置](#pm2-部署配置)
- [jemalloc 说明](#jemalloc-说明)
- [`_ipx` 路由排除说明](#_ipx-路由排除说明)
- [环境变量加载机制](#环境变量加载机制)
- [故障排查](#故障排查)

---

## CI/CD 流程概览

项目使用 GitHub Actions 实现自动化部署，工作流定义在 [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)。

### 触发条件

- `main` 分支推送时自动触发
- 支持手动触发（`workflow_dispatch`）

### 完整流程

```
推送到 main 分支
    │
    ▼
┌─────────────────────────────┐
│  1. Checkout 代码            │
│  2. Setup Node.js 22        │
│  3. npm ci                  │
│  4. 安装 sharp (linux/x64)  │
│  5. 安装 jemalloc           │
│  6. npm run build           │
│     (注入环境变量)           │
│  7. 打包 .output + PM2 配置  │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  8. SCP 上传到服务器 /tmp/   │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  9. SSH 登录服务器           │
│ 10. 清理旧 .output          │
│ 11. 解压新构建产物           │
│ 12. PM2 delete + start      │
│     (重新加载 .env)          │
└─────────────────────────────┘
```

---

## GitHub Actions 工作流详解

### 依赖安装

```yaml
- name: Install dependencies
  run: |
    npm ci
    npm install --platform=linux --arch=x64 sharp
```

`npm ci` 使用 lockfile 精确安装依赖。由于 CI 环境为 Linux 而开发环境可能为 Windows/macOS，需要额外安装 Linux 平台的 sharp 原生二进制。

### jemalloc 安装

```yaml
- name: Install jemalloc
  run: |
    sudo apt-get update -qq
    sudo apt-get install -y -qq libjemalloc2 > /dev/null 2>&1
```

详见下方 [jemalloc 说明](#jemalloc-说明)。

### 构建步骤

```yaml
- name: Build Project
  run: npm run build
  env:
    NUXT_STUDIO: 'true'
    NODE_ENV: production
    NODE_OPTIONS: '--max-old-space-size=6144 --no-node-snapshot'
    VIPS_WARNING: '0'
    LD_PRELOAD: /usr/lib/x86_64-linux-gnu/libjemalloc.so.2
    STUDIO_GITHUB_CLIENT_ID: ${{ secrets.STUDIO_GITHUB_CLIENT_ID }}
    STUDIO_GITHUB_CLIENT_SECRET: ${{ secrets.STUDIO_GITHUB_CLIENT_SECRET }}
```

关键环境变量说明：

| 变量 | 作用 |
|------|------|
| `NUXT_STUDIO` | 设为 `'true'` 使构建时条件加载 `nuxt-studio` 模块 |
| `NODE_OPTIONS` | 增大堆内存至 6GB，避免 Nitro 打包阶段 OOM |
| `LD_PRELOAD` | 使用 jemalloc 替代 glibc malloc，防止 sharp 崩溃 |
| `VIPS_WARNING` | 抑制 libvips 警告输出 |
| `STUDIO_GITHUB_*` | Nuxt Studio 的 GitHub OAuth 凭据（从 Secrets 注入） |

### 打包与上传

```yaml
- name: Zip Output
  run: tar -czf release.tar.gz .output ecosystem.config.cjs
```

打包内容包括：
- `.output/` — Nuxt 构建产物（服务端 + 客户端）
- `ecosystem.config.cjs` — PM2 进程管理配置

### 服务器部署

```yaml
- name: Execute Deploy
  uses: appleboy/ssh-action@v1.0.3
  with:
    script: |
      # 1. 清理旧的构建产物，避免 symlink 冲突
      cd /opt/bitfsae
      rm -rf .output
      
      # 2. 解压新的构建产物
      tar -xzf /tmp/release.tar.gz -C /opt/bitfsae
      
      # 3. 删除临时包
      rm /tmp/release.tar.gz
      
      # 4. 加载 .env 文件中的凭据并重启 PM2
      pm2 delete bitfsae 2>/dev/null || true
      if [ -f /opt/bitfsae/.env ]; then
        set -a; source /opt/bitfsae/.env; set +a
      fi
      pm2 start ecosystem.config.cjs
      
      # 5. 保存 PM2 状态
      pm2 save
```

**为什么使用 `pm2 delete + start` 而不是 `pm2 reload`？**

`pm2 reload` 不会重新读取 `.env` 文件和 `ecosystem.config.cjs` 的变更。使用 `delete + start` 确保：
1. 完全清除旧进程及其缓存的环境变量
2. 重新读取 `ecosystem.config.cjs` 配置
3. 重新加载服务器 `/opt/bitfsae/.env` 文件中的凭据

**`.env` 文件加载机制**：部署脚本通过 `set -a; source /opt/bitfsae/.env; set +a` 将 `.env` 中的变量导出为环境变量，然后 `pm2 start` 会继承这些环境变量。`set -a` 使 `source` 读取的所有变量自动导出，`set +a` 恢复默认行为。

---

## GitHub Secrets 配置清单

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中配置以下 Secrets：

| Secret 名称 | 说明 | 示例 |
|-------------|------|------|
| `SERVER_HOST` | 阿里云服务器 IP 地址 | `1.2.3.4` |
| `SERVER_USER` | SSH 登录用户名 | `root` |
| `SERVER_SSH_KEY` | SSH 私钥（完整内容） | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `STUDIO_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | `Iv1.abc123...` |
| `STUDIO_GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | `ghs_xxx...` |

### GitHub OAuth App 创建

1. 前往 [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
2. 填写信息：
   - **Application name**: `BITFSAE Studio`
   - **Homepage URL**: `https://bitfsae.xin`
   - **Authorization callback URL**: `https://bitfsae.xin/__nuxt_studio/auth/github`
3. 创建后获取 Client ID 和 Client Secret，分别配置到 GitHub Secrets

---

## 服务器环境配置

### 目录结构

```
/opt/bitfsae/
├── .output/                # Nuxt 构建产物（CI 部署时覆盖）
│   └── server/
│       └── index.mjs       # 服务端入口
├── ecosystem.config.cjs    # PM2 配置（CI 部署时覆盖）
└── .env                    # 运行时凭据（手动创建，不被 CI 覆盖）
```

### 服务器 `.env` 文件

在 `/opt/bitfsae/.env` 中配置运行时凭据：

```bash
# Nuxt Studio GitHub OAuth（运行时认证）
# nuxt-studio 模块使用 STUDIO_ 前缀读取这些变量
STUDIO_GITHUB_CLIENT_ID=你的_GitHub_OAuth_App_Client_ID
STUDIO_GITHUB_CLIENT_SECRET=你的_GitHub_OAuth_App_Client_Secret
STUDIO_GITHUB_REDIRECT_URL=https://bitfsae.xin/__nuxt_studio/auth/github

# 如果使用了其他 OAuth 功能（如 nuxt-auth-utils），还需要：
# NUXT_OAUTH_GITHUB_CLIENT_ID=xxx
# NUXT_OAUTH_GITHUB_CLIENT_SECRET=xxx
# NUXT_SESSION_PASSWORD=至少32字符的随机字符串
```

> **⚠️ 重要：** `.env` 文件不会被 CI 部署覆盖（CI 只部署 `.output/` 和 `ecosystem.config.cjs`）。首次部署时需要手动在服务器上创建此文件。

### Node.js 环境

服务器需要安装 Node.js 22+。推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理版本：

```bash
nvm install 22
nvm use 22
```

### PM2 安装

```bash
npm install -g pm2
```

---

## PM2 部署配置

PM2 配置文件为 [`ecosystem.config.cjs`](../ecosystem.config.cjs)：

```javascript
module.exports = {
  apps: [
    {
      name: 'bitfsae',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      max_memory_restart: '512M',
      env: {
         NODE_ENV: 'production',
         // ⚠️ 不要设置 NUXT_STUDIO！
         NITRO_PRESET: 'node-server',
         NUXT_PUBLIC_SITE_URL: 'https://bitfsae.xin',
      }
    }
  ]
}
```

关键配置说明：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `exec_mode` | `cluster` | 集群模式，利用多核 CPU |
| `instances` | `max` | 启动与 CPU 核心数相同的进程 |
| `max_memory_restart` | `512M` | 单进程内存超过 512MB 自动重启 |
| `script` | `.output/server/index.mjs` | Nuxt 构建后的服务端入口 |

### 为什么 `env` 中不设置 `NUXT_STUDIO`？

Nuxt 会将所有 `NUXT_` 前缀的环境变量自动映射到 `runtimeConfig`。如果设置 `NUXT_STUDIO='true'`，Nuxt 会把 `runtimeConfig.studio` 从对象（包含 `auth`、`repository` 等子配置）覆盖为字符串 `'true'`，导致运行时读取 `studio.auth.github` 等配置时报错。

`NUXT_STUDIO` 仅在构建时（[`nuxt.config.ts`](../nuxt.config.ts:8)）用于条件判断是否加载 `nuxt-studio` 模块，运行时不需要也不应该设置。

---

## jemalloc 说明

### 问题背景

sharp 依赖的 libvips 是 C 语言编写的图片处理库，使用 native 内存分配。在 CI 环境（Ubuntu）中，libvips 的内存释放模式与 glibc 默认的 ptmalloc2 分配器存在兼容性问题，在预渲染阶段可能触发：

```
munmap_chunk(): invalid pointer
```

### 解决方案

安装 jemalloc 并通过 `LD_PRELOAD` 在构建时替代默认分配器：

```yaml
# deploy.yml 中的相关配置
- name: Install jemalloc
  run: |
    sudo apt-get update -qq
    sudo apt-get install -y -qq libjemalloc2 > /dev/null 2>&1

- name: Build Project
  run: npm run build
  env:
    LD_PRELOAD: /usr/lib/x86_64-linux-gnu/libjemalloc.so.2
```

jemalloc 对碎片化内存分配更友好，能有效避免 libvips 的 native 内存释放崩溃。

### 影响范围

- 仅影响 CI 构建环境（GitHub Actions Ubuntu runner）
- 不影响服务器运行时（服务器上不需要 jemalloc）
- 不影响本地开发环境

---

## `_ipx` 路由排除说明

### 问题背景

`@nuxt/image` 模块注册了 `/_ipx/**` 路由用于服务端动态图片处理（裁剪、缩放、格式转换等）。这些路由是动态的，依赖请求参数生成图片，不应被预渲染。

### 配置位置

在 [`nuxt.config.ts`](../nuxt.config.ts:145) 的 `nitro.prerender` 中排除：

```typescript
nitro: {
  prerender: {
    // 排除动态图片处理路由
    ignore: ['/_ipx/**']
  }
}
```

如果不排除，预渲染阶段会尝试访问这些动态路由并失败，导致构建报错。

---

## 环境变量加载机制

### 构建时（GitHub Actions）

```
deploy.yml env: 块
    │
    ▼
nuxt.config.ts 读取 process.env
    │
    ├── NUXT_STUDIO → 条件加载 nuxt-studio 模块
    ├── STUDIO_GITHUB_* → 写入 studio.auth.github 配置
    └── NODE_OPTIONS → Node.js 运行时参数
```

### 运行时（服务器 PM2）

```
/opt/bitfsae/.env 文件
    │
    ▼
PM2 start → 加载 .env + ecosystem.config.cjs
    │
    ▼
.output/server/index.mjs 读取 process.env
    │
    ├── STUDIO_GITHUB_* → Studio OAuth 认证
    ├── NUXT_PUBLIC_SITE_URL → 站点 URL
    └── NODE_ENV → 生产模式
```

> **注意：** PM2 的 `pm2 reload` 命令不会重新读取 `.env` 文件。修改 `.env` 后必须使用 `pm2 delete bitfsae && pm2 start ecosystem.config.cjs` 重启。

---

## 故障排查

### 构建失败：OOM (Out of Memory)

**症状：** CI 构建时报 `JavaScript heap out of memory`

**解决：** 确保 `NODE_OPTIONS` 中设置了足够的堆内存：

```yaml
NODE_OPTIONS: '--max-old-space-size=6144'
```

### 构建失败：`munmap_chunk(): invalid pointer`

**症状：** 预渲染阶段崩溃

**解决：** 确保安装了 jemalloc 并设置了 `LD_PRELOAD`。详见 [jemalloc 说明](#jemalloc-说明)。

### Studio 登录失败：401 或 OAuth 回调错误

**排查步骤：**

1. 检查 GitHub OAuth App 的回调 URL 是否正确：`https://bitfsae.xin/__nuxt_studio/auth/github`
2. 检查服务器 `.env` 文件中的 `STUDIO_GITHUB_CLIENT_ID` 和 `STUDIO_GITHUB_CLIENT_SECRET` 是否正确
3. 确认运行时没有设置 `NUXT_STUDIO` 环境变量
4. 使用 `pm2 delete bitfsae && pm2 start ecosystem.config.cjs` 重启以加载最新 `.env`

### PM2 进程异常重启

**排查步骤：**

```bash
# 查看进程状态
pm2 status

# 查看日志
pm2 logs bitfsae --lines 100

# 查看内存使用
pm2 monit
```

如果频繁因内存超限重启，考虑调整 `ecosystem.config.cjs` 中的 `max_memory_restart` 值。

### 部署后页面 404

**排查步骤：**

1. 确认 `.output/` 目录已正确解压到 `/opt/bitfsae/`
2. 确认 PM2 进程正在运行：`pm2 status`
3. 检查 Nginx 反向代理配置是否正确指向 `localhost:3000`
