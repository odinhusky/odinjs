import {
  EHeaderType,
  useHeaderStore,
} from '@mode2/zustand/components/headerStore';
import { useEffect } from 'react';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { HeaderWalletBalanceSummary } from '@components/HeaderWalletBalanceSummary';
import cx from '@commonUtils/cx';
import { useLocationStore } from '@mode2/zustand/locationStore';

export const useRechargeWheelHeaderOverride = () => {
  const thisPath = BasePagePathObj.RechargeWheelPage;
  const location = useLocationStore((state) => state.location);
  const setConfig = useHeaderStore((state) => state.setConfig);

  useEffect(() => {
    if (location?.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        headerBgColor: 'bgi-[var(--background-dark)]',
        render: () => {
          return (
            <div className={cx('flex justify-end items-center')}>
              <HeaderWalletBalanceSummary />
            </div>
          );
        },
      });
    }
  }, [location]);
};

export default useRechargeWheelHeaderOverride;
