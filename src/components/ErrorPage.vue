<script setup lang="ts">

import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <div class="flex  items-center">
    <div>
      <img src="/public/images/nodata.png" alt="no-data-image">
    </div>
    <div class="text-center">
      <p class="text-lg font-semibold">Page not found</p>
      <button @click="router.go(-1)" class="btn btn-md bg-main-500 text-white">Go back</button>
    </div>
  </div>
</template>

<style scoped>

</style>