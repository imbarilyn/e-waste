<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { type ProductTab} from "@/stores";
import {useProductTabStore} from "@/stores";

// const props = withDefaults(defineProps<ProductTab>(), {
//   id: 1,
//   name: 'General',
//   isActive: true
//
// })

// const props = withDefaults(defineProps<{
//   tabs: ProductTab [],
// }>(),{
//   tabs:()=> [
//     {
//       id: 1,
//       name: 'General',
//       isActive: true
//     }
//   ]
// })

const productTabStore = useProductTabStore()

const props = defineProps<{
  tabs: ProductTab []
}>()



const emits  = defineEmits<{
  (event: 'tabChange', value: ProductTab): void
}>()
const handleChangeTab = (tab: ProductTab) => {
  emits('tabChange', tab)

}


// const categories = ref({
//   Recent: [
//     {
//       id: 1,
//       title: 'Does drinking coffee make you smarter?',
//       date: '5h ago',
//       commentCount: 5,
//       shareCount: 2,
//     },
//     {
//       id: 2,
//       title: "So you've bought coffee... now what?",
//       date: '2h ago',
//       commentCount: 3,
//       shareCount: 2,
//     },
//   ],
//   Popular: [
//     {
//       id: 1,
//       title: 'Is tech making coffee better or worse?',
//       date: 'Jan 7',
//       commentCount: 29,
//       shareCount: 16,
//     },
//     {
//       id: 2,
//       title: 'The most innovative things happening in coffee',
//       date: 'Mar 19',
//       commentCount: 24,
//       shareCount: 12,
//     },
//   ],
//   Trending: [
//     {
//       id: 1,
//       title: 'Ask Me Anything: 10 answers to your questions about coffee',
//       date: '2d ago',
//       commentCount: 9,
//       shareCount: 5,
//     },
//     {
//       id: 2,
//       title: "The worst advice we've ever heard about coffee",
//       date: '4d ago',
//       commentCount: 1,
//       shareCount: 2,
//     },
//   ],
// })

</script>

<template>
  <div class="w-full max-w-md  py-4">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-xl bg-main-500 p-1">
        <Tab
            v-for="prop in props.tabs"
            as="template"
            :key="prop.name"
            v-slot="{ selected }"
        >
          <button
              @click="handleChangeTab(prop)"
              :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-main-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-main-700 shadow'
                : 'text-main-100 hover:bg-white/[0.12] hover:text-white',
            ]"
          >
            {{ prop.title}}
          </button>
        </Tab>
      </TabList>

<!--      <TabPanels class="mt-2">-->
<!--        <TabPanel-->
<!--            v-for="(posts, idx) in Object.values(categories)"-->
<!--            :key="idx"-->
<!--            :class="[-->
<!--            'rounded-xl bg-white p-3',-->
<!--            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',-->
<!--          ]"-->
<!--        >-->
<!--          <ul>-->
<!--            <li-->
<!--                v-for="post in posts"-->
<!--                :key="post.id"-->
<!--                class="relative rounded-md p-3 hover:bg-gray-100"-->
<!--            >-->
<!--              <h3 class="text-sm font-medium leading-5">-->
<!--                {{ post.title }}-->
<!--              </h3>-->

<!--              <ul-->
<!--                  class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500"-->
<!--              >-->
<!--                <li>{{ post.date }}</li>-->
<!--                <li>&middot;</li>-->
<!--                <li>{{ post.commentCount }} comments</li>-->
<!--                <li>&middot;</li>-->
<!--                <li>{{ post.shareCount }} shares</li>-->
<!--              </ul>-->

<!--              <a-->
<!--                  href="#"-->
<!--                  :class="[-->
<!--                  'absolute inset-0 rounded-md',-->
<!--                  'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2',-->
<!--                ]"-->
<!--              />-->
<!--            </li>-->
<!--          </ul>-->
<!--        </TabPanel>-->
<!--      </TabPanels>-->
    </TabGroup>
  </div>
</template>

<style scoped>

</style>