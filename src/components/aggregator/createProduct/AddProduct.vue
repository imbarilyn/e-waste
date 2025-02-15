<script setup lang="ts">
import ComboBox from "@/components/commonComponent/ComboBox.vue";
import {useAdminStore, useAggregatorStore} from "@/stores";
import {computed, reactive, ref, watch} from "vue";
import {useField} from "vee-validate";
import RadioGroup from "@/components/commonComponent/RadioGroup.vue";
import {showAlert} from "@/modules/sweetAlert.ts";
import {type ComboOptions} from "@/components/commonComponent/ComboBox.vue";


const adminStore = useAdminStore()


interface WeightUnit {
  name: string
  color: string
  icon: string
  description: string
}

const aggregatorStore = useAggregatorStore()
const isLoading = ref(false)
const imageFileRef = ref<HTMLInputElement | null>(null)


const productUnits = [
  {
    id: 1,
    name: 'Kg',
    color: 'text-main-500',
    icon: 'scale',
    description: 'Kilograms'
  },
  // {
  //   id: 2,
  //   name: 'g',
  //   color: 'text-yellow-500',
  //   icon: 'scale',
  //   description: 'Grams'
  // },
  {
    id: 3,
    name: 'pcs',
    color: 'text-yellow-500',
    icon: 'segment',
    description: 'Pieces'
  }
]

const createProduct = reactive({
  name: '',
  regularPrice: '',
  shortDescription: '',
  stockQuantity: '',
  weight: ''
})

const createProductValidator = (value: string) => {
  if (!value) {
    return "This field is required"
  }
  return true
}
const shortDescriptionValidator = (value: string) => {
  if (value && value.length < 10) {
    return "This field must be at least 10 characters"
  }
  if (value && value.length > 100) {
    return "This field must be less than 100 characters"
  }
  return true
}


const numberValidator = (value: string) => {
  if (!value) {
    return "This field is required"
  }
  if (isNaN(Number(value))) {
    return "This field must be a number"
  }
  return true

}


const {
  value: name,
  errorMessage: nameErrorMessage,
  meta: nameMeta
} = useField('name', createProductValidator)

watch(() => createProduct.name, (value) => {
  name.value = value
})

const {
  value: regularPrice,
  errorMessage: regularPriceErrorMessage,
  meta: regularPriceMeta
} = useField('regular_price', numberValidator)


watch(() => createProduct.regularPrice, (value) => {
  regularPrice.value = value
})

const {
  value: shortDescription,
  errorMessage: shortDescriptionErrorMessage,
  meta: shortDescriptionMeta
} = useField('short_description', shortDescriptionValidator)

watch(() => createProduct.shortDescription, (value) => {
  shortDescription.value = value
})


const {
  value: stockQuantity,
  errorMessage: stockQuantityErrorMessage,
  meta: stockQuantityMeta
} = useField('stock_quantity', numberValidator)

watch(() => createProduct.stockQuantity, (value) => {
  stockQuantity.value = value
})

const {
  value: weight,
  errorMessage: weightErrorMessage,
  meta: weightMeta
} = useField('weight',  createProductValidator)

watch(() => createProduct.weight, (value) => {
  weight.value = value
})


const unit = ref<string>()
const selectUnit = (val: WeightUnit) => {
  console.log(val)
  if (val) {

    unit.value = val.name
    createProduct.weight = val.name
  }
}


const images = ref<File[]>([])

const onImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files as FileList
  images.value = [...file]
  console.log(images.value)
}

const imageValidator = (value: File[]) => {
  if (!value) {
    return "Please select at least one image"
  }
  if (value.length < 1) {
    return "Please select at least one image"
  }
  if (value.length > 3) {
    return "You can only upload a maximum of 3 images"
  }
  return true
}

const {
  value: image,
  errorMessage: imageMetaErrorMessage,
  meta: imageMeta
} = useField('images', imageValidator)


watch(() => images.value, (value) => {
  image.value = value
})

