import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeaderAction } from '@libs/mode2/action/components/header/headerAction';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import cx from '@libs/commonUtils/cx';
import isEqual from 'lodash/isEqual';
import { handleWalletActionClick } from '@mode2/action/actionTypes';
import { useBreakPoint } from '@libs/commonUtils';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import Icon from '@components/Icon';
import { HeaderDepositButtonProps } from '../HeaderDepositButtonProps';

export const HeaderDepositButton = memo(
  ({ onDepositClick, isInGame }: HeaderDepositButtonProps) => {
    const { t } = useTranslation();
    const { handleHeaderClick } = useHeaderAction();
    const { isMobile } = useBreakPoint();
    return (
      <BaseSecondaryBtn
        className={cx(
          'gap-1',
          'mobile:px-3 mobile:py-[6px] p-1',
          'tablet:text-lg mobile:text-base text-sm',
          'font-medium',
          'h-auto mobile:h-full'
        )}
        onClick={() => {
          if (onDepositClick) {
            onDepositClick();
          } else {
            handleHeaderClick({
              actionName: handleWalletActionClick,
            });
          }
        }}
        children={
          <div className={cx(FLEX_ITEMS_CENTER)}>
            {isInGame && isMobile ? null : (
              <Icon className={cx('w-5 h-5')} name={'ic_add'} />
            )}
            {!isMobile || isInGame ? (
              <span>{t('wallet_nav_deposit')}</span>
            ) : null}
          </div>
        }
      />
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default HeaderDepositButton;
