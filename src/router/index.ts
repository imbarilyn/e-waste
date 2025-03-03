import {createRouter, createWebHistory, type RouteLocationNormalized} from 'vue-router'
import { useAdminAuthStore, useAggregatorAuthStore} from "@/stores";

const routes = [
    {
        name: 'Home',
        path: '/',
        redirect: '/auth'
    },

    //   auth routes
    {
        name: 'auth',
        path: '/auth',
        component: () => import('@/views/auth/AuthRootPage.vue'),
        children: [
            {
                name: 'admin-login',
                path: '',
                component: () => import('@/views/auth/admin/LoginPage.vue'),
                meta: {
                    requiresAuth: false,
                }
            },
            {
                name: 'admin-register',
                path: 'admin-register',
                component: () => import('@/views/auth/admin/RegisterPage.vue'),
                meta: {
                    requiresAuth: false,
                }
            },
            {
                path: 'admin-register',
                name: 'admin-register',
                component: () => import('@/views/auth/admin/RegisterPage.vue'),
                meta: {
                    requiresAuth: false,
                }
            },
            {
                path: 'admin-forgot-password',
                name: 'admin-forgot-password',
                component: () => import('@/views/auth/admin/ForgotPasswordPage.vue'),
                meta: {
                    requiresAuth: true,
                }
            },
            {
                name: 'admin-reset-password',
                path: 'admin-reset-password/:resetToken',
                component: () => import('@/views/auth/admin/ResetPasswordPage.vue'),
                props:(route: RouteLocationNormalized) => {
                    return {
                        resetToken: route.params.resetToken
                    }
                },
                meta: {
                    requiresAuth: true,
                }
            },

            {
                name: 'aggregator-login',
                path: 'aggregator-login',
                component: () => import('@/views/auth/aggregator/LoginPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.userId
                    }
                }
            },
            {
                name: 'aggregator-reset-password',
                path: 'aggregator-reset-password/:resetToken',
                component: () => import('@/views/auth/aggregator/ResetPasswordPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        resetToken: route.params.resetToken
                    }
                },
                meta: {
                    requiresAuth: false,
                }
            },
            {
                name: 'aggregator-forgot-password',
                path: 'aggregator-forgot-password',
                component: () => import('@/views/auth/aggregator/ForgotPasswordPage.vue'),
                meta: {
                    requiresAuth: false,
                }
            }


        ]
    },
    //   aggregator routes


    {
        name: 'aggregator',
        path: '/aggregator',
        component: () => import('@/views/pages/aggregator/LayoutPage.vue'),
        children: [
            {
                name: 'Aggregator-Overview',
                path: 'overview/:userId',
                component: () => import('@/components/aggregator/overview/OverviewPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.userId
                    }
                },
                meta: {
                    role: 'aggregator'
                }
            },
            {
                name: 'Aggregator-Analytics',
                path: 'analytics/:userId',
                component: () => import('@/components/aggregator/analytics/AnalyticsPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.userId
                    }
                },
                meta: {
                    role: 'aggregator',
                    requiresAuth: true,

                }
            },
            {
                name: 'Aggregator-Inventory',
                path: 'inventory/:userId',
                component: () => import('@/components/aggregator/inventory/InventoryPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.userId
                    }
                },
                meta: {
                    role: 'aggregator',
                    requiresAuth: true,
                }
            },
            {
                name: 'Aggregator-Account Receivables',
                path: 'accounts/:userId',
                component: () => import('@/components/aggregator/accounts/AccountsPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.userId
                    }
                },
                meta: {
                    role: 'aggregator',
                    requiresAuth: true,
                }
            },
            {
                name: 'Aggregator-Product',
                path: 'new-product/:userId',
                component: () => import('@/components/aggregator/createProduct/AddProduct.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.userId
                    }
                },
                meta: {
                    role: 'aggregator',
                    requiresAuth: true,
                }
            }
        ]
    },
    // admin routes
    {
        name: 'Admin',
        path: '/admin',
        component: () => import('@/views/pages/admin/LayoutPage.vue'),
        children: [
            {
                name: 'Admin-Overview',
                path: 'overview/:userId',
                component: () => import('@/components/admin/overview/OverviewPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
            {
                name: 'Admin-Analytics',
                path: 'analytics/:userId',
                component: () => import('@/components/admin/analytics/AnalyticsPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
            {
                name: 'Admin-Inventory',
                path: 'inventory/:userId',
                component: () => import('@/components/admin/inventory/InventoryPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
            {
                name: 'Admin-Account Receivables',
                path: 'accounts/:userId',
                component: () => import('@/components/admin/accounts/AccountsPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
            {
                name: 'Create-Aggregator',
                path: 'create-aggregator/:userId',
                component: () => import('@/components/admin/createAggregator/CreateAggregatorPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
            {
                name: 'Admin-Communications',
                path: 'communications/:userId',
                component: () => import('@/components/admin/communications/CommunicationPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
            {
                name: 'Admin-Portfolio',
                path: 'portfolio/:userId',
                component: () => import('@/components/admin/viewAggregators/AggregatorsPage.vue'),
                props: (route: RouteLocationNormalized) => {
                    return {
                        userId: route.params.user_id
                    }
                },
                meta: {
                    role: 'admin',
                    requiresAuth: true,
                }
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const adminAuthStore = useAdminAuthStore()
    const aggregatorAuthStore = useAggregatorAuthStore()
    const requiresAuth = to.meta.requiresAuth as boolean
    const role = to.meta.role as string

    if (!requiresAuth) {
        console.log('no auth required')
        next()
    } else {
        console.log('auth required')
        if(role === 'admin' && !adminAuthStore.adminTokenValid){
            next({
                name: 'admin-login'
            })
        } else if(role === 'aggregator' && !aggregatorAuthStore.aggregatorTokenValid){
            next({
                name: 'aggregator-login'
            })
        }
        else {
            next()
        }

    }
})

export default router
