import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { FLEX_CENTER, XY_CENTER } from '@libs/constant/style';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <div className={cx('relative', 'px-5', 'w-full ', FLEX_CENTER, className)}>
      <div className={cx('mx-7', classNameSub)}>
        {/* 背景圖 */}
        <img
          src={getImgUrl(EResourceLevel.V, 'rules_title_m')}
          alt="rules_title_m"
          className={cx('w-full object-contain', classNameImg)}
        />
        <span
          className={cx(
            'block',
            'w-[95%]',
            'text-center',
            'absolute',
            XY_CENTER,
            'bgi-text-[var(--base-1-variant1)]',
            'text-2xl font-bold',
            classNameText
          )}
        >
          {renderI18N(title, t)}
        </span>
      </div>
    </div>
  );
};
export default RulesImgTitle;
