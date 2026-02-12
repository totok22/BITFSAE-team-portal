<template>
  <div class="prose-right">
    <slot />
  </div>
</template>

<style scoped>
.prose-right {
  text-align: right;
  margin: 1rem 0;
  width: 100%;
}

.prose-right :deep(p) {
  text-align: right;
}
</style>
