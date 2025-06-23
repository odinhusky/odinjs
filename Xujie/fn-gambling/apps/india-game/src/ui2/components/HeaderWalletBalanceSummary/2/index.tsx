import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useUserState } from '@/usecase/useUserState';
import Icon from '@components/Icon';

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
          {formatMoney({ value: totalAssets, includeDecimal: true })}
        </div>
        <Icon
          className={cx('w-4 h-4 cursor-pointer', {
            'animate-spin-reverse': isRefreshLoading,
          })}
          name={'ic_reload_1'}
          onClick={refreshUserState}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default HeaderWalletBalanceSummary;
