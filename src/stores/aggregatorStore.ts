import {defineStore} from 'pinia'
import {ref} from "vue";

export interface Product {
    name: string
    created_at?: string
    regularPrice: string
    stockQuantity: string
    type: string
    shortDescription: string
    weight: string
    images:File[]
}

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