import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from 'assets/lang/en.json';
import cn from 'assets/lang/cn.json';
import jp from 'assets/lang/jp.json';
import tw from 'assets/lang/tw.json';

const resources = {
  en: {
    translation: en
  },
  'zh-CN': {
    translation: cn
  },
  jp: {
    translation: jp
  },
  'zh-TW': {
    translation: tw
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN', // 預設語言
  fallbackLng: 'zh-CN', // 如果當前切換的語言沒有對應的翻譯則使用這個語言，
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
