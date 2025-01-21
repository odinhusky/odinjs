import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo } from 'react';
import { useUserState } from '@/usecase/useUserState';
import Icon from '@mode2/components/Icon';

/**
 * 錢包餘額
 */
export const HeaderWalletBalanceSummary = memo(
  () => {
    const { refreshUserState, isRefreshLoading } = useUserState();
    const totalAssets = useUserProfileStore((state) => state.totalAssets);
    const level = useUserProfileStore((state) => state.level);

    return (
      <div className={cx('flex flex-col', 'pl-3 pr-1')}>
        <div className={cx('text-xxxs mobile:text-xxs')}>
          <span className={cx('bgi-text-[var(--grayscale-70)]')}>VIP</span>
          <span className={cx('bgi-text-[var(--base-2-main)] ml-0.5')}>
            {level}
          </span>
        </div>
        <div className={cx(FLEX_ITEMS_CENTER, 'gap-1')}>
          <div
            className={cx(
              'text-xs mobile:text-sm font-medium',
              'bgi-text-[var(--grayscale-90)]'
            )}
          >
            {formatMoney(totalAssets, true)}
          </div>
          <Icon
            className={cx('w-4 h-4 mobile:w-5 mobile:h-5 cursor-pointer', {
              'animate-spin-reverse': isRefreshLoading,
            })}
            name={'ic_reload'}
            color={'var(--grayscale-90)'}
            onClick={refreshUserState}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);
