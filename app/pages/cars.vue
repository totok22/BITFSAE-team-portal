<template>
  <div class="cars-page">
    <section id="cars" class="section-container">
      <div class="section-header">
        <h2>{{ $t('sectionCars') }}</h2>
        <div class="section-line"></div>
      </div>

      <!-- 赛车列表 -->
      <div class="cars-timeline">
        <div
          v-for="(car, index) in carsData"
          :key="index"
          class="car-timeline-item"
        >
          <!-- 时间线节点 -->
          <div class="timeline-node">
            <div class="timeline-year">{{ car.year }}</div>
            <div class="timeline-dot"></div>
          </div>

          <!-- 赛车卡片 -->
          <div class="car-card" v-auto-animate>
            <!-- 卡片头部 -->
            <div class="car-header">
              <div class="car-title-wrapper">
                <h3 class="car-title">{{ car.model }}</h3>
              </div>
            </div>

            <!-- 卡片内容 -->
            <div class="car-body">
              <!-- 左侧：图片和核心参数 -->
              <div class="car-image-section">
                <div class="car-image-wrapper">
                  <NuxtImg
                    v-if="car.image"
                    :src="car.image"
                    :alt="`${car.year} ${car.model}`"
                    class="car-image"
                    format="webp"
                    quality="90"
                    loading="lazy"
                    sizes="sm:100vw md:50vw lg:40vw"
                  />
                  <div v-else class="car-image-placeholder">
                    <Icon name="lucide:car" class="w-20 h-20" />
                    <span>{{ car.model }}</span>
                  </div>
                </div>

                <!-- 核心参数卡片 -->
                <div class="core-specs">
                  <h4 class="specs-title">
                    <Icon name="lucide:gauge" class="w-4 h-4" />
                    {{ $t('specsCore') }}
                  </h4>
                  <div class="specs-grid">
                    <div class="spec-card">
                      <div class="spec-icon">
                        <Icon name="lucide:weight" class="w-5 h-5" />
                      </div>
                      <div class="spec-info">
                        <div class="spec-label">{{ $t('specsWeight') }}</div>
                        <div class="spec-value">{{ car.specs.weight }}</div>
                      </div>
                    </div>
                    <div class="spec-card">
                      <div class="spec-icon power">
                        <Icon name="lucide:zap" class="w-5 h-5" />
                      </div>
                      <div class="spec-info">
                        <div class="spec-label">{{ $t('specsPower') }}</div>
                        <div class="spec-value">{{ car.specs.maxPower }}</div>
                      </div>
                    </div>
                    <div class="spec-card">
                      <div class="spec-icon voltage">
                        <Icon name="lucide:battery-charging" class="w-5 h-5" />
                      </div>
                      <div class="spec-info">
                        <div class="spec-label">{{ $t('specsVoltage') }}</div>
                        <div class="spec-value">{{ car.specs.maxVoltage }}</div>
                      </div>
                    </div>
                    <div class="spec-card">
                      <div class="spec-icon capacity">
                        <Icon name="lucide:battery" class="w-5 h-5" />
                      </div>
                      <div class="spec-info">
                        <div class="spec-label">{{ $t('specsCapacity') }}</div>
                        <div class="spec-value">{{ car.specs.capacity }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 特点标签 - 移到左侧 -->
                <div v-if="car.features && car.features.length" class="features-card">
                  <h4 class="features-title">
                    <Icon name="lucide:sparkles" class="w-4 h-4" />
                    {{ $t('specsFeatures') }}
                  </h4>
                  <div class="features-list">
                    <span v-for="(feature, i) in car.features" :key="i" class="feature-tag">
                      {{ feature }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 右侧：详细参数 -->
              <div class="car-details-section">
                <!-- 参数表格 -->
                <div class="details-card">
                  <h4 class="details-title">
                    <Icon name="lucide:settings-2" class="w-4 h-4" />
                    {{ $t('specsDetail') }}
                  </h4>
                  <div class="details-content">
                    <div class="detail-group">
                      <div class="group-header">{{ $t('specsStructure') }}</div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsFrame') }}</span>
                        <span class="detail-value">{{ car.specs.frame }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsBodyMaterial') }}</span>
                        <span class="detail-value">{{ car.specs.bodyMaterial }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsSuspension') }}</span>
                        <span class="detail-value">{{ car.specs.suspensionFR }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsDimensions') }}</span>
                        <span class="detail-value">{{ car.specs.dimensions }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsWheelbase') }}</span>
                        <span class="detail-value">{{ car.specs.wheelbase }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsGroundClearance') }}</span>
                        <span class="detail-value">{{ car.specs.groundClearance }}</span>
                      </div>
                    </div>

                    <div class="detail-group">
                      <div class="group-header">{{ $t('specsPowerSystem') }}</div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsMotor') }}</span>
                        <span class="detail-value">{{ car.specs.motor }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsBatteryBrand') }}</span>
                        <span class="detail-value">{{ car.specs.batteryBrand }} / {{ car.specs.batteryType }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsTransmission') }}</span>
                        <span class="detail-value">{{ car.specs.transmission }}</span>
                      </div>
                    </div>

                    <div class="detail-group">
                      <div class="group-header">{{ $t('specsTire') }}</div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsWheel') }}</span>
                        <span class="detail-value">{{ car.specs.wheel }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">{{ $t('specsTire') }}</span>
                        <span class="detail-value">{{ car.specs.tire }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Car {
  year: string
  model: string
  image?: string
  specs: Record<string, any>
  features?: string[]
}

const { data } = await useAsyncData('cars', () =>
  queryCollection('cars')
    .order('year', 'DESC')
    .all()
)

const getSpecsScore = (specs: Record<string, any> | undefined) => {
  if (!specs) return 0
  return Object.values(specs).filter(Boolean).length
}

const carsData = computed(() => {
  if (!data.value) return []

  const normalized = data.value.map((item: any) => ({
    year: item.year,
    model: item.model,
    image: item.image,
    specs: item.specs || {},
    features: item.features || [],
    description: item.description || ''
  }))

  // 去重：同一代车型优先保留参数更完整的一份
  const deduped = new Map<string, (typeof normalized)[number]>()
  for (const car of normalized) {
    const key = `${car.year}-${car.model}`
    const current = deduped.get(key)
    if (!current) {
      deduped.set(key, car)
      continue
    }

    const currentScore = getSpecsScore(current.specs) + (current.features?.length || 0)
    const nextScore = getSpecsScore(car.specs) + (car.features?.length || 0)
    if (nextScore > currentScore) {
      deduped.set(key, car)
    }
  }

  return Array.from(deduped.values())
})
</script>

<style scoped>
.cars-page { 
  padding-top: 80px; 
  background: linear-gradient(180deg, var(--bg-color) 0%, rgba(0,122,255,0.02) 100%);
  min-height: 100vh;
}

.section-container { 
  padding: 60px 20px; 
  max-width: 1400px; 
  margin: 0 auto; 
}

.section-header { 
  text-align: center; 
  margin-bottom: 60px; 
}

.section-header h2 { 
  font-size: 48px; 
  font-weight: 800; 
  color: var(--text-color); 
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.section-line { 
  width: 100px; 
  height: 4px; 
  background: linear-gradient(90deg, var(--primary-color), #60a5fa);
  margin: 0 auto; 
  border-radius: 2px; 
}

/* 时间线布局 */
.cars-timeline {
  position: relative;
  padding-left: 60px;
}

.cars-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--primary-color), transparent);
}

.car-timeline-item {
  position: relative;
  margin-bottom: 60px;
}

.timeline-node {
  position: absolute;
  left: -60px;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.timeline-year {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
  font-family: 'Outfit', monospace;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 2px;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 3px solid var(--bg-color);
  box-shadow: 0 0 0 2px var(--primary-color);
}

/* 赛车卡片 */
.car-card { 
  background: var(--card-bg); 
  border-radius: 24px; 
  border: 1px solid var(--glass-border); 
  overflow: hidden; 
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.car-card:hover { 
  box-shadow: 0 12px 48px rgba(0, 122, 255, 0.12); 
  border-color: rgba(0, 122, 255, 0.2);
  transform: translateY(-4px);
}

/* 卡片头部 */
.car-header { 
  background: linear-gradient(135deg, var(--primary-color) 0%, #1e40af 100%);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.car-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.car-year {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  font-family: 'Outfit', monospace;
}

.car-title { 
  font-size: 32px; 
  font-weight: 800; 
  color: white; 
  margin: 0;
  font-family: 'Outfit', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.car-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
}

/* 卡片主体 */
.car-body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  padding: 32px;
}

/* 左侧：图片区域 */
.car-image-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.car-image-wrapper {
  background: linear-gradient(135deg, rgba(0,122,255,0.03) 0%, rgba(0,122,255,0.08) 100%);
  border-radius: 16px;
  padding: 24px;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0,122,255,0.1);
}

.car-image {
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.15));
  transition: transform 0.4s ease;
}

.car-card:hover .car-image {
  transform: scale(1.03);
}

.car-image-placeholder {
  width: 100%;
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-dim);
  font-family: 'Outfit';
  font-size: 24px;
  font-weight: 700;
}

/* 核心参数 */
.core-specs {
  background: linear-gradient(135deg, rgba(0,122,255,0.05) 0%, rgba(0,122,255,0.02) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0,122,255,0.1);
}

.specs-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.spec-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
}

.spec-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,122,255,0.1);
}

.spec-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0,122,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.spec-icon.power,
.spec-icon.voltage,
.spec-icon.capacity {
  background: rgba(0,122,255,0.1);
  color: var(--primary-color);
}

.spec-info {
  flex: 1;
}

.spec-label {
  font-size: 11px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.spec-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-color);
}

/* 特点标签 - 移到左侧，与核心参数保持一致 */
.features-card {
  background: linear-gradient(135deg, rgba(0,122,255,0.05) 0%, rgba(0,122,255,0.02) 100%);
  border-radius: 16px;
  padding: 16px 20px;
  border: 1px solid rgba(0,122,255,0.1);
}

.features-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(0,122,255,0.1);
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,122,255,0.2);
}

.feature-tag:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,122,255,0.2);
}

