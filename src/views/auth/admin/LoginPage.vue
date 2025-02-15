<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ref, watch, reactive, computed} from "vue";
import {useField} from "vee-validate";
import {useAdminAuthStore, useAdminTabStore} from "@/stores";

const adminAuthStore = useAdminAuthStore()
const adminTabStore = useAdminTabStore()
const router = useRouter()
const isLoading = ref(false)
const loginAdminData = reactive(
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
    () => loginAdminData.phoneNumber,
    (value: string) => {
      phoneNumber.value = value
    }
)

const passwordValidator = (value: string) => {
  if (!value) {
    return 'Password is required'
  }

  if (value.length < 6) {
    return 'Password must be at least 6 characters'
  }

  return true
}

const {
  value: password,
  errorMessage: passwordErrorMessage,
  meta: passwordMeta
} = useField('password', passwordValidator)

watch(
    () => loginAdminData.password,
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

const adminLoginHandler = () => {
  if (everyThingOk.value) {
    console.log(loginAdminData)
    isLoading.value = true
    adminAuthStore.adminLogin(loginAdminData)
        .then((res) =>{
          console.log('login response-admin', res)
          if(res?.result === 'success'){
            setTimeout(()=>{
              isLoading.value = false
              adminTabStore.setActiveTab('Admin-Overview')

              router.push({
                name: 'Admin-Overview',
                params: {
                  userId: adminAuthStore.getAdminInfo()?.userId
                }
              })
            }, 1500)
          } else{
            setTimeout(()=>{
              isLoading.value = false
              adminAuthStore.setIsAuthenticationError({
                isError: true,
                message: res?.message,
                type: 'error'
              })

            }, 1500)

          }
        })
        .catch((error) => {
        setTimeout(()=>{
          isLoading.value = false
          adminAuthStore.setIsAuthenticationError({
            isError: true,
            message: 'An error occurred',
            type: 'error'
          })
        }, 1500)
        })

  } return
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
          <span>Do you have an account?</span>
          <router-link
              class="text-sm ps-2 text-white decoration-2 underline font-medium"
              to="/auth/admin-register">Create account?
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
          <form class="md:my-4 my-24" @submit.prevent="adminLoginHandler">
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
                        v-model="loginAdminData.phoneNumber"
                        :class="{
                    'input-error': phoneNumberMeta.validated && !phoneNumberMeta.valid,
                    'input-primary': phoneNumberMeta.validated && phoneNumberMeta.valid
                  }"
                        id="phoneNumber"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        placeholder="0712345678"
                        required
                        type="text"
                    />
                    <small
                        v-if="phoneNumberMeta.validated && !phoneNumberMeta.valid"
                        class="text-sm text-rose-500"
                    >
                      {{ phoneNumberErrorMessage }}
                    </small>

                  </div>
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="label font-semibold text-main-800" for="email">Password</label>
                      <router-link
                          class="text-sm text-main-500 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          to="/auth/admin-forgot-password">Forgot password?
                      </router-link>
                    </div>
                    <div>
                      <input
                          v-model="loginAdminData.password"
                          :class="{
                    'input-error': passwordMeta.validated && !passwordMeta.valid,
                    'input-primary': passwordMeta.validated && passwordMeta.valid
                  }"

                          id="password"
                          class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                          required
                          type="password"

                      />
                      <small v-if="passwordMeta.validated && !passwordMeta.valid" class="text-sm text-rose-500">
                        {{ passwordErrorMessage }}
                      </small>

                    </div>
                  </div>
                  <div class="w-full">
                    <button class="btn w-full bg-main-500 hover:bg-main-700" type="submit">
                      <span
                          v-if="isLoading"
                          class="loading loading-spinner loading-md text-white"></span>
                      <span v-else class="text-white text-lg">Login</span>
                    </button>
                  </div>
                  <div class="md:hidden block">
                    <span>Do you have an account?</span>
                    <router-link
                        class="text-sm ps-2 decoration-2 text-main-500 underline font-medium"
                        to="auth/">Create account
                    </router-link>
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