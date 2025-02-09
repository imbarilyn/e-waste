<script lang="ts" setup>
import {useRouter} from "vue-router";
import {computed, reactive, ref, watch} from "vue";
import {useField} from "vee-validate";
import {useAggregatorAuthStore} from "@/stores/aggregatorAuthStore.ts";

const router = useRouter()
const aggregatorAuthStore = useAggregatorAuthStore()
const isLoading = ref(false)

const loginAggregatorData = reactive(
    {
      phoneNumber: '',
      password: ''
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
    () => loginAggregatorData.phoneNumber,
    (value: string) => {
      phoneNumber.value = value
    }
)

const passwordValidator = (value: string) => {
  if (!value) {
    return 'Password is required'
  }

  if (value.length < 4) {
    return 'Password must be at least 4 characters'
  }

  return true
}

const {
  value: password,
  errorMessage: passwordErrorMessage,
  meta: passwordMeta
} = useField('password', passwordValidator)

watch(
    () => loginAggregatorData.password,
    (value: string) => {
      password.value = value
    }
)

const everyThingOk = computed(() => {
  return (
      phoneNumberMeta.validated && phoneNumberMeta.valid &&
      passwordMeta.validated && passwordMeta.valid
  )
})

const aggregatorLoginHandler = () => {
  if (everyThingOk) {
    isLoading.value = true
    aggregatorAuthStore.loginAggregator(loginAggregatorData)
        .then((res) => {
          console.log('login response-admin', res)
          if (res?.result === 'success') {
            setTimeout(() => {
              isLoading.value = false
              router.push({
                name: 'Aggregator-Overview',
                params: {
                  userId: aggregatorAuthStore.getAggregatorInfo()?.userId
                }
              })
            }, 1500)
          } else {
            setTimeout(() => {
              isLoading.value = false
              aggregatorAuthStore.setIsAuthenticationError({
                isError: true,
                message: res?.message,
                type: 'error'
              })

            }, 1500)

          }
        })
        .catch((error) => {
          setTimeout(() => {
            isLoading.value = false
            aggregatorAuthStore.setIsAuthenticationError({
              isError: true,
              message: 'An error occurred, please try again',
              type: 'error'
            })
          }, 1500)
        })

  }
  return
}

</script>

<template>
  <div class="h-full w-full grid grid-cols-12 bg-main-300 md:bg-white">

    <div
        class="bg-main-300  md:rounded-tr-2xl md:rounded-br-2xl  md:h-screen flex  items-center md:justify-center md:col-span-6 col-span-12">
      <div class="md:block hidden  space-y-10">
        <div class="text-white">
          <p class="!text-5xl font-semibold">Welcome Back</p>
          <span class="text-lg">Hello there, login to continue</span>
        </div>
        <div class="flex justify-center">
          <img src="/images/e-waste.png" alt="contract-image" class="lg:w-40 w-32 ">
        </div>
        <div class="text-white">
          <span>Forgotten your password?</span>
          <router-link
              class="text-sm ps-2 text-white decoration-2 underline font-medium"
              to="/auth/aggregator-forgot-password">Forgot password
          </router-link>
        </div>
      </div>
      <div class="md:hidden flex items-center py-4  justify-start text-white ps-4">
        <div class="flex items-center justify-center btn btn-sm btn-ghost btn-circle" @click="router.go(-1)">
          <span class="material-icons-outlined cursor-pointer">chevron_left</span>
        </div>
        <div>
          <span class="text-lg font-semibold ps-4">Login</span>
        </div>
      </div>
    </div>
    <div
        class="md:col-span-6 col-span-12 bg-white rounded-tl-2xl rounded-tr-2xl md:h-screen flex justify-center md:items-center ">
      <div
          class="w-10/12 "
      >
        <div class="md:mt-5">
          <!-- Form -->
          <form class="md:my-4 my-24" @submit.prevent="aggregatorLoginHandler">
            <div class="grid md:gap-y-4">
              <div class="flex flex-col md:space-y-1">
                <div class="flex flex-col space-y-5">
                  <div class="flex  flex-col justify-start  md:hidden">
                    <p class="!text-2xl font-semibold text-main-400">Welcome Back</p>
                    <span class="!text-xl text-main-800">Hello there, login to continue</span>
                  </div>
                  <div class="md:hidden mx-auto block">
                    <div>
                      <img src="/images/e-waste.png" alt="e-waste-image" class="w-32">
                    </div>
                  </div>
                  <div>
                    <label class="label font-semibold text-main-800" for="phoneNumber">Phone number</label>
                    <input

                        id="phoneNumber"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        placeholder="0712345678"
                        required
                        type="text"
                    />

                  </div>
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="label font-semibold text-main-800" for="email">Password</label>
                      <router-link
                          class="text-sm text-main-500 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          to="/auth/aggregator-forgot-password">Forgot password?
                      </router-link>
                    </div>
                    <div>
                      <input

                          id="password"
                          class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"

                          required
                          type="password"
                      />

                    </div>
                  </div>
                  <div class="w-full">
                    <button class="btn w-full bg-main-500 hover:bg-main-700" type="submit">
                      <!--                      <span class="loading loading-spinner loading-md text-white"></span>-->
                      <span class="text-white text-lg">Login</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </form>
          <!-- End Form -->

        </div>
      </div>
    </div>


  </div>
</template>