import { createRouter, createWebHistory } from "vue-router";

import Home from '../Views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Text3', component: Home }
    ]
})

export default router