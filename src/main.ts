import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/assets/iconfont/iconfont.css'

import 'element-plus/dist/index.css';

import './assets/main.css';


import App from './App.vue'
import router from './router'
import {consoleStr} from "@/config";

console.log(consoleStr)
const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(router)

app.mount('#app')
