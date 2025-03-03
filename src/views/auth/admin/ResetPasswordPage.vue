<script lang="ts" setup>
import {useRouter} from "vue-router";
import {useField} from "vee-validate";
import {computed, watch, reactive, ref} from "vue";
import {showAlert} from "@/modules/sweetAlert.ts";
import {useAdminAuthStore} from "@/stores";
import {param} from "jquery";

const router = useRouter()
const adminAuthStore = useAdminAuthStore()
const isLoading = ref(false)

interface ResetToken {
  resetToken: string
}


const props = defineProps<ResetToken>()
const resetPasswordData = reactive({
  password: '',
  confirmPassword: ''
})

const passwordValidator=(value: string)=>{
  if(!value){
    return 'Password is required'
  }

  if(value.length < 6){
    return 'Password too short'
  }

  return true
}

const {
  value: password,
  errorMessage: passwordErrorMessage,
  meta: passwordMeta
} = useField('password', passwordValidator)

watch(
    () => resetPasswordData.password,
    (value: string) => {
      password.value = value
    }
)

const confirmPasswordValidator = (value: string) => {
  if (!value) {
    return 'Confirm password is required'
  }

  if (value !== resetPasswordData.password) {
    return 'Passwords do not match'
  }
  return true
}

const {
  value: confirmPassword,
  errorMessage: confirmPasswordErrorMessage,
  meta: confirmPasswordMeta
} = useField('confirmPassword', confirmPasswordValidator)

watch(
    () => resetPasswordData.confirmPassword,
    (value: string) => {
      confirmPassword.value = value
    }
)

const everyThingOk = computed(()=>{
  return(
      passwordMeta.validated && passwordMeta.valid &&
      confirmPasswordMeta.validated && confirmPasswordMeta.valid
  )
})

const resetPasswordHandler = ()=>{
  if(!everyThingOk.value){
    return
  }
  else {
    isLoading.value = true
    adminAuthStore.resetPassword({...resetPasswordData, resetToken: props.resetToken})
        .then((resp) => {
          if(resp.result === 'success'){
            setTimeout(()=>{
              isLoading.value = false
              showAlert({
                type: 'success',
                message: resp.message
              })
              router.push({
                path: '/auth'
              })
            }, 1500)
          }
          else {
            setTimeout(()=>{
              isLoading.value = false
              showAlert({
                type: 'error',
                message: resp.message
              })
            }, 1500)
          }

        })
        .catch((err) => {
          setTimeout(()=>{
            isLoading.value = false
            showAlert({
              type: 'error',
              message: 'An error occurred. Please try again'
            })
          }, 1500)

        })
  }

}



</script>

<template>
  <div class="h-full w-full grid grid-cols-12 bg-main-300 md:bg-white">

    <div
        class="bg-main-300 sticky top-0    md:rounded-tr-2xl md:rounded-br-2xl  md:h-screen flex  items-center md:justify-center md:col-span-6 col-span-12">
      <div class="md:block hidden  space-y-10">
        <div class="text-white">
          <p class="!text-4xl font-semibold">Reset Password</p>
          <span>Kindly reset your password</span>
        </div>
        <div class="flex justify-center">
          <img src="/images/e-waste.png" alt="contract-image" class="lg:w-40 w-32 ">
        </div>
      </div>
      <div class="md:hidden flex items-center py-4 justify-start text-white ps-4">
        <div class="flex items-center justify-center btn btn-sm btn-ghost btn-circle" @click="router.go(-1)">
          <span class="material-icons-outlined cursor-pointer">chevron_left</span>
        </div>
        <div>
          <span class="text-lg ps-4">Reset password</span>
        </div>
      </div>
    </div>
    <div
        class="md:col-span-6 col-span-12 bg-white rounded-tl-2xl rounded-tr-2xl md:h-screen flex justify-center items-start md:items-center ">
      <div
          class="w-10/12 "
      >
        <div class="md:mt-5">
          <!-- Form -->
          <form class="md:my-4 py-3 my-36" @submit.prevent="resetPasswordHandler">
            <div class="grid md:gap-y-4">
              <div class="flex flex-col md:space-y-1">
                <div class="flex flex-col space-y-5">
                  <div class="flex  flex-col justify-start  md:hidden">
                    <p class="!text-2xl font-semibold text-main-400">Reset Password</p>
                  </div>
                  <div class="md:hidden mx-auto block">
                    <div>
                      <img src="/images/e-waste.png" alt="e-waste-image" class="w-32">
                    </div>
                  </div>

                  <div>
                    <label class="label font-semibold text-main-800" for="password">New password</label>
                    <input
                        v-model="resetPasswordData.password"
                        :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': passwordMeta.validated && !passwordMeta.valid,

                        }"
                        id="password"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        required
                        type="password"
                    />
                    <small class="text-sm text-rose-500">{{passwordErrorMessage}}</small>
                  </div>
                  <div>
                    <label class="label font-semibold text-main-800" for="confirmPassword">Confirm password</label>
                    <input
                        v-model="resetPasswordData.confirmPassword"
                        :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': confirmPasswordMeta.validated && !confirmPasswordMeta.valid,

                        }"
                        id="confirmPassword"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        required
                        type="password"
                    />
                    <small class="text-rose-500 text-sm">{{confirmPasswordErrorMessage}}</small>
                  </div>


                  <div class="w-full">
                    <button class="btn w-full bg-main-500 hover:bg-main-700" type="submit">
                      <span v-if="isLoading" class="loading loading-spinner loading-md text-white"></span>
                      <span v-else class="text-white text-lg">Rest password</span>
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