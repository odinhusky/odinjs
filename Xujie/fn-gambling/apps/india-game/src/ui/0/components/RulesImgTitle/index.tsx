import { I18NContent } from '@libs/mode2/@types/i18nType';

interface RulesImgTitleProps {
  className?: string;
  classNameSub?: string;
  classNameImg?: string;
  classNameText?: string;
  title?: I18NContent;
}

export const RulesImgTitle = ({
  className = '',
  classNameSub = '',
  classNameImg = '',
  classNameText = '',
  title = { i18nKey: '' },
}: RulesImgTitleProps) => {
  return null;
};
export default RulesImgTitle;
