import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./assets/i18n/en.json";
import tw from "./assets/i18n/zh-TW.json";
import cn from "./assets/i18n/zh-CN.json";

export const resources = {
  en: {
    translation: en,
  },
  tw: {
    translation: tw,
  },
  cn: {
    translation: cn,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "tw",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
