<script setup lang="ts">

import ComboBox from "@/components/commonComponent/ComboBox.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useField} from "vee-validate";
import {useStorage} from "@vueuse/core";
import {merge} from "lodash";
import {useAdminStore, useNotificationsStore} from "@/stores";


const createCollectorData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  storeName: '',
  username: '',
})

// const handleLocation = (value: ComboEmit): void=>{
//   createAggregatorData.address.street_1 = value.name
// }

const adminStore = useAdminStore();

export interface AccountInfo {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  storeName: string
  username: string
}

const notificationStore = useNotificationsStore()

const accountInfo = useStorage<AccountInfo>('accountInfo', {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  storeName: '',
  username: '',
})

// const upDateLocalStorage = (update: AccountInfo) => {
//   console.log(update)
//   const existingData = accountInfo.value || {}
//   accountInfo.value = merge({}, existingData, update)
//   console.log(accountInfo.value)
// }



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
    () => createCollectorData.email,
    (value: string) => {
      console.debug(`accountInfo.value.email: ${email}`);
      // upDateLocalStorage({email: value})
      email.value = value
    }, { deep: true}
)


const nameValidator = (value: string) => {
  if (!value) {
    return 'Name is required'
  }

  if (value.length > 15) {
    return 'Name too long'
  }

  return true
}

const {
  value: firstName,
  errorMessage: firstNameErrorMessage,
  meta: firstNameMeta
} = useField('firstName', nameValidator)

watch(
    () => createCollectorData.firstName,
    (value: string) => {
      // upDateLocalStorage({firstName: value})
      firstName.value = value

    }
)

const {
  value: lastName,
  errorMessage: lastNameErrorMessage,
  meta: lastNameMeta
} = useField('lastName', nameValidator)

watch(
    () => createCollectorData.lastName,
    (value: string) => {
      // upDateLocalStorage({lastName: value})
      lastName.value = value
    }
)

const storeNameValidator = (value: string) => {
  if (!value) {
    return 'Store name is required'
  }

  if (value.length > 15) {
    return 'Store name too long'
  }

  return true
}
const {
  value: storeName,
  errorMessage: storeNameErrorMessage,
  meta: storeNameMeta
} = useField('storeName', storeNameValidator)

watch(
    () => createCollectorData.storeName,
    (value: string) => {
      // upDateLocalStorage({storeName: value})
      storeName.value = value
    }
)

const usernameValidator = (value: string) => {
  if (!value) {
    return 'Store name is required'
  }

  if (value.length > 15) {
    return 'Store name too long'
  }

  return true
}

const {
  value: username,
  errorMessage: usernameErrorMessage,
  meta: usernameMeta
} = useField('username',usernameValidator)

watch(() => createCollectorData.username, (value: string) => {
  // upDateLocalStorage({username: value})
  username.value = value
})

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
    () => createCollectorData.phoneNumber,
    (value: string) => {
      // upDateLocalStorage({phoneNumber: value})
      phoneNumber.value = value
    }
)

const everyThingOk = computed(() => {
  return (
      emailMeta.validated && emailMeta.valid &&
      firstNameMeta.validated && firstNameMeta.valid &&
      lastNameMeta.validated && lastNameMeta.valid &&
      phoneNumberMeta.validated && phoneNumberMeta.valid &&
      storeNameMeta.validated && storeNameMeta.valid &&
      usernameMeta.validated && usernameMeta.valid
  )
})

// const isEverythingOkay= ref(false);

// const okayOnMounted = computed(() => {
//   return (
//       emailMeta.valid &&
//       firstNameMeta.valid &&
//       lastNameMeta.valid &&
//       phoneNumberMeta.valid &&
//       storeNameMeta.valid &&
//       usernameMeta.valid
//   )
// })
//
// function checkIsOkay (mounted = false) {
//   if (mounted) {
//     return (
//         emailMeta.valid &&
//         firstNameMeta.valid &&
//          lastNameMeta.valid &&
//         phoneNumberMeta.valid &&
//         storeNameMeta.valid &&
//         usernameMeta.valid
//     )
//   } else {
//     return (
//         emailMeta.validated && emailMeta.valid &&
//         firstNameMeta.validated && firstNameMeta.valid &&
//         lastNameMeta.validated && lastNameMeta.valid &&
//         phoneNumberMeta.validated && phoneNumberMeta.valid &&
//         storeNameMeta.validated && storeNameMeta.valid &&
//         usernameMeta.validated && usernameMeta.valid
//     )
//   }
// }

const isMoveNextDisabled = ref(false)
watch(()=>everyThingOk.value, (value)=>{
  emits('moveNext', value)
  isMoveNextDisabled.value = value as boolean
  console.log('EverythingOkay', value)

})

// const isMoveNextDisabled = computed(() => {
//   return okayOnMounted.value || everyThingOk.value
// })


const emits = defineEmits<{
  (event: 'moveNext', value: boolean): void
}>()

