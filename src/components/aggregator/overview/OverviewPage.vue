<script setup lang="ts">
import InventoryDataTable from "@/components/aggregator/inventory/InventoryDataTable.vue";
import {useRouter} from "vue-router";
import {useAggregatorTabStore} from "@/stores/aggregatorTabstore.ts";
import InventoryOverview from "@/components/aggregator/overview/InventoryOverview.vue";
import {onMounted, ref} from "vue";
import {useStorage} from "@vueuse/core";
import {useAggregatorStore} from "@/stores";

const router = useRouter()
const tabStore = useAggregatorTabStore()
const aggregatorStore = useAggregatorStore()

const handleVieMoreMaterial = ()=>{
  tabStore.setActiveTab('Aggregator-Inventory')
  router.push({
    name: 'Aggregator-Inventory'
  })
}

const isSalesReportError = ref(false)
const isProductReportError = ref(false)
const summaryData = useStorage('summaryData', {
  totalEarnings: 0,
  accountBalance: 0,
  totalOrders: 0,
  publish: 0,
  pending: 0,
  totalProducts:0
})
onMounted(()=>{
  aggregatorStore.getSalesReport()
      .then(res =>{
        console.log("sales report", res)
        if(res?.data){
          summaryData.value.totalEarnings = res?.data?.sales
          summaryData.value.accountBalance = res?.data?.seller_balance
          summaryData.value.totalOrders = res?.data?.orders_count['wc-completed']
        }
      })
      .catch((e)=>{
        console.log("error", e);
        isSalesReportError.value = true
      })

  aggregatorStore.getProductSummary()
      .then(res =>{
        console.log("Product report", res)
        if(res?.data){
          summaryData.value.publish = res?.data?.post_counts.publish
          summaryData.value.pending = res?.data?.post_counts.pending
          summaryData.value.totalProducts = res?.data?.post_counts.total
        }
      })
      .catch((e)=>{
        console.log("error", e);
        isProductReportError.value = true
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
          <span class="md:!text-xl text-sm font-semibold">{{summaryData.totalEarnings}}</span>
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
          <span class="md:!text-xl text-sm  font-semibold">{{summaryData.totalOrders}}</span>
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
          <span class="md:!text-xl text-sm font-semibold">{{summaryData.pending}}</span>
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
          <span class="md:!text-lg !text-sm font-semibold">{{summaryData.publish}}</span>
        </div>
      </div>
    </div>
<!--    bottom section-->
    <div>
      <div>
        <p class="!text-2xl font-semibold pb-4">Pending Products</p>
        <div>
          <InventoryOverview />
        </div>
<!--        <div class="flex justify-end pt-4">-->
<!--          <button-->
<!--              @click="handleVieMoreMaterial"-->
<!--              class="btn btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300">-->
<!--            <span>View more</span>-->
<!--            <span class="material-icons-outlined">east</span>-->

<!--          </button>-->
<!--        </div>-->

      </div>
      <div>
        <p></p>
      </div>
    </div>

  </div>

</template>



