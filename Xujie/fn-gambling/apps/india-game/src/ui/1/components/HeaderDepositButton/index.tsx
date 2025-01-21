import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeaderAction } from '@libs/mode2/action/components/header/headerAction';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import cx from '@libs/commonUtils/cx';
import isEqual from 'lodash/isEqual';
import {
  handleMyDrawerActionClick,
  handleWalletActionClick,
} from '@libs/mode2/action/components/header/actionType';
import { useBreakPoint } from '@libs/commonUtils';
import Icon from '@mode2/components/Icon';

/**
 * 充值按鈕
 */
export const HeaderDepositButton = memo(
  ({
    onDepositClick,
    isInGame,
    isInMoreGame,
  }: {
    onDepositClick?: () => void;
    isInGame: boolean;
    isInMoreGame?: boolean;
  }) => {
    const { t } = useTranslation();
    const { handleHeaderClick } = useHeaderAction();
    const { isMobile } = useBreakPoint();

    return (
      <>
        <button
          className={cx(
            FLEX_ITEMS_CENTER,
            'gap-1',
            'px-4 py-1',
            'rounded',
            'text-sm',
            'font-medium bgi-text-[var(--grayscale-100)]',
            'bgi-[var(--base-1-main)]'
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
        >
          {t('wallet_nav_deposit')}
        </button>
        {!isMobile ? (
          <Icon
            className={cx('w-6 h-6 ml-2 tablet:ml-3', 'cursor-pointer')}
            name={'ic_arrow_down_1'}
            color="var(--grayscale-100)"
            onClick={() =>
              handleHeaderClick({
                actionName: handleMyDrawerActionClick,
              })
            }
          />
        ) : null}
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
