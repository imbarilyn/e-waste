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

interface AdminWordPressToken {
    exp: number
}

interface AdminData {
    fullName: string
    userId: string
    email: string
}

export interface ResetPasswordPayload {
    password: string,
    confirmPassword: string
    resetToken: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL as string

export const useAdminAuthStore = defineStore('adminAuthStore', () => {
    const adminToken = useStorage('admin-token', '')
    const adminLoggedIn = ref(false)
    const adminTokenExpiry = useStorage('admin-token-expiry', '')
    const adminWordpressToken = useStorage('admin-wp-token', '')
    const adminWordpressTokenExpiry = useStorage('admin-wp-expiry', 0 )
    const adminData = useStorage('admin-data', '')
    const adminEverLoggedIn = ref(false)
    const getToken = computed(() => adminToken.value)
    const getAdminWordpressToken = computed(() => adminWordpressToken.value)
    const isAuthenticationError = ref<IsAuthenticationError>({
        isError: false,
        message: '',
        type: 'success'
    })
    const adminTokenValid = computed(() => {
        const expiry = moment.unix(Number(adminTokenExpiry.value)).utc()
        const now = moment().utc()
        const wpExpiry = moment.unix(adminWordpressTokenExpiry.value).utc()
        const isValid = adminToken.value && expiry.isAfter(now) && adminWordpressToken.value && wpExpiry.isAfter(now)
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
                // mode: 'no-cors',
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
                    setToken(data)
                    adminEverLoggedIn.value = true
                    return(
                        await decodeToken(data.access_token, data.wp_token)

                    )
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

    async function forgotPassword(email: string) {
        console.log('forgot password', email)
    try {
        const response = await fetch(`${BASE_URL}/auth/admin/forgot-password`, {
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
            const response = await fetch(`${BASE_URL}/auth/admin/reset-password`, {
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



    async function decodeToken(token:string, wp_token: string) {
        const decode: AdminToken = jwtDecode(token)
        const wpDecode: AdminWordPressToken = jwtDecode(wp_token)
        setAdminData({
            fullName: decode.sub,
            userId: decode.user_id,
            email: decode.email,
        })
        adminTokenExpiry.value = decode.exp
        adminWordpressTokenExpiry.value = wpDecode.exp
        return {
            result: 'success',
            message: 'Amin Logged in successfully'

        }
    }

    function setAdminData(data: AdminData) {
        adminData.value = JSON.stringify({...data})
        adminLoggedIn.value = true
    }

    function setToken(data: {access_token: string, wp_token: string}) {
        try {
            adminToken.value = data.access_token
            adminWordpressToken.value = data.wp_token

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
        isAuthenticationError.value = {...value}
    }


    const logout = () => {
        adminLoggedIn.value = false
        adminToken.value = null
    }


    return {
        adminToken,
        adminWordpressToken,
        adminLoggedIn,
        adminTokenExpiry,
        adminData,
        adminEverLoggedIn,
        adminTokenValid,
        setIsAuthenticationError,
        isAuthenticationError,
        createAdmin,
        logout,
        adminLogin,
        getAdminInfo,
        getToken,
        forgotPassword,
        resetPassword,
        getAdminWordpressToken
    }

})