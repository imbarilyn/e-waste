import { defineStore} from "pinia";
import { useStorage } from '@vueuse/core'
import {ref} from "vue";
import {computed} from "vue";
import moment from "moment";
import {jwtDecode} from "jwt-decode";
import {useAdminAuthStore} from "@/stores";
import {type ResetPasswordPayload} from "@/stores";

interface Address {
    street_1: string
    street_2?: string
    city: string
    state: string
    country: string
    zip: string
}
export interface  CollectorPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    username: string
    address: Address
    adminId: string
    storeName: string
    wpToken: string
}

interface VendorWordPressToken {
    exp: number
}

interface  AggregatorLoginPayload {
    phoneNumber: string
    password: string
}

interface AggregatorToken {
    sub: string
    user_id: string
    email: string
    exp: string
    dokan_id: string
}

interface AggregatorData {
    firstName: string
    email: string,
    userId: string,
    dokanId: string

}

interface IsAuthenticationError {
    isError: boolean
    message: string
    type: 'error' | 'warning' | 'info' | 'success'
}

interface DokanVendorStatus {
    status: boolean
    aggregatorId: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string

export const useAggregatorAuthStore = defineStore('aggregatorAuthStore', ()=>{
    const aggregatorToken = useStorage('aggregator-token', '' )
    const aggregatorLoggedIn = ref(false)
    const aggregatorTokenExpiry = useStorage('aggregator-token-expiry', '')
    const aggregator = useStorage('aggregator', '')
    const vendorDokanToken = useStorage('vendor-dokan-token', '')
    const vendorDokanTokenExpiry = useStorage('vendor-dokan-token-expiry', 0)
    const aggregatorEverLoggedIn = ref(false)
    const getAggregatorToken = computed(()=> aggregatorToken.value)
    const getDokanToken = computed(()=> vendorDokanToken.value)
    const isAuthenticationError = ref<IsAuthenticationError>({
        isError: false,
        message: '',
        type: 'success'
    })
    const aggregatorTokenValid = computed(()=>{
        const expiry = moment.unix(Number(aggregatorTokenExpiry.value)).utc()
        const now = moment().utc()
        const wpExpiry = moment.unix(Number(vendorDokanTokenExpiry.value)).utc()
        const isValid = aggregatorToken.value && expiry.isAfter(now) && vendorDokanToken.value && wpExpiry.isAfter(now)
        if(!isValid){
            logout()
        }
        return isValid
    })


    async function createAggregator (aggregatorPayload: CollectorPayload){
        const adminAuthStore = useAdminAuthStore()
        try{
            const response = await fetch(`${BASE_URL}/auth/aggregator/create`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminAuthStore.getToken}`,

                },
                body: JSON.stringify({
                    first_name: aggregatorPayload.firstName,
                    last_name: aggregatorPayload.lastName,
                    email: aggregatorPayload.email,
                    phone_number: aggregatorPayload.phoneNumber,
                    username: aggregatorPayload.username,
                    admin_id: aggregatorPayload.adminId,
                    address: aggregatorPayload.address,
                    store_name: aggregatorPayload.storeName,
                    wp_token: aggregatorPayload.wpToken,
                })
            })
            const data = await response.json()
            console.log(data)
            if (!response.ok){
              return {
                result: 'fail',
                message: 'Could not validate user, please try to login'
              }
            }
            return {
                result: data.result,
                message: data.message
            }
        }
        catch (error){
            return {
                result: 'fail',
                message: 'Failed to create aggregator, please try again'
            }
        }
    }

    async function loginAggregator (loginPayload: AggregatorLoginPayload){
        const formData = new FormData()
        formData.append('phone_number', loginPayload.phoneNumber)
        formData.append('password', loginPayload.password)

        try {
            const response = await fetch(`${BASE_URL}/auth/aggregator/token`, {
                method: 'POST',
                mode: 'cors',
                body: formData
            })

            if(!response.ok){
                console.log('failed to login aggregator', response)
                return {
                    result: 'fail',
                    message: 'Wrong credentials, please try again'
                }
            }
            else{
                const resp = await response.json()
                setToken(resp)
                aggregatorEverLoggedIn.value = true
                return await decodeToken(resp.access_token, resp.dokan_token)
            }
        }
        catch (error) {
            console.log("Error login Vendor:", error)
            return {
                result: 'fail',
                message: 'An error has occurred, please try again'
            }
        }
    }

    async function forgotPassword(email: string) {
        console.log('forgot password', email)
        try {
            const response = await fetch(`${BASE_URL}/auth/aggregator/forgot-password`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            })
            if(!response.ok){
                return {
                    result: 'fail',
                    message: 'Could not reset password, please try again'
                }
            }
            const res = await response.json()
            return {
                result: 'success',
                message: res.message
            }
        }
        catch(error){
            return {
                result: 'fail',
                message: 'Could not reset password, please try again'
            }
        }
    }

    async function resetPassword(resetPasswordPayload:  ResetPasswordPayload ){
        try {
            const response = await fetch(`${BASE_URL}/auth/aggregator/reset-password`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resetPasswordPayload)

            })

            if(!response.ok){
                return {
                    result: 'fail',
                    message: 'Could not reset password, please try again'
                }
            }
            const res = await response.json()
            return {
                result: 'success',
                message: res.message
            }
        }
        catch(error){
            return {
                result: 'fail',
                message: 'Could not reset password, please try again'
            }
        }
    }

    async function changeDokanVendorStatus(payload: DokanVendorStatus){
        const adminAuthStore = useAdminAuthStore()
        console.log('changing status', payload)
        try{
            const response = await fetch(`${BASE_URL}/auth/aggregator/change-dokan-vendor-status`, {
                method: 'POST',
                // mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${adminAuthStore.getToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    aggregator_id: payload.aggregatorId,
                    enabled_status: payload.status,
                    wp_token: adminAuthStore.adminWordpressToken
                })
            })
            console.log('changing ststua response', response)
            if(!response.ok){
                return {
                    result: 'fail',
                    message: 'Could not change status, please try again'
                }
            }
            const res = await response.json()
            return {
                result: res.result,
                message: res.message
            }
        }
        catch(error){
            return
        }
    }

    async function  decodeToken (token: string, wp_token: string){
        const decode: AggregatorToken = jwtDecode(token)
        const wpDecode: VendorWordPressToken = jwtDecode(wp_token)
        aggregatorTokenExpiry.value = decode.exp
        setAggregatorData ({
            firstName: decode.sub,
            email: decode.email,
            userId: decode.user_id,
            dokanId: decode.dokan_id
        })
        aggregatorTokenExpiry.value = decode.exp
        vendorDokanTokenExpiry.value = wpDecode.exp
        return {
            result: 'success',
            message: 'Successfully logged in'
        }
    }

    function setToken(token: {access_token: string, dokan_token: string}){
        aggregatorToken.value = token.access_token
        vendorDokanToken.value = token.dokan_token
        aggregatorLoggedIn.value = true
    }

    function setAggregatorData(aggregatorData:  AggregatorData){
        try{
            aggregator.value = JSON.stringify({...aggregatorData})
        }
        catch(e){
            console.log(e)
            return
        }


    }

    function getAggregatorInfo(){
        try {
            return JSON.parse(aggregator.value) as AggregatorData
        }
        catch {
            return null
        }
    }

    const logout = ()=>{
        aggregatorLoggedIn.value = false
        aggregatorToken.value = null

    }

    const setIsAuthenticationError = (value: IsAuthenticationError) => {
        console.log('setting error', value)
        isAuthenticationError.value = {...value}
    }


    return {
        aggregatorToken,
        aggregatorLoggedIn,
        aggregatorTokenExpiry,
        aggregator,
        aggregatorEverLoggedIn,
        aggregatorTokenValid,
        createAggregator,
        logout,
        loginAggregator,
        getAggregatorInfo,
        setIsAuthenticationError,
        isAuthenticationError,
        getAggregatorToken,
        forgotPassword,
        resetPassword,
        getDokanToken,
        changeDokanVendorStatus
    }

})