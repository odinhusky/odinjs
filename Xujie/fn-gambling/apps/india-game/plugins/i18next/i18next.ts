import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import hi from '@langs/hi.json';
import en from '@langs/en.json';
import { EN } from '@/constant';
import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';
import sdkUtils from '@mode2/utils/sdk';

const { VITE_COUNTRY_CODE, VITE_I18N_LOAD_S3, VITE_S3_PATH } = import.meta.env;

// 初始化 i18next
i18next
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${VITE_S3_PATH}/fn-setting/i18n/${VITE_COUNTRY_CODE.toLowerCase()}/{{lng}}.json`,
      crossDomain: true,
    },
    debug: true,
    fallbackLng: sdkUtils.getStorage(AppLocalStorageKey.LANG) || EN,

    resources:
      VITE_I18N_LOAD_S3 === 'false'
        ? {
            hi: {
              translation: { ...hi },
            },
            en: {
              translation: { ...en },
            },
          }
        : undefined,
  });

i18next.on('languageChanged', (lng) => {
  sdkUtils.setStorage(AppLocalStorageKey.LANG, lng);
});
export default i18next;

// 添加客製化 format function
if (i18next?.services?.formatter !== undefined) {
  i18next.services.formatter.add('plus1', (value, lng, option) => {
    return value + 1;
  });
}
