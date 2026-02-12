# 部署与环境配置文档

> 本文档详细说明 BITFSAE 项目的开发环境适配、Nuxt Studio 集成、GitHub Actions CI/CD 自动化部署，以及阿里云服务器部署方案。

---

## 一、开发环境适配

### 1.1 当前开发环境特殊配置

项目在开发环境中做了以下适配：

#### Nuxt Studio 模块条件加载

**问题**：在 Windows 开发环境下，`nuxt-studio` 模块依赖的 `nuxt-component-meta` 存在已知的绝对路径解析问题（与 `mlly` 包的路径处理有关），启用后会导致开发服务器启动报错。

**当前临时方案**：在 [`nuxt.config.ts`](../../nuxt.config.ts:4) 中通过环境变量 `NUXT_STUDIO` 控制模块加载：

```typescript
// nuxt.config.ts 第 4 行
const studioEnabled = process.env.NUXT_STUDIO === 'true'

// 第 15 行 - 模块条件加载
modules: [
  // ...
  process.env.NUXT_STUDIO === 'true' ? 'nuxt-studio' : undefined,
  // ...
].filter(Boolean),

// 第 151-163 行 - Studio 配置条件注入
...(studioEnabled
  ? {
      studio: {
        repository: {
          provider: 'github',
          owner: 'totok22',
          repo: 'bitfsae-nuxt',
          branch: 'main'
        }
      }
    }
  : {}),
```

**日常开发**：直接运行 `npm run dev`，Studio 模块不会加载，不会报错。

**需要测试 Studio 时**：

```bash
# Windows cmd
set NUXT_STUDIO=true && npm run dev

# PowerShell
$env:NUXT_STUDIO="true"; npm run dev

# Linux/macOS
NUXT_STUDIO=true npm run dev
```

#### ISR/SWR 缓存开发环境禁用

在 [`nuxt.config.ts`](../../nuxt.config.ts:178) 中，所有 ISR 和 API 缓存规则在开发环境下被禁用：

```typescript
'/news': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 },
'/api/news': process.env.NODE_ENV === 'development' ? {} : { swr: 1800 },
```

这确保开发时每次请求都获取最新数据，避免调试时命中陈旧缓存。

#### Google Fonts 远程下载禁用

在 [`nuxt.config.ts`](../../nuxt.config.ts:81) 中禁用了 Google Fonts 远程下载：

```typescript
fonts: {
  providers: {
    google: false
  }
}
```

原因是国内网络环境下，Google Fonts CDN 访问不稳定，可能导致开发服务器启动超时。`@nuxt/fonts` 模块会自动回退到系统字体。

#### DevTools 仅开发环境启用

```typescript
devtools: {
  enabled: process.env.NODE_ENV === 'development'
}
```

#### package.json 中的 overrides

```json
"overrides": {
  "ignore": "5.3.0"
}
```

锁定 `ignore` 包版本为 5.3.0，解决依赖冲突问题。

---

## 二、Nuxt Studio 集成

### 2.1 什么是 Nuxt Studio

