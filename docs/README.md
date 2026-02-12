# 文档总览

本目录维护 BITFSAE 官网项目的开发与部署文档。

## 文档索引

| 文档 | 说明 |
|------|------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | 架构说明：技术栈、模块配置、渲染策略、认证流程 |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | 部署文档：CI/CD 流程、GitHub Secrets、服务器配置、PM2 |
| [`SUGGESTIONS.md`](SUGGESTIONS.md) | 优化建议：已解决的技术债、待处理项、改进方向 |
| [`assets.md`](assets.md) | 静态资源清单：图片、图标、图床链接、赛车参数 |
| [`server-deployment-context.md`](server-deployment-context.md) | 服务器上下文：Docker Compose、Mosquitto、Telegraf、Grafana 配置 |

## 关键配置文件速查

| 文件 | 说明 |
|------|------|
| [`nuxt.config.ts`](../nuxt.config.ts) | Nuxt 主配置（模块、渲染策略、Studio 配置） |
| [`content.config.ts`](../content.config.ts) | 内容集合 schema 定义 |
| [`ecosystem.config.cjs`](../ecosystem.config.cjs) | PM2 部署配置 |
| [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | CI/CD 工作流 |
| [`app/app.config.ts`](../app/app.config.ts) | 应用配置（UI 主题、Prose 组件样式） |

## 约定

- 文档中的路径统一以仓库根目录为起点。
- 示例命令默认在项目根目录执行。
- 当代码结构调整时，请同步更新对应文档引用路径。
- 文档语言使用中文。
- 不在文档中包含真实的 OAuth 凭据，使用占位符。

## 最近更新

- **2026-02-10**：全面更新所有文档，反映 CI/CD 修复、Studio 认证重构、凭据安全化、PM2 部署优化等变更。
