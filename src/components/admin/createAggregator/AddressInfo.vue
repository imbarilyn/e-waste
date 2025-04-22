<script setup lang="ts">

import ComboBox, {type ComboOptions} from "@/components/commonComponent/ComboBox.vue";
import {reactive, watch, computed, onMounted, ref} from "vue";
import {useStorage} from "@vueuse/core";
import {add, merge} from "lodash";
import {useField} from 'vee-validate'
import {type CollectorPayload, useNotificationsStore, useAdminAuthStore, useAggregatorAuthStore} from "@/stores";
import {showAlert} from "@/modules/sweetAlert.ts";
import {useRouter} from "vue-router";

interface AddressData {
  county: string;
  street1: string;
  street2: string;
}

const aggregatorAuthStore = useAggregatorAuthStore()
const adminAuthStore = useAdminAuthStore()
const addressData = reactive({
  county: '',
  street1: '',
  street2: '',
})

const addressInfo = useStorage<AddressData>('addressInfo', {
  county: '',
  street1: '',
  street2: '',
  // state: 'KE30',
  // country: 'KE',
  // zip: '00100'
})

const notificationStore = useNotificationsStore()
// const updateLocalStorage = (value: AddressData) => {
//   const existingData = addressInfo.value || {}
//   addressInfo.value = merge({}, existingData, value)
// }
const counties =
    [
      {"id": 1, "name": "Mombasa"},
      {"id": 2, "name": "Kwale"},
      {"id": 3, "name": "Kilifi"},
      {"id": 4, "name": "Tana River"},
      {"id": 5, "name": "Lamu"},
      {"id": 6, "name": "Taita Taveta"},
      {"id": 7, "name": "Garissa"},
      {"id": 8, "name": "Wajir"},
      {"id": 9, "name": "Mandera"},
      {"id": 10, "name": "Marsabit"},
      {"id": 11, "name": "Isiolo"},
      {"id": 12, "name": "Meru"},
      {"id": 13, "name": "Tharaka Nithi"},
      {"id": 14, "name": "Embu"},
      {"id": 15, "name": "Kitui"},
      {"id": 16, "name": "Machakos"},
      {"id": 17, "name": "Makueni"},
      {"id": 18, "name": "Nyandarua"},
      {"id": 19, "name": "Nyeri"},
      {"id": 20, "name": "Kirinyaga"},
      {"id": 21, "name": "Murang'a"},
      {"id": 22, "name": "Kiambu"},
      {"id": 23, "name": "Turkana"},
      {"id": 24, "name": "West Pokot"},
      {"id": 25, "name": "Samburu"},
      {"id": 26, "name": "Trans Nzoia"},
      {"id": 27, "name": "Uasin Gishu"},
      {"id": 28, "name": "Elgeyo Marakwet"},
      {"id": 29, "name": "Nandi"},
      {"id": 30, "name": "Baringo"},
      {"id": 31, "name": "Laikipia"},
      {"id": 32, "name": "Nakuru"},
      {"id": 33, "name": "Narok"},
      {"id": 34, "name": "Kajiado"},
      {"id": 35, "name": "Kericho"},
      {"id": 36, "name": "Bomet"},
      {"id": 37, "name": "Kakamega"},
      {"id": 38, "name": "Vihiga"},
      {"id": 39, "name": "Bungoma"},
      {"id": 40, "name": "Busia"},
      {"id": 41, "name": "Siaya"},
      {"id": 42, "name": "Kisumu"},
      {"id": 43, "name": "Homa Bay"},
      {"id": 44, "name": "Migori"},
      {"id": 45, "name": "Kisii"},
      {"id": 46, "name": "Nyamira"},
      {"id": 47, "name": "Nairobi"}
    ] as ComboOptions[]


const selectedCounty = (val: ComboOptions) => {
  addressData.county = val.name
  console.log('Selected County: ', val)
}

const street1Validator = (value: string) => {
  if (!value) {
    return 'street name is required'
  }

  if (value.length > 15) {
    return 'Street name is too long'
  }

  return true
}

const {
  value: street1,
  errorMessage: street1ErrorMessage,
  meta: street1Meta,
} = useField('street1', street1Validator)

watch(() => addressData.street1, (value) => {
  street1.value = value
})


const street2Validator = (value: string) => {
  if (value && value.length > 15) {
    return 'Street name is too long'
  }

  return true;
}


