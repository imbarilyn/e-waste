import {createRouter, createWebHistory, type RouteLocationNormalized} from 'vue-router'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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
                    path: 'admin-reset-password',
                    component: () => import('@/views/auth/admin/ResetPasswordPage.vue'),
                    meta: {
                        requiresAuth: true,
                    }
                },

                {
                    name: 'aggregator-login',
                    path: 'aggregator-login',
                    component: () => import('@/views/auth/aggregator/LoginPage.vue'),
                },
                {
                    name: 'aggregator-reset-password',
                    path: 'aggregator-reset-password',
                    component: () => import('@/views/auth/aggregator/ResetPasswordPage.vue'),
                },
                {
                    name: 'aggregator-forgot-password',
                    path: 'aggregator-forgot-password',
                    component: () => import('@/views/auth/aggregator/ForgotPasswordPage.vue'),
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
                            path: '',
                            component: () => import('@/components/aggregator/overview/OverviewPage.vue'),
                            props: (route: RouteLocationNormalized) => {
                                return {
                                    user_id: route.params.user_id
                                }
                            }
                        },
                        {
                            name: 'Aggregator-Analytics',
                            path: 'analytics',
                            component: () => import('@/components/aggregator/analytics/AnalyticsPage.vue'),
                            props: (route: RouteLocationNormalized) => {
                                return {
                                    user_id: route.params.user_id
                                }
                            }
                        },
                        {
                            name: 'Aggregator-Inventory',
                            path: 'inventory',
                            component: () => import('@/components/aggregator/inventory/InventoryPage.vue'),
                            props: (route: RouteLocationNormalized) => {
                                return {
                                    user_id: route.params.user_id
                                }
                            }
                        },
                        {
                            name: 'Aggregator-Account Receivables',
                            path: 'accounts',
                            component: () => import('@/components/aggregator/accounts/AccountsPage.vue'),
                            props: (route: RouteLocationNormalized) => {
                                return {
                                    user_id: route.params.user_id
                                }
                            }
                        }
                    ]
                },
        // admin routes
        {
            name: 'admin',
            path: '/admin',
            component: () => import('@/views/pages/admin/LayoutPage.vue'),
            children: [
                {
                    name: 'Admin-Overview',
                    path: '',
                    component: () => import('@/components/admin/overview/OverviewPage.vue'),
                    props: (route: RouteLocationNormalized) => {
                        return {
                            user_id: route.params.user_id
                        }
                    }
                },
                {
                    name: 'Admin-Analytics',
                    path: 'analytics',
                    component: () => import('@/components/admin/analytics/AnalyticsPage.vue'),
                    props: (route: RouteLocationNormalized) => {
                        return {
                            user_id: route.params.user_id
                        }
                    }
                },
                {
                    name: 'Admin-Inventory',
                    path: 'inventory',
                    component: () => import('@/components/admin/inventory/InventoryPage.vue'),
                    props: (route: RouteLocationNormalized) => {
                        return {
                            user_id: route.params.user_id
                        }
                    }
                },
                {
                    name: 'Admin-Account Receivables',
                    path: 'accounts',
                    component: () => import('@/components/admin/accounts/AccountsPage.vue'),
                    props: (route: RouteLocationNormalized) => {
                        return {
                            user_id: route.params.user_id
                        }
                    }
                },
                {
                    name: 'Create-Aggregator',
                    path: 'create-aggregator',
                    component: ()=> import('@/components/admin/CreateAggregatorPage.vue'),
                    props: (route: RouteLocationNormalized) => {
                        return {
                            user_id: route.params.user_id
                        }
                    }
                }
            ]
        }
        ,


    ],
})


export default router
