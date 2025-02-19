import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useUserState } from '@/usecase/useUserState';
import Icon from '@components/Icon';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { handleWalletActionClick } from '@mode2/action/components/header/actionType';

export const HeaderWalletBalanceSummary = memo(
  () => {
    const { refreshUserState, isRefreshLoading } = useUserState();
    const totalAssets = useUserProfileStore((state) => state.totalAssets);
    const { handleHeaderClick } = useHeaderAction();
    return (
      <div
        className={cx(
          'cursor-pointer',
          FLEX_ITEMS_CENTER,
          'gap-1',
          'p-1.5',
          'bgi-[var(--transparent-gray-30)]',
          'rounded-full',
          'h-auto'
        )}
      >
        <Icon
          className={cx('w-5 h-5', {
            'animate-spin-reverse': isRefreshLoading,
          })}
          name={'ic_coin'}
          onClick={() => {
            refreshUserState();
          }}
        />

        <div
          className={cx(
            'text-sm font-bold',
            'bgi-text-[var(--transparent-white-70)]',
            {
              'animate-pulse-scale-infinitely': isRefreshLoading,
            }
          )}
        >
          {formatMoney(totalAssets, true)}
        </div>

        <Icon
          className={cx('w-[14px] h-[14px]')}
          name={'ic_arrow_right_3'}
          onClick={() => {
            handleHeaderClick({
              actionName: handleWalletActionClick,
            });
          }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
