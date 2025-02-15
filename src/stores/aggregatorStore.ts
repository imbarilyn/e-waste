import {defineStore} from 'pinia'
import {ref} from "vue";
import {useAggregatorAuthStore} from "@/stores/aggregatorAuthStore.ts";

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

const BASE_URL = import.meta.env.VITE_BASE_URL
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