<script lang="ts" setup>
import {ref, watch} from 'vue'
import {RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption,} from '@headlessui/vue'

// eslint-disable-next-line no-redeclare
interface MyRadioGroup {
  name: string
  color:  string
  icon: string
  description: string
}

interface WeightUnitProps {
  weightUnit: MyRadioGroup []
}

const props = defineProps<WeightUnitProps>()
const selected = ref()

const emits = defineEmits<{
  (event: 'change', value: MyRadioGroup): void;
}>();

watch(() => selected.value, (newVal) => {
  emits('change', newVal)
})
</script>


<template>
  <div class="w-full py-3">
    <div class="mx-auto w-full">
      <RadioGroup v-model="selected">
        <RadioGroupLabel class="sr-only">Server Size</RadioGroupLabel>
        <div class="space-y-0 grid grid-cols-12 gap-3">
          <RadioGroupOption
              v-for="unit in props.weightUnit"
              :key="unit.name"
              v-slot="{ active, checked }"
              :value="unit"
              as="template"
          >
            <div
                :class="[
                active
                  ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                  : '',
                checked ? 'bg-main-300 text-white ' : 'bg-white',
              ]"
                class="col-span-6 cursor-pointer rounded-lg px-5 py-2 shadow-md focus:outline-none"
            >
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-sm">
                    <div class="flex flex-row gap-3 items-center">
                      <RadioGroupLabel
                          :class="checked ? 'text-white' : 'text-gray-900'"
                          as="p"
                          class="font-medium col-span-1"
                      >
                        <span :class="[unit.color]"
                              class="material-icons ">{{
                            unit.icon
                          }}</span>
                      </RadioGroupLabel>
                      <RadioGroupDescription
                          :class="checked ? 'text-main-500' : 'text-gray-500'"
                          as="span"
                          class="col-span-1"
                      >
                        <p>{{ unit.name }}</p>
                        <p>{{ unit.description }}</p>

                      </RadioGroupDescription>
                    </div>
                  </div>
                </div>
                <div v-show="checked" class="shrink-0 text-white">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle
                        cx="12"
                        cy="12"
                        fill="#fff"
                        fill-opacity="0.2"
                        r="12"
                    />
                    <path
                        :style="{stroke: 'deepskyblue'}"
                        d="M7 13l3 3 7-7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>

