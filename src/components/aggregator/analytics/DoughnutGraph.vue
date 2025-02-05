<script setup lang="ts">
import { ref, Ref, onMounted} from 'vue'
import {Chart} from "chart.js/auto";


const doughnutRef =  ref<HTMLCanvasElement | null>(null)
const doughnutInstance: Ref<Chart<'doughnut', number[], string> | null> = ref(null)

const doughnutData = ref({
  labels:['Bad', 'Good', 'Fair'],
  datasets: [
    {
      label:'Material Condition',
      data: [] as number[],
      backgroundColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(191, 237, 105, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 6
    }
  ]
})


onMounted(()=>{
  doughnutData.value.datasets[0].data = [10, 20, 30]
  renderChart()

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
  <div>
    <span class="md:!text-2xl !text-lg font-semibold">Material condition</span>
    <div class=" flex justify-center ">
      <div class="relative flex justify-center items-center w-72">
        <canvas ref="doughnutRef" ></canvas>
        <div class="absolute pb-7 md:pb-0 flex flex-col justify-center items-center ">
          <span class="md:text-3xl text-2xl font-bold">48</span>
          <p class="md:text-xl text-lg min-w-10  ">Bad condition</p>

        </div>
      </div>

    </div>


</div>
</template>

<style scoped>

</style>