<script setup lang="ts">

import {ref, reactive, onMounted} from "vue";
import type {Ref} from 'vue'
import {Chart} from "chart.js/auto";
const refLineGraph: Ref<HTMLCanvasElement | null> = ref<HTMLCanvasElement | null>(null)
const lineGraphInstance: Ref<Chart<'line', number[], string> | null> = ref(null)


interface LineGraph{
  labels: string[],
  datasets: [
    {
      label: string,
      data: number[],
      fill: boolean,
      backgroundColor: string,
      tension: number,
      borderWidth: number
    }
  ]
}

const lineData = reactive({
  labels: [] as string[],
  datasets: [
    {
      label: 'My sales',
      data: [] as number[],
      fill: true,
      backgroundColor: 'rgb(73, 173, 231, 0.75)',
      tension: 0.4,
      borderWidth: 1,
    }
  ]
})


const lineOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'My Sales Over Time',
    },
    scales: {
      x: {
        display: true,
        text: 'Duration',
      },
      y: {
        display: true,
        text: 'Amount in Ksh',
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

const renderChart  = async ()=> {
  if (lineGraphInstance.value) {
    lineGraphInstance.value.destroy()
  } else {
    if (refLineGraph.value) {
      lineGraphInstance.value = new Chart(
          refLineGraph.value as HTMLCanvasElement,
          {
            type: 'line',
            data: lineData as LineGraph,
            options: lineOptions
          }
      )
    }
  }
}

onMounted(()=>{
  lineData.datasets[0].data = [10, 23, 13, 65, 54, 61, 74, 22, 91, 100]
  lineData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  renderChart()
})

const activeTab = (value: SalesTab)=>{
  console.log(value)
  // const dateMin = moment().format()
  if(value.label === 'Yesterday'){
   dateMin.value = moment().subtract(1, 'days').format()
    }
  else if(value.label === 'Last 7 days'){
    dateMin.value = moment().subtract(7, 'days').format()
  }
  else if(value.label === 'Last 30 days'){
    dateMin.value = moment().subtract(30, 'days').format()
  }
  else if(value.label === 'Last 12 months'){
    dateMin.value = moment().subtract(12, 'months').format()
  }
  console.log(dateMin.value)


}
const aggregatorAuthStore = useAggregatorAuthStore()

watch(dateMin, (newValue) => {
  console.log(newValue)
  const dateMax = moment().format()
  if (newValue) {
    aggregatorStore.getSalesReportByDate(
        {
          dateMin: newValue,
          dateMax: dateMax,
          vendorId: aggregatorAuthStore.getAggregatorInfo()?.dokanId
        }
    ).then((response) => {
      console.log('Line graph sales', response)
      // lineData.labels = response.data.map((item: any) => item.date)
      // lineData.datasets[0].data = response.data.map((item: any) => item.total_sales)
      // renderChart()
    })
  }
}, { immediate: true })




</script>

<template>
  <div class="">
    <span class="md:text-2xl text-lg font-semibold">My sales Report</span>
    <div class="h-96">
      <SalesTab  :record-tab="salesTab"  @activeTab="activeTab"/>


      <canvas ref="refLineGraph"></canvas>
    </div>
  </div>

</template>

<style scoped>

</style>