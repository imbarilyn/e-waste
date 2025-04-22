import { get } from '@vueuse/core';
import { defineStore } from 'pinia'

export interface ProductTab {
    name: string;
    title: string;
    to: string;
    component: string;
    active: boolean
    display: boolean
}
export const useProductTabStore = defineStore('productTabStore', {

    state: ()=>({
        productTabs: [
            {
                name: 'general',
                title: 'General',
                to: 'general-data',
                component: 'GeneralData',
                active: true,
                display: true
            },
            {
                name: 'inventory',
                title: 'Inventory',
                to: 'inventory-data',
                component: 'InventoryData',
                active: false
            },
            {
                name: 'dimensions',
                title: 'Dimensions',
                to: 'dimensions-data',
                component: 'DimensionData',
                active: false
            },
            // {
            //     name: 'attributes',
            //     title: 'Attributes',
            //     to: 'attributes-data',
            //     component: 'AttributesData',
            //     active: false
            // },
            {
                name: 'media',
                title: 'Media',
                to: 'media-data',
                component: 'MediaData',
                active: false
            },

        ] as ProductTab[],
        activeTab: 'general'
    }),
    getters: {
        getActiveTab: (state) =>{
            return state.productTabs.find(tab =>tab.active)
        },
        getProductTabs: (state)=> state.productTabs as []
    },
    actions: {
        setActiveTab(tabName: string){
            tabName = tabName.toLowerCase();
            this.activeTab = tabName

        //     deactivate all tabs
            this.productTabs.forEach((tab: ProductTab) =>{
                if(tab.name != tabName){
                    tab.active = false
                }
            })

            // activate the active tab
            const tab = this.productTabs.find((tab: ProductTab)=> tab.name === tabName)

            if(tab){
            tab.active = true
            }
        }
    }


})