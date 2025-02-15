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

    async function addProduct(productPayload: Product) {
        console.log('Adding product')
        const uploadedUrls = ref<string[]>()
        const aggregatorAuthStore = useAggregatorAuthStore()

        try {
            uploadedUrls.value = await Promise.all(productPayload.images.map(uploadImages)) as string[]
            console.log(uploadedUrls.value)

            const response = await fetch(`${BASE_URL}/aggregator/add-product/${aggregatorAuthStore.getAggregatorInfo()?.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aggregatorAuthStore.getAggregatorToken}`,
                    mode: 'cors'
                },
                body: JSON.stringify({
                    name: productPayload.name,
                    regular_price: productPayload.regularPrice,
                    stock_type: productPayload.type,
                    short_description: productPayload.shortDescription,
                    stock_quantity: productPayload.stockQuantity,
                    weight: productPayload.weight,
                    images: uploadedUrls.value
                })
            })
            if(!response.ok){
                return {
                    result: 'fail',
                    message: `${response.statusText}`
                }
            }
            else {
                return await response.json()
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    async function uploadImages(image: File) {
        const formData = new FormData()
        formData.append('file', image)
        const aggregatorAuthStore = useAggregatorAuthStore()
        try {
            const response = await fetch(`${BASE_URL}/aggregator/upload-images`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${aggregatorAuthStore.getAggregatorToken}`
                },
                body: formData
            })
            if (!response.ok) {
                console.log('here!!', response)
            } else {
                const data = await response.json()
                console.log(data)
                return data.url
            }
        } catch
            (e) {
            console.log(e)
        }
    }



return {
    expandSidebarSmall,
    setExpandSidebarSmall,
    addProduct

}
})