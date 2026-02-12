<template>
  <span class="prose-span" v-bind="attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
const attrs = useAttrs()
</script>

<style scoped>
.prose-span {
  display: inline;
}
</style>
