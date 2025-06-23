import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeaderAction } from '@libs/mode2/action/components/header/headerAction';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import cx from '@libs/commonUtils/cx';
import isEqual from 'lodash/isEqual';
import { handleWalletActionClick } from '@mode2/action/actionTypes';
import { useBreakPoint } from '@libs/commonUtils';
import Icon from '@components/Icon';
import { HeaderDepositButtonProps } from '../HeaderDepositButtonProps';

/**
 * 充值按鈕
 */
export const HeaderDepositButton = memo(
  ({ onDepositClick, isInGame }: HeaderDepositButtonProps) => {
    const { t } = useTranslation();
    const { handleHeaderClick } = useHeaderAction();
    const { isMobile } = useBreakPoint();
    return (
      <button
        className={cx(
          FLEX_ITEMS_CENTER,
          'gap-1',
          'px-4 py-1',
          'rounded',
          'text-sm leading-5',
          'font-medium bgi-text-[var(--grayscale-10)]',
          'bgi-[var(--base-2-main)]'
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
        {!isMobile || isInGame ? (
          <Icon className={cx('w-5 h-5')} name={'ic_deposit_1'} />
        ) : null}
        {t('wallet_nav_deposit')}
      </button>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default HeaderDepositButton;
