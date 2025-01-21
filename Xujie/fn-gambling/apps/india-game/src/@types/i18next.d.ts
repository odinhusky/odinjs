import pt from '../../plugins/i18next/langs/u1/pt';
import en from '../../plugins/i18next/langs/u1/en';

declare module i18next {
  interface CustomTypeOptions {
    debug: boolean;
    fallbackLng: 'pt';
    resources: {
      pt: typeof pt;
      en: typeof en;
    };
  }
}
