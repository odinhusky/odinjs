import { I18NContent } from '@libs/mode2/@types/i18nType';
import { TFunction } from 'i18next';

export const renderI18N = (i18nContent: I18NContent, t: TFunction) => {
  return t(i18nContent.i18nKey, i18nContent?.i18nOption);
};

export default renderI18N;
