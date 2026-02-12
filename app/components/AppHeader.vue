<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="logo-container">
      <NuxtLink to="/" aria-label="BITFSAE 首页">
        <img src="/assets/images/bitfsae.svg" alt="BITFSAE Logo" class="logo-img">
      </NuxtLink>
    </div>

    <nav class="main-nav">
      <ul>
        <li>
          <NuxtLink :to="$localePath('/')" :class="{ active: $route.name === 'index' }">
            {{ $t('navHome') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath('/news')" :class="{ active: typeof $route.name === 'string' && $route.name.includes('news') }">
            {{ $t('navNews') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath('/about')" :class="{ active: $route.name === 'about' }">
            {{ $t('navAbout') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath('/events')" :class="{ active: $route.name === 'events' }">
            {{ $t('navEvents') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath('/cars')" :class="{ active: $route.name === 'cars' }">
            {{ $t('navCars') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="$localePath('/sponsors')" :class="{ active: $route.name === 'sponsors' }">
            {{ $t('navSponsors') }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="nav-controls">
      <button class="control-btn" @click="toggleLanguage">
        {{ $t('langLabel') }}
      </button>
      <button class="control-btn" @click="toggleTheme">
        {{ currentTheme === 'dark' ? $t('themeLight') : $t('themeDark') }}
      </button>
      <button class="mobile-menu-btn" @click="toggleMobileMenu">☰</button>
    </div>
  </header>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const { currentTheme, toggleTheme, initTheme } = useTheme()
const { openMobileMenu } = useMobileMenu()

const isScrolled = ref<boolean>(false)

const toggleLanguage = (): void => {
  const newLang = locale.value === 'zh' ? 'en' : 'zh'
  setLocale(newLang)
}

const toggleMobileMenu = (): void => {
  openMobileMenu()
}

const handleScroll = (): void => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style scoped>
.main-nav {
  margin: 0 40px;
}

.main-nav a {
  font-size: 17px;
}
/* Re-add other styles from original file if they were global vs scoped, but assuming scoped are enough */
/* Note: Original file didn't have much scoped styles, relied on global.css */
</style>
