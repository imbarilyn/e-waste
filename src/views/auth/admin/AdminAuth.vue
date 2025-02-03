<script setup lang="ts">

import NotificationBanner from "@/components/notifications/NotificationBanner.vue";
</script>

<template>


      <RouterView #default="{Component, route}">
        <Transition name="page" mode="out-in" appear>
          <template v-if="Component">
            <component :is="Component" :key="route.fullPath" />
          </template>
        </Transition>

      </RouterView>




<!--  <NotificationBanner message="" is-open="" type="" />-->

</template>

<style scoped>

.page-enter-from {
  opacity: 0;
  transform: translateY(50%);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(50%)
}

.page-enter-active, .page-leave-active {
  transition: all 0.35s ease-out;
}

</style>