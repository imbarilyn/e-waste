import { defineStore} from "pinia";
import { useStorage } from '@vueuse/core'
import {ref} from "vue";
import {computed} from "vue";
import moment from "moment";
import {jwtDecode} from "jwt-decode";
import {useAdminAuthStore} from "@/stores/adminAuthStore.ts";

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
    location: string
    adminId: string
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
}

interface AggregatorData {
    fullName: string
    email: string,
    userId: string,
}

interface IsAuthenticationError {
    isError: boolean
    message: string
    type: 'error' | 'warning' | 'info' | 'success'
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string

export const useAggregatorAuthStore = defineStore('aggregatorAuthStore', ()=>{
    const aggregatorToken = useStorage('aggregator-token', '' )
    const aggregatorLoggedIn = ref(false)
    const aggregatorTokenExpiry = useStorage('aggregator-token-expiry', '')
    const aggregator = useStorage('aggregator', '')
    const aggregatorEverLoggedIn = ref(false)
    const getAggregatorToken = computed(()=> aggregatorToken.value)
    const IsAuthenticationError = ref<IsAuthenticationError>({
        isError: false,
        message: '',
        type: 'success'
    })
    const aggregatorTokenValid = computed(()=>{
        const expiry = moment.unix(Number(aggregatorTokenExpiry.value)).utc()
        const now = moment().utc()
        const isValid = aggregatorToken.value && expiry.isAfter(now)
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
                    message: 'Failed to login, please try again'
                }
            }
            else{
                const resp = await response.json()
                setToken(resp.access_token)
                aggregatorEverLoggedIn.value = true
                return await decodeToken(resp.access_token)
            }
        }
        catch (error) {
            return {
                result: 'fail',
                message: 'Failed to login, please try again'
            }
        }
    }

    async function  decodeToken (token: string){
        const decode: AggregatorToken = jwtDecode(token)
        aggregatorTokenExpiry.value = decode.exp
        setAggregatorData ({
            fullName: decode.sub,
            email: decode.email,
            userId: decode.user_id,
        })
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
        IsAuthenticationError.value = {...value}
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
        IsAuthenticationError,
        getAggregatorToken
    }

})