<script setup lang="ts">
import {useAggregatorStore} from "@/stores";
import {onMounted, ref} from "vue";
import { type Product} from "@/stores";
import ErrorPage from "@/components/ErrorPage.vue";
import moment from "moment";

interface Props {
  productId: string
}


const aggregatorStore = useAggregatorStore()
const product = ref<Record<any, any>>()
const isError = ref(false)
const props = defineProps<Props>()
onMounted(()=>{
  aggregatorStore.getProduct(Number(props.productId))
      .then(resp =>{
        console.log('Delete', resp?.data)
        if(resp?.data){
          product.value = resp.data
        }
        else{
          isError.value = true

        }
      })
      .catch(err=>{
        isError.value = true
      })

})

//  parse short_description to remove html tags
function decodeHtml(html: string) {
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";

}
</script>

<template>
  <div class="pt-14">
    <div v-if="!isError && product" class="grid grid-cols-12 gap-4">
<!--      photo side-->
      <div class="carousel  rounded-box xl:col-span-6 col-span-12 " v-for="img in product?.images">
        <div class="carousel-item bg-transparent  xl:w-3/4  w-full h-3/4">
          <img
              :src="img?.src as string"
              class="w-full" />
        </div>
      </div>
<!--      details side-->
      <div class="xl:col-span-6 col-span-12 space-y-6 xl:py-4 px-4 xl:px-1">
        <div class="">
          <div class="">
<!--            <p class="text-4xl font-semibold">Price</p>-->
            <p class="text-4xl font-semibold">{{product?.name}}</p>
          </div>
        </div>
        <div>
          <p class="text-lg">{{decodeHtml(product.short_description)}}</p>
        </div>
        <div>
          <div class="flex gap-1 ">
           <span class="font-italic !text-xl font-bold">Kes</span>
            <p class="text-4xl">{{product?.regular_price}}</p>
          </div>
        </div>
        <div class="">
          <p class="!text-xl">Created on: {{moment(product.date_created).format('DD MMMM YYYY')}}</p>
        </div>
        <div>
          <div :class="[product.status ==='publish'? 'bg-conifer-500': 'bg-rose-500']" class="px-4 py-2 rounded-lg w-fit flex">
            <span v-if="product.status === 'publish'" class="material-icons-outlined text-conifer-950">done</span>
            <span v-else class="material-icons-outlined text-conifer-950">edit_note</span>
            <span class="text-conifer-950 font-semibold">{{product.status}}</span>
          </div>
        </div>

      </div>

    </div>
    <div v-else>
      <ErrorPage />
    </div>


  </div>

</template>

<style scoped>

</style>