const everythingOk = computed(() => {
  return (
      nameMeta.validated && nameMeta.valid &&
      regularPriceMeta.validated && regularPriceMeta.valid &&
      shortDescriptionMeta.validated && shortDescriptionMeta.valid &&
      stockQuantityMeta.validated && stockQuantityMeta.valid &&
      weightMeta.validated && weightMeta.valid &&
      imageMeta.validated && imageMeta.valid
  )
})

const addProductHandler = () => {
  if (!everythingOk.value) {
    console.log('Everything not okay')
    return
  }
  isLoading.value = true
  aggregatorStore.addProduct({
        name: createProduct.name,
        regularPrice: createProduct.regularPrice,
        shortDescription: createProduct.shortDescription,
        stockQuantity: createProduct.stockQuantity,
        weight: createProduct.weight,
        type: 'simple', images: images.value
      }
  )
      .then((res) => {
        if (res.result === 'success') {
          setTimeout(() => {
            isLoading.value = false
            showAlert({
              type: 'success',
              message: `${res.message}`
            })

          }, 1500)

        } else {
          setTimeout(() => {
            isLoading.value = false
            showAlert({
              type: 'error',
              message: `${res.message}`
            })
          }, 1500)
        }
      })
      .catch((error) => {
        setTimeout(() => {
          isLoading.value = false
          showAlert({
            type: 'error',
            message: 'Something went wrong, please try again'
          })
        }, 1500)
      })
}

</script>

