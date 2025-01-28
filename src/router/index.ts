import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'Home',
      path: '/',
      redirect: '/auth'
    },
    {
      name: 'auth',
      path: '/admin',
      component: ()=>import('@/views/auth/admin/AdminAuth.vue'),
      children: [
        {
          name: 'login',
          path: '',
            component: ()=>import('@/views/auth/admin/LoginPage.vue'),
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
    }

  ],
})

export default router
