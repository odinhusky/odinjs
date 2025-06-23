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
      <div className={cx('cursor-pointer', FLEX_ITEMS_CENTER)}>
        <div
          className={cx(
            'mobile:text-lg text-sm font-medium',
            'bgi-text-[var(--grayscale-100)]',
            'mx-1 mobile:mx-2 tablet:mx-3'
          )}
        >
          {formatMoney({ value: totalAssets, includeDecimal: true })}
        </div>

        <Icon
          className={cx('w-5 h-5 mobile:w-6 mobile:h-6 cursor-pointer', {
            'animate-spin-reverse': isRefreshLoading,
          })}
          name={'ic_reload_1'}
          onClick={refreshUserState}
        />

        <div
          className={cx(
            'w-[2px] h-7 bgi-[var(--grayscale-40)]',
            'mx-1 mobile:mx-2 tablet:mx-3'
          )}
        ></div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default HeaderWalletBalanceSummary;
