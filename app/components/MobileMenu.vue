<template>
  <div>
    <div class="mobile-overlay" :class="{ active: isMobileMenuOpen }" @click="closeMenu"></div>
    <nav class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <button class="mobile-menu-close" @click="closeMenu">×</button>
      <ul>
        <li>
          <NuxtLink :to="localePath('/')" @click="closeMenu">
            {{ $t('navHome') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/news')" @click="closeMenu">
            {{ $t('navNews') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/about')" @click="closeMenu">
            {{ $t('navAbout') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/events')" @click="closeMenu">
            {{ $t('navEvents') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/cars')" @click="closeMenu">
            {{ $t('navCars') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('/sponsors')" @click="closeMenu">
            {{ $t('navSponsors') }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu()

const closeMenu = () => {
  closeMobileMenu()
}
</script>

<style scoped>
/* Scoped styles are handled globally effectively by the id selectors or class names, 
   but ideally should be scoped here if they are component specific. 
   The original used global styles or CSS file. keeping as is. */
</style>
