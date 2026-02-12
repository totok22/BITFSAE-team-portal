<template>
  <div class="sponsors-page">
    <section id="sponsors" class="section-container">
      <div class="section-header">
        <h2>{{ $t('sectionSponsors') }}</h2>
        <div class="section-line"></div>
      </div>
      
      <div class="sponsors-container">
        <NuxtImg
          :src="IMAGE_URLS.SPONSORS"
          alt="Sponsors"
          class="sponsors-img"
          format="webp,png"
          quality="85"
          loading="lazy"
          sizes="sm:100vw md:90vw lg:900px"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { IMAGE_URLS } from '~/utils/data'
</script>

<style scoped>
.sponsors-page {
  padding-top: 80px;
}

.section-container {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
}

.section-line {
  width: 80px;
  height: 4px;
  background: var(--primary-color);
  margin: 0 auto;
  border-radius: 2px;
}

.sponsors-container {
  text-align: center;
  padding: 40px 20px;
}

.sponsors-img {
  max-width: 100%;
  width: 900px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: block;
  margin: 0 auto;
}

.sponsors-img:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .sponsors-page {
    padding-top: 70px;
  }

  .section-container {
    padding: 40px 15px;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .section-header h2 {
    font-size: 28px;
    margin-bottom: 15px;
  }

  .section-line {
    width: 60px;
    height: 3px;
  }

  .sponsors-container {
    padding: 30px 15px;
  }

  .sponsors-img {
    width: 100%;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 30px 12px;
  }

  .section-header h2 {
    font-size: 24px;
  }

  .sponsors-container {
    padding: 20px 12px;
  }

  .sponsors-img {
    border-radius: 6px;
  }
}
</style>
