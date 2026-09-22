import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: DefaultLayout,
            children: [
                {
                    path: '',
                    name: 'showcase',
                    component: () => import('../pages/showcase/_index.vue'),
                },
                {
                    path: ':name',
                    name: 'component',
                    component: () => import('../pages/showcase/_viewer.vue'),
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
