// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import { SITE_ASSETS } from './app/utils/site'
import { visualizer } from 'rollup-plugin-visualizer'



const studioEnabled = process.env.NUXT_STUDIO === 'true' 

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: process.env.NODE_ENV === 'development'
  },


  
  modules: [
    '@nuxt/fonts',
    '@nuxt/content',
    studioEnabled ? 'nuxt-studio' : undefined,
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxt/icon',
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/seo'
  ].filter(Boolean),

  // Nuxt UI 配置 - 启用 MDC 渲染
  ui: {
    mdc: true,  // 启用 Prose 组件用于 Markdown 渲染
    content: true  // 启用 Content 相关组件
  },

  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          'rehype-katex': {}
        },
        highlight: {
          theme: 'github-dark',
          preload: ['ts', 'js', 'css', 'vue', 'bash', 'md', 'yaml', 'json']
        }
      }
    }
  },

  app: {
    head: {
      style: [
        {
          innerHTML: `html.no-fouc body, html.no-fouc #__nuxt { visibility: hidden !important; opacity: 0 !important; } body, #__nuxt { transition: opacity .2s ease; }`
        }
      ],
      script: [
        {
          // 在 HTML 解析时立即设置主题，并短暂隐藏内容避免首屏未样式化闪烁
          innerHTML: `(function(){var d=document.documentElement;d.classList.add('no-fouc');try{var t=localStorage.getItem('theme')||'dark';d.setAttribute('data-theme',t);if(t==='dark')d.classList.add('dark');else d.classList.remove('dark');}catch(e){}setTimeout(function(){d.classList.remove('no-fouc')},5000)})()`,
          type: 'text/javascript',
          tagPosition: 'head'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: SITE_ASSETS.favicon
        },
        {
          rel: 'stylesheet',
          href: '/assets/katex/katex.min.css'
        }
      ]
    }
  },

  components: [
    {
      path: '~/components/content',
      global: true
    },
    '~/components'
  ],

  // 字体配置，由于国内网络问题，禁用远程下载以防止启动超时
  fonts: {
    providers: {
      google: false
    },
    families: [
      {
        name: 'Inter',
        src: '/fonts/Inter/Inter-VariableFont_opsz-wght.ttf'
      },
      {
        name: 'Outfit',
        src: '/fonts/Outfit/Outfit-VariableFont_wght.ttf'
      }
    ]
  },

  css: [
    '~/assets/styles/ui.css',
    '~/assets/styles/variables.css',
    '~/assets/styles/global.css',
    '~/assets/styles/studio-light.css'
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'zh', file: 'zh.json', name: '简体中文' }
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      fallbackLocale: 'zh'
    }
  },

  image: {
    format: ['webp', 'avif', 'jpg'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  typescript: {
    strict: true
  },

  nitro: {
    prerender: {
      concurrency: 1,      // 强制串行处理，防止多个进程抢占 SQLite 导致内存指针错误
      failOnError: true, 
      crawlLinks: true,
      // 排除 _ipx 图片处理路由：sharp/libvips 的 native 内存管理在 CI 环境下
      // 与 glibc 分配器冲突，导致 munmap_chunk(): invalid pointer 崩溃
      ignore: ['/_ipx/**']
    },
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  
  // 构建产物可视化（仅在 ANALYZE=true 时启用）
  vite: {
    build: {
      assetsInlineLimit: 4096, // 超过 4KB 的文件必须作为独立文件加载，不能塞进 JS
    },
    css: {
      devSourcemap: false  // 消除 @tailwindcss/vite sourcemap 警告
    },
    plugins: process.env.ANALYZE === 'false'
      ? [
          visualizer({
            filename: 'stats.html',
            gzipSize: true,
            brotliSize: true,
            open: true
          }) as any
        ]
      : []
  },

  // SEO 配置
  runtimeConfig: {
    // 1. 为 Auth Utils 的 Session 密码占座（运行时由 NUXT_SESSION_PASSWORD 环境变量覆盖）
    session: {
      password: ''
    },
    // 2. 为 GitHub OAuth 占座（运行时由 NUXT_OAUTH_GITHUB_CLIENT_ID/SECRET 环境变量覆盖）
    oauth: {
      github: {
        clientId: '',
        clientSecret: ''
      }
    },
    // studio 的 runtimeConfig 由 nuxt-studio 模块自动注入，不要在此手动定义
    // （手动定义会覆盖模块默认值，导致缺少 repository.private 等字段）
    public: {
      siteUrl: 'https://bitfsae.xin',
      siteName: 'BITFSAE',
      siteDescription: '北京理工大学纯电动方程式赛车队(BITFSAE)致力于设计、制造高性能电动方程式赛车,参加中国大学生方程式汽车大赛。',
      language: 'zh'
    }
  },
  site: {
    url: 'https://bitfsae.xin',
    name: 'BITFSAE',
    description: '北京理工大学纯电动方程式赛车队(BITFSAE)致力于设计、制造高性能电动方程式赛车,参加中国大学生方程式汽车大赛。',
    defaultLocale: 'zh'
  },
  sitemap: {
    zeroRuntime: true,
    urls: async () => {
      // 动态路由将在运行时生成
      return []
    }
  },
  robots: {
    allow: '/',
    sitemap: 'https://bitfsae.xin/sitemap.xml'
  },

  // Nuxt Studio 配置（仅在 NUXT_STUDIO=true 时注入，避免 Windows 下 nuxt-component-meta 报错影响日常 dev）
  ...(studioEnabled
    ? {
        studio: {
          repository: {
            provider: 'github',
            owner: 'totok22',
            repo: 'bitfsae-nuxt',
            branch: 'main',
            private: true  // 公开仓库使用 public_repo scope，私有仓库改为 true
          },
          auth: {
            github: {
              // 通过 GitHub Secrets → deploy.yml 环境变量 STUDIO_GITHUB_CLIENT_ID / STUDIO_GITHUB_CLIENT_SECRET 注入
              clientId: process.env.STUDIO_GITHUB_CLIENT_ID,
              clientSecret: process.env.STUDIO_GITHUB_CLIENT_SECRET
            }
          }
        }
      }
    : {}),

  // 混合渲染策略
  routeRules: {
    // 预渲染静态页面
    '/': { prerender: true },
    '/about': { prerender: true },
    '/sponsors': { prerender: true },
    '/cars': { prerender: true },

    // 避免 /sw.js 被前端路由接管产生 warn
    '/sw.js': { static: true },

    // ISR 策略：新闻页面（开发环境禁用，避免内容调试时命中陈旧缓存）
    '/news': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 },
    '/news/**': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 },

    // API 路由缓存（开发环境禁用，避免调试时命中陈旧缓存）
    '/api/news': process.env.NODE_ENV === 'development' ? {} : { swr: 1800 },  // 30分钟
    '/api/cars': process.env.NODE_ENV === 'development' ? {} : { swr: 7200 },  // 2小时
    '/api/events': process.env.NODE_ENV === 'development' ? {} : { swr: 3600 } // 1小时
  },

} as any)
