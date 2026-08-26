import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        /* ── Default layout (/) ── */
        {
            path: '/',
            component: DefaultLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('../pages/index.vue'),
                },
                {
                    path: 'components',
                    name: 'components',
                    component: () => import('../pages/components.vue'),
                },
                {
                    path: 'market',
                    name: 'market',
                    component: () => import('../pages/market.vue'),
                },
            ],
        },

        /* ── Auth layout (/auth) ── */
        {
            path: '/auth',
            component: AuthLayout,
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('../pages/login.vue'),
                },
                {
                    path: 'signup',
                    name: 'signup',
                    component: () => import('../pages/signup.vue'),
                },
                {
                    path: 'forgot-password',
                    name: 'forgot-password',
                    component: () => import('../pages/forgot-password.vue'),
                },
            ],
        },

        /* ── Dashboard layout (/dash) ── */
        {
            path: '/dash',
            component: () => import('../layouts/DashboardLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../pages/dashboard.vue'),
                },
                {
                    path: 'appointments',
                    name: 'appointments',
                    component: () => import('../pages/appointments.vue'),
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('../pages/users.vue'),
                },
                {
                    path: 'reports',
                    name: 'reports',
                    component: () => import('../pages/reports.vue'),
                },
                {
                    path: 'messages',
                    name: 'messages',
                    component: () => import('../pages/messages.vue'),
                },
                {
                    path: 'tools',
                    name: 'tools',
                    component: () => import('../pages/tools.vue'),
                },
                {
                    path: 'courses',
                    name: 'courses',
                    component: () => import('../pages/courses.vue'),
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('../pages/settings.vue'),
                },
            ],
        },
    ],
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) return savedPosition
        return { top: 0 }
    },
})

export default router
