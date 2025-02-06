<script setup lang="ts">
import {onMounted, Ref, ref} from 'vue'
import {Chart} from 'chart.js/auto'


const pieChartRef: Ref<HTMLCanvasElement | null> = ref<HTMLCanvasElement | null>(null)
const pieGraphInstance: Ref<Chart<'pie', number[], string> | null> = ref<Chart<'pie', number[], string> | null>(null)


const pieChartData = ref(
    {
      labels: ['Computer', 'Phone', 'Other'],
      datasets: [
        {
          label: 'Material Type',
          data: [] as number[],
          backgroundColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(191, 237, 105, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          hoverOffset: 4,
          borderWidth: 0,
        }
      ]

    })

const renderChart = async () => {
  if (pieGraphInstance.value) {
    pieGraphInstance.value.destroy()
  } else {
    if (pieChartRef.value) {
      pieGraphInstance.value = new Chart(pieChartRef.value as HTMLCanvasElement, {
            type: 'pie',
            data: pieChartData.value,
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
            },
          }
      )
    }
  }
}

onMounted(()=>{
  pieChartData.value.datasets[0].data = [10, 20, 30]
  renderChart()

})

</script>

<template>
  <div>
    <span class="md:text-2xl text-lg">Material type</span>
  </div>
  <div>
    <canvas ref="pieChartRef"></canvas>
  </div>
</template>

<style scoped>

</style>