import {defineStore} from 'pinia'
import {ref} from "vue";
import {type SalesReportByDatePayload, useAdminAuthStore, useAggregatorAuthStore} from "@/stores";
import type {Tabs} from "@/components/commonComponent/Tab.vue";
import moment from "moment";

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
const WP_URL = import.meta.env.VITE_WOOCOMMERCE_API_URL as string
export const useAdminStore = defineStore('adminStore', () => {
    const expandSidebarSmall = ref(false)
    const collapseSidebar = ref(false)
    const activeTab = ref<Tabs>(  {
        position: 1,
        name: 'Account Info'
    },)


    const setActiveTab = (tab: Tabs) => {
        activeTab.value = tab

    }




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

    // publish posted pending products
    async function publishProduct(productId: number) {
        const adminAuthStore = useAdminAuthStore()
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                },
                body: JSON.stringify({
                    status: 'publish',
                    post_status: 'publish'
                })
            })

            const res = await response.json()
            return {
                status: res.status,
            }
        }
        catch(e){
            console.log("There iss an error in publishing the product", e)
        }


    }

    // getting

    async function getOrdersReport(){
        const adminAuthStore = useAdminAuthStore()

        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/reports/orders/totals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                }
            })
            if(!response.ok){
                return{
                    result: 'fail',
                    data: null
                }
            }
            console.log('Store try block', response.status)
            const resp = await response.json()
            return {
                result: 'success',
                data: resp
            }

        } catch (e) {
            console.log("Error in fetching orders report in the store", e)
        }
    }

    async function getSalesReportByDate(payload: SalesReportByDatePayload){
        console.log("We ae here getSalesReportByDate", payload)
        const adminAuthStore = useAdminAuthStore()


        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/reports/sales?date_min=${payload.dateMin}&date_max=${payload.dateMax}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                }
            })

            const res = await response.json()
            console.log(res)
            if(!response.ok){
                return {
                    result: 'fail',
                    data: null
                }
            }
            else {
                return {
                    result: 'success',
                    data: res
                }
            }
        }
        catch(e){
            console.log(e)
        }
    }


    async function getRatings(){
        const adminAuthStore = useAdminAuthStore()
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/reports/reviews/totals`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                    'Content-Type': 'application/json',
                }
            })
            const res = await response.json()
            if(!response.ok){
                return {
                    result: 'fail',
                    data: null
                }
            }
            else {
                return {
                    result: 'success',
                    data: res
                }
            }
        }
        catch(e){
            console.log(e)
        }
    }

    const getPublishedProducts = async () => {
        const adminAuthStore = useAdminAuthStore()
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/products?status=publish`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                return {
                    data: null
                }
            }
            const data = await response.json()
            return {
                data: response.headers.get('X-WP-Total')
            }
        } catch (error) {
            console.error('Error fetching published products:', error)
        }
    }

    const getPendingProducts = async () => {
        const adminAuthStore = useAdminAuthStore()
        try {
            const response = await fetch(`${WP_URL}/wp-json/wc/v3/products?status=pending`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${adminAuthStore.getAdminWordpressToken}`,
                    'Content-Type': 'application/json'
                }
            })
            if(!response.ok){
                return {
                    data: null
                }
            }
            const data = await response.json()
            return {
                data: response.headers.get('X-WP-Total')
            }
        } catch (error) {
            console.error('Error fetching pending products:', error)
        }
    }

    // fetching data for Overview page display
    async function getOverviewData (){
      try{
          const pendingProducts = await getPendingProducts()
          const publishedProducts = await getPublishedProducts()
          const salesReport = await getSalesReportByDate({
              dateMin: '2025-01-01',
              dateMax: moment().format('YYYY-MM-DD'),
          })
          console.log('sales report', salesReport?.data[0].total_sales)
          if(!pendingProducts || !publishedProducts || !salesReport){
                return {
                    data: null,
                    result: 'fail'
                }
          }
          else{
              return{
                  data: {
                      pendingProducts: pendingProducts?.data,
                      publishProducts: publishedProducts?.data,
                      totalSales: salesReport?.data[0].total_sales,
                      soldProducts: salesReport?.data[0].total_items
                  },
                  result: 'success'

              }

          }


      }
      catch(e){
          console.log('Error in fetching overview data', e)
      }
    }


    return {
        expandSidebarSmall,
        setExpandSidebarSmall,
        collapseSidebar,
        setCollapseSidebar,
        resendEmail,
        // setPrices
        activeTab,
        setActiveTab,
        publishProduct,
        getOrdersReport,
        getSalesReportByDate,
        getRatings,
        getOverviewData
    }
})