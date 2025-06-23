import { I18NContent } from '@libs/mode2/@types/i18nType';

export interface PageDeskTopHeaderPropsType {
  headerTitle: I18NContent;
  onBack?: () => void;
  classNameObj?: {
    container?: string;
    icon?: string;
    backText?: string;
    headerText?: string;
  };
}
