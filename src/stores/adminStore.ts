import {defineStore} from 'pinia'
import {ref} from "vue";
import {useAdminAuthStore} from "@/stores";

interface ResendEmail {
    head: string
    body: string
    aggregatorEmail: string
}

interface ProductPrices {
    name: string
    regularPrice: string
    weight: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string
export const useAdminStore = defineStore('adminStore', () => {
    const expandSidebarSmall = ref(false)
    const collapseSidebar = ref(false)




    const setExpandSidebarSmall = (value: boolean) => {
        expandSidebarSmall.value = value
    }

    const setCollapseSidebar = () => {
        collapseSidebar.value = !collapseSidebar.value
    }

    async function resendEmail(resendEmailPayload: ResendEmail){
        console.log('Resend email--', resendEmailPayload)
        const adminAuthStore = useAdminAuthStore()
        const formData = new FormData()
        formData.append('head', resendEmailPayload.head)
        formData.append('body', resendEmailPayload.body)
        formData.append('aggregator_email', resendEmailPayload.aggregatorEmail)
        try{
            const response = await fetch(`${BASE_URL}/admin/resend-email`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${adminAuthStore.getToken}`
                },
                body: formData
            })
            const data = await response.json()
            console.log(data)
            if(!response.ok){
                return {
                    result: 'fail',
                    message: 'Could not validate user, please try to login'
                }
            }
            else{
                return {
                    result: data.result,
                    message:data.message
                }
            }
        }
        catch(e){
            console.log(e)
        }
    }

    // async function setPrices(ProductPricesPayload: ProductPrices){
    //     const adminAuthStore = useAdminAuthStore()
    //     const formData = new FormData()
    //     formData.append('name', ProductPricesPayload.name)
    //     formData.append('regular_price', ProductPricesPayload.regularPrice)
    //     formData.append('weight', ProductPricesPayload.weight)
    //     try{
    //         const response = await fetch(`${BASE_URL}/admin/set-prices/${adminAuthStore.getAdminInfo()?.userId}`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${adminAuthStore.getToken}`,
    //                 mode: 'cors'
    //             },
    //             body:formData
    //         })
    //         const data = await response.json()
    //         console.log(data)
    //         if(!response.ok){
    //             return {
    //                 result: 'fail',
    //                 message: `${response.statusText}`
    //             }
    //         }
    //         else{
    //             return {
    //                 result: data.result,
    //                 message:data.message
    //             }
    //         }
    //
    //     }
    //     catch(e){
    //         console.log('setting prices', e)
    //     }
    // }

    // async function getPrices(){
    //     const adminAuthStore = useAdminAuthStore()
    //     try{
    //         const response = await fetch(`${BASE_URL}/admin/get-prices/${adminAuthStore.getAdminInfo()?.userId}`, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${adminAuthStore.getToken}`
    //             }
    //         })
    //         const data = await response.json()
    //         console.log(data)
    //         if(!response.ok){
    //             return {
    //                 result: 'fail',
    //                 message: `${response.statusText}`
    //             }
    //         }
    //         else{
    //             return {
    //                 result: data.result,
    //                 message:data.message
    //             }
    //         }
    //
    //     }
    //     catch(e){
    //         console.log('getting prices', e)
    //     }
    // }

    return {
        expandSidebarSmall,
        setExpandSidebarSmall,
        collapseSidebar,
        setCollapseSidebar,
        resendEmail,
        // setPrices
    }
})