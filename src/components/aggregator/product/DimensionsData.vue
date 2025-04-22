<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, reactive, watch, ref} from 'vue'
import {useField} from 'vee-validate'
import {useAggregatorStore} from "@/stores";
import {useStorage} from "@vueuse/core";



const aggregatorStore = useAggregatorStore()

const dimensionData = reactive({
  width: '',
  length: '',
  height: '',
  weight: ''
})

// const pickedHeight = ref('')
// const pickedWidth = ref('')
// const pickedLength = ref('')
// const pickedWeight = ref('')



const dimensionDataInfo = useStorage('dimensionData', {
  width: '',
  length: '',
  height: '',
  weight: ''
})

const dimensionValidation = (value:  string) =>{
  if(value && isNaN(Number(value))){
    return 'This field must be a number'
  }
  if(value && Number(value) < 0){
    return 'This field must be a positive number'
  }
  // if(value && !pickedHeight.value) {
  //   return 'Please select a unit'
  // }
  return true
}
//
// const lengthValidation = (value:  string) =>{
//   if(value && isNaN(Number(value))){
//     return 'This field must be a number'
//   }
//   if(value && Number(value) < 0){
//     return 'This field must be a positive number'
//   }
//   // if(value && !pickedLength.value) {
//   //   return 'Please select a unit'
//   // }
//   return true
// }

// const widthValidation = (value:  string) =>{
//   if(value && isNaN(Number(value))){
//     return 'This field must be a number'
//   }
//   if(value && Number(value) < 0){
//     return 'This field must be a positive number'
//   }
//   // if(value && !pickedWidth.value) {
//   //   return 'Please select a unit'
//   // }
//   return true
// }
const {
  value: width,
  errorMessage: widthErrorMessage,
  meta: widthMeta
} = useField('width', dimensionValidation)

watch(()=> dimensionData.width, (value) => {
  width.value = value
})

const {
  value: length,
  errorMessage: lengthErrorMessage,
  meta: lengthMeta
} = useField('length', dimensionValidation)
watch(()=> dimensionData.length, (value) => {
  length.value = value
})

const {
  value: height,
  errorMessage: heightErrorMessage,
  meta: heightMeta
} = useField('height', dimensionValidation)

watch(()=> dimensionData.height, (value) => {
  height.value = value
})

const {
  value: weight,
  errorMessage: weightErrorMessage,
  meta: weightMeta
} = useField('weight', dimensionValidation)

watch(()=> dimensionData.weight, (value) => {
  if(value){
    console.log('Weight', value)
    weight.value = value
  }
})


const isDimensionDataValid = computed(() => {
  return (
      widthMeta.valid ||
      lengthMeta.valid ||
      heightMeta.valid ||
      weightMeta.valid
  )
})

onMounted(()=>{
  const width = (dimensionDataInfo.value?.width || ' ').split(' ')
  const length = (dimensionDataInfo.value?.length || ' ').split(' ')
  const height = (dimensionDataInfo.value?.height || ' ').split(' ')
  const weight = (dimensionDataInfo.value?.weight || ' ').split(' ')
  dimensionData.width = width[0]
  dimensionData.length = length[0]
  dimensionData.height = height[0]
  dimensionData.weight = weight[0]
  // pickedWidth.value = width[1]
  // pickedLength.value = length[1]
  // pickedHeight.value = height[1]
  // pickedWeight.value = weight[1]
})

