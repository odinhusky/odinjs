import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from './axios';
import messages from '@/assets/langs/zh-Hans';

Vue.use(VueI18n);

const i18n = new VueI18n({
  messages: {
    'zh-Hans': messages,
  },
});

// lazy load 語言檔
const loadedLanguages = [];
loadLanguageAsync('zh-Hans');

function setI18nLanguage(lang) {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  axios.defaults.headers.common['Accept'] = 'application/json';
  // document.querySelector('html').setAttribute('lang', lang)
  window.localStorage.setItem('i18nLanguage', lang);
  return lang;
}

function loadLanguageAsync(lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(
        /* webpackChunkName: "lang-[request]" */ `@/assets/langs/${lang}`
      ).then(messages => {
        i18n.setLocaleMessage(lang, messages.default);
        loadedLanguages.push(lang);
        return setI18nLanguage(lang);
      });
    }
    return Promise.resolve(setI18nLanguage(lang));
  }
  return Promise.resolve(lang);
}
export default i18n;

export function boot({ app, router }) {
  // Set i18n instance on app
  app.i18n = i18n;

  router.beforeEach((to, from, next) => {
    const lang = to.params.lang;
    const map = {
      cn: 'zh-Hans',
      tw: 'zh-Hant',
      en: 'en-US',
    };

    const defaultLang = 'zh-Hans';
    const langCode = map[lang] || defaultLang;

    loadLanguageAsync(langCode).then(() => next());
  });
}
