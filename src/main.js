import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router/index'
import ElementPlus from 'element-plus'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css'
import eventBus from 'vue3-eventbus'
import { ElIcon } from 'element-plus'
import store from '@/store'

const app = createApp(App)

import { Get, Post, Put, Delete } from '@/common/tools/axios.js'
import { zcId, menuId, DelCookie, Token } from '@/common/tools/token.js'

app.config.globalProperties.$Put = Put
app.config.globalProperties.$Delete = Delete
app.config.globalProperties.$Get = Get
app.config.globalProperties.$Post = Post

app.config.globalProperties.$zcId = zcId
app.config.globalProperties.$menuId = menuId
app.config.globalProperties.$DelCookie = DelCookie
app.config.globalProperties.$Token = Token

app.use(eventBus).use(store).use(router).use(ElIcon).use(ElementPlus, { locale }).mount('#app')
