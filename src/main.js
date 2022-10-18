import { createApp } from 'vue';

import App from './App.vue';
const app = createApp(App);

// 全局样式在 app.vue 中以 sass 的方式引入了, 这里就注释掉了
// import './style.css';

// unocss
import 'uno.css';

// Element-Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 路由
import router from './router.js';

// pinia
import { createPinia } from 'pinia';

app.use(ElementPlus);
app.use(router);
app.use(createPinia());
app.mount('#app');
