module.exports = {
  apps: [
    {
      name: 'bitfsae',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs', // Nuxt 构建后的入口
      max_memory_restart: '512M', // 内存超过512M自动重启
      env: {
         NODE_ENV: 'production',
         // ⚠️ 不要设置 NUXT_STUDIO！Nuxt 会将 NUXT_ 前缀的环境变量映射到 runtimeConfig，
         // NUXT_STUDIO='true' 会把 runtimeConfig.studio 对象覆盖为字符串 'true'，
         // 导致 studio.repository.private 读取失败。
         // NUXT_STUDIO 仅在构建时（deploy.yml）用于条件加载模块，运行时不需要。
         NITRO_PRESET: 'node-server',
         NUXT_PUBLIC_SITE_URL: 'https://bitfsae.xin',
         // 以下凭据从服务器 /opt/bitfsae/.env 文件加载（见下方注释）
         // 如果 .env 不存在，PM2 会使用此处的空字符串（导致功能不可用但不会崩溃）
         // 
         // 服务器上创建 /opt/bitfsae/.env 文件：
         //   NUXT_OAUTH_GITHUB_CLIENT_ID=xxx
         //   NUXT_OAUTH_GITHUB_CLIENT_SECRET=xxx
         //   NUXT_SESSION_PASSWORD=xxx（至少32字符）
         //   STUDIO_GITHUB_CLIENT_ID=xxx
         //   STUDIO_GITHUB_CLIENT_SECRET=xxx
         //   STUDIO_GITHUB_REDIRECT_URL=https://bitfsae.xin/__nuxt_studio/auth/github
      }
    }
  ]
}