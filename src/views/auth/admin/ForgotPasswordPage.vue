<script lang="ts" setup>
import {useRouter} from "vue-router"
import {useAdminAuthStore} from "@/stores";
import {reactive, watch, computed, ref} from "vue";
import  {showAlert} from "@/modules/sweetAlert"
import {useField} from "vee-validate";


const adminAuthStore = useAdminAuthStore()
const isLoading = ref(false)
const forgotPassword = reactive({
  email: ''
})


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

const{
    value: email,
    errorMessage: emailErrorMessage,
    meta: emailMeta

} = useField('email', emailValidator)

watch(() => forgotPassword.email, () => {
  email.value = forgotPassword.email
})

const everythingOk = computed(() => {
  return emailMeta.validated && emailMeta.valid
})
const router = useRouter()
const forgotPasswordHandler = () => {
  if(!everythingOk.value){
    return
  }
  else {
    isLoading.value = true
    adminAuthStore.forgotPassword(forgotPassword.email)
        .then((resp) => {
          if(resp.result === 'success'){
            setTimeout(()=>{
              isLoading.value = false
              showAlert({
                type: 'success',
                message: 'Password reset link has been sent to your email'
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
  <div class="h-full  w-full grid grid-cols-12 bg-main-300 md:bg-white">

    <div
        class="bg-main-300 sticky top-0    md:rounded-tr-2xl md:rounded-br-2xl  md:h-screen flex  items-center md:justify-center md:col-span-6 col-span-12">
      <div class="md:block hidden  space-y-10">
        <div class="text-white">
          <p class="!text-4xl font-semibold">Enter phone number</p>
          <div>
            <span class="text-lg">Remember your password?</span>
            <router-link
                class="text-sm ps-2 text-white decoration-2 underline font-medium"
                to="/auth">Login
            </router-link>
          </div>
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
          <span class="text-lg ps-4">Forgot password</span>
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
          <form class="md:my-4 py-3 my-40" @submit.prevent="forgotPasswordHandler">
            <div class="grid md:gap-y-4">
              <div class="flex flex-col md:space-y-1">
                <div class="flex flex-col space-y-5">
                  <div class="flex  flex-col justify-start  md:hidden">
                    <p class="!text-2xl font-semibold text-main-400">Enter phone number</p>
                    <div>
                      <span>Remember your password?</span>
                      <router-link
                          class="text-sm ps-2  text-main-500 decoration-2 underline font-medium"
                          to="/auth">Login
                      </router-link>
                    </div>


                  </div>
                  <div class="md:hidden mx-auto block">
                    <div>
                      <img src="/images/e-waste.png" alt="e-waste-image" class="w-32">
                    </div>
                  </div>

                  <div>
                    <label class="label font-semibold text-main-800" for="email">Email address</label>
                    <input
                        v-model="forgotPassword.email"
                        :class="{ 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': emailMeta.validated && !emailMeta.valid,

                        }"

                        id="email"
                        class="input border-1   focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  input-bordered border-main-500  w-full text-sm"
                        placeholder="johndoe@gmail.com"
                        required
                        type="text"
                    />
                    <small v-if="emailMeta.validated && !emailMeta.valid" class="text-rose-500 text-sm">{{emailErrorMessage}}</small>

                  </div>


                  <div class="w-full">
                    <button class="btn w-full bg-main-500 hover:bg-main-700" type="submit">
                      <span v-if="isLoading" class="loading loading-spinner loading-md text-white"></span>
                      <span v-else class="text-white text-lg">Submit</span>
                    </button>
                  </div>
                  <div class="">
                    <span>Remember your password?</span>
                    <router-link
                        class="text-sm ps-2 decoration-2 text-main-500 underline font-medium"
                        to="/auth">Login
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