import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useUserState } from '@/usecase/useUserState';
import Icon from '@libs/mode2/components/Icon';

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
          'mobile:py-2 mobile:px-4 py-1 px-2',
          'bgi-border-[var(--base-2-main)]',
          'after-rounded'
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
        <div
          className={cx('mobile:w-5 mobile:h-5 w-4 h-4')}
          onClick={refreshUserState}
        >
          <Icon
            className={cx('w-full', {
              'animate-spin-reverse': isRefreshLoading,
            })}
            color={'var(--base-2-main)'}
            name="ic_reload"
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
