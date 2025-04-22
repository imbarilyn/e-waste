<script setup lang="ts">
import {ref, reactive, watch} from 'vue'
import {useField} from "vee-validate";

const showInfo = ref(true)
const handleInfo = () => {
  showInfo.value = false
}

const attributeData = reactive({
  name: '',
  descriptiveText: ''
})

// const nameValidator = (value: string) => {
//   const regExp = /^[a-zA-Z]+$/
//   if (value && value.length < 3) {
//     return 'Name must be at least 3 characters'
//   }
//   if (!isNaN(Number(value))) {
//     return 'Name must be a string'
//   }
//   if (!regExp.test(value)) {
//     return "Name must contain only letters"
//   }
//   return true
// }
//
// const descriptionTextValidator = (value: string) => {
//   // const regExp = /^[a-zA-Z]+$/
//   if (value && value.length < 3) {
//     return 'Description must be at least 3 characters'
//   }
//   if (!isNaN(Number(value))) {
//     return 'Description must be a string'
//   }
//   // if (!regExp.test(value)) {
//   //   return "Description must contain only letters"
//   // }
//   return true
// }
//
// const {
//   value: name,
//   errorMessage: nameErrorMessage,
//   meta: nameMeta
// } = useField('name', nameValidator)
//
// watch(() => attributeData.name, (value) => {
//   name.value = value
// })
//
// const {
//   value: descriptiveText,
//   errorMessage: descriptiveTextErrorMessage,
//   meta: descriptiveTextMeta
// } = useField('descriptiveText', descriptionTextValidator)
//
// watch(() => attributeData.descriptiveText, (value) => {
//   descriptiveText.value = value
// })
interface Attribute {
  id: number,
  attribute: number
  collapse: boolean
}

const attributes =  reactive<Attribute []>([])
const addAttribute = ()=>{
  attributes.push({
    id: attributes.length + 1,
    attribute: attributes.length - 1,
    collapse: false
  })
}

const removeAttribute = (index: number) => {
  attributes.splice(index, 1)
}

const toggleAttribute = (index: number)=>{
  attributes[index].collapse = !attributes[index].collapse
}
</script>

<template>

  <div class="space-y-3">
    <div class="relative border border-main-500 rounded-2xl p-3 w-10/12" v-if="showInfo">
      <div class="absolute inset-0 left-0 border-l-4 rounded-xl border-main-500 "></div>
      <div class="">
        <p class="">Add descriptive pieces of information that customers can use to search for this product on your
          store, such as <strong>"Material"</strong> or <strong>"Size</strong></p>
        <button class="btn btn-sm btn-ghost z-40 absolute -right-3 bg-main-400 hover:bg-main-300 h-9 w-9 rounded-full -top-2.5 flex justify-center items-center"
                @click="handleInfo">
          <span class="material-icons-outlined">highlight_off</span>
        </button>
      </div>
    </div>
    <div>
      <button class="btn btn-sm border-main-500" @click="addAttribute" :disabled="attributes.length >= 3">
        Add new
      </button>
      <div class="pt-4" v-for="(attribute, index) in attributes" :key="attribute.id">
        <div class="col-span-12 border-y-2 py-2 border-slate-300 shadow-sm flex justify-between">
          <p>New Attribute</p>
          <div class="flex gap-3 divide-y-2 divider-main-300">
            <button class="btn btn-sm bg-transparent" @click.prevent="removeAttribute(index)"><span class="text-rose-400">Remove</span></button>
            <button class="btn btn-sm bg-transparent" @click.prevent="toggleAttribute(index)" ><span class="material-icons-outlined">{{attribute.collapse? 'expand_more': 'expand_less'}}</span></button>
          </div>
        </div>
        <div class="grid grid-cols-12 pt-3 gap-4" v-if="!attribute.collapse">
          <div class="col-span-6 flex flex-col">
            <label class="label font-semibold md:text-xl text-sm" for="productPrice">Name</label>
            <input
                id="productPrice"
                v-model="attributeData.name"

                class="input  input-bordered  border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"
                placeholder="e.g. length or weight or color"
                type="text"

            />
<!--            <small-->
<!--                v-if="nameMeta.validated && !nameMeta.valid"-->
<!--                class="text-sm text-rose-500"-->
<!--            >-->
<!--              {{ nameErrorMessage }}-->
<!--            </small>-->
          </div>
          <div class="col-span-6">
            <label class="label font-semibold md:text-xl text-sm" for="productPrice">Values</label>
            <textarea
                v-model="attributeData.descriptiveText"
                id="shortDescription"
                placeholder="Enter some descriptive text. Use '|' to separate different values"
                class="textarea textarea-bordered border-1 h-28 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2  w-full text-sm"


            >
            </textarea>
<!--            <small-->
<!--                v-if="descriptiveTextMeta.validated && !descriptiveTextMeta.valid"-->
<!--                class="text-sm text-rose-500"-->
<!--            >-->
<!--              {{ descriptiveTextErrorMessage }}-->
<!--            </small>-->
          </div>

        </div>


      </div>


      <div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>