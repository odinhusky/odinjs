import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import hi from './langs/hi.json';
import en from './langs/en.json';
import { EN } from '@/constant';
import { AppLocalStorageKey, AppLocalStorage } from '@/persistant/localStorage';

// 初始化 i18next
i18next
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: new URLSearchParams(window.location.search).get('lang') || EN,

    resources: {
      hi: {
        translation: { ...hi },
      },
      en: {
        translation: { ...en },
      },
    },
  });

i18next.on('languageChanged', (lng) => {
  AppLocalStorage.setStorage(AppLocalStorageKey.LANG, lng);
});
export default i18next;