const {
  value: street2,
  errorMessage: street2ErrorMessage,
  meta: street2Meta,
} = useField('street2', street2Validator, { initialValue: ''})

watch(() => addressData.street2, (value) => {
  street2.value = value
})



const everyThingOk = computed(() => {
  return (
      street1Meta.valid && street1Meta.validated &&
      street2Meta.valid && addressData.county.length > 0
  )
})

const isCreateCollectorDisabled = ref(false)
watch(() => everyThingOk.value, (value) => {
  console.log('everyThingOk', value)
  isCreateCollectorDisabled.value = value as boolean
})



const isLoadingResource = ref(false)
const router = useRouter()
const createCollectorHandler = (createCollector: CollectorPayload) => {
  if (everyThingOk) {
    isLoadingResource.value = true
    aggregatorAuthStore.createAggregator({...createCollector, wpToken: adminAuthStore.adminWordpressToken, adminId: adminAuthStore.getAdminInfo()?.userId as string})
        .then((resp) => {
          if (resp.result === 'success') {
            setTimeout(() => {
              isLoadingResource.value = false
              showAlert({
                type: 'success',
                message: resp.message
              })
              router.push({
                name: 'Admin-Portfolio',
                params: {
                  userId: adminAuthStore.getAdminInfo()?.userId,
                }
              })
            }, 2000)
          } else {
            setTimeout(() => {
              isLoadingResource.value = false
              showAlert({
                type: 'error',
                message: resp.message
              })
            }, 2000)
          }
        })
        .catch(() => {
          setTimeout(() => {
            isLoadingResource.value = false
            showAlert({
              type: 'error',
              message: 'Failed to create aggregator, please try again'
            })
          }, 2000)
        })
  }
}
const createCollector = ()=>{
  if(everyThingOk.value){
    console.log('Create collector...')
    localStorage.setItem('addressInfo', JSON.stringify(addressData))
    const accountInfo = JSON.parse(localStorage.getItem('accountInfo') as string)
    const createCollectorPayload = {
      ...accountInfo,
      address: {
        city: addressData.county,
        street_1: addressData.street1,
        street_2: addressData.street2,
        state: 'KE30',
        country: 'KE',
        zip: '00100'
      }
    }
    createCollectorHandler(createCollectorPayload)

  }
  else{
    notificationStore.addNotification('Please fill all required fields', 'error')
  }
}

// const selectedCounty = ref('')
onMounted(()=>{
  addressData.county = addressInfo.value.county
  addressData.street1 = addressInfo.value.street1
  addressData.street2 = addressInfo.value.street2

})
</script>

<template>
  <form @submit.prevent="createCollector">
    <div class="grid gap-y-4 bg-main-50 shadow-sm rounded-2xl border  border-gray-200 p-4 sm:p-7">
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between items-center">
          <label class="label font-semibold text-sm" for="email">County</label>
        </div>
        <ComboBox :combo-props="counties" @combo-choice="selectedCounty" :prompt="addressData.county"/>
        <small class="text-sm text-rose-500">
        </small>
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between items-center">
          <label class="label font-semibold text-sm" for="email">Street 1</label>
          <small class="text-sm">(eg. Kariobangi)</small>
        </div>
        <input
            v-model="addressData.street1"
            id="inputStreet1"
            :class="[street1Meta.validated && !street1Meta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
            class="w-full text-sm"
            placeholder="Street 1"
            type="text"
            required
        />
        <small class="text-sm text-rose-500" v-if="street1Meta.validated && !street1Meta.valid">{{street1ErrorMessage}}
        </small>
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex justify-between items-center">
          <label class="label font-semibold text-sm" for="email">Street 2</label>
          <small class="text-sm">(Optional)</small>
        </div>
        <input
            id="inputStreet2"
            v-model="addressData.street2"
            :class="[street2Meta.validated && !street2Meta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
            class="focus:ring-offset-2  w-full text-sm"
            placeholder="Street 2"
            type="text"
        />
        <small class="text-sm text-rose-500" v-if="street2Meta.validated && !street2Meta.validated">{{street2ErrorMessage}}
        </small>
      </div>
      <div class="flex flex-col space-y-1">
        <button type="submit" class="btn  btn-md bg-main-500 hover:bg-main-400 text-white" :disabled="!isCreateCollectorDisabled">
          <span  v-if="!isLoadingResource">Create collector</span>
          <span v-else class="loading loading-spinner loading-md text-white"></span>
        </button>
      </div>

    </div>
  </form>
</template>

<style scoped>

</style>