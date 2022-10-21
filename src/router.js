import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            // title: '首页'
        },
        component: Home,
        // redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
