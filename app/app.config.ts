export default defineAppConfig({
  ui: {
    // 与站点导航一致的品牌蓝（天蓝）
    colors: {
      primary: 'sky'
    },

    // 自定义 Prose 组件主题 - 美化优化
    prose: {
      // Callout (Note/Tip/Warning/Caution) 美化
      callout: {
        slots: {
          base: [
            'group relative block px-5 py-4 rounded-xl text-sm/6 my-5 last:mb-0',
            '[&_code]:text-xs/5 [&_code]:bg-default [&_pre]:bg-default',
            '[&>div]:my-2.5 [&_ul]:my-2.5 [&_ol]:my-2.5 [&>*]:last:!mb-0',
            '[&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:my-0',
            'shadow-sm transition-all duration-200',
            'hover:shadow-md',
            'bg-white/90 dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-700/70 text-default'
          ],
          icon: [
            'size-5 shrink-0 align-sub me-2 inline-block',
            'transition-colors'
          ],
          externalIcon: [
            'size-4 align-top absolute right-3 top-3 pointer-events-none',
            'transition-colors'
          ]
        }
      },

      // Collapsible 美化 - 解决按钮简陋问题
      collapsible: {
        slots: {
          root: 'my-5 rounded-xl border border-neutral-200/70 dark:border-neutral-700/70 bg-white/90 dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200',
          trigger: [
            'group relative w-full rounded-none inline-flex items-center gap-2.5 px-5 py-3.5',
            'text-default hover:text-highlighted text-sm font-semibold',
            'hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60',
            'focus-visible:ring-2 focus-visible:ring-primary focus:outline-none',
            'transition-all duration-200',
            'cursor-pointer'
          ],
          triggerIcon: 'size-4.5 shrink-0 text-primary group-data-[state=open]:rotate-180 transition-transform duration-300',
          triggerLabel: 'truncate',
          content: 'px-5 pb-4 *:first:mt-2.5 *:last:mb-0 *:my-1.5 border-t border-neutral-200/50 dark:border-neutral-700/50 text-default'
        }
      },

      // Steps 美化 - 简洁紧凑步骤
      steps: {
        base: 'flex flex-col gap-3 my-6 [counter-reset:step]',
        variants: {
          level: {
            '3': [
              // 每个步骤包装成紧凑卡片
              '[&>h3]:[counter-increment:step]',
              '[&>h3]:relative',
              '[&>h3]:flex',
              '[&>h3]:items-center',
              '[&>h3]:gap-1',
              '[&>h3]:p-1',
              '[&>h3]:rounded-lg',
              '[&>h3]:bg-white/30',
              'dark:[&>h3]:bg-neutral-900/30',
              '[&>h3]:border',
              '[&>h3]:border-neutral-200/30',
              'dark:[&>h3]:border-neutral-700/30',
              // 圆圈样式 - 更小更紧凑
              '[&>h3]:before:content-[counter(step)]',
              '[&>h3]:before:flex',
              '[&>h3]:before:items-center',
              '[&>h3]:before:justify-center',
              '[&>h3]:before:shrink-0',
              '[&>h3]:before:size-10',
              '[&>h3]:before:rounded-lg',
              '[&>h3]:before:font-bold',
              '[&>h3]:before:text-sm',
              '[&>h3]:before:tabular-nums',
              '[&>h3]:before:text-white',
              '[&>h3]:before:bg-gradient-to-br',
              '[&>h3]:before:from-primary',
              '[&>h3]:before:to-primary/70',
              '[&>h3]:before:shadow-md',
              '[&>h3]:before:shadow-primary/20',
              // 标题文字
              '[&>h3]:text-highlighted',
              '[&>h3]:font-semibold',
              '[&>h3]:text-base',
              // 隐藏锚点图标
              '[&>h3>a>span.absolute]:hidden',
              // 步骤内容 - 减少间距
              '[&>h3+*]:mt-0',
              '[&>h3+*]:ml-10',
              '[&>h3+*]:text-default',
              '[&>h3+*]:text-sm',
              '[&>h3+*]:leading-relaxed'
            ].join(' ')
          }
        }
      },

      // Tabs 美化 - 圆角边框容器
      tabs: {
        slots: {
          root: 'my-5 gap-0 rounded-xl border border-neutral-200/70 dark:border-neutral-700/70 bg-white/85 dark:bg-neutral-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200'
        }
      },

      // TabsItem 美化
      tabsItem: {
        base: 'p-5 text-sm/6 text-default *:first:!mt-0 *:last:!mb-0'
      },

      // Card 美化 - 圆角阴影
      card: {
        slots: {
          base: [
            'group relative block my-5 p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl bg-white dark:bg-neutral-900',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200'
          ],
          icon: 'size-6 mb-2 block',
          title: 'text-highlighted font-semibold text-base',
          description: 'text-[15px] text-muted *:first:mt-0 *:last:mb-0 *:my-1',
          externalIcon: [
            'size-4 align-top absolute right-3 top-3 text-dimmed pointer-events-none',
            'transition-colors'
          ]
        }
      },

      // CardGroup 美化 - 响应式网格
      cardGroup: {
        base: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-5 *:my-0'
      },

      // Badge 美化
      badge: {
        base: 'rounded-full font-semibold'
      },

      // Code (inline) 美化
      code: {
        base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block bg-primary/10 text-primary'
      },

      // Pre (code block) 美化
      pre: {
        slots: {
          root: 'relative my-5 group',
          header: 'flex items-center gap-1.5 border border-default/60 bg-elevated border-b-0 relative rounded-t-md px-4 py-3',
          filename: 'text-default text-sm/6',
          icon: 'size-4 shrink-0',
          copy: 'absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition',
          base: 'group font-mono text-sm/6 border border-default/60 bg-neutral-950 text-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 rounded-md px-4 py-3.5 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none'
        }
      },

      // Blockquote 美化
      blockquote: {
        base: 'border-s-4 border-primary/50 ps-5 italic text-default my-6 bg-primary/5 py-3 rounded-r-lg'
      },

      // Img 美化 - 圆角阴影
      img: {
        slots: {
          base: 'rounded-lg w-full shadow-sm hover:shadow-md transition-shadow duration-200',
          overlay: 'fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity',
          content: 'fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none',
          zoomedImage: 'w-full h-auto max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-xl'
        }
      },

      // H1 美化
      h1: {
        slots: {
          base: 'text-4xl text-highlighted font-bold mb-8 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)'
        }
      },

      // H2 美化
      h2: {
        slots: {
          base: [
            'relative text-2xl text-highlighted font-bold mt-12 mb-6 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))]',
            '[&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary',
            '[&>a>code]:transition-colors'
          ]
        }
      },

      // H3 美化
      h3: {
        slots: {
          base: [
            'relative text-xl text-highlighted font-bold mt-8 mb-3 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))]',
            '[&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary',
            '[&>a>code]:transition-colors'
          ]
        }
      },

      // P 美化
      p: {
        base: 'my-5 leading-7 text-pretty text-default'
      },

      // Hr 美化
      hr: {
        base: 'border-t border-default my-12'
      },

      // A 美化
      a: {
        base: [
          'text-primary border-b border-transparent hover:border-primary font-medium',
          'focus-visible:outline-primary',
          'transition-colors'
        ]
      },

      // Table 美化
      table: {
        slots: {
          root: 'relative my-5 overflow-x-auto rounded-lg border border-neutral-200/70 dark:border-neutral-700/70 bg-white/90 dark:bg-neutral-900 shadow-sm',
          base: 'w-full border-separate border-spacing-0 rounded-lg text-default'
        }
      },

      // Ul 美化
      ul: {
        base: 'list-disc ps-6 my-5 marker:text-primary/50'
      },

      // Ol 美化
      ol: {
        base: 'list-decimal ps-6 my-5 marker:text-primary/60 marker:font-semibold'
      },

      // Li 美化
      li: {
        base: 'my-1.5 ps-1.5 leading-7 [&>ul]:my-0'
      }
    }
  }
})
