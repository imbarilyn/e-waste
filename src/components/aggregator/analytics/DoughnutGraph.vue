<script setup lang="ts">
import { ref, onMounted} from 'vue'
import type { Ref} from 'vue'
import {Chart} from "chart.js/auto";
import {useAggregatorStore} from "@/stores";

const aggregatorStore = useAggregatorStore()
const doughnutRef =  ref<HTMLCanvasElement | null>(null)
const doughnutInstance: Ref<Chart<'doughnut', number[], string> | null> = ref(null)

const doughnutData = ref({
  labels:[ 'Pending Payment', 'Processing', 'On-hold', 'Completed', 'Cancelled', 'Refunded', 'Failed', 'Draft'],
  datasets: [
    {
      label:'Material Condition',
      data: [] as number[],
      backgroundColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(191, 237, 105, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(181, 229, 207, 1)',
        'rgba(246, 82, 160, 1)',
        'rgba(231, 210, 204, 1)',
        'rgba(182, 141, 64, 1)',
        'rgba(5, 68, 94, 1)',
      ],
      borderWidth: 6
    }
  ]
})

// interface SalesReport {
//   total: number;
//   wc-cancelled: number
//   wc-checkout:
//   wc-completed
//   wc-failed
//   wc-on-hold
//   wc-pending
//   wc-processing
//   wc-refunded
// }

const isError = ref(false)
const isLoading = ref(true)
const completedOrders = ref(0)
onMounted(()=>{
  aggregatorStore.getSalesReport()
      .then(resp =>{
        console.log(resp)
        if(resp?.data){
          console.log(resp.data.orders_count)
          doughnutData.value.datasets[0].data = [resp.data.orders_count["wc-pending"], resp.data.orders_count["wc-processing"], resp.data.orders_count["wc-on-hold"], resp.data.orders_count["wc-completed"], resp.data.orders_count["wc-cancelled"],  resp.data.orders_count["we-refunded"], resp.data.orders_count["wc-failed"], resp.data.orders_count["wc-checkout-draft"]];
          completedOrders.value = resp.data.orders_count["wc-completed"]
          renderChart()
        }
        else{
          isError.value = true

        }
      })
      .catch(err =>{
        console.log(err)
        isError.value = true
      })
      .finally(()=>{
        isLoading.value = false
      })




})

const renderChart = async ()=>{
  if(doughnutInstance.value){
    doughnutInstance.value.destroy()
  }
  else{
    if(doughnutRef.value){
      doughnutInstance.value = new Chart(doughnutRef.value as HTMLCanvasElement,{
        type: 'doughnut',
        data: doughnutData.value,
        options: {
          responsive: true,
          cutout: '75%',
          radius: '85%',
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              align: 'center',
              // paddingInline: 20,
              labels: {
                usePointStyle: true,
                pointStyle: 'rounded',
                boxWidth: 20,
                borderRadius: 10,
              },
            },
          }
        }
      })
    }
  }
}

</script>



<template>
  <div class="h-full">
    <span class="md:!text-2xl !text-lg font-semibold">My Orders Report</span>
    <div class=" flex justify-center items-center h-full">
      <div class="relative flex justify-center items-center w-72"  v-if="!isError">
        <canvas ref="doughnutRef" ></canvas>
        <div class="absolute md:pb-16 pb-20 flex flex-col justify-center items-center ">
          <span class="md:text-3xl text-2xl font-bold">{{completedOrders}}</span>
          <p class="md:text-xl text-lg min-w-10  ">Completed</p>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-col justify-center items-center">
          <img src="/public/images/no-order-report.jpg" alt="error" style="width: 250px"/>
          <span class="text-center w-20">Unable to load order report data please refresh the page</span>

        </div>
      </div>

    </div>


</div>
</template>

<style scoped>

</style>