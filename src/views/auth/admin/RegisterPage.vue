<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const adminAuthStore = useAdminAuthStore()
const createAdminData = reactive({
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)

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
    () => createAdminData.fullName,
    (value: string) => {
      fullName.value = value
    }
)

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
    () => createAdminData.email,
    (value: string) => {
      email.value = value
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
    () => createAdminData.phoneNumber,
    (value: string) => {
      phoneNumber.value = value
    }
)

const passwordValidator=(value: string)=>{
  if(!value){
    return 'Password is required'
  }

  if(value.length < 6){
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
    () => createAdminData.password,
    (value: string) => {
      password.value = value
    }
)

const confirmPasswordValidator = (value: string) => {
  if (!value) {
    return 'Confirm password is required'
  }

  if (value !== createAdminData.password) {
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
    () => createAdminData.confirmPassword,
    (value: string) => {
      confirmPassword.value = value
    }
)


const everyThingOk = computed(()=>{
  return(
      fullNameMeta.validated && fullNameMeta.valid &&
      emailMeta.validated && emailMeta.valid &&
      phoneNumberMeta.validated && phoneNumberMeta.valid &&
      passwordMeta.validated && passwordMeta.valid &&
      confirmPasswordMeta.validated && confirmPasswordMeta.valid
  )
})



const createAdminHandler = () => {
  if(everyThingOk.value){
    isLoading.value = true
    adminAuthStore.createAdmin(createAdminData)
        .then((resp) => {
          console.log('Response---->', resp)
          if(resp.result === 'success'){
            setTimeout(()=>{
              isLoading.value = false
              router.push({
                path: '/auth'
              })
            }, 1500)
          }
          else{
            setTimeout(()=>{
              isLoading.value = false
              adminAuthStore.setIsAuthenticationError({
                isError: true,
                message: resp.message,
                type: 'error'
              })

            }, 1500)
          }

        })
        .catch(() => {
          setTimeout(()=>{
            isLoading.value = false
            adminAuthStore.setIsAuthenticationError({
              isError: true,
              message: 'An error occurred, please try again',
              type: 'error'
            })

          }, 1500)

        })

  }

  else{
    console.log('Please fill in all the required fields')
  }
}



</script>

<template>
  <div class="h-full w-full grid grid-cols-12 bg-main-300 md:bg-white">

    <div
        class="bg-main-300 sticky top-0    md:rounded-tr-2xl md:rounded-br-2xl  md:h-screen flex  items-center md:justify-center md:col-span-6 col-span-12">
      <div class="md:block hidden  space-y-10">
        <div class="text-white">
          <p class="!text-5xl font-semibold">Hello there,</p>
          <span class="text-lg">Create account</span>
        </div>
        <div class="flex justify-center">
          <img src="/images/e-waste.png" alt="contract-image" class="lg:w-40 w-32 ">
        </div>
        <div class="text-white">
          <span>Do you have an account already?</span>
          <router-link
              class="text-sm ps-2 text-white decoration-2 underline font-medium"
              to="/auth">Login
          </router-link>
        </div>
      </div>
      <div class="md:hidden flex items-center py-4 justify-start text-white ps-4">
        <div class="flex items-center justify-center btn btn-sm btn-ghost btn-circle" @click="router.go(-1)">
          <span class="material-icons-outlined cursor-pointer">chevron_left</span>
        </div>
        <div>
          <span class="text-lg ps-4">Register</span>
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
          <form class="md:my-4 py-8">
            <div class="grid md:gap-y-4">
              <div class="flex flex-col md:space-y-1">
                <div class="flex flex-col space-y-5">
                  <div class="flex  flex-col justify-start  md:hidden">
                    <p class="!text-2xl font-semibold text-main-400">Hello there,</p>
                    <span class="!text-xl text-main-800">Create an account</span>
                  </div>
                  <div class="md:hidden mx-auto block">
                    <div>
                      <img src="/images/e-waste.png" alt="e-waste-image" class="w-32">
                    </div>
                  </div>
                  <div>
                    <label class="label font-semibold text-main-800" for="fullName">Full name</label>
                    <input

                        id="fullName"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        placeholder="John Doe"
                        required
                        type="text"
                    />

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
                    <label class="label font-semibold text-main-800" for="email">Email address</label>
                    <input

                        id="email"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        placeholder="johndoe@gmail.com"
                        required
                        type="text"
                    />

                  </div>
                  <div>
                      <label class="label font-semibold text-main-800" for="email">Password</label>
                      <input
                          id="password"
                          class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                          required
                          type="password"
                      />
                  </div>
                  <div>
                    <label class="label font-semibold text-main-800" for="email">Confirm password</label>
                    <input
                        id="confirmPassword"
                        class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                        required
                        type="password"
                    />
                  </div>
                  <div class="w-full">
                    <button class="btn w-full bg-main-500 hover:bg-main-700" type="submit">
                      <span v-if="isLoading" class="loading loading-spinner loading-md text-white"></span>
                      <span v-else class="text-white text-lg">Submit</span>
                    </button>
                  </div>
                  <div>
                    <span class="text-lg">Remember your password?</span>
                    <router-link
                        class="text-sm ps-2 text-main-500 decoration-2 underline font-medium"
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