<script setup lang="ts">
// npm install -D tailwindcss@3 postcss autoprefixer
// npx tailwindcss init -p
</script>

<template>
<RouterView #default="{Component, route}">
  <template v-if="Component">
    <component :is="Component" :key="route.fullPath" />
  </template>
</RouterView>
</template>

<style scoped>

</style>
