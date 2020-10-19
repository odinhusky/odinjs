import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import messages from '@/assets/langs/zh-Hans';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zh-Hans', // 设置语言环境
  fallbackLocale: 'zh-Hans',
  messages: {
    'zh-Hans': messages,
  },
});

export default i18n;

export function boot({ app, router }) {
  // Set i18n instance on app
  app.i18n = i18n;

  // lazy load 語言檔
  const loadedLanguages = ['zh-Hans']; // 我们的预装默认语言

  function setI18nLanguage(lang) {
    i18n.locale = lang;
    axios.defaults.headers.common['Accept-Language'] = lang;
    axios.defaults.headers.common['Accept'] = 'application/json';
    // document.querySelector('html').setAttribute('lang', lang)
    return lang;
  }

  function loadLanguageAsync(lang) {
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(
          /* webpackChunkName: "lang-[request]" */ `@/assets/langs/${lang}`
        ).then(msgs => {
          i18n.setLocaleMessage(lang, msgs.default);
          loadedLanguages.push(lang);
          return setI18nLanguage(lang);
        });
      }
      return Promise.resolve(setI18nLanguage(lang));
    }
    return Promise.resolve(lang);
  }
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
