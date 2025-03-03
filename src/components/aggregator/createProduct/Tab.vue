<script setup lang="ts">

import {onMounted, ref} from "vue";

export interface Tabs {
  position: number
  name: string
}

 const tabs = [
  {
    position: 1,
    name: 'Metadata'
  },
  {
    position: 2,
    name: 'Units'
  },
  {
    position: 3,
    name: 'Description'
  },
  {
    position: 4,
    name: 'Upload'
  }
] as Tabs[]

onMounted(()=>{
  emits('tabChange', tabs[0])

})
const activeTab = ref<Tabs>(tabs[0])
const handleChangeTab = (tab: Tabs)=>{
  emits('tabChange', tab)
  activeTab.value = tab
}

const emits = defineEmits<{
  (event: 'tabChange', value: Tabs): void
}>()

</script>

<template>
  <div class="px-4">
    <nav class="flex gap-x-2" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
      <button   v-for="(tab, index) in tabs" :key="tab.position" @click="handleChangeTab(tab)"  type="button"
                :class="[activeTab.position === tab.position ? ' hs-tab-active:border-main-500 hs-tab-active:text-main-500 transition-all duration-500' : 'hs-tab-inactive']"
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