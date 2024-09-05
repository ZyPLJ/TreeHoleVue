import { createRouter, createWebHistory } from "vue-router";

import Home from '../Views/Home.vue'
import Framework from "../views/Management/Framework.vue";
import Comment from "../views/Management/Comment/CommenIndex.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Text3', component: Home },
        {
            path: '/framework',
            component: Framework,
            children: [
                {
                    path: '/comment',
                    name: 'Comment',
                    component: Comment
                }
            ]
        }
    ]
})

export default router