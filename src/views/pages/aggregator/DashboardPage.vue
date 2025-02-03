<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {useTabStore} from "@/stores/tabstore.ts";
import {useRouter} from "vue-router";


const open = ref(true)

const tabStore = useTabStore()
const router = useRouter()

const handleTab = (tab: string)=>{
  tabStore.setActiveTab(tab)
  router.push({
    name: tab
  })
}


</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10 flex">
      <TransitionChild as="template" class="flex-1" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed  inset-0 left-80  ">
          <div class="pt-8 justify-between  space-y-4 px-4 h-screen">
            <!--      top side-->
            <div class="flex  justify-between w-full" style="pointer-events: auto;">
              <div class="btn btn-sm btn-ghost" @click="collapseSidebar">
                <span class="material-icons-outlined !text-3xl">menu_open</span>
              </div>
              <div>
                <div class="flex gap-2 btn btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300">
                  <span class="material-icons-outlined">add</span>
                  <span>New product</span>
                </div>
              </div>
            </div>

            <!--bottom side-->
            <RouterView #default="{Component, route}">
              <template v-if="Component">
                <component :is="Component" :key="route.fullPath"/>
              </template>
            </RouterView>
          </div>
        </div>
      </TransitionChild>
      <div class="absolute  inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 left-0 flex max-w-80">
          <TransitionChild as="template"
                           class="transition-transform duration-500"
                           :class="{ 'translate-x-0': open, '-translate-x-full': !open }">
            <DialogPanel class="pointer-events-auto relative w-80 ">
              <div class="flex h-full flex-col rounded-br-3xl rounded-tr-3xl shadow-2xl  py-6">
                <div class="px-4 sm:px-6">
                  <DialogTitle class="text-base font-semibold text-gray-900">
                    <P>Good afternoon Smith</P>
                  </DialogTitle>
                </div>
                <div v-for="(tab, index) in tabStore.getTabs"
                     :key="index"
                     class="px-4 pt-5 sm:px-6 cursor-pointer"
                     @click.stop="handleTab(tab.name)">
                  <div class="pt-3 py-2  px-2 flex justify-start gap-2 items-center rounded-lg"
                       :class="[tabStore.activeTab === tab.name? 'bg-main-200 transition duration-500 ease-in-out': 'hover-tab']">
                      <span class="material-icons-round"
                            :class="[tabStore.activeTab === tab.name? 'text-main-500': 'text-slate-400']">{{ tab.icon }}</span>
                    <span
                        :class="[tabStore.activeTab === tab.name? 'text-main-500': 'text-black']">{{ tab.name }}</span>
                  </div>
                </div>
                <!--                  profile-->
                <div class="absolute bottom-0 px-4 pt-5 sm:px-6 pb-4 flex  gap-3">
                  <div>
                    <span class="material-icons-round !text-4xl">account_circle</span>
                  </div>
                  <div class="flex flex-col">
                    <span>Smith Joe</span>
                    <span>smith@gmail.com</span>
                  </div>

                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>

      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.hover-tab:hover{
  background-color: #f3f4f6;
  transform: scale(1.02);
}

</style>