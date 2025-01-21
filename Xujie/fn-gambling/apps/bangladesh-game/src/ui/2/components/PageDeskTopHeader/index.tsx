import { cx, useBreakPoint } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import Icon from '@mode2/components/Icon';
import { isEqual } from 'lodash';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
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
    const { isDesktop } = useBreakPoint();
    const { t } = useTranslation();
    const { navToHallPage } = useNavPageClick();

    const onBackClick = () => {
      if (onBack) onBack();
      else {
        navToHallPage();
      }
    };
    return isDesktop ? (
      <div className={cx(classNameObj?.container)}>
        {/* 返回按鈕 */}
        <div>
          <button
            className={cx(FLEX_ITEMS_CENTER, 'w-auto h-7')}
            onClick={onBackClick}
          >
            <Icon
              key={'ic_arrow_left_1'}
              name="ic_arrow_left_1"
              className={cx('w-6 h-6', classNameObj?.icon)}
            />
            <span
              className={cx(
                'block',
                'bgi-text-[var(--grayscale-100)] text-xl',
                'ml-2',
                classNameObj?.backText
              )}
            >
              {t('leftnav_back')}
            </span>
          </button>
        </div>

        {/* Page Title */}
        <h3
          className={cx(
            'block',
            'w-full',
            'text-center font-bold',
            'text-[32px] leading-9',
            'bgi-text-[var(--base-2-main)]',
            classNameObj?.headerText
          )}
        >
          {renderI18N(headerTitle, t)}
        </h3>
      </div>
    ) : null;
  },
  (prev, next) => isEqual(prev, next)
);

export default PageDeskTopHeader;
