<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from '@headlessui/vue'
import {useRouter} from "vue-router";
import { useAdminTabStore, useAdminStore, useAdminAuthStore  } from "@/stores";
import { displayHour} from "@/modules/getHour.ts";
import DialogModal from "@/components/commonComponent/DialogModal.vue";
import {ref} from "vue";


const adminStore = useAdminStore()
const router = useRouter()
const adminTabStore = useAdminTabStore()
const adminAuthStore = useAdminAuthStore()


const props = defineProps<{
  open: boolean
}>()

const handleTab = (tab: string) => {
  adminTabStore.setActiveTab(tab)
  router.push({
    name: tab,
    params: {userId: adminAuthStore.getAdminInfo()?.userId}
  })
  console.log(adminTabStore.getTabs)
}




</script>

<template>

  <div class="fixed lg:block hidden pointer-events-auto h-dvh w-80 transition-transform duration-500"
       :class="[!open? 'translate-x-0' : '-translate-x-full']">
    <div class="flex h-full flex-col rounded-br-3xl rounded-tr-3xl shadow-2xl  py-6">
      <div class="px-4 sm:px-6">
        <div class="flex justify-center gap-4 pb-3">
          <img src="/images/e-waste.png" alt="e-waste-mage" class="h-12 w-12">
        </div>
        <p class="text-center">{{displayHour}} {{adminAuthStore.getAdminInfo()?.fullName}}</p>
      </div>
      <div v-for="(tab, index) in adminTabStore.getTabs"
           :key="index"
           class="px-4 pt-5 sm:px-6 cursor-pointer"
           @click.stop="handleTab(tab.value)">
        <div class="pt-3 py-2  px-2 flex justify-start gap-2 items-center rounded-lg"
             :class="[adminTabStore.activeTab === tab.value? 'bg-main-200 transition duration-500 ease-in-out': 'hover-tab']">
                      <span class="material-icons-round"
                            :class="[adminTabStore.activeTab === tab.value? 'text-main-500': 'text-slate-400']">{{
                          tab.icon
                        }}</span>
          <span
              :class="[adminTabStore.activeTab === tab.value? 'text-main-500': 'text-black']">{{ tab.name }}</span>
        </div>
      </div>
      <!--                  profile-->
      <div class="absolute bottom-0 px-4 pt-5 sm:px-6 pb-4 flex  gap-0.5">
        <div>
          <span class="material-icons-round !text-4xl">account_circle</span>
        </div>
        <div class="flex flex-col">
          <span>{{adminAuthStore.getAdminInfo()?.fullName}}</span>
          <span class="text-sm">{{adminAuthStore.getAdminInfo()?.email}}</span>
        </div>

      </div>
    </div>
  </div>
  <TransitionRoot as="template" :show="adminStore.expandSidebarSmall" class="duration 500 lg:hidden block"
                  id="sidebar">
    <Dialog class="relative z-50" @close="adminStore.setExpandSidebarSmall(false)">
      <div class="fixed inset-x-0  overflow-hidden ">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 left-0 flex">
            <TransitionChild as="template"
                             id="transitionChild" class="transition-transform duration"
                             :class="[ adminStore.expandSidebarSmall? 'translate-x-0': '-translate-x-full']">
              <DialogPanel class="w-72 pointer-events-auto h-screen relative top-0 bottom-0 overflow-y-hidden"
                           id="SidebarDialog">
                <div
                    class="flex h-screen flex-col overflow-y-auto bg-white !shadow-2xl rounded-br-2xl me-6 rounded-tl-2xl">
                  <div class="px-2 sm:px-4">
                    <TransitionChild as="template" enter="ease-in-out duration 500" enter-from="opacity-0"
                                     leave="ease-in-out duration 500" leave-from="opacity-100">
                      <div class="pt-4">
                        <button @click="adminStore.setExpandSidebarSmall(false)" class="btn btn-sm btn-ghost">
                          <span class="material-icons-outlined !text-xl">menu_open</span>
                        </button>
                      </div>
                    </TransitionChild>
                  </div>
                  <!--                    sidebar content goes here-->

                  <!-- Your content -->
                  <div class="flex h-full flex-col rounded-br-3xl rounded-tr-3xl shadow-2xl  py-3">
                    <div class="flex justify-center gap-4 pb-3">
                      <img src="/images/e-waste.png" alt="e-waste-mage" class="h-12 w-12">
                    </div>
                    <p class="text-center">{{displayHour}} {{adminAuthStore.getAdminInfo()?.fullName}}</p>
                    <div v-for="(tab, index) in adminTabStore.getTabs"
                         :key="index"
                         class="px-4 pt-5 sm:px-6 md:!text-lg !text-sm cursor-pointer"
                         @click="handleTab(tab.value)">
                      <div class="md:py-2 py-1.5  px-2 flex justify-start gap-2 items-center rounded-lg"
                           :class="[adminTabStore.activeTab === tab.value? 'bg-main-200 transition duration-500 ease-in-out': 'hover-tab']">
                        <span class="material-icons-round"
                              :class="[adminTabStore.activeTab === tab.value? 'text-main-500': 'text-slate-400']">{{
                            tab.icon
                          }}</span>
                        <span
                            :class="[adminTabStore.activeTab === tab.value? 'text-main-500': 'text-black']">{{
                            tab.name
                          }}</span>
                      </div>
                    </div>
                    <!--                  profile-->
                    <div class="absolute bottom-0 px-4 pt-5 sm:px-6 pb-4 flex  gap-0.5">
                      <div>
                        <span class="material-icons-round !text-4xl">account_circle</span>
                      </div>
                      <div class="flex flex-col">
                        <span>{{adminAuthStore.getAdminInfo()?.fullName}}</span>
                        <span class="text-xs">{{adminAuthStore.getAdminInfo()?.email}}</span>
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

  <teleport to="body">
    <DialogModal :is-open="openDialog.isOpen"
                 @close-modal="openDialog.isOpen=false">
      <template #title>
        <div class="flex justify-center">
          <span class="material-icons-outlined !text-6xl"> logout </span>
        </div>
      </template>
      <template #body>
        <div class="flex justify-center">
          <h1 class="text-xl font-bold">Oh no! You're leaving?</h1>
        </div>
        <div class="flex justify-center">
          <p class="text-lg font-semibold">Are you sure?</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center gap-8">
          <button class="btn btn-sm btn-ghost text-white bg-main-500 hover:bg-main-600 " @click="signOut">Sign Out</button>
          <button class="btn btn-sm bg-slate-200" @click="openDialog.isOpen=false">
            Cancel
          </button>
        </div>
      </template>

    </DialogModal>
  </teleport>
</template>

<style scoped>
.hover-tab:hover {
  background-color: #f3f4f6;
  transform: scale(1.02);
}

</style>