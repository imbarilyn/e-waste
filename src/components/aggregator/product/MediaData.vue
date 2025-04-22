<script setup lang="ts">

import {onBeforeUnmount, ref, watch, onMounted, computed} from "vue";
import {useField} from "vee-validate";
import {type productPhotos, useAggregatorStore, useAggregatorAuthStore, useNotificationsStore} from "@/stores";
import DialogModal from "@/components/commonComponent/DialogModal.vue";
import Swal from "sweetalert2";
import {showAlert} from "@/modules/sweetAlert.ts";
import { useRouter} from "vue-router";

const notificationStore = useNotificationsStore()
const aggregatorAuthStore = useAggregatorAuthStore()
const aggregatorStore = useAggregatorStore()
const notificationsStore = useNotificationsStore()


const photoRef = ref<HTMLInputElement | null>(null)
const onPhotoChange = (e: Event) => {
  // console.log("Here!!")
  const target = e.target as HTMLInputElement
  const files = target.files as FileList
  if (files.length > 0 && files.length <= 3) {
    console.log("File length", files.length)
    for (let i = 0; i < files.length; i++) {
      console.log("Looping the files")
      const file = files[i]
      console.log(file)
      const reader = new FileReader()
      console.log("File reader:", reader)
      reader.onload = (event) => {
        console.log("Hello")
        const fileReader = event.target as FileReader
        const fileContent = fileReader.result as string
        console.log("File content:", fileContent)
        aggregatorStore.productPhotos.push({
          imgUrl: fileContent,
          timestamp: file.lastModified
        })
        // imageDataInfo.productPhotos.push({
      }
      console.log(aggregatorStore.productPhotos)

      reader.onerror = (e) => {
        notificationStore.addNotification(
            'Error uploading image',
            'error'
        )
      }
      reader.readAsDataURL(file)
    }
  } else {
    notificationStore.addNotification(
        'Please select images not exceeding 3',
        'error'
    )
  }
}
const isDeleteButton = ref(false)
// const showDeleteButton = (value: boolean) => {
//   console.log(value)
//   isDeleteButton.value = value
// }
const deleteImage = (image: string) => {
  const index = aggregatorStore.productPhotos.findIndex((img) => img.imgUrl === image)
  if (index !== -1) {
    aggregatorStore.productPhotos.splice(index, 1)
    notificationStore.addNotification(
        'Image deleted successfully',
        'success'
    )
  }
}

const everythingOk = computed(()=>{
  return (
      aggregatorStore.productPhotos.length > 0 &&
          aggregatorStore.productValidation.dimensionsData &&
          aggregatorStore.productValidation.generalData &&
          aggregatorStore.productValidation.inventoryData
  )

})

const router = useRouter()
const isProductUploadLoading = ref(false)
const postProduct = () => {
  if(everythingOk.value){
    isProductUploadLoading.value = true
    const generalData = localStorage.getItem("generalData")
    const inventoryData = localStorage.getItem("inventoryData")
    const dimensionsData = JSON.parse(localStorage.getItem("dimensionData") || '{}')
    const imageBase64 = [] as string []
    aggregatorStore.productPhotos.map((image)=>{
      imageBase64.push(image.imgUrl)
    })

    aggregatorStore.addProduct({
      name: JSON.parse(generalData as string).productName,
      regular_price: JSON.parse(generalData as string).regularPrice,
      sale_price: JSON.parse(generalData as string).salePrice,
      short_description: JSON.parse(generalData as string).shortDescription,
      sku: JSON.parse(inventoryData as string).SKU,
      stock_quantity: Number(JSON.parse(inventoryData as string).stock),
      categories: JSON.parse(inventoryData as string).category,
      dimensions: {
        length: dimensionsData?.length || '',
        width: dimensionsData.width || '',
        height: dimensionsData.height || ''
      },
      weight: dimensionsData.weight || '',
      images: imageBase64 as string[],
      type: 'simple',
      post_author: aggregatorAuthStore.getAggregatorInfo()?.dokanId as string,
      dokan_token: aggregatorAuthStore.getDokanToken as string,

    })
        .then(resp =>{
          if(resp.result === 'success'){
            localStorage.removeItem("generalData")
            localStorage.removeItem("inventoryData")
            localStorage.removeItem("dimensionData")
            aggregatorStore.productPhotos.splice(0, aggregatorStore.productPhotos.length)
            setTimeout(()=>{
              isProductUploadLoading.value = false
              showAlert({
                type: 'success',
                message: `${resp.message}`
              })
              router.push({
                name: 'Aggregator-Overview',
              })
            }, 1500)
          }
          else{
            setTimeout(()=>{
              isProductUploadLoading.value = false
              showAlert({
                type: 'error',
                message: `${resp.message}`
              })
            }, 1500)

          }
        })
  } else{
    notificationsStore.addNotification('Please fill all the required fields', 'error')

  }

}
</script>

