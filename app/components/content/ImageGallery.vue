<template>
  <div class="image-gallery" :style="gridStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  cols?: number | string
}>()

const gridStyle = computed(() => {
  const cols = props.cols ? Number(props.cols) : 3
  return {
    '--gallery-cols': cols
  }
})
</script>

<style scoped>
.image-gallery {
  display: grid;
  gap: 0.75rem;
  margin: 1.5rem 0;
  grid-template-columns: repeat(var(--gallery-cols, 3), minmax(0, 1fr));
}

.image-gallery :deep(figure) {
  margin: 0;
}

.image-gallery :deep(img) {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-gallery :deep(img:hover) {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.image-gallery :deep(figcaption) {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-dim);
}

@media (max-width: 1024px) {
  .image-gallery {
    grid-template-columns: repeat(min(var(--gallery-cols, 3), 2), minmax(0, 1fr));
  }
  
  .image-gallery :deep(img) {
    height: 180px;
  }
}

@media (max-width: 640px) {
  .image-gallery {
    grid-template-columns: 1fr;
  }
  
  .image-gallery :deep(img) {
    height: 220px;
  }
}
</style>
