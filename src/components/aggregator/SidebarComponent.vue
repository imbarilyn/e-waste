<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {useTabStore} from "@/stores/tabstore.ts";
import {useRouter} from "vue-router";
import {useAggregatorStore} from "@/stores/aggregatorStore.ts";

const tabStore = useTabStore()
const router = useRouter()
const aggregatorStore = useAggregatorStore()


const props = defineProps<{
  open: boolean
}>()

const handleTab = (tab: string) => {
  tabStore.setActiveTab(tab)
  router.push({
    name: tab
  })
}


</script>

<template>

  <div class="fixed lg:block hidden pointer-events-auto h-dvh w-80 transition-transform duration-500"
       :class="[!open? 'translate-x-0' : '-translate-x-full']">
    <div class="flex h-full flex-col rounded-br-3xl rounded-tr-3xl shadow-2xl  py-6">
      <div class="px-4 sm:px-6">
        <p>Good afternoon Smith</p>
      </div>
      <div v-for="(tab, index) in tabStore.getTabs"
           :key="index"
           class="px-4 pt-5 sm:px-6 cursor-pointer"
           @click.stop="handleTab(tab.name)">
        <div class="pt-3 py-2  px-2 flex justify-start gap-2 items-center rounded-lg"
             :class="[tabStore.activeTab === tab.name? 'bg-main-200 transition duration-500 ease-in-out': 'hover-tab']">
                      <span class="material-icons-round"
                            :class="[tabStore.activeTab === tab.name? 'text-main-500': 'text-slate-400']">{{
                          tab.icon
                        }}</span>
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
  </div>
  <TransitionRoot as="template" :show="aggregatorStore.expandSidebarSmall" class="duration 500 lg:hidden block"
                  id="sidebar">
    <Dialog class="relative z-50" @close="aggregatorStore.setExpandSidebarSmall(false)">
      <div class="fixed inset-x-0  overflow-hidden ">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 left-0 flex">
            <TransitionChild as="template"
                             id="transitionChild" class="transition-transform duration"
                             :class="[ aggregatorStore.expandSidebarSmall? 'translate-x-0': '-translate-x-full']">
              <DialogPanel class="w-72 pointer-events-auto h-screen relative top-0 bottom-0 overflow-y-hidden"
                           id="SidebarDialog">
                <div
                    class="flex h-screen flex-col overflow-y-auto bg-white !shadow-2xl rounded-br-2xl me-6 rounded-tl-2xl">
                  <div class="px-2 sm:px-4">
                    <TransitionChild as="template" enter="ease-in-out duration 500" enter-from="opacity-0"
                                     leave="ease-in-out duration 500" leave-from="opacity-100">
                      <div class="pt-4">
                        <button @click="aggregatorStore.setExpandSidebarSmall(false)" class="btn btn-sm btn-ghost">
                          <span class="material-icons-outlined !text-xl">menu_open</span>
                        </button>
                      </div>
                    </TransitionChild>
                  </div>
                  <!--                    sidebar content goes here-->

                  <!-- Your content -->
                  <div class="flex h-full flex-col rounded-br-3xl rounded-tr-3xl shadow-2xl  py-3">
                    <div class="ps-5 flex items-end gap-4 pb-3">
                      <img src="/images/e-waste.png" alt="e-waste-mage" class="h-12 w-12">
                   <p class="font-normal">E-waste</p>

                    </div>
                    <div v-for="(tab, index) in tabStore.getTabs"
                         :key="index"
                         class="px-4 pt-5 sm:px-6 md:!text-lg !text-sm cursor-pointer"
                         @click="handleTab(tab.name)">
                      <div class="md:py-2 py-1.5  px-2 flex justify-start gap-2 items-center rounded-lg"
                           :class="[tabStore.activeTab === tab.name? 'bg-main-200 transition duration-500 ease-in-out': 'hover-tab']">
                        <span class="material-icons-round"
                              :class="[tabStore.activeTab === tab.name? 'text-main-500': 'text-slate-400']">{{
                            tab.icon
                          }}</span>
                        <span
                            :class="[tabStore.activeTab === tab.name? 'text-main-500': 'text-black']">{{
                            tab.name
                          }}</span>
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
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.hover-tab:hover {
  background-color: #f3f4f6;
  transform: scale(1.02);
}

</style>