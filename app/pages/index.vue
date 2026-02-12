<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <section class="hero">
      <div class="hero-slider">
        <div class="hero-slides" :style="slideTransform">
          <div
            v-for="(slide, index) in heroSlides"
            :key="index"
            class="hero-slide"
          >
            <NuxtImg
              :src="slide.image"
              :alt="slide.alt"
              class="hero-slide-image"
              :class="{ 'animate-zoom': currentIndex === index }"
              format="webp"
              quality="90"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              sizes="100vw"
            />
          </div>
        </div>
      </div>

      <!-- 左下角标题 - 速度感设计 -->
      <div class="hero-content" :key="`title-${currentIndex}`">
        <div class="hero-text-wrapper">
          <div class="speed-line"></div>
          <h1 class="hero-title">
            <span
              v-for="(char, i) in animatedTitle"
              :key="i"
              class="char"
              :style="{ animationDelay: `${Number(i) * 0.03}s` }"
            >{{ char }}</span>
          </h1>
        </div>
      </div>

      <!-- 渐变遮罩 -->
      <div class="hero-overlay"></div>

      <!-- 进度条 -->
      <div class="hero-progress" :key="progressKey">
        <div class="progress-bar" :style="{ animationDuration: `${slideDuration}ms` }"></div>
      </div>

      <!-- 左下角导航点 -->
      <div class="slider-nav">
        <div class="slider-dots">
          <button
            v-for="(slide, index) in heroSlides"
            :key="index"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
            class="dot"
          >
            <span class="dot-inner"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- 赞助商大图 -->
    <div class="sponsors-showcase">
      <h3>{{ $t('partnersTitle') }}</h3>
      <NuxtImg
        :src="IMAGE_URLS.SPONSORS"
        :alt="$t('partnersAlt')"
        class="sponsors-image"
        loading="lazy"
        sizes="sm:100vw md:90vw lg:900px"
        format="webp,jpg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HERO_SLIDES, IMAGE_URLS } from '~/utils/data'
import type { Slide } from '~/types'

const { t } = useI18n()
const heroSlides: Slide[] = HERO_SLIDES
const slideDuration = 5000

const { currentIndex, goToSlide } = useCarousel(heroSlides, slideDuration)

// 进度条重绘key
const progressKey = ref(0)

// 监听当前索引变化，重置进度条和文字动画
watch(currentIndex, () => {
  progressKey.value++
})

const slideTransform = computed(() => {
  return {
    transform: `translateX(-${currentIndex.value * 33.333}%)`,
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  }
})

// 固定标题 - 单行，体现速度感，使用 i18n
const animatedTitle = computed(() => {
  const title = t('heroTitle')
  return title.split('').map((char: string) => (char === ' ' ? '\u00A0' : char))
})

// SEO
useHead({
  title: () => t('heroTitle')
})

useSeoMeta({
  description: () => t('heroDesc'),
  ogTitle: () => t('heroTitle'),
  ogDescription: () => t('heroDesc'),
  ogImage: 'https://img.bitfsae.xin/img/20260106143818204.jpg'
})
</script>

<style scoped>
.home-page {
  padding-top: 0;
}

.hero {
  position: relative;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: none;
}

.hero-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  margin: 0;
  padding: 0;
}

.hero-slides {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-slide {
  width: 33.333%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.hero-slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1);
}

.hero-slide-image.animate-zoom {
  animation: zoomIn 6s ease-out forwards;
}

@keyframes zoomIn {
  from { transform: scale(1.1); }
  to { transform: scale(1); }
}

/* 渐变遮罩 - 左下角更暗以便文字可读 */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

/* 左下角文字容器 */
.hero-content {
  position: absolute;
  bottom: 100px;
  left: 60px;
  z-index: 2;
  max-width: 600px;
}

.hero-text-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 速度线装饰 - 体现速度感 */
.speed-line {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), transparent);
  margin-bottom: 12px;
  animation: speedLine 0.8s ease-out forwards;
}

@keyframes speedLine {
  0% { width: 0; opacity: 0; }
  100% { width: 80px; opacity: 1; }
}

/* 单行标题 - 速度感动画 */
.hero-title {
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.15em;
  line-height: 1.4;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
}

/* 英文模式下增加单词间距 */
html[lang="en"] .hero-title {
  letter-spacing: 0.02em;
  word-spacing: 0.15em;
}

.hero-title .char {
  display: inline-block;
  opacity: 0;
  /* 速度感：从左侧快速滑入，带倾斜和模糊效果 */
  transform: translateX(-60px) skewX(-15deg);
  filter: blur(8px);
  animation: speedIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes speedIn {
  0% {
    opacity: 0;
    transform: translateX(-60px) skewX(-15deg);
    filter: blur(8px);
  }
  60% {
    opacity: 0.8;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) skewX(0);
    filter: blur(0);
  }
}

/* 进度条 */
.hero-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 3;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #60a5fa);
  width: 0;
  animation: progress linear forwards;
}

@keyframes progress {
  to { width: 100%; }
}

/* 左下角导航点 */
.slider-nav {
  position: absolute;
  bottom: 40px;
  left: 60px;
  z-index: 3;
  margin: 0;
  padding: 0;
}

.slider-dots {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
}

.dot-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}

.dot.active .dot-inner {
  background: white;
  transform: scale(1.3);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
}

.dot:hover .dot-inner {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

/* 赞助商区域 */
.sponsors-showcase {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
}

.sponsors-showcase h3 {
  color: var(--text-dim);
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.sponsors-image {
  max-width: 90%;
  width: 900px;
  border-radius: 8px;
  opacity: 1;
  display: block;
  margin: 0 auto;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .hero-content {
    bottom: 80px;
    left: 24px;
    max-width: 320px;
  }

  .hero-title {
    font-size: 20px;
    letter-spacing: 0.1em;
  }

  .speed-line {
    height: 2px;
    animation: speedLineMobile 0.6s ease-out forwards;
  }

  @keyframes speedLineMobile {
    0% { width: 0; opacity: 0; }
    100% { width: 50px; opacity: 1; }
  }

  @keyframes speedIn {
    0% {
      opacity: 0;
      transform: translateX(-40px) skewX(-10deg);
      filter: blur(6px);
    }
    60% {
      opacity: 0.8;
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: translateX(0) skewX(0);
      filter: blur(0);
    }
  }

  .slider-nav {
    bottom: 24px;
    left: 24px;
  }

  .sponsors-showcase {
    padding: 40px 15px;
  }

  .sponsors-showcase h3 {
    font-size: 12px;
    margin-bottom: 20px;
  }

  .sponsors-image {
    width: 100%;
    max-width: 100%;
    border-radius: 6px;
  }
}

@media (max-width: 480px) {
  .hero-content {
    bottom: 70px;
    left: 20px;
    max-width: 260px;
  }

  .hero-title {
    font-size: 16px;
    letter-spacing: 0.08em;
  }

  .sponsors-showcase {
    padding: 30px 15px;
  }
}
</style>