[Nuxt Studio](https://nuxt.studio) 是一个基于 Git 的可视化内容编辑平台，允许非技术人员（如运营组同学）通过类似 Notion 的界面直接编辑 Markdown 内容，编辑完成后自动提交到 GitHub 仓库。

### 2.2 Studio 的工作流程

```
运营同学 → 访问 Studio 子页面 → GitHub 认证登录
    → 可视化编辑 content/news/*.md
    → 点击保存 → Studio 自动 git commit + push 到 GitHub
    → GitHub Actions 触发 → 自动构建 + 部署到阿里云
    → 网站内容自动更新
```

### 2.3 Studio 配置

#### 仓库配置

在 [`nuxt.config.ts`](../../nuxt.config.ts:153) 中已配置 Studio 仓库信息：

```typescript
studio: {
  repository: {
    provider: 'github',
    owner: 'totok22',
    repo: 'bitfsae-nuxt',
    branch: 'main'
  }
}
```

#### 生产环境启用 Studio

**关键**：生产环境构建时必须设置 `NUXT_STUDIO=true`，否则 Studio 模块不会被加载，运营同学无法使用可视化编辑功能。

在 GitHub Actions 的构建步骤中设置：

```yaml
env:
  NUXT_STUDIO: 'true'
```

### 2.4 Studio 使用指南（面向运营组）

1. **访问 Studio**：打开 [https://nuxt.studio](https://nuxt.studio)
2. **GitHub 登录**：使用 GitHub 账号登录（需要有仓库的写入权限）
3. **导入项目**：首次使用时点击 "Import Project"，选择 `totok22/bitfsae-nuxt` 仓库
4. **编辑内容**：
   - 在左侧文件树中找到 `content/news/` 目录
   - 点击已有文章进行编辑，或创建新文件
   - 使用可视化编辑器修改标题、正文、图片等
   - 修改 Frontmatter（标题、日期、分类、描述等）
5. **保存发布**：点击 "Save" 按钮，Studio 会自动向 GitHub 提交更改
6. **自动部署**：GitHub Actions 检测到 push 后自动触发构建和部署

### 2.5 解决 Studio 在开发环境的报错

**根本原因**：`nuxt-component-meta`（`nuxt-studio` 的依赖）在 Windows 下解析模块路径时使用了绝对路径，与 `mlly` 包的路径处理逻辑冲突。

**长期解决方案**（按优先级排列）：

1. **等待上游修复**：关注 [nuxt-component-meta](https://github.com/nuxt/component-meta) 和 [mlly](https://github.com/unjs/mlly) 的更新，问题修复后移除条件加载逻辑
2. **使用 WSL2 开发**：在 Windows 上使用 WSL2（Windows Subsystem for Linux）进行开发，Linux 环境下不存在此路径问题
3. **Docker 开发环境**：使用 Docker 容器化开发环境，统一 Linux 环境
4. **保持当前方案**：继续使用环境变量条件加载，生产环境正常启用

**验证 Studio 是否正常工作**：

```bash
# 在 Linux/macOS 或 WSL2 中测试
NUXT_STUDIO=true npm run dev

# 如果启动成功，访问 http://localhost:3000/_studio
# 应该能看到 Studio 的本地预览界面
```

---

## 三、GitHub Actions CI/CD

### 3.1 CI/CD 流程设计

```
开发者 push 代码 / 运营组通过 Studio 编辑内容
    ↓
GitHub 检测到 main 分支变更
    ↓
GitHub Actions 触发工作流
    ↓
在 GitHub 服务器上执行 npm install + npm run build
    ↓
将 .output/ 目录通过 SSH/SCP 传输到阿里云服务器
    ↓
在阿里云服务器上重启 Node.js 服务
    ↓
网站更新完成
```

### 3.2 GitHub Actions 工作流配置



回到本地的 VS Code 项目代码中。

1. **添加 PM2 配置文件**： 在项目根目录（`bitfsae-nuxt/`）下新建一个文件 `ecosystem.config.cjs` (注意后缀是 cjs)：

   JavaScript

   ```
   module.exports = {
     apps: [
       {
         name: 'bitfsae',
         port: '3000',
         exec_mode: 'cluster',
         instances: 'max',
         script: './.output/server/index.mjs', // Nuxt 构建后的入口
         env: {
            NODE_ENV: 'production'
         }
       }
     ]
   }
   ```

2. **确认 package.json**： 确保你的 `package.json` 里 `scripts` 包含 build 命令：

   JSON

   ```
   "scripts": {
     "build": "nuxt build",
     "dev": "nuxt dev",
     ...
   }
   ```



在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Aliyun

on:
  push:
    branches: [main] # 当 main 分支有推送时触发
  workflow_dispatch: # 允许手动点击按钮触发

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Project
        run: npm run build
        env:
          NUXT_STUDIO: 'true' # 启用 Studio
          NODE_ENV: production

      # 打包构建产物 (.output 目录) 和 PM2 配置文件
      - name: Zip Output
        run: tar -czf release.tar.gz .output ecosystem.config.cjs

      # 发送文件到阿里云
      - name: SCP to Server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          source: "release.tar.gz"
          target: "/tmp/"

      # SSH 登录服务器执行部署
      - name: Execute Deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            # 1. 解压文件
            cd /opt/bitfsae
            tar -xzf /tmp/release.tar.gz -C /opt/bitfsae
            
            # 2. 删除临时包
            rm /tmp/release.tar.gz
            
            # 3. 重启/启动 PM2
            # 如果项目还没运行，start；如果运行了，reload
            pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
            
            # 4. 保存 PM2 状态，防止重启失效
            pm2 save
```

### 3.3 GitHub Secrets 配置

我们需要让 GitHub 有权限把文件传给阿里云服务器。

1. **本地生成密钥对**： 在你的 **Windows 本地电脑** 打开 PowerShell 或 Git Bash，运行：

   Bash

   ```
   ssh-keygen -t ed25519 -C "github-action" -f ~/.ssh/bitfsae_deploy
   ```

   一路回车即可。这会在 `C:\Users\你的用户名\.ssh\` 下生成 `bitfsae_deploy` (私钥) 和 `bitfsae_deploy.pub` (公钥)。

2. **把公钥放到阿里云服务器**：

   - 用 VS Code 打开服务器上的 `/root/.ssh/authorized_keys` 文件。
   - 把本地电脑上 `bitfsae_deploy.pub` 文件里的内容（以 ssh-ed25519 开头的一行乱码）复制粘贴到服务器文件的最后一行。
   - 保存。

3. **把私钥放到 GitHub 仓库**：

   - 打开 GitHub 仓库页面 -> **Settings** -> **Secrets and variables** -> **Actions**。
   - 点击 **New repository secret**。
   - **Name**: `SERVER_SSH_KEY`
   - **Secret**: 复制本地 `bitfsae_deploy` (没有后缀的那个文件) 的全部内容粘贴进去。
   - 再添加两个 Secret：
     - `SERVER_HOST`: `xxx.xx`
     - `SERVER_USER`: `root`

---

## 四、阿里云服务器部署

### 4.1 服务器规格

- **配置**：2 核 2G
- **系统**：推荐 Ubuntu 22.04 LTS 或 CentOS 8+
- **注意**：2G 内存不建议在服务器上执行 `npm run build`（构建过程内存消耗大），应在 GitHub Actions 上构建后传输产物



### 4.2 服务器初始化

```bash
# 下载并安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2 (用于在这个窗口关闭后继续运行网站)
sudo npm install -g pm2

# 创建项目目录并授权
sudo mkdir -p /opt/bitfsae
sudo chown -R root:root /opt/bitfsae  # 假设用root登录，如果是其他用户请更改
```

**安装宿主机 Nginx**：



```Bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 4.3 Nginx 反向代理配置

创建 `/etc/nginx/sites-available/bitfsae`：

```nginx
# 代理 Nuxt 应用
upstream nuxt_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# 代理 Grafana (我们在 Docker 里映射到了 3001)
upstream grafana_app {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name bitfsae.xin www.bitfsae.xin;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bitfsae.xin www.bitfsae.xin;

    ssl_certificate     /etc/nginx/ssl/bitfsae.xin.pem;
    ssl_certificate_key /etc/nginx/ssl/bitfsae.xin.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # 1. 主站 Nuxt 配置
    location / {
        proxy_pass http://nuxt_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 静态资源缓存优化 (Nuxt 构建产物)
    location /_nuxt/ {
        proxy_pass http://nuxt_app;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 2. Grafana 监控页面配置
    location /monitor/ {
        proxy_pass http://grafana_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # WebSocket 支持 (Grafana 需要)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/bitfsae /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.4 SSL 证书

**方案一：Let's Encrypt（免费，推荐）**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d bitfsae.xin -d www.bitfsae.xin
# 自动续期
sudo certbot renew --dry-run
```

**方案二：阿里云免费 SSL 证书**

1. 在阿里云控制台申请免费 SSL 证书
2. 下载 Nginx 格式证书
3. 上传到服务器 `/etc/nginx/ssl/` 目录

### 4.5 PM2 进程管理

```bash
# 首次启动
cd /opt/bitfsae
pm2 start .output/server/index.mjs --name bitfsae

# 设置开机自启
pm2 startup
pm2 save

# 常用命令
pm2 status          # 查看状态
pm2 logs bitfsae    # 查看日志
pm2 restart bitfsae # 重启
pm2 stop bitfsae    # 停止
pm2 monit           # 监控面板
```

### 4.6 内存优化（2G 服务器）

由于服务器只有 2G 内存，需要进行以下优化：

```bash
# 1. 创建 1G swap 文件
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 2. PM2 限制内存
pm2 start .output/server/index.mjs --name bitfsae --max-memory-restart 512M

# 3. 设置 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=512" pm2 start .output/server/index.mjs --name bitfsae
```



---

## 五、完整部署流程总结

### 5.1 首次部署

1. **服务器初始化**：安装 Node.js、PM2、Nginx
2. **配置 Nginx**：反向代理 + SSL
3. **配置 GitHub Secrets**：SSH 密钥、服务器信息
4. **创建 GitHub Actions 工作流**：`.github/workflows/deploy.yml`
5. **推送代码到 main 分支**：触发首次自动部署
6. **验证**：访问 `https://bitfsae.xin` 确认网站正常

### 5.2 日常更新流程

#### 开发者更新代码

```
修改代码 → git push origin main → GitHub Actions 自动构建部署
```

#### 运营组更新内容

```
访问 nuxt.studio → GitHub 登录 → 编辑 content/news/*.md
→ 保存 → 自动 push → GitHub Actions 自动构建部署
```

### 5.3 回滚方案

如果部署后发现问题：

```bash
# SSH 登录服务器
ssh root@你的服务器IP

# 回滚到上一版本
cd /opt/bitfsae
rm -rf .output
mv .output.bak .output
pm2 restart bitfsae
```

或在 GitHub 上 revert commit 后重新触发部署。

---

## 六、监控与维护

### 6.1 日志查看

```bash
# PM2 应用日志
pm2 logs bitfsae

# Nginx 访问日志
tail -f /var/log/nginx/access.log

# Nginx 错误日志
tail -f /var/log/nginx/error.log
```

### 6.2 健康检查

可以在 GitHub Actions 中添加部署后的健康检查：

```yaml
- name: Health check
  run: |
    sleep 10
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://bitfsae.xin)
    if [ "$STATUS" != "200" ]; then
      echo "Health check failed! Status: $STATUS"
      exit 1
    fi
    echo "Health check passed!"
```

### 6.3 磁盘空间管理

2G 服务器磁盘空间有限，定期清理：

```bash
# 清理旧的部署备份
rm -rf /opt/bitfsae/.output.bak

# 清理 PM2 日志
pm2 flush

# 清理系统日志
sudo journalctl --vacuum-time=7d
```

---

## 七、Studio 与 CI/CD 协作架构图

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                  (totok22/bitfsae-nuxt)                  │
│                                                         │
│  ┌──────────┐    push     ┌──────────────────────┐     │
│  │  main    │◄────────────│  GitHub Actions       │     │
│  │  branch  │             │  (build + deploy)     │     │
│  └────┬─────┘             └──────────┬───────────┘     │
│       │                              │                  │
│       │                              │ SCP + SSH        │
│       │                              ▼                  │
│  ┌────┴─────┐             ┌──────────────────────┐     │
│  │  Nuxt    │  auto push  │  阿里云 ECS          │     │
│  │  Studio  │─────────────│  (2核2G)             │     │
│  │  (CMS)   │             │  Nginx + PM2 + Node  │     │
│  └──────────┘             └──────────────────────┘     │
│       ▲                              │                  │
│       │                              │ https://         │
│  ┌────┴─────┐             ┌──────────┴───────────┐     │
│  │  运营组   │             │  用户浏览器           │     │
│  │  同学    │             │  bitfsae.xin          │     │
│  └──────────┘             └──────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 运营组使用 Studio 的完整流程

1. 运营组同学访问 [https://nuxt.studio](https://nuxt.studio)
2. 使用 GitHub 账号登录（需要仓库协作者权限）
3. 选择 `bitfsae-nuxt` 项目
4. 在可视化编辑器中编辑 `content/news/` 下的文章
5. 点击保存，Studio 自动向 GitHub 仓库的 main 分支提交 commit
6. GitHub Actions 检测到 push 事件，自动触发构建工作流
7. 构建完成后，通过 SSH 将产物部署到阿里云服务器
8. PM2 重启 Node.js 服务，网站内容自动更新

**运营组同学需要的权限**：
- GitHub 账号
- 被添加为仓库的 Collaborator（至少 Write 权限）
- 无需了解 Git、命令行或代码知识
