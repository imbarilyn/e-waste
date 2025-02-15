import {defineStore} from "pinia";
import {useStorage} from '@vueuse/core'
import {ref} from "vue";
import {computed} from "vue";
import moment from "moment";
import {jwtDecode} from "jwt-decode";


interface AdminPayload {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    confirmPassword: string
}

interface IsAuthenticationError {
    isError: boolean
    message: string
    type: 'error' | 'warning' | 'info' | 'success'
}

interface AdminLoginPayload {
    phoneNumber: string
    password: string
}

interface AdminToken {
    sub: string
    user_id: string
    email: string
    exp: string
}

interface AdminData {
    fullName: string
    userId: string
    email: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string

export const useAdminAuthStore = defineStore('adminAuthStore', () => {
    const adminToken = useStorage('admin-token', '')
    const adminLoggedIn = ref(false)
    const adminTokenExpiry = useStorage('admin-token-expiry', '')
    const adminData = useStorage('admin-data', '')
    const adminEverLoggedIn = ref(false)
    const getToken = computed(() => adminToken.value)
    const IsAuthenticationError = ref<IsAuthenticationError>({
        isError: false,
        message: '',
        type: 'success'
    })
    const adminTokenValid = computed(() => {
        const expiry = moment.unix(Number(adminTokenExpiry.value)).utc()
        const now = moment().utc()
        const isValid = adminToken.value && expiry.isAfter(now)
        if (!isValid) {
            logout()
        }
        return isValid
    })


    async function createAdmin(adminPayload: AdminPayload) {
        const formData = new FormData()
        formData.append('full_name', adminPayload.fullName)
        formData.append('email', adminPayload.email)
        formData.append('phone_number', adminPayload.phoneNumber)
        formData.append('password', adminPayload.password)
        formData.append('confirm_password', adminPayload.confirmPassword)

        try {
            const response = await fetch(`${BASE_URL}/auth/admin/`, {
                method: 'POST',
                mode: 'cors',
                body: formData
            })
            if (!response.ok) {
                console.log('failed to create aggregator', response)
                return {
                    result: 'fail',
                    message: 'Failed to create aggregator, please try again'
                }
            }

            const data = await response.json()
            return {
                result: data.result,
                message: data.message
            }
        } catch (error) {
            return {
                result: 'fail',
                message: 'Failed to create aggregator, please try again'
            }
        }
    }

    async function adminLogin(loginPayload: AdminLoginPayload) {
        console.log('login payload', loginPayload)
        const formData = new FormData()
        formData.append('phone_number', loginPayload.phoneNumber)
        formData.append('password', loginPayload.password)

        try {
            const response = await fetch(`${BASE_URL}/auth/admin/token`, {
                method: 'POST',
                mode: 'cors',
                body: formData
            })

            if (!response.ok) {
                console.log('failed to login', response)
                return {
                    result: 'fail',
                    message: `${response.statusText} user`
                }
            } else {
                const data = await response.json()
                console.log('jwt token---', data)
                if (data) {
                    setToken(data.access_token)
                    adminEverLoggedIn.value = true
                    return await decodeToken(data.access_token)
                } else {
                    return {
                        result: 'fail',
                        message: data.detail
                    }
                }
            }
        } catch (error) {
            return {
                result: 'fail',
                message: 'Failed to login, please try again'
            }
        }
    }

    // async function getAggregators(adminId: string){
    //     try{
    //         const response = await fetch(`${BASE_URL}/admin/get-aggregators/${adminId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${adminToken.value}`
    //             }
    //         })
    //         if(!response.ok){
    //             return {
    //                 result: 'fail',
    //                 message: 'Failed to get aggregators'
    //             }
    //         }
    //         const data = await response.json()
    //         return {
    //             result: 'success',
    //             message: 'Aggregators retrieved successfully'
    //         }
    //     }
    //
    // }

    async function decodeToken(token:string) {
        const decode: AdminToken = jwtDecode((token))
        setAdminData({
            fullName: decode.sub,
            userId: decode.user_id,
            email: decode.email,
        })
        adminTokenExpiry.value = decode.exp
        return {
            result: 'success',
            message: 'Amin Logged in successfully'

        }
    }

    function setAdminData(data: AdminData) {
        adminData.value = JSON.stringify({...data})
        adminLoggedIn.value = true
    }

    function setToken(token: string) {
        try {
            adminToken.value = token
        } catch (error) {
            console.log('failed to set token', error)
            return
        }

    }

    const getAdminInfo = () => {
        try{
            return JSON.parse(adminData.value) as AdminData
        }
        catch{
            return null
        }
    }


    const setIsAuthenticationError = (value: IsAuthenticationError) => {
        IsAuthenticationError.value = {...value}
    }


    const logout = () => {
        adminLoggedIn.value = false
        adminToken.value = null
    }


    return {
        adminToken,
        adminLoggedIn,
        adminTokenExpiry,
        adminData,
        adminEverLoggedIn,
        adminTokenValid,
        setIsAuthenticationError,
        IsAuthenticationError,
        createAdmin,
        logout,
        adminLogin,
        getAdminInfo,
        getToken
    }

})