import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeaderAction } from '@libs/mode2/action/components/header/headerAction';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import cx from '@libs/commonUtils/cx';
import isEqual from 'lodash/isEqual';
import { handleWalletActionClick } from '@libs/mode2/action/components/header/actionType';
import Icon from '@mode2/components/Icon';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

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
    // const { isMobile, isDesktop } = useBreakPoint();
    return (
      <BasePrimaryBtn
        className={cx(
          FLEX_ITEMS_CENTER,
          'h-7 mobile:h-10 gap-1',
          'rounded',
          'text-sm mobile:text-lg',
          'font-medium',
          'rounded-lg',
          'bg-shadow-[var(--inset-shadow)]',
          isInGame
            ? 'px-3 py-1 mobile:px-4 mobile:py-2'
            : 'h-8 w-8 mobile:h-10 mobile:w-10'
        )}
        classNameText={cx(
          '!bgi-text-[var(--grayscale-00)] gap-1',
          FLEX_ITEMS_CENTER
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
        <Icon
          className={cx(
            isInGame ? 'w-4 h-4' : 'w-5 h-5',
            'mobile:w-6 mobile:h-6'
          )}
          name={'ic_deposit'}
          color={'var(--grayscale-00)'}
        />
        {isInGame ? t('wallet_nav_deposit') : null}
      </BasePrimaryBtn>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
