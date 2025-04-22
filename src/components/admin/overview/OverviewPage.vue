<script setup lang="ts">
import InventoryOverview from "@/components/admin/overview/InventoryOverview.vue";
import {useRouter} from "vue-router";
import {useAdminStore, useAdminTabStore} from "@/stores";
import {useAdminAuthStore} from "@/stores";
import DialogModal from "@/components/commonComponent/DialogModal.vue";
import {onMounted, ref} from "vue";
import { type PublishProduct} from "@/components/admin/overview/InventoryOverview.vue";
import {showAlert} from "@/modules/sweetAlert.ts";

const router = useRouter()
const tabStore = useAdminTabStore()
const adminAuthStore = useAdminAuthStore()
const adminStore = useAdminStore()

const handleViewMoreMaterial = ()=>{
  tabStore.setActiveTab('Admin-Inventory')
  router.push({
    name: 'Admin-Inventory',
    params: {userId:  adminAuthStore.getAdminInfo()?.userId}
  })
}

const showConfirmModal = ref({
  isOpen: false,
})

const publishProduct = ref({
  id: 0,
  name: '',
  vendorName: ''
})
const confirmPublish = (value: PublishProduct) =>{
  showConfirmModal.value = {
    isOpen: true
  }
  publishProduct.value = {...value}
}

const isPublishProductLoading  = ref(false)
const publishHandler = () =>{
  console.log("I confirm to publish")
  isPublishProductLoading.value = true;
  adminStore.publishProduct(publishProduct.value.id)
      .then((resp)=>{
        if(resp?.status === 'publish'){
          isPublishProductLoading.value = false
          setTimeout(()=>{
            showAlert({
              message: 'Product published successfully',
              type: 'success',
            })
          }, 1500)

        } else {
          setTimeout(()=>{
            showAlert({
              message: 'Product not published',
              type: 'error',
            })
          }, 1500)
        }
      })
      .catch((err)=>{
        console.log(err)
        showAlert({
          message: 'Unable to publish please try again',
          type: 'error',
        })
      })
      .finally(()=>{
        showConfirmModal.value.isOpen = false
      })
}
const overviewData = ref({
  pendingProducts:  '0',
  publishProducts: '0',
  soldProducts: '0',
  totalSales: '0'
})
const isLoading = ref(false)
const isError = ref(false)
onMounted(()=>{
  isLoading.value = true
  adminStore.getOverviewData()
      .then(resp =>{
        if(resp?.result === 'success'){
          console.log("overview data", resp.data)
          overviewData.value = {
            pendingProducts: resp.data?.pendingProducts as string,
            publishProducts: resp.data?.publishProducts as string,
            soldProducts: resp.data?.soldProducts,
            totalSales: resp.data?.totalSales
          }
        } else{
          isError.value = true

        }
      })
      .catch((err)=>{
        isError.value = true
      })
      .finally(()=>{
        isLoading.value = false
      })



})
</script>

<template>
  <div class="w-full h-screen row space-y-10">
    <!--    top widgets-->
    <div class="grid grid-cols-12 md:gap-10 gap-5">
      <!--      1st div-->
      <div class="md:col-span-3 col-span-6  md:space-y-3 space-y-1 bg-main-300  md:px-4 px-2 py-1 md:py-4 rounded-2xl border border-1">
        <div class="rounded-full md:w-10 md:h-10 w-8 h-8  flex justify-center items-center bg-main-800 border border-main-300">
          <span class="material-icons-outlined text-main-200 md:!text-xl !text-xs">wallet</span>
        </div>
        <div>
          <span class="text-main-950 md:!text-lg !text-sm">Total earnings</span>
        </div>
        <div class="flex ">
          <p class="!text-sm md:!text-lg">Kes.</p>
          <span class="md:!text-xl text-sm font-semibold">{{overviewData.totalSales}}</span>
        </div>
      </div>
      <!--      2nd div-->
      <div class="md:col-span-3 col-span-6  md:space-y-3 space-y-2  md:px-4 px-2 py-2 md:py-4 rounded-2xl  bg-conifer-200">
        <div class="rounded-full md:w-10 md:h-10 w-8 h-8  flex justify-center items-center bg-conifer-800 border border-conifer-300">
          <span class="material-icons-outlined text-conifer-200  md:!text-xl !text-xs ">shopping_basket</span>
        </div>
        <div>
          <span class="md:!text-lg !text-sm">Sold items</span>
        </div>
        <div class="flex ">
          <!--          <p>Kes.</p>-->
          <span class="md:!text-xl text-sm  font-semibold">{{overviewData.soldProducts}}</span>
        </div>
      </div>
      <!--      3rd div-->
      <div class="md:col-span-3 col-span-6  md:space-y-3 space-y-2  md:px-4 px-2 py-2 md:py-4 rounded-2xl bg-yellow-200">
        <div class="rounded-full  md:w-10 md:h-10 w-8 h-8  flex justify-center items-center bg-yellow-800 border-yellow-300 ">
          <span class="material-icons-outlined text-yellow-200  md:!text-xl !text-xs">settings_input_component</span>
        </div>
        <div>
          <p class="md:!text-lg !text-sm">Items Pending</p>
