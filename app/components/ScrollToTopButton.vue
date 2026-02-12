<template>
  <button
    v-show="show"
    class="btn-to-top"
    @click="scrollToTop"
    aria-label="返回顶部"
    :title="$t('backToTop') || '返回顶部'"
  >
    <UIcon name="lucide:arrow-up" class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
const show = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  show.value = window.scrollY > 400
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.btn-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), #3b82f6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 90;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}

/* 确保与目录按钮垂直对齐 */
.toc-fab {
  right: 32px !important;
}

.btn-to-top:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.5);
}

.btn-to-top:active {
  transform: translateY(-1px) scale(1.02);
}

@media (max-width: 768px) {
  .btn-to-top {
    bottom: 24px;
    right: 24px;
    width: 44px;
    height: 44px;
  }
}
</style>
