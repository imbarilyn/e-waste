<script setup lang="ts">
import {ref, computed, watch, onMounted} from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

export interface ComboOptions {
  id: number
  name: string
}

interface ComboboxProps {
  comboProps: ComboOptions[]
  prompt?: string
}

const props = defineProps<ComboboxProps>()
let selected = ref()
let query = ref('')

let filteredOptions = computed(() =>
    query.value === ''
        ? props.comboProps
        : props.comboProps.filter((option) =>
            option.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.value.toLowerCase().replace(/\s+/g, ''))
        )
)

const emits = defineEmits<{
  (event: 'comboChoice', value: ComboOptions): void
}>()

watch(()=>selected.value, (value)=>{
  console.log(value)
  if(value){
    const selectedOption = props.comboProps.find((option)=>{
      return option.name === value
    })
    console.log(selectedOption)
    if(selectedOption){
      emits('comboChoice', {
        id: selectedOption.id,
        name: selectedOption.name
      })
    }

  }
})

</script>




<template>
  <div class="relative">
    <Combobox v-model="selected">
      <div class="relative mt-1">
        <div
            class="relative w-full cursor-default overflow-hidden rounded-lg py-1.5 bg-white text-left shadow-md border border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-main-300 sm:text-sm"
        >
          <ComboboxInput
              class="w-full py-2 pl-3 pr-10 text-sm leading-5  focus:ring-0"
              placeholder="Search..."
              @change="query = $event.target.value"
          />
          <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
                class="h-6 w-5 text-main-400"
                aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
        >
<!--          border-1 border-main-500  focus:border-main-500 focus:ring focus:ring-main-500 focus:ring-offset-2-->
          <ComboboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-main-500 focus:outline-none sm:text-sm"
          >
            <div
                v-if="filteredOptions.length === 0 && query !== ''"
                class="relative cursor-default select-none px-4 py-2 text-gray-700"
            >
              Nothing found.
            </div>

            <ComboboxOption
                v-for="option in filteredOptions"
                as="template"
                :key="option.id"
                :value="option.name"
                v-slot="{ selected, active }"
            >
              <li
                  class="relative cursor-default select-none py-2 pl-10 pr-4"
                  :class="{
                  'bg-sky-500 text-white': active,
                  'text-main-950': !active,
                }"
              >
                <span
                    class="block truncate"
                    :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ option.name }}
                </span>
                <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                    :class="{ 'text-white': active, 'text-main-color': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>


