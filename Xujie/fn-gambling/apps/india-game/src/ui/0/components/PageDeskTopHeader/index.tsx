import { I18NContent } from '@libs/mode2/@types/i18nType';
import { isEqual } from 'lodash';
import { memo } from 'react';

interface PageDeskTopHeaderPropsType {
  headerTitle: I18NContent;
  onBack?: () => void;
  classNameObj?: {
    container?: string;
    icon?: string;
    backText?: string;
    headerText?: string;
  };
}

export const PageDeskTopHeader = memo(
  ({ headerTitle, classNameObj, onBack }: PageDeskTopHeaderPropsType) => {
    return null;
  },
  (prev, next) => isEqual(prev, next)
);

export default PageDeskTopHeader;
