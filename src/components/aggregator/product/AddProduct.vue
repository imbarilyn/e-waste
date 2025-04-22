<script setup lang="ts">
import {computed, reactive, ref, watch, onMounted, shallowRef} from "vue";
import GeneralData from "@/components/aggregator/product/GeneralData.vue";
import InventoryData from "@/components/aggregator/product/InventoryData.vue";
import AttributeData from "@/components/aggregator/product/AttributeData.vue";
import ProductTabs from "@/components/aggregator/product/ProductTabs.vue";
import DimensionsData from "@/components/aggregator/product/DimensionsData.vue";
import MediaData from "@/components/aggregator/product/MediaData.vue";
import {useProductTabStore, type ProductTab} from "@/stores";


const productTabStore = useProductTabStore()
const selectedTab = ref<string>('GeneralData')
const isLoading = ref(false)
const imageFileRef = ref<HTMLInputElement | null>(null)

// const addProductHandler = () => {
//   if (!everythingOk.value) {
//     console.log('Everything not okay')
//     return
//   }
//   isLoading.value = true
//   aggregatorStore.addProduct({
//         name: createProduct.name,
//         regularPrice: createProduct.regularPrice,
//         shortDescription: createProduct.shortDescription,
//         stockQuantity: createProduct.stockQuantity,
//         weight: createProduct.weight,
//         type: 'simple',
//         images: images.value,
//         categories: categories.value,
//         postAuthor: aggregatorAuthStore.getAggregatorInfo()?.dokanId as string,
//         dokanToken: aggregatorAuthStore.getDokanToken as string
//
//       }
//   )
//       .then((res) => {
//         if (res.result === 'success') {
//           setTimeout(() => {
//             isLoading.value = false
//             showAlert({
//               type: 'success',
//               message: `${res.message}`
//             })
//
//           }, 1500)
//
//         } else {
//           setTimeout(() => {
//             isLoading.value = false
//             showAlert({
//               type: 'error',
//               message: `${res.message}`
//             })
//           }, 1500)
//         }
//       })
//       .catch((error) => {
//         setTimeout(() => {
//           isLoading.value = false
//           showAlert({
//             type: 'error',
//             message: 'Something went wrong, please try again'
//           })
//         }, 1500)
//       })
// }
//
// const productCategory = ref<ComboOptions[]>([])
// const categoryError = ref(false)
// const categoryLoading = ref(false)
//
// onMounted(() => {
//   aggregatorStore.getProductsCategory()
//       .then((res) => {
//         if (res?.result !== 'success') {
//           categoryError.value = true
//         } else {
//           productCategory.value = res.data as ComboOptions[]
//           categoryError.value = false
//
//           console.log(productCategory.value)
//         }
//       })
//       .catch((error) => {
//         categoryError.value = true
//         console.log('Error', error)
//       })
//       .finally(() => {
//         categoryLoading.value = false
//       })
// })
// const selectedTab = ref<Tabs>()
// const handleTabChange = (tab: Tabs) => {
//   selectedTab.value = tab
//   console.log(selectedTab.value)
// }
//
// const handleComboChoice = (value: ComboOptions) => {
//   createProduct.categories = {
//     id: value.id
//   }
//   console.log(createProduct.categories)
// }
//
//
// const {
//   value: categories,
//   errorMessage: categoriesErrorMessage,
//   meta: categoriesMeta
// } = useField('categories', categorytValidator)
//
// watch(() => createProduct.categories, (value) => {
//   categories.value = value
//   console.log(createProduct.categories)
// })

const componentArray = [
  {
    name: 'General',
    component: shallowRef(GeneralData),
    to: 'general-data'
  },
  {
    name: 'Inventory',
    component: shallowRef(InventoryData),
    to: 'inventory-data'
  },
  // {
  //   name: 'Attributes',
  //   component: shallowRef(AttributeData),
  //   to: 'attribute-data'
  // },
  {
    name: 'Dimensions',
    component: shallowRef(DimensionsData),
    to: 'dimensions-data'
  },
  {
    name: 'Media',
    component: shallowRef(MediaData),
    to: 'media-data'
  }
]



const productTabs = productTabStore.getProductTabs
onMounted(()=>{
 console.log(productTabStore.getProductTabs)
})


const handleTabChange = (tab: ProductTab) => {
  productTabStore.setActiveTab(tab.title)
  console.log(productTabStore.getActiveTab)
  activeComponent.value = componentArray.find((c)=>{
    if(productTabStore.getActiveTab) {
      return c.name.toLowerCase() === productTabStore.getActiveTab.name.toLowerCase()
    }
    else{
      return c.name.toLowerCase() === 'general'
    }
  })
}


const activeComponent = ref(
  componentArray.find((c)=>{
    if(productTabStore.getActiveTab) {
      return c.name.toLowerCase() === productTabStore.getActiveTab.name.toLowerCase()
    }
    else{
      return c.name.toLowerCase() === 'general'
    }
  })
)

</script>

<template>
  <div class=" text-main-950">
    <p class="md:text-2xl text-lg font-semibold pb-4">Add product</p>
    <div class=" xl:w-1/2 mx-auto " v-if="productTabs">
      <ProductTabs :tabs="productTabs"  @tab-change="handleTabChange"/>
    </div>


    <div class="bg-main-100 rounded-lg shadow-md xl:w-1/2 mx-auto my-6">
      <div
            class="mt-3 md:py-10 md:px-5 py-6 px-3">

          <Component :is="activeComponent?.component" v-if="activeComponent" :key="activeComponent.name"/>


<!--        <button-->
<!--            :disabled="isLoading"-->
<!--            class="btn  btn-sm  bg-main-400 mt-3 text-main-950 text-cursor-pointer hover:bg-main-300 md:btn-md normal-case text-sm md:text-sm"-->
<!--            type="submit"-->
<!--        >-->
<!--                  <span-->
<!--                      v-if="isLoading"-->
<!--                      class="loading loading-md loading-spinner text-neutral-400"-->
<!--                  ></span>-->
<!--          <span v-else>Add product</span>-->
<!--        </button>-->
      </div>
    </div>
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

.slide-horizontal-enter-active,
.slide-horizontal-leave-active{
  transition: all 0.5s ease-out;
}

.slide-horizontal-enter-from{
  opacity: 0;
  transform: translateX(-50%);
}

.slide-horizontal-enter-to{
  opacity: 1;
  transform: translateX(0);
}
</style>

