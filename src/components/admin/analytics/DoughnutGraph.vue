<script setup lang="ts">
import { ref, onMounted} from 'vue'
import type { Ref } from 'vue'
import {Chart} from "chart.js/auto";
import {useAdminStore} from "@/stores";

const adminStore = useAdminStore()
const doughnutRef =  ref<HTMLCanvasElement | null>(null)
const doughnutInstance: Ref<Chart<'doughnut', number[], string> | null> = ref(null)

interface OrderReport {
  slug: string;
  name: string;
  total: number;
}


const doughnutData = ref({
  labels: [] as string[],
  datasets: [
    {
      label:'Orders Report',
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

const completedOrders = ref(0)
const isError = ref(false)


onMounted(()=>{
  adminStore.getOrdersReport()
      .then(res=>{
        if(res?.data){
          res.data.map((item:OrderReport) =>{
            doughnutData.value.labels.push(item.name)
            doughnutData.value.datasets[0].data.push(item.total)
            if(item.name === 'Completed'){
              completedOrders.value = item.total
            }
          })
          renderChart()
          // doughnutData.value.datasets[0].data = [10, 20, 30]
        }
        else{
          isError.value = true
          console.log("Error in fetching orders report", res)
        }
      })
      .catch(err=>{
        isError.value = true
        console.log("Error in fetching orders report catch block", err)
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
    <div class=" flex justify-center items-center h-full ">
      <div class="relative flex justify-center items-center w-72" v-if="!isError">
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