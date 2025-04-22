<script setup lang="ts">
import {computed, reactive, ref, watch, onBeforeUnmount, onMounted} from 'vue'
import {useField} from 'vee-validate'
import {useAggregatorStore, useProductTabStore, type ProductTab} from "@/stores";
import {useStorage} from "@vueuse/core";


interface GeneralData {
      productName:string
      salePrice?: string
      regularPrice: string
      shortDescription: string
      // weight?: string
}
const aggregatorStore = useAggregatorStore()
const productTabStore = useProductTabStore()
const imageFileRef = ref<HTMLInputElement | null>(null)
const generalData = reactive<GeneralData>({
  productName: '',
  salePrice: '',
  regularPrice: '',
  shortDescription: '',
  // weight: '',
})


const generalDataInfo = useStorage<GeneralData>('generalData', {
  productName: '',
  salePrice: '',
  regularPrice: '',
  shortDescription: '',
  // weight: '',
})

const createProductValidator = (value: string) => {
  if (!value) {
    return "Product name is required"
  }
  return true
}


const {
  value: productName,
  errorMessage: productNameErrorMessage,
  meta: productNameMeta
} = useField('productName', createProductValidator)

watch(() => generalData.productName, (value) => {
  productName.value = value
})

const regularPriceValidator = (value: string) => {
  if (!value) {
    return "Product price is required"
  }
  if (isNaN(Number(value))) {
    return "This field must be a number"
  }
  return true
}
const {
  value: regularPrice,
  errorMessage: regularPriceErrorMessage,
  meta: regularPriceMeta
} = useField('regularPrice', regularPriceValidator)

watch(() => generalData.regularPrice, (value) => {
  regularPrice.value = value
})

const salePriceValidator = (value: string) => {
  if (value && isNaN(Number(value))) {
    return "This field must be a number"
  }
  return true
}

const {
  value: salePrice,
  errorMessage: salePriceErrorMessage,
  meta: salePriceMeta
} = useField('salePrice', salePriceValidator)

watch(() => generalData.salePrice, (value) => {
  if(value){
    salePrice.value = value
  }

})

const weightValidator = (value: string) =>{
  if(value && isNaN(Number(value))){
    return "Weight must be a number"
  }
  return true
}

// const {
//   value: weight,
//   errorMessage: weightErrorMessage,
//   meta: weightMeta
// } = useField('weight', weightValidator)
//
// watch(()=> generalData.weight, (value) => {
//   if(value){
//     weight.value = value
//   }
// })

const shortDescriptionValidator = (value: string) => {
  if (!value) {
    return "Short description is required"
  }
  if (value.length > 100) {
    return "The description is too long"
  }
  return true
}

const {
  value: shortDescription,
  errorMessage: shortDescriptionErrorMessage,
  meta: shortDescriptionMeta
} = useField('shortDescription', shortDescriptionValidator)

watch(() => generalData.shortDescription, (value) => {
  shortDescription.value = value
})

const isGeneralDataOkay = computed(()=>{
  return (
      productNameMeta.valid && productNameMeta.validated &&
      regularPriceMeta.valid && regularPriceMeta.validated &&
      salePriceMeta.valid &&
      shortDescriptionMeta.valid && shortDescriptionMeta.validated
      // weightMeta.valid
  )
})

// watch(()=>isGeneralDataOkay.value, (value)=>{
//   aggregatorStore.productValidation.generalData = value
// })
onMounted(()=>{
  generalData.productName = generalDataInfo.value.productName
  generalData.regularPrice = generalDataInfo.value.regularPrice
  generalData.salePrice = generalDataInfo.value.salePrice
  generalData.shortDescription = generalDataInfo.value.shortDescription
  // generalData.weight = generalDataInfo.value.weight
})

onBeforeUnmount(()=>{
  aggregatorStore.productValidation.generalData = isGeneralDataOkay.value
  if(isGeneralDataOkay.value){
    localStorage.setItem('generalData', JSON.stringify(generalData));
  }
})


</script>

<template>
  <div class="flex flex-col space-y-1">
    <label class="label font-semibold md:text-xl text-sm" for="productName"> Product name </label>
    <input
        id="productName"
        v-model="generalData.productName"
        :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': productNameMeta.validated && !productNameMeta.valid,

                        }"
        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2   text-sm"
        placeholder="Product name"
        type="text"
        required
    />
    <small
        v-if="productNameMeta.validated && !productNameMeta.valid"
        class="text-sm text-rose-500"
    >
      {{ productNameErrorMessage }}
    </small>
  </div>
  <div class="flex flex-col space-y-1">
    <label class="label font-semibold md:text-xl text-sm" for="productPrice"> Regular Price </label>
    <input
        id="productPrice"
        v-model="generalData.regularPrice"
        :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': regularPriceMeta.validated && !regularPriceMeta.valid,

                        }"
        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
        placeholder="Product Price"
        type="text"
        required
    />
    <small
        v-if="regularPriceMeta.validated && !regularPriceMeta.valid"
        class="text-sm text-rose-500"
    >
      {{ regularPriceErrorMessage }}
    </small>
  </div>

  <div class="flex flex-col space-y-1">
    <label class="label font-semibold md:text-xl text-sm" for="phone">Sale Price</label>
    <input
        id="salePrice"
        v-model="generalData.salePrice"
        :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': salePriceMeta.validated && !salePriceMeta.valid,

                        }"
        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
        placeholder="Password"
        type="text"
    />
    <small
        v-if="salePriceMeta.validated && !salePriceMeta.valid"
        class="text-sm text-rose-500"
    >
      {{ salePriceErrorMessage }}
    </small>
  </div>
  <div class="flex flex-col space-y-1">
    <label class="label font-semibold lg:text-xl text-lg" for="shortDescription">Short description </label>

    <textarea
        id="shortDescription"
        v-model="generalData.shortDescription"
        :class="{
                    'textarea-error': shortDescriptionMeta.validated && !shortDescriptionMeta.valid,
                    'input-info': shortDescriptionMeta.validated && shortDescriptionMeta.valid
                  }"
        class="textarea textarea-bordered py-8 border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
    >
      </textarea>
    <small v-if="shortDescriptionMeta.validated && !shortDescriptionMeta.valid"
           class="text-sm text-rose-500">
      {{ shortDescriptionErrorMessage }}
    </small>
  </div>
<!--  <div class="pt-4 flex justify-end">-->
<!--    <button class="btn btn-sm bg-main-500 hover:bg-main-400">-->
<!--      <span class="text-white" >Next</span>-->
<!--    </button>-->
<!--  </div>-->
</template>

<style scoped>

</style>