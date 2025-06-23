import { cx, useBreakPoint } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
import Icon from '@components/Icon';
import { PageDeskTopHeaderPropsType } from '../PageDeskTopHeaderPropsType';

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
              key={'ic_arrow_left_'}
              className={cx('w-6 h-6', classNameObj?.icon)}
              name={'ic_arrow_left'}
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
