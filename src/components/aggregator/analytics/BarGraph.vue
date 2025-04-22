<script setup lang="ts">
import { ref, onMounted} from 'vue'
import type { Ref } from 'vue'
import { Chart } from 'chart.js/auto'
import {useAggregatorStore} from "@/stores";

// interface Data {
//   label
// }
const barGraphRef = ref(null)
const barGraphInstance: Ref<Chart<'bar', number[], string> | null> = ref(null)
const aggregatorStore = useAggregatorStore()

const barGraphData = ref({
  labels: ['Pending', 'Published', 'Rejected'],
  datasets: [
        {
          label: 'Product Summary',
          data: [] as number[],
          backgroundColor: 'rgba(255, 197, 52, 0.6)',
          // borderColor: 'rgba(54, 162, 235, 1)',
          // borderWidth: 1,
          barThickness: 60,
          borderRadius: 6
        },
        // {
        //   label: 'Computer',
        //   data: [2, 3, 20, 5],
        //   backgroundColor: 'rgba(5, 155, 255, 0.6)',
        //   // borderColor: 'rgba(255, 99, 132, 1)',
        //   // borderWidth: 1,
        //   barThickness: 20,
        //   borderRadius: 6
        //
        // },
        // {
        //   label: 'Other',
        //   data: [3, 10, 13, 15],
        //   backgroundColor: 'rgba(255, 197, 52, 0.6)',
        //   // borderColor: 'rgba(54, 162, 235, 1)',
        //   // borderWidth: 1,
        //   barThickness: 20,
        //   borderRadius: 6
        // }
  ]
})

const renderChart = async ()=>{
  if(barGraphInstance.value) {
    barGraphInstance.value.destroy()
  }
  else{
    if(barGraphRef.value){
      barGraphInstance.value = new Chart(barGraphRef.value as HTMLCanvasElement, {
        type: 'bar',
        data: barGraphData.value,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 30,
              },
            },
          },
          layout: {
            padding: {
              top: 0,
              right: 10,
            },
          },

        }
      })
    }
  }
}

const isError = ref(false)
onMounted(()=>{
  barGraphData.value.datasets[0].data = []
  aggregatorStore.getProductSummary()
      .then((response)=> {
        console.log('Rating response', response?.data)
        if(response?.data){
          barGraphData.value.datasets[0].data = [
              response.data.post_counts.pending,
              response.data.post_counts.publish,
              response.data.post_counts.reject
          ]
          renderChart()
        }
        else {
          isError.value = true
        }
      })
      .catch(error => {
        console.log('Error rating response', error)
        isError.value = false
      })
})


</script>

<template>
  <div>
    <p class="md:text-2xl text-lg font-semibold">Product Summary</p>
    <div class="h-96">
      <canvas ref="barGraphRef"></canvas>
    </div>
  </div>

</template>

<style scoped>

</style>