<template>
  <div class=" gap-8 space-y-4 w-full">
    <p class="">Product Images</p>
    <div class="col-span-6">
      <p>Upload images of your products for customers to have a look at them</p>
    </div>

    <div class="flex items-center justify-center w-full">
      <label for="dropzone-file"
             class="flex  w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
             :class="[aggregatorStore.productPhotos? 'flex-row items-center justify-center gap-4 ps-4': 'flex-col items-center justify-center']"
      >
        <div v-if="!aggregatorStore.productPhotos.length">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload photos for your product</span>
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">PNG or JPG</p>
          </div>
          <input
              ref="photoRef"
              multiple
              id="dropzone-file" type="file" class="hidden" @change="onPhotoChange" accept=".png, .jpeg, .png, .webp"/>
        </div>
        <div v-else v-for="images in aggregatorStore.productPhotos" :key="images.timestamp"

             class="relative group"
        >
          <img
              id="image-upload"
              :src="images.imgUrl"
              alt="Uploaded product image"
              class="h-40 w-40 rounded-lg outline outline-offset-2 outline-4 outline-gray-200"
          >
          <button
              @click.prevent="deleteImage(images.imgUrl)"
              class="z-99 btn btn-sm btn-circle absolute left-16 top-16 bg-gray-400 group-hover:bg-gray-400 opacity-0 group-hover:opacity-100 "

          >
            <span class="material-icons-outlined text-gray-300"> clear </span>

          </button>
        </div>

      </label>
    </div>
    <div class="flex justify-end">
      <button
          @click="postProduct"
          class="btn btn-sm bg-main-400 text-white hover:bg-main-500">
        <span v-if="!isProductUploadLoading">Add product</span>
        <span v-else class="loading loading-spinner loading-md"></span>
      </button>
    </div>

<!--    <teleport to="body">-->
<!--      <DialogModal :is-open="openDialog.isOpen"-->
<!--                   @close-modal="openDialog.isOpen=false">-->
<!--        <template #title>-->
<!--          <div class="flex justify-center">-->
<!--            <span class="material-icons-outlined !text-6xl"> logout </span>-->
<!--          </div>-->
<!--        </template>-->
<!--        <template #body>-->
<!--          <div class="flex justify-center">-->
<!--            <h1 class="text-xl font-bold">Oh no! You're leaving?</h1>-->
<!--          </div>-->
<!--          <div class="flex justify-center">-->
<!--            <p class="text-lg font-semibold">Are you sure?</p>-->
<!--          </div>-->
<!--        </template>-->
<!--        <template #footer>-->
<!--          <div class="flex justify-center gap-8">-->
<!--            <button class="btn btn-sm btn-ghost text-white bg-main-500 hover:bg-main-600 " @click="signOut">Sign Out</button>-->
<!--            <button class="btn btn-sm bg-slate-200" @click="openDialog.isOpen=false">-->
<!--              Cancel-->
<!--            </button>-->
<!--          </div>-->
<!--        </template>-->

<!--      </DialogModal>-->
<!--    </teleport>-->

  </div>

</template>

<style scoped>

</style>