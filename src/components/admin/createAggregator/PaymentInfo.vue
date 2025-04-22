<script setup lang="ts">
import {type MyRadioGroup} from "@/components/commonComponent/RadioGroup.vue";
import RadioGroup from "@/components/commonComponent/RadioGroup.vue";
import {ref} from "vue";

const radioProps = [
  {
    id: 1,
    name: 'Mpesa',
    color: 'text-main-500',
    icon: 'account_balance_wallet'
  },
  {
    id: 2,
    name: 'Bank',
    color: 'text-tertiary-500',
    icon: 'account_balance'
  }
] as MyRadioGroup[]

const selectedRadioGroup = ref<MyRadioGroup>()
const selectedOption = (val: MyRadioGroup) => {
  console.log('selected payment options---', val)
  selectedRadioGroup.value = val
}


</script>

<template>
  <div class="grid gap-y-4 bg-main-50 shadow-sm rounded-2xl border  border-gray-200 p-4 sm:p-7">
    <RadioGroup :radio-props="radioProps" @change="selectedOption"/>
    <Transition name="bounce" mode="out-in" appear>
      <div v-if="selectedRadioGroup?.name === 'Mpesa'">
        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center">
            <label class="label font-semibold text-sm" for="email">Mpesa Number</label>
          </div>
          <input
              id="email"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="Email"
              type="text"
              required
          />
          <small class="text-sm text-rose-500">
          </small>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center">
            <label class="label font-semibold text-sm" for="email">Mpesa name</label>
          </div>
          <input
              id="email"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="Email"
              type="text"
              required
          />
          <small class="text-sm text-rose-500">
          </small>
        </div>

      </div>
      <div v-else-if="selectedRadioGroup?.name === 'Bank'">
        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center">
            <label class="label font-semibold text-sm" for="email">Account Name</label>
          </div>
          <input
              id="inputAccountName"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="Email"
              type="text"
              required
          />
          <small class="text-sm text-rose-500">
          </small>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center">
            <label class="label font-semibold text-sm" for="email">Account Number</label>
          </div>
          <input
              id="inputAccountNumber"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="Email"
              type="text"
              required
          />
          <small class="text-sm text-rose-500">
          </small>
        </div>
        <div class="flex flex-col space-y-1">
          <div class="flex justify-between items-center">
            <label class="label font-semibold text-sm" for="email">Bank Name</label>
          </div>
          <input
              id="inputBankName"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="Email"
              type="text"
              required
          />
          <small class="text-sm text-rose-500">
          </small>
        </div>


      </div>
    </Transition>
    <div class="flex  justify-end space-y-1">
      <button class="btn  btn-md bg-main-500 hover:bg-main-400 text-white">Create aggregator</button>
    </div>
  </div>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 1s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>