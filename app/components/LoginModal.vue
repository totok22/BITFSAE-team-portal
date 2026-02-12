<template>
  <div class="modal-overlay" :class="{ active: isLoginModalOpen }" @click.self="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-title">{{ $t('modalTitle') }}</div>
      <div class="info-table">
        <div class="info-row">
          <span class="info-label">{{ $t('labelUser') }}</span>
          <span class="info-value">public-viewer</span>
        </div>
        <div class="info-row">
          <span class="info-label">{{ $t('labelPass') }}</span>
          <span class="info-value">VIEWER</span>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-btn primary" @click="proceedToGrafana">
          {{ $t('btnConfirm') }}
        </button>
        <button class="modal-btn secondary" @click="closeModal">
          {{ $t('btnCancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EXTERNAL_LINKS } from '~/utils/site'

const { isLoginModalOpen, closeLoginModal } = useLoginModal()

const closeModal = () => {
  closeLoginModal()
}

const proceedToGrafana = () => {
  window.open(EXTERNAL_LINKS.telemetryMonitor, '_blank')
  closeModal()
}
</script>

<style scoped>
/* Copied styles from LoginModal.vue */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: none; align-items: center; justify-content: center; z-index: 9999; }
.modal-overlay.active { display: flex; }
.modal-content { background: #1a1a1a; border-radius: 12px; padding: 30px 40px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); border: 1px solid #333; }
[data-theme="light"] .modal-content { background: #ffffff; border: 1px solid #e0e0e0; }
.modal-title { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 25px; }
[data-theme="light"] .modal-title { color: #1d1d1f; }
.info-table { background: #252525; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
[data-theme="light"] .info-table { background: #f5f5f5; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.info-row:last-child { border-bottom: none; }
.info-label { font-weight: 600; color: #ffffff; font-size: 16px; }
[data-theme="light"] .info-label { color: #1d1d1f; }
.info-value { font-family: 'Courier New', monospace; background: rgba(0, 122, 255, 0.2); padding: 8px 16px; border-radius: 4px; color: #007aff; font-weight: 700; font-size: 16px; }
.modal-actions { display: flex; gap: 15px; justify-content: flex-end; margin-top: 30px; }
.modal-btn { padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; color: white; flex: 1; }
.modal-btn.primary { background: var(--primary-color); }
.modal-btn.primary:hover { box-shadow: 0 0 20px var(--primary-glow); transform: translateY(-2px); }
.modal-btn.secondary { background: transparent; border: 1px solid #555; color: #a0a0a0; }
[data-theme="light"] .modal-btn.secondary { border-color: #ccc; color: #86868b; }
.modal-btn.secondary:hover { background: #333; color: #ffffff; }
[data-theme="light"] .modal-btn.secondary:hover { background: #e5e5e5; color: #1d1d1f; }
</style>
