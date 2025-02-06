import {defineStore} from 'pinia'
import {ref} from "vue";


export const useAdminStore = defineStore('adminStore', () => {
    const expandSidebarSmall = ref(false)
    const collapseSidebar = ref(false)




    const setExpandSidebarSmall = (value: boolean) => {
        expandSidebarSmall.value = value
    }

    const setCollapseSidebar = () => {
        collapseSidebar.value = !collapseSidebar.value
    }



    return {
        expandSidebarSmall,
        setExpandSidebarSmall,
        collapseSidebar,
        setCollapseSidebar
    }
})