onBeforeUnmount(()=>{
  aggregatorStore.productValidation.dimensionsData = isDimensionDataValid.value as boolean
  console.log(isDimensionDataValid.value)
  if(isDimensionDataValid.value){
    localStorage.setItem('dimensionData', JSON.stringify({
      width: dimensionData.width,
      length: dimensionData.length,
      height: dimensionData.height,
      weight: dimensionData.weight
    }))

  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-12 gap-8">
<!--      <div>-->
<!--        <span>The</span>-->
<!--      </div>-->
      <div class="flex flex-col space-y-1 col-span-12">

        <div class="flex justify-between md:text-xl text-sm">
          <label class="font-semibold md:text-xl text-sm" for="height">Height</label>
          <small>Optional(Meters)</small>
        </div>

        <input
            id="height"
            v-model="dimensionData.height"
            :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': heightMeta.validated && !heightMeta.valid,

                        }"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2   text-sm"
            placeholder="Height in metres"
            type="text"
            required
        />
        <small
            v-if="!heightMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ heightErrorMessage }}
        </small>
<!--        <span v-if="pickedHeight" class="font-semibold">Selected Height {{pickedHeight}} </span>-->
      </div>
<!--      <div class="col-span-2 space-y-2 flex flex-col" :class="[pickedHeight? 'justify-center': 'justify-end']">-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio" id="Cm" v-model="pickedHeight" value="Cm" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="Cm">Centimeters(Cm)</label>-->

<!--        </div>-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio"  id="m" v-model="pickedHeight" value="m" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="m">Metres(m)</label>-->
<!--        </div>-->
<!--      </div>-->

    </div>
    <div class="grid grid-cols-12 gap-8">
      <div class="flex flex-col space-y-1 col-span-12">
        <div class="flex justify-between md:text-xl text-sm">
          <label class="font-semibold md:text-xl text-sm" for="length">Length</label>
          <small>Optional(Meters)</small>
        </div>

        <input
            id="length"
            v-model="dimensionData.length"
            :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500':!lengthMeta.valid,

                        }"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2   text-sm"
            placeholder="Length in metres"
            type="text"
            required
        />
        <small
            v-if="!lengthMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ lengthErrorMessage }}
        </small>
<!--        <span v-if="pickedLength" class="font-semibold">Selected Height {{pickedLength}} </span>-->
      </div>
<!--      <div class="col-span-2 space-y-2 flex flex-col" :class="[pickedLength ? 'justify-center' : 'justify-end']">-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio" id="Cm" v-model="pickedLength" value="Cm" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="Cm">Centimeters(Cm)</label>-->

<!--        </div>-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio"  id="m" v-model="pickedLength" value="m" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="m">Metres(m)</label>-->
<!--        </div>-->
<!--      </div>-->
      </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="flex flex-col space-y-1 col-span-12">
        <div class="flex justify-between md:text-xl text-sm">
          <label class="font-semibold md:text-xl text-sm" for="width">Width</label>
          <small>Optional(Meters)</small>
        </div>


        <input
            id="width"
            v-model="dimensionData.width"
            :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': !widthMeta.valid,

                        }"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2   text-sm"
            placeholder="Width in meters"
            type="text"
            required
        />
        <small
            v-if="!widthMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ widthErrorMessage }}
        </small>
<!--        <span v-if="pickedWidth" class="font-semibold">Selected Height {{pickedWidth}} </span>-->

      </div>
<!--      <div class="col-span-2 space-y-2 flex flex-col" :class="[pickedWidth ? 'justify-center' : 'justify-end']">-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio" id="Cm" v-model="pickedWidth" value="Cm" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="Cm">Centimeters(Cm)</label>-->

<!--        </div>-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio"  id="m" v-model="pickedWidth" value="m" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="m">Metres(m)</label>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="grid grid-cols-12 gap-8">
      <div class="flex flex-col space-y-1 col-span-12">
        <div class="flex justify-between md:text-xl text-sm">
          <label class="font-semibold md:text-xl text-sm" for="width">Weight</label>
          <small>Optional(Kilogram)</small>
        </div>


        <input
            id="width"
            v-model="dimensionData.weight"
            :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': !weightMeta.valid,

                        }"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2   text-sm"
            placeholder="Weight in Kilograms"
            type="text"
            required
        />
        <small
            v-if="!weightMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ weightErrorMessage }}
        </small>
<!--        <span v-if="pickedWeight" class="font-semibold">Selected Height {{pickedWeight}} </span>-->

      </div>
<!--      <div class="col-span-2 space-y-2 flex flex-col" :class="[pickedWeight ? 'justify-center' : 'justify-end']">-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio" id='g' v-model="pickedWeight" value="g" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="g">Grams(g)</label>-->

<!--        </div>-->
<!--        <div class="flex gap-2">-->
<!--          <input type="radio"  id="Kg" v-model="pickedWeight" value="Kg" class="radio border-main-600  checked:bg-main-400 checked:text-main-800 checked:border-main-500" />-->
<!--          <label for="Kg">Kilograms(Kg)</label>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    </div>




<!--  <div class="pt-6">-->
<!--    <small class="text-lg">The above attributes are optional</small>-->
<!--  </div>-->
</template>

<style scoped>

</style>