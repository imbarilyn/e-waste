<script setup lang="ts">
import {reactive, watch, ref, computed} from 'vue'
import {showAlert} from "@/modules/sweetAlert.ts";
import Tab, {type Tabs} from "@/components/commonComponent/Tab.vue";
import AccountInfo from "@/components/admin/createAggregator/AccountInfo.vue";
import {useAdminStore} from "@/stores";
import PaymentInfo from "@/components/admin/createAggregator/PaymentInfo.vue";
import AddressInfo from "@/components/admin/createAggregator/AddressInfo.vue";

const adminStore = useAdminStore()



// const createAggregatorHandler = () => {
//   if (everyThingOk) {
//     isLoadingResource.value = true
//     console.log(createAggregatorData)
//     console.log(adminAuthStore.getAdminInfo()?.userId)
//     aggregatorAuthStore.createAggregator({...createAggregatorData, wpToken: adminAuthStore.adminWordpressToken, adminId: adminAuthStore.getAdminInfo()?.userId as string})
//         .then((resp) => {
//           if (resp.result === 'success') {
//             setTimeout(() => {
//               isLoadingResource.value = false
//               showAlert({
//                 type: 'success',
//                 message: resp.message
//               })
//             }, 2000)
//           } else {
//             setTimeout(() => {
//               isLoadingResource.value = false
//               showAlert({
//                 type: 'error',
//                 message: resp.message
//               })
//             }, 2000)
//           }
//         })
//         .catch(() => {
//           setTimeout(() => {
//             isLoadingResource.value = false
//             showAlert({
//               type: 'error',
//               message: 'Failed to create aggregator, please try again'
//             })
//           }, 2000)
//         })
//   }
// }
const tab = [
  {
    position: 1,
    name: 'Account Info'
  },
  {
    position: 2,
    name: 'Address'
  },
  // {
  //   position: 3,
  //   name: 'Payment Options'
  // },
]
const moveNext = ref(false)
const isMoveNext = (val: boolean) =>{
  console.log('isMoveNext', val)
  moveNext.value = val

}
// const selectedTab = ref<Tabs>()
// const handleTabChange = (tab: Tabs)=>{
//   console.log(tab)
//   selectedTab.value = tab
// }
</script>

<template>
  <div class="relative md:text-3xl text-2xl text-main-950 ">
    <p class="md:text-2xl text-lg font-semibold">Add an aggregator</p>
    <div class="flex justify-center">
      <Tab :tab="tab"  :isMoveNext = "moveNext"/>
    </div>
    <main class="w-full mx-auto p-6 items-center flex flex-col justify-center">
      <div
          :class="[adminStore.collapseSidebar? 'lg:w-10/12': 'lg:w-full']"
          class="w-full md:w-10/12 lg:w-10/12 xl:w-8/12  2xl:w-6/12 px-4 md:px-2 lg:px-0 mt-7  "
      >


            <form class="my-4">
              <Transition name="slide-horizontal" mode="out-in" appear>
                <AccountInfo v-if="adminStore.activeTab.name === 'Account Info'" @move-next="isMoveNext" />
<!--                <PaymentInfo  v-else-if="selectedTab?.name === 'Payment Options'" />-->
                <AddressInfo v-else  />
              </Transition>
            </form>
            <!-- End Form -->
      </div>
    </main>
<!--    <div class="flex justify-center">-->
<!--      <div class="w-full flex justify-end ">-->
<!--        <button class="btn btn-sm bg-main-500 hover:bg-main-400" @click="">-->
<!--          <span class="material-icons-outlined text-white">east</span>-->
<!--        </button>-->

<!--      </div>-->
<!--    </div>-->



  </div>

</template>

<style scoped>
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