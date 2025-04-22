<script setup lang="ts">
import {useField} from "vee-validate";
import {computed, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import ComboBox, {type ComboOptions} from "@/components/commonComponent/ComboBox.vue";
import {useAggregatorStore} from "@/stores";
import {useStorage} from "@vueuse/core";

// interface InventoryData {
//   SKU?: string,
//   stock?: string,
//   trackStock?: boolean,
//   category: string
// }

const categories = [
  {
    id: 49,
    name: 'Cameras'
  },
  {
    id: 41,
    name: 'Computer Hardware'
  },
  {
    id: 35,
    name: 'Dairy & Eggs'
  },
  {
    id: 36,
    name: 'Home Electronics'
  },
  {
    id: 48,
    name: 'Kids Toys'
  },
  {
    id: 58,
    name: 'Mobile Phones'
  },
  {
    id: 15,
    name: 'Uncategorised'
  }
] as ComboOptions[]

const aggregatorStore = useAggregatorStore()
const inventoryData = reactive({
  SKU: '',
  stock: '',
  // trackStock: ref(false),
  category: ref<ComboOptions>()
})

// const trackStock = ref(false)

// watch(()=>trackStock.value, (value)=>{
//   inventoryData.trackStock = value
// })
const inventoryDataInfo = useStorage('inventoryData', {
  SKU: '',
  stock: '',
  // trackStock: false,
  category: categories[length-1]
})
const categoryValidator = (value: ComboOptions) =>{
  if(!value){
    return "Please select a category"
  }
  return true
}

const {
  value: category,
  errorMessage: categoryErrorMessage,
  meta: categoryMeta
} = useField('category', categoryValidator)

watch(()=>inventoryData.category, (value)=>{
  if(value){
    category.value = value
  }
})

const stockValidator = (value: string) => {
  if (value && isNaN(Number(value))) {
    return "Stock number must be a number"
  }
  return true
}

const SKUValidator = (value: string) =>{
  if(value && value.length < 4){
    return "SKU NUmber too short"
  }
  return true
}

const {
  value: SKU,
  errorMessage: SKUErrorMessage,
  meta: SKUMeta
} = useField('SKU', SKUValidator)

watch(()=>inventoryData.SKU, (value) => {
  SKU.value = value
})

const {
  value: stock,
  errorMessage: stockErrorMessage,
  meta: stockMeta
} = useField('stock', stockValidator)

watch(() => inventoryData.stock, (value) => {
  stock.value = value
})

// const productCategory = ref<ComboOptions[]>([])




const comboSelected = (value: ComboOptions) => {
  console.log("Selected product category", value)
  inventoryData.category = value

}

const isInventoryDataOkay = computed(()=>{
  return (
      categoryMeta.validated && categoryMeta.valid
      && stockMeta.validated && stockMeta.valid
  )
})

onMounted(()=>{
  // const inventoryLocalStorage = JSON.parse(localStorage.get('inventoryData') || '{}')
  inventoryData.category = inventoryDataInfo.value.category
  inventoryData.SKU = inventoryDataInfo.value.SKU
  inventoryData.stock = inventoryDataInfo.value.stock
  // inventoryData.trackStock = inventoryDataInfo.value.trackStock

})

 onBeforeUnmount(()=>{
   console.log(inventoryData)
   aggregatorStore.productValidation.inventoryData = isInventoryDataOkay.value
   console.log(isInventoryDataOkay.value)
   if(isInventoryDataOkay.value){
     localStorage.setItem('inventoryData', JSON.stringify({
       ...inventoryData,
       // trackStock: inventoryData.trackStock.toString()
     }));

   }
 })



</script>


<template>
  <div class="space-y-4">

    <label class="label font-semibold md:text-xl text-sm" for="productPrice">Category</label>
    <ComboBox :combo-props="categories" @combo-choice="comboSelected" />
    <small v-if="categoryMeta.validated && !categoryMeta.valid">{{categoryErrorMessage}}</small>
    <div class="flex flex-col space-y-1">
      <div class="flex justify-between md:text-xl text-sm pt-3">
        <label class="font-semibold md:text-xl text-sm" for="productPrice">SKU</label>
        <small>Optional</small>
      </div>

      <input
          id="productPrice"
          v-model="inventoryData.SKU"
          :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': stockMeta.validated && !stockMeta.valid,

                        }"
          class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
          placeholder="SKU number"
          type="text"
          required
      />
      <small class="text-sm">SKU refers to the Stock Keeping Unit. A unique identifiers for each product or service that can be purchased. </small>
      <small
          v-if="SKUMeta.validated && !SKUMeta.valid"
          class="text-sm text-rose-500"
      >
        {{ SKUErrorMessage }}
      </small>
    </div>

<!--    <div class="flex lg:gap-6 gap-3">-->
<!--      <input type="checkbox"-->
<!--             id="checkbox"-->
<!--             v-model="trackStock"-->
<!--             class="checkbox border-main-600-->
<!--    bg-main-500 checked:bg-yellow-400-->
<!--    checked:text-yellow-800 checked:border-yellow-500"-->
<!--      />-->
<!--      <span class="text-lg">Track stock for this product</span>-->
<!--    </div>-->

      <div class="flex flex-col space-y-1">
        <label class="label font-semibold md:text-xl text-sm" for="productPrice">Stock quantity </label>
        <input
            id="productPrice"
            v-model="inventoryData.stock"
            :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': stockMeta.validated && !stockMeta.valid,

                        }"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
            placeholder="Product Price"
            type="text"
            required
        />
        <small
            v-if="stockMeta.validated && !stockMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ stockErrorMessage }}
        </small>
      </div>




  </div>

</template>

<style scoped>



.bounce-enter-active {
  animation: bounce-in 0.5s
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }

}

</style>