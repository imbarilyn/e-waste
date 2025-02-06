<script setup lang="ts">
import {reactive, watch, ref} from 'vue'
import { useField } from 'vee-validate'
import {useAdminStore} from "@/stores/adminStore.ts";

const createAggregatorData = reactive({
  fullName: '',
  email: '',
  phoneNumber: '',
  location: ''
})

const adminStore = useAdminStore()
const isLoadingResource = ref(false)


const emailValidator = (value: string) => {
  if (!value) {
    return 'Email is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(value)) {
    return 'Email must be valid'
  }

  if (value.length > 50) {
    return 'Email must be less than 50 characters'
  }

  return true
}

const {
  value: email,
  errorMessage: emailErrorMessage,
  meta: emailMeta
} = useField('email', emailValidator)

watch(
    () => createAggregatorData.email,
    (value: string) => {
      email.value = value
    }
)



const fullNameValidator = (value: string) => {
  if (!value) {
    return 'Full name is required'
  }

  if (value.length > 50) {
    return 'Full name must be less than 50 characters'
  }

  return true
}

const {
  value: fullName,
  errorMessage: fullNameErrorMessage,
  meta: fullNameMeta
} = useField('fullName', fullNameValidator)

watch(
    () => createAggregatorData.fullName,
    (value: string) => {
      fullName.value = value
    }
)

const phoneNumberValidator = (value: string) => {
  if (!value) {
    return 'Phone number is required'
  }

  const phoneRegex = /^(\+254|0)[1-9]\d{8}$/

  if (!phoneRegex.test(value)) {
    return 'Phone number is invalid'
  }

  return true
}

const {
  value: phoneNumber,
  errorMessage: phoneNumberErrorMessage,
  meta: phoneNumberMeta
} = useField('phoneNumber', phoneNumberValidator)

watch(
    () => createAggregatorData.phoneNumber,
    (value: string) => {
      phoneNumber.value = value
    }
)

const locationValidator = (value: string) => {
  if (!value) {
    return 'Location is required'
  }

  if (value.length > 50) {
    return 'Location must be less than 50 characters'
  }

  return true
}

const {
  value: location,
  errorMessage: locationErrorMessage,
  meta: locationMeta
} = useField('location', locationValidator)

watch(
    () => createAggregatorData.location,
    (value: string) => {
      location.value = value
    }
)



















</script>

<template>
  <div class="md:text-3xl text-2xl text-main-950">
    <div>Add an aggregator</div>
    <main class="w-full mx-auto p-6 items-center flex justify-center">
      <div
          :class="[adminStore.collapseSidebar? 'lg:w-8/12': 'lg:w-10/12']"
          class="w-full md:w-10/12 xl:w-5/12  px-4 md:px-2 lg:px-0 mt-7 bg-white border border-gray-200 rounded-2xl shadow-2xl"
      >
        <div class="p-4 sm:p-7">
          <div class="mt-5">
            <form class="my-4" @submit.prevent="onLoginClick">
              <div class="grid gap-y-4">
                <div class="flex flex-col space-y-1">
                  <label class="label font-semibold text-sm" for="name"> Full name </label>
                  <input
                      id="name"
                      v-model="createAggregatorData.fullName"
                      :class="{
                    'input-error': fullNameMeta.validated && !fullNameMeta.valid,
                    'input-primary': fullNameMeta.validated && fullNameMeta.valid
                  }"
                      class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                      placeholder="Password"
                      type="text"
                      required
                  />
                  <small
                      v-if="fullNameMeta.validated && !fullNameMeta.valid"
                      class="text-sm text-rose-500"
                  >
                    {{ fullNameErrorMessage }}
                  </small>
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="label font-semibold text-sm" for="phone"> Phone number </label>
                  <input
                      id="phone"
                      v-model="createAggregatorData.phoneNumber"
                      :class="{
                    'input-error': phoneNumberMeta.validated && !phoneNumberMeta.valid,
                    'input-primary': phoneNumberMeta.validated && phoneNumberMeta.valid
                  }"
                      class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                      placeholder="Password"
                      type="text"
                      required
                  />
                  <small
                      v-if="phoneNumberMeta.validated && !phoneNumberMeta.valid"
                      class="text-sm text-rose-500"
                  >
                    {{ phoneNumberErrorMessage }}
                  </small>
                </div>

                <div class="flex flex-col space-y-1">
                  <div class="flex justify-between items-center">
                    <label class="label font-semibold text-sm" for="email"> Email </label>
                    <!--                  <router-link-->
                    <!--                      class="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"-->
                    <!--                      to="forgot-password">Forgot password?-->
                    <!--                  </router-link>-->
                  </div>
                  <input
                      id="email"
                      v-model="createAggregatorData.email"
                      :class="{
                    'input-error': emailMeta.validated && !emailMeta.valid,
                    'input-primary': emailMeta.validated && emailMeta.valid
                  }"
                      class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                      placeholder="Email"
                      type="text"
                      required
                  />
                  <small v-if="emailMeta.validated && !emailMeta.valid" class="text-sm text-rose-500">
                    {{ emailErrorMessage }}
                  </small>
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="label font-semibold text-sm" for="location"> Location </label>
                  <input
                      id="phone"
                      v-model="createAggregatorData.location"
                      :class="{
                    'input-error': locationMeta.validated && !locationMeta.valid,
                    'input-primary': locationMeta.validated && locationMeta.valid
                  }"
                      class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                      placeholder="Password"
                      type="text"
                  />
                  <small
                      v-if="locationMeta.validated && !locationMeta.valid"
                      class="text-sm text-rose-500"
                  >
                    {{ locationErrorMessage }}
                  </small>
                </div>
                <div class="flex flex-col space-y-1 my-1">
                  <button
                      :disabled="isLoadingResource"
                      class="btn  btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300 md:btn-md normal-case text-sm md:text-sm w-full"
                      type="submit"
                  >
                  <span
                      v-if="isLoadingResource"
                      class="loading loading-md loading-spinner text-neutral-400"
                  ></span>
                    Add Aggregator
                  </button>
                </div>
              </div>
            </form>
            <!-- End Form -->
          </div>
        </div>
      </div>
    </main>
  </div>

</template>

<style scoped>

</style>