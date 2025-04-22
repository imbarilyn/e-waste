<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {useAdminStore, useNotificationsStore} from "@/stores";

const adminStore = useAdminStore()

export interface Tabs {
  position: number
  name: string

}

const props = defineProps<{
  tab: Tabs[]
  isMoveNext: boolean
}>()
//
//  const tabs = [
//   {
//     position: 1,
//     name: 'Metadata'
//   },
//   {
//     position: 2,
//     name: 'Units'
//   },
//   {
//     position: 3,
//     name: 'Description'
//   },
//   {
//     position: 4,
//     name: 'Upload'
//   }
// ] as Tabs[]
const notificationStore = useNotificationsStore()
// onMounted(()=>{
//   emits('tabChange', props.tab[0])
//   console.log('Tabs')
// })

// watch(()=>props.isMoveNext, (value)=>{
//   if(value){
//     emits('tabChange', tab)
//     activeTab.value = tab
//   }
//   else{
//     return
//   }
//
// })
// const activeTab = ref<Tabs>(props.tab[0])
// console.log('active tab', activeTab.value)
const handleChangeTab = (tab: Tabs)=>{
  if(!props.isMoveNext){
    notificationStore.addNotification('Please fill collector\'s account information ', 'error')

    return

  } else{
    adminStore.setActiveTab(tab)
    // emits('tabChange', tab)
    // activeTab.value = tab
    console.log('selected tab', tab.name)
  }
  // emits('tabChange', tab)
  // activeTab.value = tab
  // console.log('selected tab', tab.name)
}

// const emits = defineEmits<{
//   (event: 'tabChange', value: Tabs): void
// }>()

</script>

<template>
  <div class="px-4">
    <nav class="flex gap-x-10" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
      <button   v-for="(tab, index) in props.tab" :key="tab.position" @click="handleChangeTab(tab)"  type="button"
                :class="[adminStore.activeTab.position === tab.position ? ' hs-tab-active:border-main-500 hs-tab-active:text-main-500 transition-all duration-500' : 'hs-tab-inactive',  !props.isMoveNext? 'text-slate-300': '']"
                class="hs-tab-active:font-semibold

                  py-4 px-1 inline-flex
                  items-center gap-x-2
                  text-main-950
                   border-b-2 border-transparent
                    md:text-lg  text-sm whitespace-nowrap
                     hover:text-main-500 focus:outline-none

                       focus:text-main-500 disabled:opacity-50
                       disabled:pointer-events-none
                        active" :id="`basic-tabs-${tab.position}`"
                aria-selected="true" data-hs-tab="#basic-tabs-1" aria-controls="basic-tabs-1" role="tab">
        {{ tab.name }}
      </button>
    </nav>
  </div>

</template>

<style scoped>

</style>