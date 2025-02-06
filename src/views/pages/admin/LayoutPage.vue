<script setup lang="ts">
import {ref} from 'vue'
import SidebarComponent from "@/components/admin/SidebarComponent.vue";
import {useAdminStore} from "@/stores/adminStore.ts";
import {useRouter} from "vue-router";
import {useAdminTabStore} from "@/stores/adminTabStore.ts";



const adminStore = useAdminStore()
const adminTabStore = useAdminTabStore()
const router = useRouter()

const collapseSidebar = ref(false)
const handleCollapseSidebar = ()=>{
  // collapseSidebar.value = !collapseSidebar.value
  adminStore.setCollapseSidebar()
}

const expandSmall = ()=>{
  adminStore.setExpandSidebarSmall(true)
}

const addAggregator = ()=>{
router.push({
  name: 'Create-Aggregator'
})
  adminTabStore.setActiveTab('Create-Aggregator')

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
      <SidebarComponent :open="adminStore.collapseSidebar" />
    </div>
    <!--    right side-->
    <div
        class="flex-1 inset-0 md:mx-10 absolute transition-left duration-500" :class="[!adminStore.collapseSidebar? 'lg:left-80 left-0': 'left-0']">
      <div class="md:pt-8 pt-4 justify-between  space-y-4 md:px-1 px-2 h-screen">
        <!--      top side-->
        <div class="flex  lg:justify-between  justify-end w-full" style="pointer-events: auto;">
          <div class="lg:block hidden btn btn-sm btn-ghost" @click="handleCollapseSidebar">
            <span class="material-icons-outlined !text-3xl">menu_open</span>
          </div>
          <div class="flex">
            <div
                @click="addAggregator"
                class="flex gap-2 btn btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300">
              <span class="material-icons-outlined text-sm">add</span>
              <span class="hidden md:block">Add aggregator</span>
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
</template>

<style scoped>
.hover-tab:hover {
  background-color: #f3f4f6;
  transform: scale(1.02);
}

</style>