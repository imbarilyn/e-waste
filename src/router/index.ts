import {createRouter, createWebHistory, type RouteLocationNormalized} from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      path: '/',
      redirect: '/admin'
    },
    {
      name: 'admin',
      path: '/admin',
      component: ()=>import('@/views/auth/admin/AdminAuth.vue'),
      children: [
        {
          name: 'login',
          path: '',
            component: ()=>import('@/views/auth/admin/LoginPage.vue'),
          meta: {
            requiresAuth: false,
          }
        },
        {
          name: 'register',
          path: 'register',
            component: ()=>import('@/views/auth/admin/RegisterPage.vue'),
          meta: {
            requiresAuth: false,
          }
        },
        {
          name: 'register',
          path: 'register',
          component: ()=>import('@/views/auth/admin/RegisterPage.vue'),
          meta: {
            requiresAuth: false,
          }
        },
        {
          name: 'forgot-password',
          path: 'forgot-password',
          component: ()=>import('@/views/auth/admin/ForgotPasswordPage.vue'),
          meta: {
            requiresAuth: true,
          }
        },
        {
          name: 'reset-password',
          path: 'reset-password',
          component: ()=>import('@/views/auth/admin/ResetPasswordPage.vue'),
          meta: {
            requiresAuth: true,
          }
        }

      ]
    },
    {
      name: 'aggregator',
      path: '/aggregator',
      component: ()=>import('@/views/auth/aggregator/AggregatorPage.vue'),
      children: [
        {
          name: 'aggregator-login',
          path: '',
          component: ()=>import('@/views/auth/aggregator/LoginPage.vue'),
        },
        {
          name: 'reset-password',
          path: 'reset-password',
          component: ()=>import('@/views/auth/aggregator/ResetPasswordPage.vue'),
        },
        {
          name: 'forgot-password',
          path: 'forgot-password',
          component: ()=>import('@/views/auth/aggregator/ForgotPasswordPage.vue'),
        },
        {
          name: 'dashboard',
          path: '/dashboard',
          component: ()=>import('@/views/pages/aggregator/DashboardPage.vue'),
          children: [
            {
              name: 'Overview',
              path: '',
              component: ()=>import('@/components/aggregator/OverviewPage.vue'),
              props: (route: RouteLocationNormalized)=>{
                return {
                  user_id: route.params.user_id
                }
              }
            },
            {
              name: 'Analytics',
              path: 'analytics',
              component: ()=>import('@/components/aggregator/AnalyticsPage.vue'),
              props: (route: RouteLocationNormalized)=>{
                return {
                  user_id: route.params.user_id
                }
              }
            },
            {
              name: 'Products',
              path: 'products',
              component: ()=>import('@/components/aggregator/InventoryPage.vue'),
              props: (route: RouteLocationNormalized)=>{
                return {
                  user_id: route.params.user_id
                }
              }
            },
            {
              name: 'Account Receivables',
              path: 'accounts',
              component: ()=>import('@/components/aggregator/AccountsPage.vue'),
              props: (route: RouteLocationNormalized)=>{
                return {
                  user_id: route.params.user_id
                }
              }
            }
          ]
        },

      ]
    }

  ],
})

export default router
