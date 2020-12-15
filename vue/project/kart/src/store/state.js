import { getAndSetI18nLanguage } from '@/plugins/utility.js';

const state = {
  i18nLanguage: getAndSetI18nLanguage(),
  notifications: [],
  user: {
    loginToken: '',
    type: '',
    detail: {},
  },
  countryCodeList: [],
};

export default state;
