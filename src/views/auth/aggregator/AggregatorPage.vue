<script setup lang="ts">

</script>

<template>
  <RouterView #default="{Component, route}">
    <Transition name="page">
      <template v-if="Component">
        <component :is="Component" :Key="route.fullPath"/>
      </template>
    </Transition>



  </RouterView>

</template>

<style scoped>

</style>