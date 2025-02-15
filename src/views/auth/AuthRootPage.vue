<script setup lang="ts">
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import NotificationBanner from "@/components/commonComponent/NotificationBanner.vue";
import {useAggregatorAuthStore} from "@/stores/aggregatorAuthStore.ts";


const adminAuthStore = useAdminAuthStore()
const aggregatedAuthStore = useAggregatorAuthStore()
</script>

<template>
  <div class="relative">
    <div class="">
      <NotificationBanner :message="adminAuthStore.IsAuthenticationError.message || aggregatedAuthStore.IsAuthenticationError.message"
                          :is-open=adminAuthStore.IsAuthenticationError.isError || aggregatedAuthStore.IsAuthenticationError.isError
                          :type="adminAuthStore.IsAuthenticationError.type || aggregatedAuthStore.IsAuthenticationError.isError" />

    </div>


    <RouterView #default="{Component, route}">
      <Transition name="page" mode="out-in" appear>
        <template v-if="Component">
          <component :is="Component" :key="route.fullPath" />
        </template>
      </Transition>

    </RouterView>

  </div>







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