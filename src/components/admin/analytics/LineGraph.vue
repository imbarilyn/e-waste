<script setup lang="ts">

import {ref, reactive, onMounted, watch} from "vue";
import type {Ref} from 'vue'
import {Chart} from "chart.js/auto";
import SalesTab from "@/components/admin/analytics/SalesTab.vue";
import moment from "moment/moment";
import {useAdminStore} from "@/stores";
import {resolveObjectKey} from "chart.js/helpers";
export interface SalesTab {
  label: string
  position: number
  isActive: boolean
}

interface Totals {
  [date: string]: {
    sales: number;
    orders: number;
    items: number;
    tax: string;
    shipping: string;
    discount: string;
    customers: number;
  };
}

const refLineGraph: Ref<HTMLCanvasElement | null> = ref<HTMLCanvasElement | null>(null)
const lineGraphInstance: Ref<Chart<'line', number[], string> | null> = ref(null)
const adminStore = useAdminStore()
const dateMin = ref<string>('')
const selectedPeriod = ref<string>('')


const salesTab = [
  {
    label: 'Yesterday',
    position: 1,
    isActive: true,
  },
  {
    label: 'Last 7 days',
    position: 2,
    isActive: false,
  },
  {
    label: 'Last 30 days',
    position: 3,
    isActive: false,
  },
  {
    label: 'Last 12 months',
    position: 4,
    isActive: false,
  }
] as SalesTab[]

interface LineGraph {
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

const renderChart = async () => {
  console.log('Rendering the line graph')

  if (lineGraphInstance.value) {
    console.log("Destroying the line graph instance")
    lineGraphInstance.value.destroy()
  }

    if (refLineGraph.value) {
      console.log("Rendering the line graph in the ref")
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

const activeTab = (value: SalesTab) => {
  selectedPeriod.value = value.label
  if (value.label === 'Yesterday') {
    dateMin.value = moment().subtract(1, 'days').format('YYYY-MM-DD')
  } else if (value.label === 'Last 7 days') {
    dateMin.value = moment().subtract(1, 'week').format('YYYY-MM-DD')
  } else if (value.label === 'Last 30 days') {
    dateMin.value = moment().subtract(1, 'month').format('YYYY-MM-DD')
  } else if (value.label === 'Last 12 months') {
    dateMin.value = moment().subtract(1, 'year').format('YYYY-MM-DD')
  }
}


watch(dateMin, (newValue) => {

  console.log(newValue)
  const dateMax = moment().format('YYYY-MM-DD')
  if (newValue) {
    adminStore.getSalesReportByDate(
        {
          dateMin: newValue,
          dateMax: dateMax,
        }
    ).then((response) => {
      if(response?.result === 'success'){
        console.log(selectedPeriod.value)
        lineData.labels = []
        lineData.datasets[0].data = []
        const totals = response.data[0].totals as Totals
        for(const [date, values] of Object.entries(totals)){
          // console.log(moment(date).format('dddd'))
          lineData.datasets[0].data.push(Math.round(values.sales))
          // lineData.datasets[0].data = [10, 100]
          console.log('Values', values.sales)
          if(selectedPeriod.value === 'Last 7 days') {
            console.log('Here in the last 7 days', moment(date).format('dddd'))
            lineData.labels.push(moment(date).format('dddd'))
          }
          else if(selectedPeriod.value === 'Yesterday') {
            lineData.labels = ['Yesterday', 'Today']
          }
          else if(selectedPeriod.value === 'Last 30 days'){
            console.log('Here in the last 30 days', moment(date).format('Do'))
            lineData.labels.push(moment(date).format('Do'))
          }
          else if(selectedPeriod.value === 'Last 12 months'){
            console.log('Here in the Last 12 months')
            console.log(moment(date).format('MMMM'))
            lineData.labels.push(moment(date).format('MMMM'))
          }

        }
        console.log(lineData.labels)
        renderChart()
      }


</script>

<template>
  <div class="">
    <span class="md:text-2xl text-lg font-semibold">My sales</span>
    <div class="h-96">
      <SalesTab :record-tab="salesTab" @activeTab="activeTab"/>
      <canvas ref="refLineGraph" height=""></canvas>
    </div>
  </div>

</template>

<style scoped>

</style>