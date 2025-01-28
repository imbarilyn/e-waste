<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div class="h-full w-full grid grid-cols-12 md:bg-white">

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
                      <!--                      <span class="loading loading-spinner loading-md text-white"></span>-->
                      <span class="text-white text-lg">Submit</span>
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