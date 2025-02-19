import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useUserState } from '@/usecase/useUserState';
import Icon from '@components/Icon';

export const HeaderWalletBalanceSummary = memo(
  () => {
    const { refreshUserState, isRefreshLoading } = useUserState();
    const totalAssets = useUserProfileStore((state) => state.totalAssets);
    return (
      <div
        className={cx(
          'cursor-pointer',
          FLEX_ITEMS_CENTER,
          'gap-1 mobile:gap-2',
          'mobile:py-2 mobile:px-4 py-1 px-1.5',
          'bgi-border-[var(--base-2-main)]',
          'after-rounded',
          'h-[26px] mobile:h-[34px] tablet:h-[38px]'
        )}
      >
        <div
          className={cx(
            'text-sm font-medium leading-5',
            'bgi-text-[var(--base-2-main)]'
          )}
        >
          {formatMoney(totalAssets, true)}
        </div>

        <Icon
          className={cx('mobile:w-5 mobile:h-5 w-4 h-4 z-10', {
            'animate-spin-reverse': isRefreshLoading,
          })}
          color={'var(--base-2-main)'}
          name={'ic_reload'}
          onClick={() => {
            refreshUserState();
          }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
