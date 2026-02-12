<template>
  <footer>
    <div class="footer-content">
      <div class="footer-section footer-brand">
        <NuxtImg src="/assets/images/bitfsae.svg" alt="BITFSAE Logo" class="logo-small" loading="lazy" />
        <p style="display: flex; align-items: center; gap: 8px;">
          <NuxtImg src="/assets/images/date.svg" alt="Date" class="contact-icon" loading="lazy" />
          Est. 2009
        </p>
        <p style="display: flex; align-items: center; gap: 8px;">
          <NuxtImg src="/assets/images/location.svg" alt="Location" class="contact-icon" loading="lazy" />
          {{ $t('addressLine1') }}
        </p>
        <p>{{ $t('addressLine2') }}</p>
        <p style="margin-top: 20px; font-size: 12px; opacity: 0.4;">
          &copy; 2026 BITFSAE. All Rights Reserved.
        </p>
      </div>

      <div class="footer-section">
        <h3 style="font-size: 16px; margin-bottom: 10px;">{{ $t('footerContact') }}</h3>
        <a href="mailto:wulibo@bitfsae.xin" class="contact-item">
          <NuxtImg src="/assets/images/email.svg" alt="Email" class="contact-icon" loading="lazy" />
          wulibo@bitfsae.xin
        </a>

        <div style="margin-top: 30px;">
          <h3 style="font-size: 16px; color: var(--text-dim); margin-bottom: 10px;">{{ $t('telemetrySystem') }}</h3>
          <button type="button" @click="showLoginInfo" class="telemetry-entry"
             style="margin-top: 0; background: transparent; padding: 0; border: none; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: var(--card-bg); border: 1px solid var(--glass-border); transition: all 0.3s ease; cursor: pointer;"
             :aria-label="$t('telemetrySystem')">
            <NuxtImg src="/assets/images/telegraf.svg" alt="" loading="lazy" class="telemetry-icon" style="width: 18px; height: 18px;" />

          </button>
        </div>
      </div>

      <div class="footer-section">
        <h3 style="font-size: 16px; margin-bottom: 10px;">{{ $t('footerFollow') }}</h3>
        <div class="social-media-container">
          <NuxtImg :src="IMAGE_URLS.SOCIAL_MEDIA_QRCODE"
               alt="Social Media QR Codes" class="media-image"
               loading="lazy"
               format="webp,jpg"
               quality="85"
               sizes="sm:80vw md:60vw lg:400px"
               style="opacity: 1; filter: none; width: 400px;" />
        </div>

        <div style="margin-top: 30px;">
          <h4 style="font-size: 16px; color: var(--text-dim); margin-bottom: 15px;">{{ $t('friendLinks') }}</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 13px;">
            <a :href="EXTERNAL_LINKS.friend.fsc" target="_blank" rel="noopener noreferrer" class="friend-link"
               style="display: flex; align-items: center; gap: 4px; text-decoration: none; color: var(--text-dim);">
              <NuxtImg src="/assets/images/link-icon.svg" alt="link" loading="lazy" class="link-icon" style="width: 12px;" />
              {{ $t('friendLinkFsc') }}
            </a>
            <a :href="EXTERNAL_LINKS.friend.saeChina" target="_blank" rel="noopener noreferrer" class="friend-link"
               style="display: flex; align-items: center; gap: 4px; text-decoration: none; color: var(--text-dim);">
              <NuxtImg src="/assets/images/link-icon.svg" alt="link" loading="lazy" class="link-icon" style="width: 12px;" />
              {{ $t('saeChina') }}
            </a>
            <a :href="EXTERNAL_LINKS.friend.fsg" target="_blank" rel="noopener noreferrer" class="friend-link"
               style="display: flex; align-items: center; gap: 4px; text-decoration: none; color: var(--text-dim);">
              <NuxtImg src="/assets/images/link-icon.svg" alt="link" loading="lazy" class="link-icon" style="width: 12px;" />
              {{ $t('friendLinkFsg') }}
            </a>
            <a :href="EXTERNAL_LINKS.friend.bitfsd" target="_blank" rel="noopener noreferrer" class="friend-link"
               style="display: flex; align-items: center; gap: 4px; text-decoration: none; color: var(--text-dim);">
              <NuxtImg src="/assets/images/link-icon.svg" alt="link" loading="lazy" class="link-icon" style="width: 12px;" />
              {{ $t('friendLinkBitfsd') }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="beian-strip">
      <a :href="EXTERNAL_LINKS.beian" target="_blank" rel="noopener noreferrer">
        <NuxtImg src="/assets/images/beian-icon.png" alt="公安备案图标" class="beian-icon" loading="lazy"
             style="width: 16px; height: 16px;" />
        <span>{{ $t('gongAn') }}</span>
      </a>
      <span class="divider">|</span>
      <a :href="EXTERNAL_LINKS.icp" target="_blank" rel="noopener noreferrer">{{ $t('icp') }}</a>
    </div>
  </footer>
</template>

<script setup>
import { IMAGE_URLS } from '~/utils/data'
import { EXTERNAL_LINKS } from '~/utils/site'
const { openLoginModal } = useLoginModal()

const showLoginInfo = () => {
  openLoginModal()
}
</script>
