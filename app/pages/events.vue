<template>
  <div class="events-page">
    <section id="events" class="section-container">
      <div class="section-header">
        <h2>{{ $t('sectionEvents') }}</h2>
        <div class="section-line"></div>
      </div>

      <div class="events-content">
        <!-- 总体介绍 -->
        <div class="events-intro">
          <p>{{ $t('eventIntro1') }}</p>
          <p>{{ $t('eventIntro2') }}</p>
        </div>

        <!-- 赛事性质 -->
        <div class="events-nature">
          <p>{{ $t('eventNatureDesc') }}</p>
        </div>

        <!-- 细分赛项 -->
        <div class="events-categories">
          <h3>{{ $t('eventsCategories') }}</h3>
          <div class="events-minimal">
            <div class="event-row">
              <div class="event-year">FSCC</div>
              <div class="event-detail">
                <h4>{{ $t('eventFSCCFuel') }}</h4>
                <p class="desc">{{ $t('eventFsccDesc') }}</p>
              </div>
            </div>
            <div class="event-row">
              <div class="event-year">FSEC</div>
              <div class="event-detail">
                <h4>{{ $t('eventFSECElectric') }}</h4>
                <p class="desc">{{ $t('eventFsecDesc') }}</p>
              </div>
            </div>
            <div class="event-row">
              <div class="event-year">FSAC</div>
              <div class="event-detail">
                <h4>{{ $t('eventFSACAutonomous') }}</h4>
                <p class="desc">{{ $t('eventFsacDesc') }}</p>
              </div>
            </div>
            <div class="event-row">
              <div class="event-year">BSC</div>
              <div class="event-detail">
                <h4>{{ $t('eventBSCBaja') }}</h4>
                <p class="desc">{{ $t('eventBscDesc') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 宗旨与展望 -->
        <div class="events-vision">
          <p>{{ $t('eventVision1') }}</p>
          <p>{{ $t('eventVision2') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.events-page { padding-top: 80px; }
.section-container { padding: 60px 20px; max-width: 900px; margin: 0 auto; }
.section-header { text-align: center; margin-bottom: 50px; }
.section-header h2 { font-size: 40px; font-weight: 700; color: var(--text-color); margin-bottom: 20px; }
.section-line { width: 80px; height: 4px; background: var(--primary-color); margin: 0 auto; border-radius: 2px; }
.events-content { line-height: 1.8; color: var(--text-color); }
.events-intro { margin-bottom: 50px; }
.events-intro p { text-indent: 2em; margin-bottom: 20px; }
.events-nature { background: var(--card-bg); padding: 40px; border-radius: 16px; border: 1px solid var(--glass-border); margin-bottom: 50px; }
.events-nature p { margin-bottom: 0; }

.events-list { margin-bottom: 50px; }
.events-list h3 { font-family: 'Outfit'; font-size: 24px; margin-bottom: 30px; color: var(--primary-color); }
.loading, .error, .empty { text-align: center; padding: 40px; color: var(--text-dim); font-size: 16px; }
.events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
.event-card { background: var(--card-bg); border-radius: 16px; overflow: hidden; border: 1px solid var(--glass-border); transition: transform 0.3s, box-shadow 0.3s; }
.event-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }
.event-link { display: block; text-decoration: none; color: inherit; }
.event-image { width: 100%; height: 200px; overflow: hidden; }
.event-image img { width: 100%; height: 100%; object-fit: cover; }
.event-info { padding: 24px; }
.event-date { font-size: 14px; color: var(--primary-color); font-weight: 600; margin-bottom: 8px; }
.event-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--text-color); }
.event-location { font-size: 14px; color: var(--text-dim); margin-bottom: 12px; }
.event-description { font-size: 14px; color: var(--text-dim); line-height: 1.6; margin-bottom: 16px; }
.event-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { font-size: 12px; padding: 4px 12px; background: var(--primary-color); color: white; border-radius: 12px; }

.events-categories { margin-bottom: 50px; }
.events-categories h3 { font-family: 'Outfit'; font-size: 24px; margin-bottom: 30px; color: var(--primary-color); }
.events-minimal { display: flex; flex-direction: column; gap: 30px; }
.event-row { display: flex; gap: 30px; align-items: flex-start; }
.event-year { min-width: 80px; font-size: 28px; font-weight: 900; color: var(--primary-color); font-family: 'Outfit'; }
.event-detail { flex: 1; }
.event-detail h4 { font-size: 18px; margin-bottom: 8px; color: var(--text-color); }
.event-detail .desc { color: var(--text-dim); line-height: 1.6; }
.events-vision { padding-top: 30px; border-top: 1px solid var(--glass-border); }
.events-vision p { text-indent: 2em; margin-bottom: 20px; }
@media (max-width: 768px) {
  .events-page { padding-top: 70px; }
  .section-container { padding: 40px 15px; }
  .section-header { margin-bottom: 40px; }
  .section-header h2 { font-size: 28px; margin-bottom: 15px; }
  .section-line { width: 60px; height: 3px; }
  .events-content p { font-size: 15px; line-height: 1.8; }
  .events-intro { margin-bottom: 40px; }
  .events-intro p, .events-vision p { font-size: 15px; text-indent: 1.5em; }
  .events-nature { padding: 25px 20px; border-radius: 12px; margin-bottom: 40px; }
  .events-nature p { font-size: 14px; }
  .events-list { margin-bottom: 40px; }
  .events-list h3 { font-size: 20px; margin-bottom: 25px; }
  .events-grid { grid-template-columns: 1fr; gap: 20px; }
  .event-image { height: 180px; }
  .event-info { padding: 20px; }
  .event-title { font-size: 16px; }
  .events-categories { margin-bottom: 40px; }
  .events-categories h3 { font-size: 20px; margin-bottom: 25px; }
  .events-minimal { gap: 25px; }
  .event-row { flex-direction: column; gap: 12px; padding-bottom: 25px; }
  .event-year { min-width: auto; font-size: 24px; }
  .event-detail h4 { font-size: 16px; }
  .event-detail .desc { font-size: 14px; }
  .events-vision { padding-top: 25px; }
}
@media (max-width: 480px) {
  .section-container { padding: 30px 12px; }
  .section-header h2 { font-size: 24px; }
  .events-content p { font-size: 14px; }
  .events-intro p, .events-vision p { font-size: 14px; text-indent: 1.2em; }
  .events-nature { padding: 20px 15px; }
  .events-list h3 { font-size: 18px; }
  .event-image { height: 160px; }
  .event-info { padding: 16px; }
  .event-title { font-size: 15px; }
  .event-date, .event-location, .event-description { font-size: 13px; }
  .events-categories h3 { font-size: 18px; }
  .event-year { font-size: 22px; }
  .event-detail h4 { font-size: 15px; }
  .event-detail .desc { font-size: 13px; }
}
</style>