const handleAccountInfo = ()=>{
  if(everyThingOk.value) {
    localStorage.setItem('accountInfo', JSON.stringify(createCollectorData))
    console.log('Account Info', accountInfo.value)
    adminStore.setActiveTab(
        {
          position: 2,
          name: 'Address'
        },
    )
  } else {
    notificationStore.addNotification('Please fill in all the required fields', 'error')
  }
}
// onMounted(()=>{
//   console.log(everyThingOk.value)
//
//   // isEverythingOkay.value = checkIsOkay(true)
// })

onMounted(()=>{
  console.log(accountInfo.value)
  createCollectorData.firstName = accountInfo.value.firstName
  createCollectorData.lastName = accountInfo.value.lastName
  createCollectorData.email = accountInfo.value.email
  createCollectorData.phoneNumber = accountInfo.value.phoneNumber
  createCollectorData.storeName = accountInfo.value.storeName
  createCollectorData.username = accountInfo.value.username

})
</script>

<template>
  <form @submit.prevent="handleAccountInfo">
    <div class="grid gap-y-4 bg-main-50 shadow-sm rounded-2xl border  border-gray-200 p-4 sm:p-7">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col col-span-1   space-y-1">
          <label class="label font-semibold text-sm" for="firstName"> First name </label>
          <input
              id="firstName"
              v-model="createCollectorData.firstName"
              :class="[firstNameMeta.validated && !firstNameMeta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="John"
              type="text"
              required
          />
          <small
              v-if=" firstNameMeta.validated && ! firstNameMeta.valid"
              class="text-sm text-rose-500"
          >
            {{ firstNameErrorMessage }}
          </small>
        </div>
        <div class="flex flex-col space-y-1">
          <label class="label font-semibold text-sm" for="lastName"> Last name </label>
          <input
              id="lastName"
              v-model="createCollectorData.lastName"
              :class="[lastNameMeta.validated && !lastNameMeta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
              class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
              placeholder="Doe"
              type="text"
              required
          />
          <small
              v-if=" lastNameMeta.validated && ! lastNameMeta.valid"
              class="text-sm text-rose-500"
          >
            {{ lastNameErrorMessage }}
          </small>
        </div>
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
            v-model="createCollectorData.email"
            :class="[emailMeta.validated && !emailMeta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
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
        <label class="label font-semibold text-sm" for="phone"> Phone number </label>
        <input
            id="phone"
            v-model="createCollectorData.phoneNumber"
            :class="[phoneNumberMeta.validated && !phoneNumberMeta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
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
        <label class="label font-semibold text-sm" for="storeName"> Store name </label>
        <input
            id="storeName"
            v-model="createCollectorData.storeName"
            :class="[storeNameMeta.validated && !storeNameMeta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
            placeholder="Doe"
            type="text"
            required
        />
        <small
            v-if=" storeNameMeta.validated && ! storeNameMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ storeNameErrorMessage }}
        </small>
      </div>

      <div class="flex flex-col space-y-1">
        <label class="label font-semibold text-sm" for="storeName"> Username </label>
        <input
            id="username"
            v-model="createCollectorData.username"
            :class="[usernameMeta.validated && !usernameMeta.valid ? 'input border-1   focus:border-rose-500 focus:ring focus:ring-rose-500 focus:ring-offset-2  input-bordered border-rose-500': 'input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2']"
            class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
            placeholder="Doe"
            type="text"
            required
        />
        <small
            v-if=" usernameMeta.validated && ! usernameMeta.valid"
            class="text-sm text-rose-500"
        >
          {{ usernameErrorMessage }}
        </small>
      </div>
      <div class="flex justify-end">
        <button class="btn btn-sm bg-main-500 hover:bg-main-400" type="submit" :disabled="!everyThingOk">
          <span class="material-icons-outlined text-white">arrow_right_alt</span>
        </button>
      </div>


      <!--    <div class="flex flex-col space-y-1">-->
      <!--      <label class="label font-semibold text-sm" for="location"> Location </label>-->
      <!--      <ComboBox :combo-props="locationArray"  @combo-choice="handleLocation"/>-->
      <!--      <small-->
      <!--          v-if="streetMeta.validated && !streetMeta.valid"-->
      <!--          class="text-sm text-rose-500"-->
      <!--      >-->
      <!--        {{ streetErrorMessage }}-->
      <!--      </small>-->
      <!--    </div>-->
      <!--    <div class="flex flex-col space-y-1 my-1">-->
      <!--      <button-->
      <!--          :disabled="isLoadingResource"-->
      <!--          class="btn  btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300 md:btn-md normal-case text-sm md:text-sm w-full"-->
      <!--          type="submit"-->
      <!--      >-->
      <!--                  <span-->
      <!--                      v-if="isLoadingResource"-->
      <!--                      class="loading loading-md loading-spinner text-neutral-400"-->
      <!--                  ></span>-->
      <!--        Add Aggregator-->
      <!--      </button>-->
      <!--    </div>-->
    </div>
  </form>

</template>

<style scoped>

</style>