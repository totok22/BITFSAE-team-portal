<template>
  <div class="prose-center">
    <slot />
  </div>
</template>

<style scoped>
.prose-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 1.5rem auto;
  width: 100%;
  max-width: 100%;
}

.prose-center :deep(*) {
  max-width: 100%;
}

.prose-center :deep(img) {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.prose-center :deep(figure) {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.prose-center :deep(h1),
.prose-center :deep(h2),
.prose-center :deep(h3),
.prose-center :deep(h4),
.prose-center :deep(h5),
.prose-center :deep(h6) {
  text-align: center;
  width: 100%;
}

.prose-center :deep(p) {
  text-align: center;
  width: 100%;
}
</style>
