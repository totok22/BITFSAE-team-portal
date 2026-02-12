<template>
  <div class="about-page">
    <section id="about" class="section-container">
      <div class="section-header">
        <h2>{{ $t('sectionAbout') }}</h2>
        <div class="section-line"></div>
      </div>
      
      <div class="about-content">
        <div class="about-text">
          <h3>{{ $t('aboutHistoryTitle') }}</h3>
          <p>{{ $t('aboutHistoryDesc') }}</p>

          <div class="about-grid">
            <!-- 车队合影占位 -->
            <div class="team-photo-placeholder">
              <span>{{ $t('teamPhoto') }}</span>
              <div class="gradient-overlay"></div>
            </div>

            <!-- 微信公众号二维码 -->
            <div class="wechat-card hover-lift">
              <NuxtImg
                :src="IMAGE_URLS.WECHAT_QRCODE"
                alt="WeChat Official Account"
                class="wechat-qrcode"
                format="webp,jpg"
                quality="85"
                loading="lazy"
                sizes="sm:100vw md:60vw lg:600px"
              />
              <p>{{ $t('scanWeChat') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { IMAGE_URLS } from '~/utils/data'
</script>

<style scoped>
.about-page {
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

.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-text {
  flex: 1;
  width: 100%;
  max-width: 800px;
}

.about-text h3 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 20px;
}

.about-text p {
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-dim);
  margin-bottom: 40px;
}

.about-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  width: 100%;
}

.team-photo-placeholder {
  width: 100%;
  max-width: 800px;
  height: 450px;
  background: var(--card-bg);
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  position: relative;
  overflow: hidden;
}

.team-photo-placeholder span {
  font-family: 'Inter';
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 18px;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(0, 102, 255, 0.03));
  pointer-events: none;
}

.wechat-card {
  text-align: center;
  background: var(--card-bg);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
  width: 100%;
  max-width: 600px;
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.wechat-qrcode {
  width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
  margin: 0 auto 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.wechat-card p {
  font-size: 15px;
  color: var(--text-dim);
  opacity: 0.9;
  margin: 0;
}

@media (max-width: 768px) {
  .about-page {
    padding-top: 70px;
  }

  .section-container {
    padding: 40px 15px;
  }

  .section-header h2 {
    font-size: 28px;
    margin-bottom: 15px;
  }

  .section-line {
    width: 60px;
    height: 3px;
  }

  .about-text h3 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .about-text p {
    font-size: 16px;
    line-height: 1.7;
  }

  .about-grid {
    gap: 30px;
  }

  .team-photo-placeholder {
    height: 250px;
    border-radius: 12px;
  }

  .team-photo-placeholder span {
    font-size: 16px;
  }

  .wechat-card {
    padding: 25px 20px;
    border-radius: 16px;
    max-width: 100%;
  }

  .wechat-qrcode {
    border-radius: 10px;
  }

  .wechat-card p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .section-container {
    padding: 30px 12px;
  }

  .section-header h2 {
    font-size: 24px;
  }

  .about-text h3 {
    font-size: 20px;
  }

  .about-text p {
    font-size: 15px;
  }

  .team-photo-placeholder {
    height: 200px;
  }

  .team-photo-placeholder span {
    font-size: 14px;
  }

  .wechat-card {
    padding: 20px 15px;
  }

  .wechat-card p {
    font-size: 13px;
  }
}
</style>
