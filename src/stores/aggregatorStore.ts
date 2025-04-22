import {defineStore} from 'pinia'
import {computed, reactive, ref} from "vue";
import {useAggregatorAuthStore} from "@/stores/aggregatorAuthStore.ts";
import {useStorage} from "@vueuse/core";
import type {AccountInfo} from "@/components/admin/createAggregator/AccountInfo.vue";
import {useAdminAuthStore} from "@/stores/adminAuthStore.ts";

export interface Product {
    name: string
    regular_price: string
    sale_price: string
    short_description: string
    sku?: string
    stock_quantity?: number
    categories: {
        id: number,
        name: string
    }
    dimensions?: {
        length: string
        width: string
        height: string
    }
    weight?: string
    images:string []
    type: string
    post_author: string
    dokan_token: string
    date_modified: string
    store_id?: number

}

interface ProductCategory {
    id: number
    name: string
}

export interface productPhotos {
    imgUrl: string
    timestamp: number
}

export interface SalesReportByDatePayload {
    vendorId?: string
    dateMin: string | null
    dateMax: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL
const WP_URL = import.meta.env.VITE_WOOCOMMERCE_API_URL

export const useAggregatorStore = defineStore('aggregatorStore', () => {
    const expandSidebarSmall = ref(false)
    const isFile = ref(false)
    const productPhotos = ref<productPhotos []>([])
    const setExpandSidebarSmall = (value: boolean) => {
        expandSidebarSmall.value = value
    }


    const productValidation = useStorage("productValidation", {
        "generalData": false,
        "inventoryData": false,
        // "attributeData": false,
        "dimensionsData": true,
        // "mediaData": false,
    });


    async function addProduct(productPayload: Product) {
        console.log('Adding product', productPayload)
        const uploadedUrls = ref<string[]>()
        const aggregatorAuthStore = useAggregatorAuthStore()
        console.log(productPayload)

        try {
            uploadedUrls.value = await uploadImages(productPayload.images)
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
                    regular_price: productPayload.regular_price,
                    sale_price: productPayload.sale_price,
                    short_description: productPayload.short_description,
                    sku: productPayload.sku,
                    stock_quantity: productPayload.stock_quantity,
                    categories: productPayload.categories,
                    dimensions: productPayload.dimensions,
                    weight: productPayload.weight,
                    images: uploadedUrls.value,
                    type: 'simple',
                    post_author: aggregatorAuthStore.getAggregatorInfo()?.userId,
                    dokan_token: aggregatorAuthStore.getDokanToken
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

    async function uploadImages(images: string[]) {
        console.log('Uploading images', images)
        const aggregatorAuthStore = useAggregatorAuthStore()
        try {
            const response = await fetch(`${BASE_URL}/aggregator/upload-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${aggregatorAuthStore.getAggregatorToken}`

                },
                body: JSON.stringify({
                    file: images
                })
            })
            if (!response.ok) {
                console.log('here!!', response)
                return
            } else {
                const data = await response.json()
                console.log(data)
                return data.url
            }
        } catch
            (e) {
            console.log(e)
            return
        }
    }
async function getProductsCategory() {
        const productCategory = [] as ProductCategory[]
    try {
        const response = await fetch(`${BASE_URL}/aggregator/get-products-categories`)
        if (!response.ok) {
            return {
                result: 'fail',
                message: `${response.statusText}`
            }
        }
        else{
           const resp = await response.json()
            resp.map((category: any)=>{
                productCategory.push({
                    id: category.id,
                    name: category.name
                })
            })
            return {
                result: 'success',
                data: productCategory
            }
        }
    }
    catch(e){
        console.log(e)
    }
}

async function deleteProduct(productId: number){
        const aggregatorAuthStore = useAggregatorAuthStore()
    console.log('delete product', productId)
        try{
            const response = await fetch(`${WP_URL}/wp-json/dokan/v1/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${aggregatorAuthStore.getDokanToken}`,
                    // mode: 'cors',
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                return {
                   data: null
                }
            }
            else {
                 const data = await response.json()
                return {
                    data: data
                }
            }
        }
        catch(e){
            console.log('error--', e)
        }

}

    async function getProduct(productId: number){
        const aggregatorAuthStore = useAggregatorAuthStore()
        console.log('delete product', productId)
        try{
            const response = await fetch(`${WP_URL}/wp-json/dokan/v1/products/${productId}`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${aggregatorAuthStore.getDokanToken}`,
                    // mode: 'cors',
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                return {
                    data: null
                }
            }
            else {
                const data = await response.json()
                return {
                    data: data
                }
            }
        }
        catch(e){
            console.log('error--', e)
        }
    }

    async function getSalesReport(){
        const aggregatorAuthStore = useAggregatorAuthStore()
        try{
            const response = await fetch(`${WP_URL}/wp-json/dokan/v1/reports/summary`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${aggregatorAuthStore.getDokanToken}`,
                    // mode: 'cors',
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                return {
                    data: null
                }
            }
            else {
                const data = await response.json()
                return {
                    data: data
                }
            }
        }
        catch(e){
            console.log('error--', e)
        }

    }


    async function getProductSummary() {
        const aggregatorAuthStore = useAggregatorAuthStore()
        try{
            const response = await fetch(`${WP_URL}/wp-json/dokan/v1/products/summary`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${aggregatorAuthStore.getDokanToken}`,
                    // mode: 'cors',
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                return {
                    data: null
                }
            }
            else {
                const data = await response.json()
                return {
                    data: data
                }
            }
        }
        catch(e){
            console.log('error--', e)
        }

    }

    // getting sales report by date
    async function getSalesReportByDate(payload: SalesReportByDatePayload){
        const aggregatorAuthStore = useAggregatorAuthStore()
        const adminAuthStore = useAdminAuthStore()

        try {
            const response = await fetch(`${WP_URL}/wp-json/dokan/v1/orders?vendor_id=${payload.vendorId}&date_min=${payload.dateMin}&date_max=${payload.dateMax}&status=completed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                    'Authorization': `Bearer ${aggregatorAuthStore.getDokanToken}`,
                }
            })

            const res = await response.json()
            console.log(res)
        }
        catch(e){
            console.log(e)
        }
    }



return {
    expandSidebarSmall,
    setExpandSidebarSmall,
    addProduct,
    getProductsCategory,
    // getVendor,
    deleteProduct,
    getProduct,
    productValidation,
    productPhotos,
    getSalesReport,
    getProductSummary,
    getSalesReportByDate


}
})