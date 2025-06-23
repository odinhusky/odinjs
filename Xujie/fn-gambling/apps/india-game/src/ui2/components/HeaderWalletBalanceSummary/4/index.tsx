import cx from '@libs/commonUtils/cx';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import isEqual from 'lodash/isEqual';
import { memo, useMemo } from 'react';
import Icon from '@components/Icon';
import useHeaderAction from '@mode2/action/components/header/headerAction';
import { handleWalletDashboardBalanceActionClick } from '@mode2/action/actionTypes';
import { useLocationStore } from '@mode2/zustand/locationStore';
import { BasePagePathObj } from '@mode2/routerTypes/types';

export const HeaderWalletBalanceSummary = memo(
  () => {
    const totalAssets = useUserProfileStore((state) => state.totalAssets);
    const { handleHeaderClick } = useHeaderAction();

    const location = useLocationStore((state) => state.location);
    const isFull = useMemo(() => {
      return location?.pathname !== BasePagePathObj.RechargeWheelPage;
    }, [location]);

    return (
      <div
        className={cx(
          'cursor-pointer',
          FLEX_ITEMS_CENTER,
          'gap-1',
          'bgi-[var(--transparent-gray-30)]',
          'rounded-full',
          'h-auto',
          {
            'p-1.5': isFull,
            'pr-1.5 bgi-border-[var(--transparent-white-20)] border-2': !isFull,
          }
        )}
        onClick={() => {
          // refreshUserState();
          handleHeaderClick({
            actionName: handleWalletDashboardBalanceActionClick,
          });
        }}
      >
        <Icon
          className={cx('w-7 h-7', {
            'w-5 h-5': isFull,
          })}
          name={'ic_coin'}
        />

        <div
          className={cx(
            'text-sm px-4 box-border font-bold',
            'bgi-text-[var(--base-1-main)]'
          )}
        >
          {formatMoney({
            value: totalAssets,
            includeDecimal: true,
            showCurrency: false,
          })}
        </div>

        {isFull ? (
          <Icon className={cx('w-[14px] h-[14px]')} name={'ic_arrow_right_3'} />
        ) : null}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export default HeaderWalletBalanceSummary;