/* 右侧：详细参数 */
.car-details-section {
  display: flex;
  flex-direction: column;
}

.details-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--glass-border);
  flex: 1;
}

.details-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group-header {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-color);
  padding: 8px 12px;
  background: rgba(0,122,255,0.08);
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--glass-border);
  transition: background 0.2s ease;
}

.detail-row:hover {
  background: rgba(0,122,255,0.03);
  border-radius: 6px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 13px;
  color: var(--text-dim);
  font-weight: 500;
}

.detail-value {
  font-size: 13px;
  color: var(--text-color);
  font-weight: 600;
  text-align: right;
  max-width: 60%;
}

/* 响应式 */
@media (max-width: 1200px) {
  .car-body { 
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .cars-page { padding-top: 70px; }
  .section-container { padding: 40px 16px; }
  .section-header { margin-bottom: 40px; }
  .section-header h2 { font-size: 32px; }
  .section-line { width: 80px; height: 3px; }
  
  .cars-timeline {
    padding-left: 0;
  }
  
  .cars-timeline::before {
    display: none;
  }
  
  .timeline-node {
    position: relative;
    left: 0;
    flex-direction: row;
    padding: 0 20px;
    margin-bottom: 16px;
  }
  
  .timeline-year {
    writing-mode: horizontal-tb;
    font-size: 18px;
  }
  
  .car-timeline-item {
    margin-bottom: 40px;
  }
  
  .car-header {
    padding: 20px 24px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .car-title-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .car-title {
    font-size: 24px;
  }
  
  .car-body {
    padding: 24px;
    gap: 24px;
  }
  
  .car-image-wrapper {
    min-height: 220px;
    padding: 16px;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .spec-card {
    padding: 12px;
  }
  
  .details-card {
    padding: 20px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .detail-value {
    text-align: left;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .section-header h2 { font-size: 28px; }
  .car-title { font-size: 20px; }
  .car-header { padding: 16px 20px; }
  .car-body { padding: 16px; }
  .spec-icon { width: 32px; height: 32px; }
  .spec-value { font-size: 14px; }
  .feature-tag { padding: 5px 10px; font-size: 11px; }
}
</style>
