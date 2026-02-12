<template>
  <span class="prose-span" :style="mergedStyle" v-bind="attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: string
  bg?: string
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | string
  weight?: string
  preset?: 'highlight' | 'code' | 'warn' | 'important' | 'success'
  px?: string
  py?: string
  radius?: string
}>(), {
  color: '',
  bg: '',
  size: '',
  weight: '',
  preset: undefined,
  px: '',
  py: '',
  radius: ''
})

const attrs = useAttrs()

const presetStyle = computed((): Record<string, string> => {
  switch (props.preset) {
    case 'highlight':
      return {
        background: 'linear-gradient(120deg, #ffd700 0%, #ffec8b 100%)',
        color: '#1a1a1a',
        padding: '2px 8px',
        borderRadius: '4px'
      }
    case 'code':
      return {
        background: 'rgba(59, 130, 246, 0.15)',
        color: '#2563eb',
        padding: '2px 8px',
        borderRadius: '4px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      }
    case 'warn':
      return {
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        padding: '2px 8px',
        borderRadius: '4px'
      }
    case 'important':
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '0.875rem'
      }
    case 'success':
      return {
        background: '#22c55e',
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontWeight: '600',
        fontSize: '0.75rem'
      }
    default:
      return {}
  }
})

const sizeMap: Record<string, string> = {
  sm: '0.75rem',
  base: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem'
}

const mergedStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    ...presetStyle.value
  }

  if (props.color) style.color = props.color
  if (props.bg) style.background = props.bg
  if (props.weight) style.fontWeight = props.weight
  if (props.radius) style.borderRadius = props.radius

  if (props.size) {
    style.fontSize = sizeMap[props.size] || props.size
  }

  const hasSpacing = props.px || props.py
  if (hasSpacing) {
    style.padding = `${props.py || '0'} ${props.px || '0'}`
  }

  return style
})
</script>

<style scoped>
.prose-span {
  display: inline-block;
}
</style>

