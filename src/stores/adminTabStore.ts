import { defineStore } from 'pinia'


export const useAdminTabStore = defineStore('adminTabStore', {
    state: ()=>({
        tabs: [
            { name: 'Overview', value:'Admin-Overview', icon: 'grid_view' },
            { name: 'Inventory', value:'Admin-Inventory', icon: 'settings_input_component' },
            { name: 'Analytics', value:'Admin-Analytics', icon: 'bar_chart' },
            {name: 'Portfolio', value: 'Admin-Portfolio', icon: 'bar_chart'},
            {name: 'Add Aggregator', value: 'Create-Aggregator', icon: 'person'},
        ] as { name: string, value:string, icon: string }[],
        activeTab: localStorage.getItem('activeTab') || 'Admin-Overview' as string
    }),
    getters: {
        getTabs: (state) => state.tabs,
        getActiveTav: (state) => state.activeTab
    },
    actions: {
        setActiveTab(tab: string) {
            if (this.tabs.some(t => t.value === tab)) {
                this.activeTab = tab
                localStorage.setItem('activeTab', tab)
            } else {
                console.log(`${tab} not found`)
            }
        }
    }
})