<template>
  <div class="md:text-3xl text-2xl text-main-950">
    <p class="md:text-2xl text-lg font-semibold">Add product</p>
    <main class="w-full h-full mx-auto flex justify-center">
      <div
          :class="[adminStore.collapseSidebar? 'lg:w-10/12': 'lg:w-8/12']"
          class="w-full md:w-10/12 xl:w-5/12  px-4 md:px-2 lg:px-0 mt-7 bg-white border border-gray-200 rounded-2xl shadow-2xl"
      >
        <div class="px-4 sm:px-7 py-2">
          <form class="p-4"  @submit.prevent="addProductHandler">
            <div class="grid space-y-2">
                <div class="flex flex-col space-y-1">
                  <label class="label font-semibold lg:text-xl text-lg" for="name"> Product name </label>
                  <input
                      id="productName"
                      v-model="createProduct.name"
                      :class="{
                    'input-error': nameMeta.validated && !nameMeta.valid,
                    'input-primary': nameMeta.validated && nameMeta.valid
                  }"
                      class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                      placeholder="Product name"
                      type="text"
                      required
                  />
                  <!--                    <ComboBox :combo-props="productUnits"-->
                  <!--                    />-->
                  <small
                      v-if="nameMeta.validated && !nameMeta.valid"
                      class="text-sm text-rose-500"
                  >
                    {{ nameErrorMessage }}
                  </small>
                </div>
                <div class="flex flex-col space-y-1">
                  <label class="label font-semibold lg:text-xl text-lg" for="phone"> Product Price </label>
                  <input
                      id="productPrice"
                      v-model="createProduct.regularPrice"
                      :class="{
                    'input-error': regularPriceMeta.validated && !regularPriceMeta.valid,
                    'input-primary': regularPriceMeta.validated && regularPriceMeta.valid
                  }"
                      class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                      placeholder="Password"
                      type="text"
                      required
                  />
                  <small
                      v-if="regularPriceMeta.validated && !regularPriceMeta.valid"
                      class="text-sm text-rose-500"
                  >
                    {{ regularPriceErrorMessage }}
                  </small>
                </div>

              <div class="flex flex-col space-y-1">
                <div class="flex justify-between items-center">
                  <label class="label font-semibold lg:text-xl text-lg" for="stockQuantity">Stock quantity </label>
                </div>
                <input
                    id="stockQuantity"
                    v-model="createProduct.stockQuantity"
                    :class="{
                    'input-error': stockQuantityMeta.validated && !stockQuantityMeta.valid,
                    'input-primary': stockQuantityMeta.validated && stockQuantityMeta.valid
                  }"
                    class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                    placeholder="Stock quantity"
                    type="text"
                    required
                />
                <small v-if="stockQuantityMeta.validated && !stockQuantityMeta.valid" class="text-sm text-rose-500">
                  {{ stockQuantityErrorMessage }}
                </small>
              </div>
              <div class="flex flex-col space-y-1">
                <p class="lg:text-xl text-lg font-semibold">Select your units</p>
                <div>
                  <RadioGroup :weight-unit="productUnits"
                              @change="selectUnit"
                  />
                  <small
                    v-if="weightMeta.validated && !weightMeta.valid"
                    class="text-sm text-rose-500"
                    >
                    {{ weightErrorMessage }}
                  </small>

                </div>
                <!--                  <Transition name="bounce">-->
                <!--                    <div v-if="isUnitSelected" class="flex flex-col space-y-1">-->
                <!--                      <label class="label font-semibold lg:text-xl text-lg" for="weight">Product in {{unit}}</label>-->
                <!--                      <input-->
                <!--                          id="weight"-->
                <!--                          v-model="createProduct.weight"-->
                <!--                          :class="{-->
                <!--                                  'input-error': weightMeta.validated && !weightMeta.valid,-->
                <!--                                  'input-primary': weightMeta.validated && weightMeta.valid-->
                <!--                                }"-->
                <!--                          class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"-->
                <!--                          placeholder="Enter weight"-->
                <!--                          type="text"-->
                <!--                      />-->
                <!--                      <small-->
                <!--                          v-if="weightMeta.validated && !weightMeta.valid"-->
                <!--                          class="text-sm text-rose-500"-->
                <!--                      >-->
                <!--                        {{ weightErrorMessage }}-->
                <!--                      </small>-->
                <!--                    </div>-->
                <!--                  </Transition>-->
              </div>

              <div class="flex flex-col space-y-1">
                <div class="flex justify-between items-center">
                  <label class="label font-semibold lg:text-xl text-lg" for="email">Product images</label>
                </div>
                <input
                    @change="onImageChange"
                    ref="imageFileRef"
                    id="image-file"
                    multiple
                    accept=".png, .jpg, jpeg"
                    type="file"
                    required
                    class="file-input file-input-bordered input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  file-input-info w-full"/>
                <div v-if="images.length > 0" v-for="(image, index) in images" :key="index">
                  <p class="text-lg">{{ image.name }}</p>
                </div>

                <small v-if="imageMeta.validated && !imageMeta.valid" class="text-sm text-rose-500">
                  {{ imageMetaErrorMessage }}
                </small>
              </div>
              <div class="flex flex-col space-y-1">
                <div class="flex justify-between items-center">
                  <label class="label font-semibold lg:text-xl text-lg" for="shortDescription">Short
                    description </label>
                </div>
                <textarea
                    id="shortDescription"
                    v-model="createProduct.shortDescription"
                    :class="{
                    'textarea-error': shortDescriptionMeta.validated && !shortDescriptionMeta.valid,
                    'input-info': shortDescriptionMeta.validated && shortDescriptionMeta.valid
                  }"
                    class="textarea textarea-bordered py-8 border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                >
                  </textarea>
                <small v-if="shortDescriptionMeta.validated && !shortDescriptionMeta.valid"
                       class="text-sm text-rose-500">
                  {{ shortDescriptionErrorMessage }}
                </small>
              </div>
              <div class="flex flex-col space-y-1 my-1">
                <button
                    :disabled="isLoading"
                    class="btn  btn-sm bg-main-400 text-main-950 text-cursor-pointer hover:bg-main-300 md:btn-md normal-case text-sm md:text-sm w-full"
                    type="submit"
                >
                  <span
                      v-if="isLoading"
                      class="loading loading-md loading-spinner text-neutral-400"
                  ></span>
                  <span v-else>Add product</span>
                </button>
              </div>
            </div>
          </form>
          <!-- End Form -->

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

.bounce-enter-active {
  animation: bounce-in 0.5s
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);

  }
  100% {
    transform: scale(1);
  }

}

</style>