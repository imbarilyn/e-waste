<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';

interface SalesTab {
  label: string
  position: number
  isActive: boolean

}
const activeTab = ref<SalesTab>({
  label: 'Yesterday',
  position: 1,
  isActive: true
})
const props = defineProps<{
      recordTab: SalesTab[]
    }>()

const emits = defineEmits<{
  (event: 'activeTab', value: SalesTab): void
}>()

const setActiveTab = (position: number)=>{
  activeTab.value = props.recordTab.find((tab: SalesTab)=>{
    return tab.position === position
  }) as SalesTab

  emits('activeTab', activeTab.value)

}



onMounted(()=>{
  emits('activeTab', activeTab.value)
})
</script>

<template>
  <nav class="relative flex w-fit row  ms-1" >
    <div
        class="ps-4"
        v-for="tab in recordTab"
        :id="`tab-${tab.position}`"
        :key="tab.position"
    >
      <button
          @click="setActiveTab(tab.position)"
          class="btn btn-sm btn-ghost bg-transparent border-0"
          :class="[
              activeTab.label === tab.label
                ? 'text-gray-900'
                : ' text-gray-600',
            ]"
      >
        <span class="text-center">{{ tab.label }}</span>
      </button>
    </div>
    <div
        style="transition: all 0.35s ease"
        class="absolute bottom-0 transition-duration-300 border-top border-main-500 border-2 px-2"
        :style="{
            left: ((activeTab.position - 1) / recordTab.length) * 100 + '%',
            width: (1 / recordTab.length) * 100 + '%',
          }"
    ></div>
  </nav>

</template>

<style scoped>

</style>