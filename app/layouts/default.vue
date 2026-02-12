<template>
  <div id="app">
    <AppHeader />
    <MobileMenu />
    <main>
      <slot />
    </main>
    <AppFooter />
    <LoginModal />
    <ScrollToTopButton />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu()

// Use composables to manage animations and modal behavior
const { initScrollAnimations } = useScrollAnimation()

onMounted(() => {
  // 在应用真正挂载后立即解除 no-fouc，避免首屏出现未样式化 DOM
  document.documentElement.classList.remove('no-fouc')
  setTimeout(() => {
    initScrollAnimations()
  }, 60)
})

watch(isMobileMenuOpen, (open: boolean) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

// Re-initialize scroll animations on route change
watch(route, () => {
  closeMobileMenu()
  setTimeout(() => {
    initScrollAnimations()
  }, 300)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
