import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // 引入創建方法

const pinia = createPinia(); // 建立實體

const app = createApp(App)
app.use(pinia); // 使用
app.use(router);
app.mount('#app');
