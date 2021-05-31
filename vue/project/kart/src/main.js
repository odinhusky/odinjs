import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { boot as bootI18n } from './i18n';
import { boot as bootAxios } from './axios';

import './registerServiceWorker';

// animate.css
import VAnimateCss from 'v-animate-css';
Vue.use(VAnimateCss);

// filters
import filters from '@/filters/filters';

// CSS Reset
import 'normalize.css';

// Vue config
Vue.config.productionTip = false;
// Vue.prototype.odin = odin;

// eventBus
Vue.prototype.$bus = new Vue();

// filters register
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

const app = {
  router,
  store,
  render: h => h(App),
};

bootI18n({ Vue, app, router });
bootAxios({ Vue, app, router });

new Vue(app).$mount('#app');
