<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import { Chart } from 'chart.js/auto'
import {useAdminStore} from "@/stores";

// interface Data {
//   label
// }

interface Rating {
  name:string
  slug: string
  total: number
}

const barGraphRef = ref(null)
const barGraphInstance: Ref<Chart<'bar', number[], string> | null> = ref(null)
const adminStore = useAdminStore()

const barGraphData = ref({
  labels: ['Five star', 'Four star', 'Three start', 'Four two', 'One star'],
  datasets: [
        // {
        //   label: 'Phone',
        //   data: [12, 19, 3, 5],
        //   backgroundColor: 'rgba(184, 255, 53, 0.6)',
        //   // borderColor: 'rgba(75, 192, 192, 1)',
        //   // borderWidth: 1,
        //   barThickness: 20,
        //   borderRadius: 6
        // },
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
        {
          label: 'Rating Report',
          data: [] as number[],
          backgroundColor: 'rgba(255, 197, 52, 0.6)',
          // borderColor: 'rgba(54, 162, 235, 1)',
          // borderWidth: 1,
          barThickness: 60,
          borderRadius: 6
        }
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
  adminStore.getRatings()
      .then((response)=> {
        console.log('Rating response', response?.data)
        if(response?.result === 'success'){
          response.data.map((rating: Rating)=>{
            barGraphData.value.datasets[0].data.push(rating.total)
          })
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
  <div class="space-y-4">
    <p class="md:text-2xl text-lg font-semibold">Product Ratings</p>
    <div class="h-96" v-if="!isError">
      <canvas ref="barGraphRef"></canvas>
    </div>
    <div v-else class="pt-4">
      <div class="flex flex-col justify-center items-center">
        <img src="/public/images/rating1.png" alt="error" style="width: 250px"/>
        <span class="text-center">Unable to load rating report data please refresh the page</span>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>