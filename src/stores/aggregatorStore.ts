import {defineStore} from 'pinia'
import {ref} from "vue";


export const useAggregatorStore = defineStore('aggregatorStore', () => {
    const expandSidebarSmall = ref(false)




    const setExpandSidebarSmall = (value: boolean) => {
        expandSidebarSmall.value = value
    }



    return {
        expandSidebarSmall,
        setExpandSidebarSmall
    }
})