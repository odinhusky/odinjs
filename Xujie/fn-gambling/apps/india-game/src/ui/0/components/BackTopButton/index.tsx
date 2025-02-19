import Icon from '@components/Icon';
import cx from '@commonUtils/cx';
import useBackTopButtonAction from '@mode2/action/components/backTopButton/useFloatActionButtonAction';
import { handleBackTopButtonActionClick } from '@mode2/action/components/backTopButton/acitonType';
import { useTranslation } from 'react-i18next';

/**
 * 觸發滾動置頂
 * 預設 <TemplateLayout/> 內定義的 [id={'main-content'}] 有效
 * @constructor
 */

export const BackTopButton = (props: {
  targetElementId?: string;
  className?: string;
}) => {
  return null;
};
