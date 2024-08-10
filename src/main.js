import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//导入路由
import router from './router';

createApp(App).use(router).use(ElementPlus).mount('#app')
