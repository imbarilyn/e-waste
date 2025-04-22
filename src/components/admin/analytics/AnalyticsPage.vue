<script setup lang="ts">
import LineGraph from "@/components/admin/analytics/LineGraph.vue";
import DoughnutGraph from "@/components/admin/analytics/DoughnutGraph.vue";
import PieChart from "@/components/aggregator/analytics/PieChart.vue";
import BarGraph from "@/components/admin/analytics/BarGraph.vue";


</script>

<template>
  <div class="h-full w-full">
    <div class="space-y-10">
      <!--      top side-->
      <div class="grid grid-cols-11 gap-4">
        <div class="md:col-span-7 col-span-12 rounded-2xl border shadow-2xl px-4 py-4 ">
          <LineGraph/>
        </div>
        <div class="py-5 px-8 space-y-3 bg-conifer-300 rounded-2xl shadow-2xl md:col-span-4 col-span-12">
          <div class="w-10 h-10 bg-conifer-600 rounded-full flex justify-center items-center">
            <span class="material-icons-outlined">compost</span>
          </div>
          <div>
            <p class="text-xl font-semibold">A little tip!</p>
          </div>
          <div class="flex justify-center space-y-2 flex-col pt-3 w-50">
            <div>
              <span class="material-icons-outlined">tips_and_updates</span>
              <span class="md:!text-lg !text-sm">What we do to the forests of the world is but a mirror reflection of what we are doing to ourselves and to one another.</span>
            </div>
            <div>
              <span class="material-icons-outlined">tips_and_updates</span>
              <span class="md:!text-lg !text-sm">What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves and to one another.</span>
            </div>
          </div>
        </div>
      </div>

      <!--    bottom side-->
      <div class="grid grid-cols-12 gap-4">
        <div class="md:col-span-5 col-span-12 rounded-2xl border shadow-2xl px-4 py-4">
         <DoughnutGraph />
        </div>
        <div class="md:col-span-7  col-span-12 rounded-2xl border shadow-2xl px-4 py-4">
          <div>
            <BarGraph />
<!--            <PieChart />-->
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<style scoped>
.linear-bg {
  background-image: linear-gradient(340deg, #405f15, #9bdd29, #1a2d06);
}

</style>