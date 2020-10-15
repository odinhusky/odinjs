import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import handler from '@/plugins/vue-handler';

import { getAndSetI18nLanguage, getI18nLanguage } from '@/plugins/utility.js';
import './registerServiceWorker';

// i18n
import VueI18n from 'vue-i18n';
import langs from '@/assets/langs';

// filters
import filters from '@/filters/filters';

// CSS Reset
import 'normalize.css';

// Vue use
Vue.use(VueI18n);

// i18n Instance
const i18n = new VueI18n({
  locale: getAndSetI18nLanguage(),
  messages: langs,
});

// axios 基本設定
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers['Accept'] = 'application/json';
    config.headers['Accept-Language'] = getI18nLanguage();
    // console.log('axios config modfied =>', config);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

Vue.config.productionTip = false;
// Vue.prototype.odin = odin;
Vue.prototype.axios = axios;

// eventBus
Vue.prototype.$bus = new Vue();

// vue related handler function register
Object.keys(handler).forEach(key => {
  Vue.prototype[key] = handler[key];
});

// filters register
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
