<script setup lang="ts">
import {onMounted, ref, watch, computed} from 'vue'
import {useAggregatorTabStore, useAggregatorStore, useAggregatorAuthStore, useNotificationsStore,} from "@/stores";
import {useRouter} from "vue-router";
import SidebarComponent from "@/components/aggregator/SidebarComponent.vue";
import ToastContainer from "@/components/commonComponent/toast/ToastContainer.vue";
import ToastAlert from "@/components/commonComponent/toast/ToastAlert.vue";


const aggregatorStore = useAggregatorStore()
const aggregatorTabStore = useAggregatorTabStore()
const aggregatorAuthStore = useAggregatorAuthStore()
const notificationStore = useNotificationsStore()
const router = useRouter()
const collapseSidebar = ref(false)
const handleCollapseSidebar = ()=>{
  collapseSidebar.value = !collapseSidebar.value
}

const expandSmall = ()=>{
  aggregatorStore.setExpandSidebarSmall(true)
}

const addProduct = ()=>{
  aggregatorTabStore.setActiveTab('Aggregator-Product')
  router.push({
    name: 'Aggregator-Product',
    params: {
      userId: aggregatorAuthStore.getAggregatorInfo()?.userId
    }
  })
}
</script>

<template>
  <div class="relative flex">
    <div class="absolute left-0 z-50 ps-4 pt-4 lg:hidden block">
      <button class="brn btn-sm btn-ghost rounded-lg" @click="expandSmall">
        <span class="material-icons-outlined !text-xl">menu_open</span>
      </button>
    </div>
    <div>
      <SidebarComponent :open="collapseSidebar" />
    </div>
<!--    right side-->
    <div
        class="flex-1 inset-0 md:mx-10 absolute transition-left duration-500" :class="[!collapseSidebar? 'lg:left-80 left-0': 'left-0']">
      <div class="md:pt-8 pt-4 justify-between  space-y-4 md:px-1 px-2 h-screen">
        <!--      top side-->
        <div class="flex  lg:justify-between  justify-end w-full" style="pointer-events: auto;">
          <div class="lg:block hidden btn btn-sm btn-ghost" @click="handleCollapseSidebar">
            <span class="material-icons-outlined !text-3xl">menu_open</span>
          </div>
          <div class="flex">
            <div @click="addProduct"  class="flex gap-2 btn btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300">
              <span class="material-icons-outlined text-sm">add</span>
              <span class="hidden md:block">New product</span>
            </div>
          </div>
        </div>

        <!--bottom side-->
        <RouterView #default="{Component, route}" class="px-3">
          <template v-if="Component">
            <component :is="Component" :key="route.fullPath"/>
          </template>
        </RouterView>
      </div>
    </div>
  </div>
  <teleport to="body">
    <ToastContainer v-if="notificationStore.hasNotifications">
      <template v-for="notification in notificationStore.getNotifications" :key="notification.id">
        <ToastAlert
            v-if="notification.id && notification.isShown"
            :id="notification.id"
            :is-shown="notification.isShown"
            :message="notification.message"
            :type="notification.type"
        />
      </template>
    </ToastContainer>
  </teleport>
</template>

<style scoped>
.hover-tab:hover {
  background-color: #f3f4f6;
  transform: scale(1.02);
}

</style>