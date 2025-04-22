<script setup lang="ts">
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import NotificationBanner from "@/components/commonComponent/NotificationBanner.vue";
import {useAggregatorAuthStore} from "@/stores/aggregatorAuthStore.ts";
import { onMounted } from "vue";


const adminAuthStore = useAdminAuthStore()
const aggregatorAuthStore = useAggregatorAuthStore()
onMounted(()=>{
  console.log('Here at the routerview', aggregatorAuthStore.isAuthenticationError)
})
</script>

<template>
  <div class="relative">
<!--    <div v-if="adminAuthStore.IsAuthenticationError.isError || aggregatorAuthStore.isAuthenticationError.isError">-->
<!--      <NotificationBanner :message="adminAuthStore.IsAuthenticationError.message || aggregatorAuthStore.isAuthenticationError.message"-->
<!--                          :is-open=adminAuthStore.IsAuthenticationError.isError || aggregatorAuthStore.isAuthenticationError.isError-->
<!--                          :type="adminAuthStore.IsAuthenticationError.type || aggregatorAuthStore.isAuthenticationError.isError" />-->

<!--    </div>-->


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