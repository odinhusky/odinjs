import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeaderAction } from '@libs/mode2/action/components/header/headerAction';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import cx from '@libs/commonUtils/cx';
import isEqual from 'lodash/isEqual';
import { handleWalletActionClick } from '@libs/mode2/action/components/header/actionType';
import Icon from '@components/Icon';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';

/**
 * 充值按鈕
 */
export const HeaderDepositButton = memo(
  ({
    onDepositClick,
    isInGame,
  }: {
    onDepositClick?: () => void;
    isInGame: boolean;
  }) => {
    const { t } = useTranslation();
    const { handleHeaderClick } = useHeaderAction();

    return (
      <BaseSecondaryBtn
        className={cx(
          'w-auto h-auto',
          'font-medium text-lg',
          'px-4 py-1 rounded-full',
          'bgi-[var(--base-2-variant8)]'
        )}
        classNameText={cx(FLEX_ITEMS_CENTER)}
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
          <>
            <Icon className={cx('w-8 h-8')} name={'ic_deposit'} />
            <span className="bgi-text-[var(--base-1-main)] font-medium ml-1">
              {t('wallet_nav_deposit')}
            </span>
          </>
        }
      />
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
