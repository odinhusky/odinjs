import cx from '@libs/commonUtils/cx';
import Icon from '@mode2/components/Icon';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useUserState } from '@/usecase/useUserState';

/**
 * 錢包餘額
 */
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
          'px-0 mobile:px-4 py-1',
          'rounded',
          'bgi-[#00000000] mobile:bgi-[var(--transparent-white-10)] '
        )}
      >
        <div
          className={cx(
            'mobile:text-lg text-sm font-medium',
            'bgi-text-[var(--base-2-main)]'
          )}
        >
          {formatMoney(totalAssets, true)}
        </div>
        <div className={cx('w-4 h-4')} onClick={refreshUserState}>
          <Icon
            className={cx('w-full', {
              'animate-spin-reverse': isRefreshLoading,
            })}
            color={'var(--grayscale-70)'}
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