<!--          <span class="md:!text-xl text-sm">Since 12 Feb 2025</span>-->
        </div>
        <div class="flex ">
          <!--          <p>Kes.</p>-->
          <span class="md:!text-xl text-sm font-semibold">{{overviewData.pendingProducts}}</span>
        </div>
      </div>

      <!--      4th div-->

      <div class="md:col-span-3 col-span-6  md:space-y-3 space-y-2  md:px-4 px-2 py-2 md:py-4 rounded-2xl bg-tertiary-200 ">
        <div class="rounded-full  md:w-10 md:h-10 w-8 h-8  flex justify-center items-center bg-tertiary-800 border border-tertiary-300">
          <span class="material-icons-outlined text-tertiary-200 md:!text-xl !text-xs ">inventory_2</span>
        </div>
        <div>
          <span class="md:!text-lg !text-sm">Stock available</span>
        </div>
        <div class="flex ">
          <!--          <p>Kes.</p>-->
          <span class="md:!text-lg !text-sm font-semibold">{{overviewData.publishProducts}}</span>
        </div>
      </div>
    </div>
<!--    bottom section-->
    <div>
      <div>
        <div class="py-4" v-if="Number(overviewData.pendingProducts) > 0">
          <p class="!text-2xl font-semibold pb-4 ">Pending Products</p>
          <div class="relative border border-main-500 bg-main-100 rounded-2xl p-3 w-full font-semibold text-main-800">
            <div class="absolute inset-0 left-0 right-0 border-l-4 rounded-xl border-main-500 "></div>
            <div class="flex items-center gap-2 justify-center">
              <span class="material-icons-outlined">verified</span>
              <p class="">Pending products awaiting your approval</p>
            </div>
          </div>
        </div>

        <div>
          <InventoryOverview @confirm-publish="confirmPublish" />
        </div>
      </div>
    </div>

    <teleport to="body">
      <DialogModal :is-open="showConfirmModal.isOpen"
                   @close-modal="showConfirmModal.isOpen = false">
        <template #title>
          <div  class="flex justify-center">
            <div class="flex justify-center items-center bg-main-200 h-10 w-10 rounded-full">
              <span class="material-icons-outlined !text-2xl text-main-800">verified</span>
            </div>

          </div>

        </template>
        <template #body>
          <div class="flex justify-center">
            <h1 class="text-lg font-semibold">Confirm to publish {{publishProduct.name}}?</h1>
          </div>
          <div class="flex justify-center">
            <p class="text-lg font-semibold">For vendor {{publishProduct.vendorName}}</p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-center gap-8">
            <button class="btn btn-sm btn-ghost text-white bg-main-500 hover:bg-main-600 " @click="publishHandler">
              <span v-if="!isPublishProductLoading">Publish</span>
              <span  v-else class="loading loading-spinner loading-md"></span>
            </button>
            <button :disabled="isPublishProductLoading" class="btn btn-sm bg-slate-200" @click="showConfirmModal.isOpen=false">
              Cancel
            </button>
          </div>
        </template>

      </DialogModal>
    </teleport>

  </div>

</template>



