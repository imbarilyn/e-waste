<script setup lang="ts">

import NotificationBanner from "@/components/notifications/NotificationBanner.vue";
</script>

<template>

    <div class="bg-main-300 h-screen">
      <RouterView #default="{Component, route}">
        <Transition name="slide-in" mode="out-in" appear>
          <template v-if="Component">
            <component :is="Component" :key="route.fullPath" />
          </template>
        </Transition>

      </RouterView>
    </div>



<!--  <NotificationBanner message="" is-open="" type="" />-->

</template>

<style scoped>

.page-slide-enter-active, .page-slide-enter-active {
  transition: all 0.35s ease-out;
}
.page-slide-enter-from {
  opacity: 0;
  transform: translateY(50%);
}
.page-slide-leave-to{
  opacity: 0;
  transform: translateY(50%);
}


</style>